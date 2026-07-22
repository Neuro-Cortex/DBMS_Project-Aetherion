

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';

-- ================================================================
-- ██████  PHASE 1: CORE AUTHENTICATION & AUTHORIZATION  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T1: roles — System role definitions and hierarchy
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`            VARCHAR(50)  NOT NULL UNIQUE  COMMENT 'super_admin,admin,moderator,doctor,hospital,hospital_admin,hospital_authority,pharmacy,pharmacy_admin,patient,client,blood_donor,emergency_volunteer,admin_applicant,normal_user',
  `display_name`    VARCHAR(100) NOT NULL,
  `description`     VARCHAR(255),
  `is_system_role`  BOOLEAN      NOT NULL DEFAULT TRUE,
  `priority`        INT UNSIGNED NOT NULL DEFAULT 0  COMMENT 'Higher = more privileges',
  `created_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_roles_name`     (`name`),
  INDEX `idx_roles_priority` (`priority` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System role hierarchy';

-- ---------------------------------------------------------------
-- T2: users — Core user identity and authentication
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`                CHAR(36)     PRIMARY KEY              COMMENT 'UUID v4',
  `email`             VARCHAR(255) NOT NULL UNIQUE,
  `phone`             VARCHAR(20),
  `password_hash`     VARCHAR(255) NOT NULL                COMMENT 'bcrypt hash',
  `full_name`         VARCHAR(150) NOT NULL,
  `first_name`        VARCHAR(100),
  `last_name`         VARCHAR(100),
  `gender`            ENUM('male','female','other','prefer-not-to-say') DEFAULT NULL,
  `date_of_birth`     DATE         DEFAULT NULL,
  `profile_image`     VARCHAR(500) DEFAULT NULL             COMMENT 'S3/CDN URL',
  `cover_image`       VARCHAR(500) DEFAULT NULL,
  `blood_group`       ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `primary_role_id`   INT UNSIGNED NOT NULL,
  `is_verified`       BOOLEAN      NOT NULL DEFAULT FALSE   COMMENT 'Email verified',
  `is_active`         BOOLEAN      NOT NULL DEFAULT TRUE,
  `is_admin_approved` BOOLEAN      NOT NULL DEFAULT FALSE   COMMENT 'For doctor/hospital/pharmacy/admin roles',
  `is_online`         BOOLEAN      NOT NULL DEFAULT FALSE,
  `email_verified_at` TIMESTAMP    NULL,
  `phone_verified_at` TIMESTAMP    NULL,
  `last_login_at`     TIMESTAMP    NULL,
  `created_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`        TIMESTAMP    NULL                     COMMENT 'Soft delete for GDPR',
  CONSTRAINT `fk_users_role` FOREIGN KEY (`primary_role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_users_email` CHECK (`email` REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  INDEX `idx_users_email`    (`email`),
  INDEX `idx_users_phone`   (`phone`),
  INDEX `idx_users_role`    (`primary_role_id`),
  INDEX `idx_users_active`  (`is_active`, `is_verified`),
  INDEX `idx_users_online`  (`is_online`),
  INDEX `idx_users_deleted`  (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Core user identity';

-- ---------------------------------------------------------------
-- T3: user_sessions — JWT refresh token management
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE `user_sessions` (
  `id`               CHAR(36)    PRIMARY KEY,
  `user_id`          CHAR(36)    NOT NULL,
  `refresh_token`    VARCHAR(500) NOT NULL,
  `device_type`      ENUM('web','ios','android','desktop') DEFAULT 'web',
  `user_agent`       VARCHAR(500),
  `ip_address`       VARCHAR(45),
  `is_active`        BOOLEAN     NOT NULL DEFAULT TRUE,
  `expires_at`       TIMESTAMP   NOT NULL,
  `last_activity_at`  TIMESTAMP  NULL,
  `created_at`       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_sessions_user`   (`user_id`),
  INDEX `idx_sessions_token`  (`refresh_token`(255)),
  INDEX `idx_sessions_active` (`is_active`, `expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='JWT refresh token storage';

-- ---------------------------------------------------------------
-- T4: user_roles — Many-to-Many: Users ↔ Roles (multi-role support)
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`      CHAR(36)     NOT NULL,
  `role_id`      INT UNSIGNED NOT NULL,
  `is_primary`   BOOLEAN      NOT NULL DEFAULT FALSE,
  `assigned_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  INDEX `idx_ur_user` (`user_id`),
  INDEX `idx_ur_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User-role many-to-many';

-- ---------------------------------------------------------------
-- T5: user_role_upgrades — Profile upgrade requests (client→patient, etc.)
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_role_upgrades`;
CREATE TABLE `user_role_upgrades` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`          CHAR(36) NOT NULL,
  `upgrade_type`     ENUM('client_patient','blood_donor','pharmacy_user','emergency_volunteer') NOT NULL,
  `status`           ENUM('pending','approved','rejected') DEFAULT 'pending',
  `requested_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `reviewed_by`      CHAR(36) DEFAULT NULL,
  `reviewed_at`      TIMESTAMP NULL,
  `rejection_reason` TEXT,
  CONSTRAINT `fk_uru_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_uru_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_uru_user`   (`user_id`),
  INDEX `idx_uru_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Role upgrade requests';

-- ================================================================
-- ██████  PHASE 2: USER PROFILES & SETTINGS  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T6: user_profiles — Extended profile information
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_profiles`;
CREATE TABLE `user_profiles` (
  `id`                        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`                   CHAR(36)    NOT NULL UNIQUE,
  `bio`                       TEXT,
  `height_cm`                 DECIMAL(5,1) DEFAULT NULL,
  `weight_kg`                 DECIMAL(5,1) DEFAULT NULL,
  `allergies`                 JSON        DEFAULT NULL  COMMENT '["Penicillin","Pollen"]',
  `chronic_conditions`        JSON        DEFAULT NULL  COMMENT '["Diabetes","Hypertension"]',
  `insurance_provider`        VARCHAR(255),
  `insurance_policy_number`   VARCHAR(100),
  `emergency_contact_name`    VARCHAR(150),
  `emergency_contact_phone`   VARCHAR(20),
  `emergency_contact_relation` VARCHAR(50),
  `language_preference`       VARCHAR(10) DEFAULT 'en',
  `theme_preference`         ENUM('dark','light','system') DEFAULT 'dark',
  `notifications_enabled`    BOOLEAN     DEFAULT TRUE,
  `sms_alerts_enabled`        BOOLEAN     DEFAULT FALSE,
  `email_alerts_enabled`      BOOLEAN     DEFAULT TRUE,
  `created_at`                TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  `updated_at`                TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_up_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Extended user profiles';---------------------------------------------------------------
-- T7: user_addresses — Multiple addresses per user
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_addresses`;
CREATE TABLE `user_addresses` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`      CHAR(36) NOT NULL,
  `address_type` ENUM('home','work','billing','other') DEFAULT 'home',
  `street`       VARCHAR(255),
  `city`         VARCHAR(100) NOT NULL,
  `state`        VARCHAR(100) NOT NULL,
  `zip_code`     VARCHAR(20),
  `country`      VARCHAR(100) NOT NULL DEFAULT 'USA',
  `landmark`     VARCHAR(255),
  `latitude`     DECIMAL(10,7),
  `longitude`    DECIMAL(10,7),
  `is_default`   BOOLEAN      DEFAULT FALSE,
  CONSTRAINT `fk_addr_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_addr_user` (`user_id`),
  INDEX `idx_addr_city` (`city`, `state`),
  INDEX `idx_addr_location` (`latitude`, `longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User address book';

-- ---------------------------------------------------------------
-- T8: user_emergency_contacts — Emergency contacts list
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_emergency_contacts`;
CREATE TABLE `user_emergency_contacts` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`     CHAR(36)    NOT NULL,
  `name`        VARCHAR(150) NOT NULL,
  `phone`       VARCHAR(20) NOT NULL,
  `email`       VARCHAR(255),
  `relation`     VARCHAR(50) NOT NULL,
  `is_available` BOOLEAN     DEFAULT TRUE,
  `created_at`  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_emc_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_emc_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Emergency contacts';

-- ---------------------------------------------------------------
-- T9: user_notification_settings — Per-user notification preferences
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_notification_settings`;
CREATE TABLE `user_notification_settings` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`               CHAR(36) NOT NULL UNIQUE,
  `sms_enabled`           BOOLEAN  DEFAULT TRUE,
  `email_enabled`         BOOLEAN  DEFAULT TRUE,
  `push_enabled`          BOOLEAN  DEFAULT TRUE,
  `emergency_alerts`      BOOLEAN  DEFAULT TRUE,
  `donation_reminders`    BOOLEAN  DEFAULT TRUE,
  `appointment_reminders` BOOLEAN  DEFAULT TRUE,
  `medicine_reminders`    BOOLEAN  DEFAULT FALSE,
  `health_tips`          BOOLEAN  DEFAULT TRUE,
  `review_notifications`  BOOLEAN  DEFAULT TRUE,
  `created_at`            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_uns_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Notification preferences';

-- ---------------------------------------------------------------
-- T10: user_documents — Uploaded documents (ID, certificates, etc.)
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_documents`;
CREATE TABLE `user_documents` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         CHAR(36) NOT NULL,
  `document_type`   ENUM('id-proof','medical-certificate','degree','license','donation-certificate','other') NOT NULL,
  `name`            VARCHAR(255) NOT NULL,
  `file_url`        VARCHAR(500) NOT NULL,
  `file_type`       VARCHAR(50),
  `file_size`       INT UNSIGNED COMMENT 'Bytes',
  `is_verified`     BOOLEAN DEFAULT FALSE,
  `verified_by`     CHAR(36) DEFAULT NULL,
  `upload_date`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ud_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ud_verifier` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_ud_user`   (`user_id`),
  INDEX `idx_ud_type`   (`document_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User uploaded documents';

-- ---------------------------------------------------------------
-- T11: password_resets — Password reset tokens
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email`        VARCHAR(255) NOT NULL,
  `token`        VARCHAR(255) NOT NULL,
  `is_used`      BOOLEAN      DEFAULT FALSE,
  `expires_at`   TIMESTAMP    NOT NULL,
  `created_at`   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pr_email` (`email`),
  INDEX `idx_pr_token` (`token`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Password reset tokens';

-- ---------------------------------------------------------------
-- T12: user_preferences — User app preferences (AI, voice, display)
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_preferences`;
CREATE TABLE `user_preferences` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         CHAR(36) NOT NULL UNIQUE,
  `language`        VARCHAR(10)  DEFAULT 'en',
  `voice_enabled`   BOOLEAN     DEFAULT FALSE,
  `font_size`       ENUM('small','medium','large') DEFAULT 'medium',
  `sidebar_collapsed` BOOLEAN DEFAULT FALSE,
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_upref_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User app preferences';

-- ================================================================
-- ██████  PHASE 3: DOCTOR MODULE  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T13: doctor_profiles — Doctor professional information
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `doctor_profiles`;
CREATE TABLE `doctor_profiles` (
  `id`                     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`                CHAR(36)     NOT NULL UNIQUE,
  `specialization`         VARCHAR(150) NOT NULL,
  `sub_specializations`   JSON         DEFAULT NULL           COMMENT '["Interventional","Electrophysiology"]',
  `license_number`        VARCHAR(100) NOT NULL UNIQUE,
  `medical_council`        VARCHAR(150),
  `experience_years`       INT UNSIGNED NOT NULL DEFAULT 0,
  `qualifications`        JSON         NOT NULL               COMMENT '[{"degree":"MD","institution":"Harvard","year":2015,"country":"US"}]',
  `education`             JSON         DEFAULT NULL           COMMENT '[{"degree":"MBBS","institution":"Stanford","year":2012}]',
  `consultation_fee`      DECIMAL(10,2) NOT NULL DEFAULT 0,
  `follow_up_fee`         DECIMAL(10,2) DEFAULT 0,
  `video_consultation_fee` DECIMAL(10,2) DEFAULT 0,
  `consultation_duration` INT UNSIGNED  DEFAULT 15             COMMENT 'Minutes',
  `hospital_affiliation`  VARCHAR(255),
  `department`            VARCHAR(100),
  `designation`           VARCHAR(100),
  `languages`             JSON         DEFAULT NULL           COMMENT '["English","Spanish"]',
  `consultation_modes`    JSON         DEFAULT NULL           COMMENT '["in-person","video","phone"]',
  `max_patients_per_day`  INT UNSIGNED DEFAULT 30,
  `about`                 TEXT,
  `achievements`          JSON         DEFAULT NULL,
  `awards`                JSON         DEFAULT NULL           COMMENT '[{"title":"Best Doctor","organization":"WHO","year":2023}]',
  `publications`          JSON         DEFAULT NULL           COMMENT '[{"title":"...","journal":"Lancet","year":2022}]',
  `memberships`           JSON         DEFAULT NULL,
  `is_verified`           BOOLEAN      NOT NULL DEFAULT FALSE,
  `verified_by`           CHAR(36)     DEFAULT NULL,
  `verified_at`          TIMESTAMP    NULL,
  `rating`                DECIMAL(2,1) DEFAULT 0.0,
  `review_count`          INT UNSIGNED DEFAULT 0,
  `total_patients`        INT UNSIGNED DEFAULT 0,
  `total_consultations`   INT UNSIGNED DEFAULT 0,
  `success_rate`          DECIMAL(5,2) DEFAULT 0.00,
  `status`                ENUM('online','offline','busy') DEFAULT 'offline',
  `is_active`             BOOLEAN      DEFAULT TRUE,
  `joined_date`           DATE,
  `created_at`            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dp_user`      FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dp_verifier`  FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_dp_fee`      CHECK (`consultation_fee` >= 0),
  CONSTRAINT `chk_dp_rating`   CHECK (`rating` >= 0.0 AND `rating` <= 5.0),
  INDEX `idx_doc_specialization` (`specialization`),
  INDEX `idx_doc_verified`      (`is_verified`),
  INDEX `idx_doc_rating`        (`rating` DESC),
  INDEX `idx_doc_license`       (`license_number`),
  INDEX `idx_doc_status`        (`status`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Doctor professional profiles';

-- ---------------------------------------------------------------
-- T14: doctor_availability — Weekly schedule/time slots
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `doctor_availability`;
CREATE TABLE `doctor_availability` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doctor_id`       INT UNSIGNED  NOT NULL,
  `day_of_week`     TINYINT UNSIGNED NOT NULL  COMMENT '0=Sunday...6=Saturday',
  `start_time`      TIME NOT NULL,
  `end_time`        TIME NOT NULL,
  `max_patients`    INT UNSIGNED  DEFAULT 10,
  `current_patients` INT UNSIGNED DEFAULT 0,
  `is_available`    BOOLEAN      DEFAULT TRUE,
  CONSTRAINT `fk_da_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_da_time`   CHECK (`start_time` < `end_time`),
  INDEX `idx_avail_doctor` (`doctor_id`),
  INDEX `idx_avail_day`    (`day_of_week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Doctor weekly availability';

-- ---------------------------------------------------------------
-- T15: doctor_earnings — Daily/weekly earnings tracking
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `doctor_earnings`;
CREATE TABLE `doctor_earnings` (
  `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doctor_id`           INT UNSIGNED  NOT NULL,
  `earning_date`        DATE          NOT NULL,
  `consultation_revenue` DECIMAL(10,2) DEFAULT 0,
  `video_revenue`        DECIMAL(10,2) DEFAULT 0,
  `follow_up_revenue`   DECIMAL(10,2) DEFAULT 0,
  `total_revenue`       DECIMAL(10,2) DEFAULT 0,
  `total_appointments`  INT UNSIGNED  DEFAULT 0,
  `completed_appointments` INT UNSIGNED DEFAULT 0,
  CONSTRAINT `fk_de_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_doctor_date` (`doctor_id`, `earning_date`),
  INDEX `idx_de_doctor` (`doctor_id`),
  INDEX `idx_de_date`   (`earning_date` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Doctor daily earnings';

-- ---------------------------------------------------------------
-- T16: doctor_patients — Doctor-patient relationship tracking
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `doctor_patients`;
CREATE TABLE `doctor_patients` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doctor_id`       INT UNSIGNED NOT NULL,
  `patient_id`       CHAR(36)    NOT NULL,
  `first_visit_date` DATE,
  `last_visit_date`  DATE,
  `total_visits`     INT UNSIGNED DEFAULT 0,
  `is_active`       BOOLEAN      DEFAULT TRUE,
  `notes`           TEXT,
  CONSTRAINT `fk_dpat_doctor`  FOREIGN KEY (`doctor_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dpat_patient` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_doctor_patient` (`doctor_id`, `patient_id`),
  INDEX `idx_dpat_doctor`  (`doctor_id`),
  INDEX `idx_dpat_patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Doctor-patient associations';

-- ---------------------------------------------------------------
-- T17: doctor_notifications — Doctor-specific notifications
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `doctor_notifications`;
CREATE TABLE `doctor_notifications` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doctor_id`   INT UNSIGNED NOT NULL,
  `type`        ENUM('appointment','emergency','prescription','review','system','blood_request','video_consultation') NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `message`     TEXT         NOT NULL,
  `priority`    ENUM('low','medium','high','urgent') DEFAULT 'medium',
  `is_read`     BOOLEAN      DEFAULT FALSE,
  `read_at`     TIMESTAMP    NULL,
  `action_url`  VARCHAR(500),
  `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dn_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  INDEX `idx_dn_doctor` (`doctor_id`, `is_read`),
  INDEX `idx_dn_priority` (`priority`),
  INDEX `idx_dn_created`  (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Doctor notifications';

-- ---------------------------------------------------------------
-- T18: doctor_activities — Recent activity feed for doctor dashboard
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `doctor_activities`;
CREATE TABLE `doctor_activities` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doctor_id`     INT UNSIGNED NOT NULL,
  `type`          ENUM('appointment','prescription','consultation','review','emergency') NOT NULL,
  `description`   TEXT         NOT NULL,
  `patient_name`  VARCHAR(150),
  `status`        ENUM('completed','pending','cancelled') DEFAULT 'pending',
  `created_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dact_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  INDEX `idx_dact_doctor`  (`doctor_id`),
  INDEX `idx_dact_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Doctor activity feed';

-- ================================================================
-- ██████  PHASE 4: HOSPITAL MODULE  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T19: hospitals — Hospital entity
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospitals`;
CREATE TABLE `hospitals` (
  `id`                    CHAR(36)     PRIMARY KEY              COMMENT 'UUID',
  `admin_user_id`         CHAR(36)     NOT NULL                 COMMENT 'Hospital manager user',
  `name`                  VARCHAR(255) NOT NULL,
  `registration_number`   VARCHAR(100) NOT NULL UNIQUE,
  `type`                  ENUM('government','private','charitable','multispecialty','community','teaching','specialized','general') NOT NULL,
  `phone`                 VARCHAR(20)  NOT NULL,
  `emergency_phone`       VARCHAR(20),
  `email`                 VARCHAR(255),
  `website`               VARCHAR(500),
  `street`                VARCHAR(255),
  `city`                  VARCHAR(100) NOT NULL,
  `state`                 VARCHAR(100) NOT NULL,
  `zip_code`              VARCHAR(20),
  `country`               VARCHAR(100) DEFAULT 'USA',
  `latitude`              DECIMAL(10,7),
  `longitude`             DECIMAL(10,7),
  `total_beds`            INT UNSIGNED  DEFAULT 0,
  `available_beds`        INT UNSIGNED  DEFAULT 0,
  `icu_total_beds`        INT UNSIGNED  DEFAULT 0,
  `icu_available_beds`    INT UNSIGNED  DEFAULT 0,
  `icu_with_ventilator`   INT UNSIGNED  DEFAULT 0,
  `icu_without_ventilator` INT UNSIGNED  DEFAULT 0,
  `ambulance_count`       INT UNSIGNED  DEFAULT 0,
  `ambulance_available`   INT UNSIGNED  DEFAULT 0,
  `emergency_service`     ENUM('active','busy','unavailable') DEFAULT 'active',
  `emergency_response_time` VARCHAR(20) DEFAULT '15 min',
  `total_doctors`         INT UNSIGNED  DEFAULT 0,
  `total_nurses`          INT UNSIGNED  DEFAULT 0,
  `total_staff`           INT UNSIGNED  DEFAULT 0,
  `rating`                DECIMAL(2,1)  DEFAULT 0.0,
  `review_count`          INT UNSIGNED  DEFAULT 0,
  `is_verified`           BOOLEAN       DEFAULT FALSE,
  `is_active`             BOOLEAN       DEFAULT TRUE,
  `verified_by`           CHAR(36)      DEFAULT NULL,
  `verified_at`           TIMESTAMP     NULL,
  `services`              JSON          DEFAULT NULL           COMMENT '["Emergency","Cardiology"]',
  `facilities`            JSON          DEFAULT NULL,
  `insurance_accepted`    JSON          DEFAULT NULL,
  `working_hours`         JSON          DEFAULT NULL           COMMENT '{"monday":{"open":"08:00","close":"20:00","isOpen":true}}',
  `visiting_hours`        JSON          DEFAULT NULL,
  `accreditation`         JSON          DEFAULT NULL,
  `established_year`      INT UNSIGNED,
  `image_url`             VARCHAR(500),
  `created_at`            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`            TIMESTAMP     NULL,
  CONSTRAINT `fk_hosp_admin`    FOREIGN KEY (`admin_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_hosp_verifier`  FOREIGN KEY (`verified_by`)  REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_hosp_rating`   CHECK (`rating` >= 0.0 AND `rating` <= 5.0),
  INDEX `idx_hosp_city`       (`city`, `state`),
  INDEX `idx_hosp_type`       (`type`),
  INDEX `idx_hosp_emergency`  (`emergency_service`),
  INDEX `idx_hosp_verified`   (`is_verified`),
  INDEX `idx_hosp_location`   (`latitude`, `longitude`),
  FULLTEXT `idx_hosp_search`  (`name`, `city`, `state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hospital entities';

-- ---------------------------------------------------------------
-- T20: hospital_departments
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospital_departments`;
CREATE TABLE `hospital_departments` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hospital_id`     CHAR(36)     NOT NULL,
  `name`            VARCHAR(150) NOT NULL,
  `description`     TEXT,
  `head_doctor_id`  INT UNSIGNED DEFAULT NULL,
  `total_beds`      INT UNSIGNED DEFAULT 0,
  `available_beds`  INT UNSIGNED DEFAULT 0,
  `total_doctors`   INT UNSIGNED DEFAULT 0,
  `total_nurses`    INT UNSIGNED DEFAULT 0,
  `services`        JSON         DEFAULT NULL,
  `timings`         VARCHAR(100),
  `is_active`       BOOLEAN      DEFAULT TRUE,
  CONSTRAINT `fk_dept_hospital` FOREIGN KEY (`hospital_id`)    REFERENCES `hospitals`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dept_head`     FOREIGN KEY (`head_doctor_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE SET NULL,
  INDEX `idx_dept_hospital` (`hospital_id`),
  INDEX `idx_dept_name`     (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hospital departments';

-- ---------------------------------------------------------------
-- T21: hospital_doctors — Hospital-doctor staff affiliation
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospital_doctors`;
CREATE TABLE `hospital_doctors` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hospital_id`      CHAR(36)     NOT NULL,
  `doctor_profile_id` INT UNSIGNED NOT NULL,
  `department_id`     INT UNSIGNED DEFAULT NULL,
  `designation`      VARCHAR(100),
  `consultation_fee` DECIMAL(10,2) DEFAULT 0,
  `availability`     JSON         DEFAULT NULL  COMMENT '[{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":15}]',
  `rating`           DECIMAL(2,1) DEFAULT 0.0,
  `review_count`     INT UNSIGNED DEFAULT 0,
  `status`           ENUM('active','on-leave','inactive') DEFAULT 'active',
  `joined_date`      DATE,
  `profile_image`    VARCHAR(500),
  CONSTRAINT `fk_hd_hospital` FOREIGN KEY (`hospital_id`)      REFERENCES `hospitals`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hd_doctor`   FOREIGN KEY (`doctor_profile_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hd_dept`     FOREIGN KEY (`department_id`)     REFERENCES `hospital_departments`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uk_hosp_doctor` (`hospital_id`, `doctor_profile_id`),
  INDEX `idx_hd_hospital` (`hospital_id`),
  INDEX `idx_hd_doctor`   (`doctor_profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hospital-doctor staff affiliations';

-- ---------------------------------------------------------------
-- T22: hospital_beds — Individual bed tracking
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospital_beds`;
CREATE TABLE `hospital_beds` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hospital_id`     CHAR(36) NOT NULL,
  `department_id`   INT UNSIGNED DEFAULT NULL,
  `bed_number`      VARCHAR(20) NOT NULL,
  `bed_type`        ENUM('general','semi-private','private','icu','nicu','picu','cardiac-icu','emergency','pediatric','maternity') NOT NULL,
  `floor`           VARCHAR(50),
  `ward`            VARCHAR(100),
  `status`          ENUM('available','occupied','reserved','maintenance','cleaning') DEFAULT 'available',
  `patient_id`      CHAR(36)     DEFAULT NULL,
  `patient_name`    VARCHAR(150),
  `admission_date`  DATE,
  `has_ventilator`  BOOLEAN     DEFAULT FALSE,
  `has_monitor`     BOOLEAN     DEFAULT FALSE,
  `nurse_station`   VARCHAR(50),
  `price_per_day`   DECIMAL(10,2) DEFAULT 0,
  `daily_charge`    DECIMAL(10,2) DEFAULT 0,
  `features`        JSON        DEFAULT NULL  COMMENT '["TV","AC","Attendant Bed"]',
  CONSTRAINT `fk_bed_hospital` FOREIGN KEY (`hospital_id`)    REFERENCES `hospitals`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bed_dept`     FOREIGN KEY (`department_id`)  REFERENCES `hospital_departments`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bed_patient`  FOREIGN KEY (`patient_id`)     REFERENCES `users`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uk_hospital_bed` (`hospital_id`, `bed_number`),
  INDEX `idx_bed_status`       (`status`),
  INDEX `idx_bed_type`         (`bed_type`),
  INDEX `idx_bed_hospital`     (`hospital_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Individual hospital beds';

-- ---------------------------------------------------------------
-- T23: hospital_blood_bank
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospital_blood_bank`;
CREATE TABLE `hospital_blood_bank` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hospital_id`     CHAR(36) NOT NULL UNIQUE,
  `is_available`    BOOLEAN  DEFAULT TRUE,
  `total_units`     INT UNSIGNED DEFAULT 0,
  `expiry_alerts`   INT UNSIGNED DEFAULT 0,
  `last_updated`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bb_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE,
  INDEX `idx_bb_hospital` (`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hospital blood banks';

-- ---------------------------------------------------------------
-- T24: hospital_blood_stocks — Blood group inventory
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospital_blood_stocks`;
CREATE TABLE `hospital_blood_stocks` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `blood_bank_id`   INT UNSIGNED NOT NULL,
  `blood_group`     ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `units`           INT UNSIGNED NOT NULL DEFAULT 0,
  `expiry_date`     DATE,
  `status`          ENUM('sufficient','low','critical','out-of-stock') DEFAULT 'sufficient',
  CONSTRAINT `fk_hbs_bank` FOREIGN KEY (`blood_bank_id`) REFERENCES `hospital_blood_bank`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_bb_blood` (`blood_bank_id`, `blood_group`),
  INDEX `idx_hbs_group`  (`blood_group`),
  INDEX `idx_hbs_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blood stock by group';

-- ---------------------------------------------------------------
-- T25: hospital_oxygen_stock
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospital_oxygen_stock`;
CREATE TABLE `hospital_oxygen_stock` (
  `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hospital_id`         CHAR(36) NOT NULL UNIQUE,
  `total_cylinders`     INT UNSIGNED DEFAULT 0,
  `available_cylinders` INT UNSIGNED DEFAULT 0,
  `in_use_cylinders`    INT UNSIGNED DEFAULT 0,
  `reserved_cylinders`  INT UNSIGNED DEFAULT 0,
  `cylinder_types`      JSON        DEFAULT NULL  COMMENT '[{"type":"A-type","capacity":"10L","total":20,"available":15}]',
  `last_refilled`       DATE,
  `next_refill_date`    DATE,
  `supplier`            VARCHAR(255),
  `supplier_contact`    VARCHAR(100),
  `status`              ENUM('sufficient','low','critical','out-of-stock') DEFAULT 'sufficient',
  `emergency_support`   BOOLEAN     DEFAULT FALSE,
  CONSTRAINT `fk_o2_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE,
  INDEX `idx_o2_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hospital oxygen inventory';

-- ---------------------------------------------------------------
-- T26: hospital_ambulances — Ambulance fleet management
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospital_ambulances`;
CREATE TABLE `hospital_ambulances` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hospital_id`      CHAR(36) NOT NULL,
  `vehicle_number`    VARCHAR(50) NOT NULL UNIQUE,
  `type`             ENUM('basic','advanced','cardiac','neonatal','mobile-icu') DEFAULT 'basic',
  `status`           ENUM('available','on-call','dispatched','maintenance','offline') DEFAULT 'available',
  `current_latitude` DECIMAL(10,7),
  `current_longitude` DECIMAL(10,7),
  `current_address`   VARCHAR(255),
  `driver_name`      VARCHAR(150),
  `driver_phone`     VARCHAR(20),
  `paramedic_name`   VARCHAR(150),
  `equipment`        JSON DEFAULT NULL  COMMENT '["Defibrillator","Oxygen","Stretcher"]',
  `last_service`     DATE,
  `next_service`     DATE,
  `is_ac_available`   BOOLEAN DEFAULT FALSE,
  `has_oxygen_support` BOOLEAN DEFAULT TRUE,
  CONSTRAINT `fk_amb_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE,
  INDEX `idx_amb_hospital` (`hospital_id`),
  INDEX `idx_amb_status`   (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hospital ambulance fleet';

-- ---------------------------------------------------------------
-- T27: hospital_activities — Recent activity log for hospital dashboard
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `hospital_activities`;
CREATE TABLE `hospital_activities` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hospital_id`  CHAR(36) NOT NULL,
  `type`         ENUM('admission','discharge','emergency','surgery','blood','ambulance','bed_change','other') NOT NULL,
  `description`  TEXT     NOT NULL,
  `department`   VARCHAR(100),
  `user_name`    VARCHAR(150),
  `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hact_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE,
  INDEX `idx_hact_hospital` (`hospital_id`),
  INDEX `idx_hact_created`  (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hospital activity log';

-- ================================================================
-- ██████  PHASE 5: PHARMACY MODULE  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T28: pharmacies
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `pharmacies`;
CREATE TABLE `pharmacies` (
  `id`                    CHAR(36)     PRIMARY KEY,
  `admin_user_id`         CHAR(36)     NOT NULL UNIQUE,
  `name`                  VARCHAR(255) NOT NULL,
  `registration_number`   VARCHAR(100) NOT NULL UNIQUE,
  `license_number`        VARCHAR(100) NOT NULL UNIQUE,
  `gst_number`            VARCHAR(50),
  `pharmacist_name`       VARCHAR(150) NOT NULL,
  `pharmacist_license`    VARCHAR(100),
  `owner_name`            VARCHAR(150),
  `operating_hours`       VARCHAR(255),
  `opening_time`          TIME,
  `closing_time`          TIME,
  `is_24x7`              BOOLEAN      DEFAULT FALSE,
  `phone`                 VARCHAR(20),
  `emergency_phone`       VARCHAR(20),
  `email`                 VARCHAR(255),
  `website`               VARCHAR(500),
  `street`                VARCHAR(255),
  `city`                  VARCHAR(100),
  `state`                 VARCHAR(100),
  `zip_code`              VARCHAR(20),
  `latitude`              DECIMAL(10,7),
  `longitude`             DECIMAL(10,7),
  `delivery_available`    BOOLEAN      DEFAULT FALSE,
  `delivery_radius`       DECIMAL(5,1) DEFAULT 0          COMMENT 'km',
  `emergency_service`     BOOLEAN      DEFAULT FALSE,
  `services`              JSON         DEFAULT NULL        COMMENT '["prescription","otc","delivery"]',
  `is_verified`           BOOLEAN      DEFAULT FALSE,
  `is_active`             BOOLEAN      DEFAULT TRUE,
  `is_open`               BOOLEAN      DEFAULT TRUE,
  `status`                ENUM('active','inactive','suspended') DEFAULT 'active',
  `verified_by`           CHAR(36)     DEFAULT NULL,
  `verified_at`           TIMESTAMP    NULL,
  `rating`                DECIMAL(2,1) DEFAULT 0.0,
  `review_count`          INT UNSIGNED DEFAULT 0,
  `total_orders`          INT UNSIGNED DEFAULT 0,
  `image_url`             VARCHAR(500),
  `created_at`            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pharm_admin`    FOREIGN KEY (`admin_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pharm_verifier`  FOREIGN KEY (`verified_by`)  REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_pharm_rating`   CHECK (`rating` >= 0.0 AND `rating` <= 5.0),
  INDEX `idx_pharm_city`      (`city`, `state`),
  INDEX `idx_pharm_verified`  (`is_verified`),
  INDEX `idx_pharm_status`    (`status`),
  FULLTEXT `idx_pharm_search` (`name`, `city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pharmacy entities';

-- ---------------------------------------------------------------
-- T29: pharmacy_inventory
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `pharmacy_inventory`;
CREATE TABLE `pharmacy_inventory` (
  `id`                     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pharmacy_id`            CHAR(36)     NOT NULL,
  `medicine_name`          VARCHAR(255) NOT NULL,
  `generic_name`           VARCHAR(255),
  `brand_name`             VARCHAR(255),
  `category`               VARCHAR(100)               COMMENT 'antibiotics,pain-relief,vitamins,cardiac,diabetes,respiratory,dermatology,pediatric,gynecology,neurology,psychiatry,other',
  `type`                   ENUM('prescription','otc') DEFAULT 'prescription',
  `description`            TEXT,
  `usage_instructions`     TEXT,
  `dosage`                 VARCHAR(100),
  `side_effects`           JSON         DEFAULT NULL,
  `precautions`            JSON         DEFAULT NULL,
  `contraindications`      JSON         DEFAULT NULL,
  `alternatives`           JSON         DEFAULT NULL,
  `manufacturer`           VARCHAR(255),
  `manufactured_date`      DATE,
  `expiry_date`            DATE,
  `batch_number`           VARCHAR(100),
  `price`                  DECIMAL(10,2) NOT NULL,
  `discounted_price`       DECIMAL(10,2),
  `currency`               VARCHAR(3)   DEFAULT 'USD',
  `quantity`                INT UNSIGNED NOT NULL DEFAULT 0,
  `min_stock`              INT UNSIGNED DEFAULT 10,
  `max_stock`              INT UNSIGNED DEFAULT 1000,
  `unit`                   VARCHAR(20)  DEFAULT 'tablet',
  `pack_size`              VARCHAR(50),
  `strength`               VARCHAR(50),
  `form`                   ENUM('tablet','capsule','syrup','injection','cream','ointment','drops','inhaler','spray','powder','gel','other') DEFAULT 'tablet',
  `requires_prescription`  BOOLEAN      DEFAULT TRUE,
  `is_available`           BOOLEAN      DEFAULT TRUE,
  `is_expired`             BOOLEAN      DEFAULT FALSE,
  `rating`                 DECIMAL(2,1) DEFAULT 0.0,
  `review_count`           INT UNSIGNED DEFAULT 0,
  `image_url`              VARCHAR(500),
  `created_at`             TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_inv_pharmacy` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_inv_price`   CHECK (`price` > 0),
  CONSTRAINT `chk_inv_stock`   CHECK (`quantity` >= 0),
  INDEX `idx_inv_pharmacy`   (`pharmacy_id`),
  INDEX `idx_inv_category`   (`category`),
  INDEX `idx_inv_expiry`     (`expiry_date`),
  INDEX `idx_inv_low_stock`  (`quantity`, `min_stock`),
  INDEX `idx_inv_available`  (`is_available`),
  FULLTEXT `idx_inv_search`  (`medicine_name`, `generic_name`, `manufacturer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pharmacy medicine inventory';

-- ---------------------------------------------------------------
-- T30: medicine_orders
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `medicine_orders`;
CREATE TABLE `medicine_orders` (
  `id`                    CHAR(36)     PRIMARY KEY,
  `order_number`          VARCHAR(50) NOT NULL UNIQUE,
  `patient_id`            CHAR(36)    NOT NULL,
  `pharmacy_id`           CHAR(36)    NOT NULL,
  `prescription_id`       CHAR(36)    DEFAULT NULL,
  `total_amount`          DECIMAL(10,2) NOT NULL,
  `discount`              DECIMAL(10,2) DEFAULT 0,
  `final_amount`          DECIMAL(10,2) NOT NULL,
  `payment_method`        ENUM('cash','card','online','insurance') DEFAULT 'cash',
  `payment_status`        ENUM('pending','paid','refunded','failed') DEFAULT 'pending',
  `prescription_required` BOOLEAN      DEFAULT FALSE,
  `prescription_url`      VARCHAR(500),
  `prescription_verified` BOOLEAN      DEFAULT FALSE,
  `delivery_address`      TEXT,
  `delivery_status`       ENUM('pending','assigned','picked-up','in-transit','delivered','failed') DEFAULT 'pending',
  `delivery_partner`      VARCHAR(150),
  `tracking_number`      VARCHAR(100),
  `estimated_delivery`    TIMESTAMP    NULL,
  `delivered_at`         TIMESTAMP    NULL,
  `delivery_lat`         DECIMAL(10,7),
  `delivery_lng`         DECIMAL(10,7),
  `order_status`         ENUM('pending','confirmed','processing','packed','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `created_at`            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mo_patient`     FOREIGN KEY (`patient_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mo_pharmacy`   FOREIGN KEY (`pharmacy_id`)    REFERENCES `pharmacies`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mo_prescription` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_mo_amount`     CHECK (`final_amount` >= 0),
  INDEX `idx_order_patient`   (`patient_id`),
  INDEX `idx_order_pharmacy`  (`pharmacy_id`),
  INDEX `idx_order_status`    (`order_status`),
  INDEX `idx_order_payment`   (`payment_status`),
  INDEX `idx_order_number`    (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Medicine orders';

-- ---------------------------------------------------------------
-- T31: order_items
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id`     CHAR(36)     NOT NULL,
  `inventory_id` INT UNSIGNED NOT NULL,
  `medicine_name` VARCHAR(255) NOT NULL,
  `quantity`      INT UNSIGNED NOT NULL,
  `unit_price`    DECIMAL(10,2) NOT NULL,
  `total_price`  DECIMAL(10,2) GENERATED ALWAYS AS (`quantity` * `unit_price`) STORED,
  CONSTRAINT `fk_oi_order`     FOREIGN KEY (`order_id`)     REFERENCES `medicine_orders`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oi_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `pharmacy_inventory`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_oi_qty`     CHECK (`quantity` > 0),
  INDEX `idx_oi_order`     (`order_id`),
  INDEX `idx_oi_inventory` (`inventory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Medicine order line items';

-- ---------------------------------------------------------------
-- T32: stock_alerts — Pharmacy stock level alerts
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `stock_alerts`;
CREATE TABLE `stock_alerts` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pharmacy_id`     CHAR(36)    NOT NULL,
  `inventory_id`    INT UNSIGNED NOT NULL,
  `medicine_name`   VARCHAR(255) NOT NULL,
  `current_stock`   INT UNSIGNED NOT NULL,
  `min_stock`       INT UNSIGNED NOT NULL,
  `status`          ENUM('low','critical','out-of-stock','expired') NOT NULL,
  `is_read`         BOOLEAN      DEFAULT FALSE,
  `created_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sa_pharmacy`  FOREIGN KEY (`pharmacy_id`)  REFERENCES `pharmacies`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sa_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `pharmacy_inventory`(`id`) ON DELETE CASCADE,
  INDEX `idx_sa_pharmacy` (`pharmacy_id`, `is_read`),
  INDEX `idx_sa_status`   (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pharmacy stock alerts';

-- ================================================================
-- ██████  PHASE 6: APPOINTMENTS  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T33: appointments
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id`                  CHAR(36)     PRIMARY KEY,
  `patient_id`          CHAR(36)     NOT NULL,
  `doctor_id`           INT UNSIGNED NOT NULL,
  `hospital_id`         CHAR(36)     DEFAULT NULL,
  `department_id`       INT UNSIGNED DEFAULT NULL,
  `appointment_date`    DATE         NOT NULL,
  `start_time`          TIME         NOT NULL,
  `end_time`            TIME         NOT NULL,
  `duration_minutes`    INT UNSIGNED DEFAULT 15,
  `type`                ENUM('consultation','follow-up','emergency','checkup','surgery','lab-review') DEFAULT 'consultation',
  `status`              ENUM('scheduled','confirmed','in-progress','completed','cancelled','rescheduled','no-show') DEFAULT 'scheduled',
  `location`            ENUM('in-person','video','phone') DEFAULT 'in-person',
  `priority`            ENUM('low','medium','high','urgent') DEFAULT 'medium',
  `reason`              TEXT,
  `symptoms`            JSON         DEFAULT NULL   COMMENT '["Fever","Headache"]',
  `notes`               TEXT,
  `cancellation_reason` VARCHAR(500),
  `rescheduled_from`   CHAR(36)     DEFAULT NULL,
  `is_emergency`       BOOLEAN      DEFAULT FALSE,
  `is_first_visit`     BOOLEAN      DEFAULT TRUE,
  `video_call_url`     VARCHAR(500),
  `video_call_token`   VARCHAR(255),
  `meeting_link`       VARCHAR(500),
  `room_id`            VARCHAR(100),
  `fee`                DECIMAL(10,2) DEFAULT 0,
  `payment_status`     ENUM('pending','paid','unpaid','insurance') DEFAULT 'pending',
  `insurance_provider`  VARCHAR(255),
  `insurance_policy_number` VARCHAR(100),
  `created_at`          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_appt_patient`  FOREIGN KEY (`patient_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appt_doctor`  FOREIGN KEY (`doctor_id`)      REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appt_hospital` FOREIGN KEY (`hospital_id`)    REFERENCES `hospitals`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appt_dept`    FOREIGN KEY (`department_id`)   REFERENCES `hospital_departments`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appt_resched`  FOREIGN KEY (`rescheduled_from`) REFERENCES `appointments`(`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_appt_time`   CHECK (`start_time` < `end_time`),
  CONSTRAINT `chk_appt_fee`    CHECK (`fee` >= 0),
  INDEX `idx_appt_patient`   (`patient_id`),
  INDEX `idx_appt_doctor`    (`doctor_id`),
  INDEX `idx_appt_date`      (`appointment_date`, `status`),
  INDEX `idx_appt_hospital`  (`hospital_id`),
  INDEX `idx_appt_status`    (`status`),
  INDEX `idx_appt_type`      (`type`),
  INDEX `idx_appt_priority`  (`priority`),
  INDEX `idx_appt_doctor_date` (`doctor_id`, `appointment_date`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient appointments';





-- ================================================================
-- ██████  PHASE 7: PRESCRIPTIONS  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T34: prescriptions
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `prescriptions`;
CREATE TABLE `prescriptions` (
  `id`                CHAR(36)     PRIMARY KEY,
  `appointment_id`    CHAR(36)     DEFAULT NULL,
  `doctor_id`         INT UNSIGNED NOT NULL,
  `patient_id`        CHAR(36)     NOT NULL,
  `hospital_id`       CHAR(36)     DEFAULT NULL,
  `diagnosis`         TEXT,
  `symptoms`          JSON         DEFAULT NULL,
  `advice`            TEXT,
  `notes`             TEXT,
  `follow_up_date`    DATE         DEFAULT NULL,
  `valid_until`       DATE,
  `is_digital`        BOOLEAN      DEFAULT TRUE,
  `digital_signature` VARCHAR(500),
  `pdf_url`           VARCHAR(500),
  `status`            ENUM('active','completed','expired') DEFAULT 'active',
  `created_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rx_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_rx_doctor`      FOREIGN KEY (`doctor_id`)       REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rx_patient`     FOREIGN KEY (`patient_id`)      REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rx_hospital`    FOREIGN KEY (`hospital_id`)     REFERENCES `hospitals`(`id`) ON DELETE SET NULL,
  INDEX `idx_rx_doctor`      (`doctor_id`),
  INDEX `idx_rx_patient`     (`patient_id`),
  INDEX `idx_rx_appointment` (`appointment_id`),
  INDEX `idx_rx_status`      (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Medical prescriptions';

-- ---------------------------------------------------------------
-- T35: prescription_items
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `prescription_items`;
CREATE TABLE `prescription_items` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `prescription_id`   CHAR(36)     NOT NULL,
  `medicine_name`     VARCHAR(255) NOT NULL,
  `dosage`            VARCHAR(100) NOT NULL  COMMENT '500mg',
  `frequency`         VARCHAR(100) NOT NULL  COMMENT '3 times daily',
  `duration`          VARCHAR(100)           COMMENT '7 days',
  `timing`            ENUM('before-food','after-food','with-food','empty-stomach') DEFAULT NULL,
  `route`             VARCHAR(50)  DEFAULT 'oral',
  `quantity`          INT UNSIGNED DEFAULT 1,
  `refills`           INT UNSIGNED DEFAULT 0,
  `instructions`      TEXT,
  `is_otc`            BOOLEAN      DEFAULT FALSE,
  CONSTRAINT `fk_pi_prescription` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE CASCADE,
  INDEX `idx_pi_prescription` (`prescription_id`),
  INDEX `idx_pi_medicine`     (`medicine_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Prescribed medicine items';

-- ---------------------------------------------------------------
-- T36: prescription_tests
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `prescription_tests`;
CREATE TABLE `prescription_tests` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `prescription_id` CHAR(36)     NOT NULL,
  `test_name`       VARCHAR(255) NOT NULL,
  `test_type`       VARCHAR(100),
  `instructions`     TEXT,
  `is_urgent`       BOOLEAN      DEFAULT FALSE,
  `result_url`      VARCHAR(500),
  CONSTRAINT `fk_pt_prescription` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE CASCADE,
  INDEX `idx_pt_prescription` (`prescription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Prescribed lab tests';

-- ================================================================
-- ██████  PHASE 8: PATIENT HEALTH RECORDS  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T37: patient_health_records
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `patient_health_records`;
CREATE TABLE `patient_health_records` (
  `id`              CHAR(36)     PRIMARY KEY,
  `patient_id`      CHAR(36)     NOT NULL,
  `record_type`     ENUM('lab_report','imaging','document','vaccination','measurement','surgery','other') NOT NULL,
  `title`           VARCHAR(255) NOT NULL,
  `description`     TEXT,
  `file_url`        VARCHAR(500),
  `file_type`       VARCHAR(50),
  `file_size`       INT UNSIGNED COMMENT 'Bytes',
  `recorded_by`     CHAR(36)     DEFAULT NULL,
  `recorded_at`     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `is_shared`       BOOLEAN      DEFAULT FALSE,
  `shared_with`     JSON         DEFAULT NULL  COMMENT '["doctor_id1","doctor_id2"]',
  CONSTRAINT `fk_phr_patient`   FOREIGN KEY (`patient_id`)  REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_phr_recorder`  FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_health_patient` (`patient_id`),
  INDEX `idx_health_type`     (`record_type`),
  INDEX `idx_health_date`     (`recorded_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient health records';

-- ---------------------------------------------------------------
-- T38: patient_vaccinations
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `patient_vaccinations`;
CREATE TABLE `patient_vaccinations` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `patient_id`       CHAR(36)     NOT NULL,
  `vaccine_name`     VARCHAR(255) NOT NULL,
  `disease`          VARCHAR(255),
  `dose_number`      TINYINT UNSIGNED DEFAULT 1,
  `scheduled_date`   DATE,
  `administered_at`  DATE,
  `next_due_date`    DATE         DEFAULT NULL,
  `administered_by`  VARCHAR(255),
  `facility_name`    VARCHAR(255),
  `hospital_name`    VARCHAR(255),
  `batch_number`     VARCHAR(100),
  `status`           ENUM('scheduled','completed','missed','delayed') DEFAULT 'scheduled',
  `side_effects`     TEXT,
  `notes`            TEXT,
  `certificate_url`   VARCHAR(500),
  CONSTRAINT `fk_pv_patient` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_vacc_patient` (`patient_id`),
  INDEX `idx_vacc_due`     (`next_due_date`),
  INDEX `idx_vacc_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient vaccination records';

-- ---------------------------------------------------------------
-- T39: patient_medications
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `patient_medications`;
CREATE TABLE `patient_medications` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `patient_id`      CHAR(36)     NOT NULL,
  `medicine_name`   VARCHAR(255) NOT NULL,
  `dosage`          VARCHAR(100) NOT NULL,
  `frequency`       VARCHAR(100) NOT NULL,
  `route`           VARCHAR(50)  DEFAULT 'oral',
  `start_date`      DATE         NOT NULL,
  `end_date`        DATE         DEFAULT NULL,
  `prescribed_by`   INT UNSIGNED DEFAULT NULL,
  `prescription_id` CHAR(36)     DEFAULT NULL,
  `is_active`       BOOLEAN      DEFAULT TRUE,
  `reminder_time`   TIME         DEFAULT NULL,
  `reminder_enabled` BOOLEAN     DEFAULT FALSE,
  `notes`           TEXT,
  CONSTRAINT `fk_pm_patient`      FOREIGN KEY (`patient_id`)      REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pm_prescriber`   FOREIGN KEY (`prescribed_by`)   REFERENCES `doctor_profiles`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pm_prescription` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE SET NULL,
  INDEX `idx_med_patient`  (`patient_id`),
  INDEX `idx_med_active`   (`is_active`),
  INDEX `idx_med_reminder` (`reminder_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient current medications';

-- ---------------------------------------------------------------
-- T40: patient_medical_history
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `patient_medical_history`;
CREATE TABLE `patient_medical_history` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `patient_id`      CHAR(36)     NOT NULL,
  `condition_name`  VARCHAR(255) NOT NULL,
  `diagnosed_date`  DATE,
  `status`          ENUM('active','resolved','managed','ongoing') DEFAULT 'active',
  `notes`           TEXT,
  CONSTRAINT `fk_pmh_patient` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_pmh_patient` (`patient_id`),
  INDEX `idx_pmh_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient medical conditions';

-- ---------------------------------------------------------------
-- T41: patient_surgeries
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `patient_surgeries`;
CREATE TABLE `patient_surgeries` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `patient_id`      CHAR(36)     NOT NULL,
  `surgery_name`    VARCHAR(255) NOT NULL,
  `surgery_date`    DATE,
  `hospital`        VARCHAR(255),
  `doctor_name`     VARCHAR(150),
  `notes`           TEXT,
  CONSTRAINT `fk_ps_patient` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_ps_patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient surgery history';

-- ---------------------------------------------------------------
-- T42: patient_family_history
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `patient_family_history`;
CREATE TABLE `patient_family_history` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `patient_id`      CHAR(36) NOT NULL,
  `relation`         VARCHAR(50) NOT NULL  COMMENT 'father,mother,sibling',
  `condition_name`  VARCHAR(255) NOT NULL,
  `notes`           TEXT,
  CONSTRAINT `fk_pfh_patient` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_pfh_patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient family medical history';

-- ---------------------------------------------------------------
-- T43: health_recommendations — AI-generated health tips
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `health_recommendations`;
CREATE TABLE `health_recommendations` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `patient_id`      CHAR(36) NOT NULL,
  `type`            ENUM('food','exercise','lifestyle','warning','medicine') NOT NULL,
  `title`           VARCHAR(255) NOT NULL,
  `description`     TEXT         NOT NULL,
  `priority`        ENUM('high','medium','low') DEFAULT 'medium',
  `category`        ENUM('recommend','avoid') DEFAULT 'recommend',
  `is_read`         BOOLEAN      DEFAULT FALSE,
  `created_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hr_patient` FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_hr_patient` (`patient_id`),
  INDEX `idx_hr_type`    (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI health recommendations';

-- ---------------------------------------------------------------
-- T44: medicine_reminders — Patient medicine reminder schedule
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `medicine_reminders`;
CREATE TABLE `medicine_reminders` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `patient_id`      CHAR(36)     NOT NULL,
  `medication_id`   INT UNSIGNED DEFAULT NULL,
  `medicine_name`   VARCHAR(255) NOT NULL,
  `dosage`          VARCHAR(100) NOT NULL,
  `frequency`        VARCHAR(100) NOT NULL,
  `reminder_times`  JSON         NOT NULL  COMMENT '["08:00","14:00","20:00"]',
  `start_date`      DATE         NOT NULL,
  `end_date`        DATE,
  `is_active`       BOOLEAN      DEFAULT TRUE,
  `notes`           TEXT,
  CONSTRAINT `fk_mr_patient`   FOREIGN KEY (`patient_id`)   REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mr_medication` FOREIGN KEY (`medication_id`) REFERENCES `patient_medications`(`id`) ON DELETE SET NULL,
  INDEX `idx_mr_patient` (`patient_id`),
  INDEX `idx_mr_active`  (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient medicine reminders';

-- ================================================================
-- ██████  PHASE 9: WOMEN'S HEALTH  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T45: women_menstrual_cycles
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `women_menstrual_cycles`;
CREATE TABLE `women_menstrual_cycles` (
  `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`             CHAR(36) NOT NULL,
  `start_date`          DATE     NOT NULL,
  `end_date`            DATE     DEFAULT NULL,
  `cycle_length`        TINYINT UNSIGNED COMMENT 'Days',
  `period_length`       TINYINT UNSIGNED COMMENT 'Days',
  `flow_intensity`      ENUM('light','medium','heavy','very_heavy') DEFAULT NULL,
  `is_regular`          BOOLEAN  DEFAULT TRUE,
  `symptoms`            JSON     DEFAULT NULL  COMMENT '["cramps","headache","fatigue"]',
  `mood`                VARCHAR(100),
  `notes`               TEXT,
  `is_prediction`       BOOLEAN  DEFAULT FALSE  COMMENT 'System predicted vs actual',
  `next_period_date`    DATE,
  `ovulation_date`      DATE,
  `fertile_window_start` DATE,
  `fertile_window_end`  DATE,
  `reminder_enabled`    BOOLEAN  DEFAULT FALSE,
  `reminder_days`       TINYINT UNSIGNED DEFAULT 2,
  `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wmc_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_cycle_user`  (`user_id`),
  INDEX `idx_cycle_date`  (`start_date` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Menstrual cycle tracking';

-- ---------------------------------------------------------------
-- T46: women_pregnancies
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `women_pregnancies`;
CREATE TABLE `women_pregnancies` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`              CHAR(36) NOT NULL,
  `lmp_date`             DATE     NOT NULL              COMMENT 'Last Menstrual Period',
  `estimated_due_date`   DATE     NOT NULL,
  `current_week`         TINYINT UNSIGNED,
  `current_trimester`    ENUM('first','second','third'),
  `pregnancy_number`     TINYINT UNSIGNED DEFAULT 1,
  `is_first_pregnancy`   BOOLEAN  DEFAULT TRUE,
  `previous_pregnancies` TINYINT UNSIGNED DEFAULT 0,
  `high_risk`            BOOLEAN  DEFAULT FALSE,
  `risk_notes`           TEXT,
  `assigned_doctor_id`   INT UNSIGNED DEFAULT NULL,
  `baby_gender`          ENUM('boy','girl','unknown') DEFAULT 'unknown',
  `baby_name`            VARCHAR(150),
  `status`               ENUM('active','ongoing','completed','miscarriage','terminated','high-risk') DEFAULT 'active',
  `complications`        JSON     DEFAULT NULL,
  `delivery_date`        DATE     DEFAULT NULL,
  `delivery_type`        ENUM('normal','c-section','assisted') DEFAULT NULL,
  `notes`                TEXT,
  `created_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wp_user`    FOREIGN KEY (`user_id`)           REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wp_doctor`  FOREIGN KEY (`assigned_doctor_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE SET NULL,
  INDEX `idx_preg_user`     (`user_id`),
  INDEX `idx_preg_status`   (`status`),
  INDEX `idx_preg_trimester` (`current_trimester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pregnancy records';

-- ---------------------------------------------------------------
-- T47: women_pregnancy_tracking — Week-by-week metrics
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `women_pregnancy_tracking`;
CREATE TABLE `women_pregnancy_tracking` (
  `id`                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pregnancy_id`            INT UNSIGNED NOT NULL,
  `week_number`             TINYINT UNSIGNED NOT NULL,
  `weight_kg`               DECIMAL(5,1),
  `blood_pressure_systolic`  TINYINT UNSIGNED,
  `blood_pressure_diastolic` TINYINT UNSIGNED,
  `blood_sugar`             DECIMAL(5,1),
  `blood_sugar_type`        ENUM('fasting','post-meal','random'),
  `hemoglobin`              DECIMAL(4,1),
  `fetal_movement_count`    TINYINT UNSIGNED,
  `fetal_movement_duration` INT UNSIGNED COMMENT 'Minutes',
  `symptoms`                JSON DEFAULT NULL,
  `notes`                   TEXT,
  `recorded_at`             DATE NOT NULL,
  CONSTRAINT `fk_wpt_pregnancy` FOREIGN KEY (`pregnancy_id`) REFERENCES `women_pregnancies`(`id`) ON DELETE CASCADE,
  INDEX `idx_wpt_pregnancy` (`pregnancy_id`),
  UNIQUE KEY `uk_week_record` (`pregnancy_id`, `week_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pregnancy weekly tracking';

-- ---------------------------------------------------------------
-- T48: women_pregnancy_ultrasounds
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `women_pregnancy_ultrasounds`;
CREATE TABLE `women_pregnancy_ultrasounds` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pregnancy_id`     INT UNSIGNED NOT NULL,
  `week_number`      TINYINT UNSIGNED NOT NULL,
  `ultrasound_date`  DATE     NOT NULL,
  `type`             VARCHAR(100),
  `findings`         TEXT,
  `images`           JSON     DEFAULT NULL  COMMENT '["url1","url2"]',
  `report_url`       VARCHAR(500),
  `performed_by`     VARCHAR(150),
  CONSTRAINT `fk_wpu_pregnancy` FOREIGN KEY (`pregnancy_id`) REFERENCES `women_pregnancies`(`id`) ON DELETE CASCADE,
  INDEX `idx_wpu_pregnancy` (`pregnancy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pregnancy ultrasound records';

-- ---------------------------------------------------------------
-- T49: pregnancy_symptoms
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `pregnancy_symptoms`;
CREATE TABLE `pregnancy_symptoms` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pregnancy_id`    INT UNSIGNED NOT NULL,
  `symptom_name`    VARCHAR(150) NOT NULL,
  `severity`        ENUM('mild','moderate','severe') DEFAULT 'mild',
  `start_date`      DATE,
  `end_date`        DATE,
  `notes`           TEXT,
  CONSTRAINT `fk_ps_pregnancy` FOREIGN KEY (`pregnancy_id`) REFERENCES `women_pregnancies`(`id`) ON DELETE CASCADE,
  INDEX `idx_ps_pregnancy` (`pregnancy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pregnancy symptoms';

-- ---------------------------------------------------------------
-- T50: pregnancy_medications
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `pregnancy_medications`;
CREATE TABLE `pregnancy_medications` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pregnancy_id`    INT UNSIGNED NOT NULL,
  `medicine_name`   VARCHAR(255) NOT NULL,
  `dosage`          VARCHAR(100) NOT NULL,
  `frequency`        VARCHAR(100) NOT NULL,
  `start_date`      DATE     NOT NULL,
  `end_date`        DATE,
  `prescribed_by`   VARCHAR(150),
  `purpose`         VARCHAR(255),
  `is_safe`         BOOLEAN  DEFAULT TRUE,
  `reminders`       BOOLEAN  DEFAULT FALSE,
  `reminder_times`  JSON     DEFAULT NULL  COMMENT '["08:00","20:00"]',
  CONSTRAINT `fk_pm_pregnancy` FOREIGN KEY (`pregnancy_id`) REFERENCES `women_pregnancies`(`id`) ON DELETE CASCADE,
  INDEX `idx_pmed_pregnancy` (`pregnancy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pregnancy medications';

-- ---------------------------------------------------------------
-- T51: gynecologist_consultations
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `gynecologist_consultations`;
CREATE TABLE `gynecologist_consultations` (
  `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`             CHAR(36) NOT NULL,
  `doctor_name`         VARCHAR(150) NOT NULL,
  `doctor_specialization` VARCHAR(100),
  `hospital_name`       VARCHAR(255),
  `consultation_date`   DATE     NOT NULL,
  `consultation_time`   TIME,
  `type`                ENUM('in-person','video','phone') DEFAULT 'in-person',
  `reason`              TEXT,
  `diagnosis`           TEXT,
  `prescription`        TEXT,
  `reports`             JSON     DEFAULT NULL  COMMENT '["url1","url2"]',
  `follow_up_date`      DATE,
  `status`              ENUM('scheduled','completed','cancelled') DEFAULT 'scheduled',
  `notes`               TEXT,
  CONSTRAINT `fk_gc_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_gc_user`   (`user_id`),
  INDEX `idx_gc_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gynecologist consultations';

-- ---------------------------------------------------------------
-- T52: baby_profiles — Baby identity
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `baby_profiles`;
CREATE TABLE `baby_profiles` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `mother_id`       CHAR(36)     NOT NULL,
  `baby_name`       VARCHAR(150),
  `date_of_birth`   DATE         NOT NULL,
  `gender`          ENUM('boy','girl') DEFAULT NULL,
  `blood_group`     ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
  `pregnancy_id`    INT UNSIGNED  DEFAULT NULL,
  CONSTRAINT `fk_bp_mother`    FOREIGN KEY (`mother_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bp_pregnancy` FOREIGN KEY (`pregnancy_id`) REFERENCES `women_pregnancies`(`id`) ON DELETE SET NULL,
  INDEX `idx_bp_mother` (`mother_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Baby profiles';

-- ---------------------------------------------------------------
-- T53: baby_vaccine_records
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `baby_vaccine_records`;
CREATE TABLE `baby_vaccine_records` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `baby_id`          INT UNSIGNED NOT NULL,
  `vaccine_name`     VARCHAR(255) NOT NULL,
  `disease`          VARCHAR(255),
  `dose_number`      TINYINT UNSIGNED DEFAULT 1,
  `scheduled_date`   DATE     NOT NULL,
  `administered_date` DATE,
  `administered_by`  VARCHAR(255),
  `hospital_name`    VARCHAR(255),
  `batch_number`     VARCHAR(100),
  `status`           ENUM('scheduled','completed','missed','delayed') DEFAULT 'scheduled',
  `next_dose_date`   DATE,
  `side_effects`     TEXT,
  `certificate_url`   VARCHAR(500),
  CONSTRAINT `fk_bvr_baby` FOREIGN KEY (`baby_id`) REFERENCES `baby_profiles`(`id`) ON DELETE CASCADE,
  INDEX `idx_bvr_baby`   (`baby_id`),
  INDEX `idx_bvr_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Baby vaccination records';

-- ---------------------------------------------------------------
-- T54: baby_growth_records
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `baby_growth_records`;
CREATE TABLE `baby_growth_records` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `baby_id`               INT UNSIGNED NOT NULL,
  `record_date`           DATE         NOT NULL,
  `age_months`            TINYINT UNSIGNED NOT NULL,
  `weight_kg`             DECIMAL(5,2),
  `height_cm`             DECIMAL(5,1),
  `head_circumference_cm` DECIMAL(4,1),
  `bmi`                   DECIMAL(5,2),
  `percentile`            DECIMAL(5,2),
  `notes`                 TEXT,
  CONSTRAINT `fk_bgr_baby` FOREIGN KEY (`baby_id`) REFERENCES `baby_profiles`(`id`) ON DELETE CASCADE,
  INDEX `idx_bgr_baby` (`baby_id`),
  INDEX `idx_bgr_date` (`record_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Baby growth tracking';

-- ================================================================
-- ██████  PHASE 10: BLOOD DONATION  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T55: blood_donors
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `blood_donors`;
CREATE TABLE `blood_donors` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`               CHAR(36) NOT NULL UNIQUE,
  `blood_group`           ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `age`                   TINYINT UNSIGNED,
  `weight_kg`             DECIMAL(5,1),
  `gender`                ENUM('male','female','other'),
  `last_donation_date`    DATE     DEFAULT NULL,
  `total_donations`       INT UNSIGNED DEFAULT 0,
  `next_eligible_date`    DATE,
  `is_eligible`           BOOLEAN  DEFAULT TRUE,
  `is_available`          BOOLEAN  DEFAULT TRUE,
  `is_emergency_donor`    BOOLEAN  DEFAULT FALSE,
  `medical_conditions`    JSON     DEFAULT NULL,
  `is_on_medication`     BOOLEAN  DEFAULT FALSE,
  `current_medications`  JSON     DEFAULT NULL,
  `has_tattoo`            BOOLEAN  DEFAULT FALSE,
  `tattoo_date`          DATE,
  `has_piercing`         BOOLEAN  DEFAULT FALSE,
  `piercing_date`        DATE,
  `has_traveled_abroad`  BOOLEAN  DEFAULT FALSE,
  `status`                ENUM('pending','approved','rejected','blocked','active','inactive','temporary-deferred','permanent-deferred') DEFAULT 'pending',
  `deferral_reason`      TEXT,
  `deferral_until`       DATE,
  `is_verified`           BOOLEAN  DEFAULT FALSE,
  `verified_by`           CHAR(36) DEFAULT NULL,
  `verified_at`          TIMESTAMP NULL,
  `rejection_reason`     TEXT,
  `preferred_donation_center` VARCHAR(255),
  `preferred_time`       ENUM('morning','afternoon','evening'),
  `reward_points`        INT UNSIGNED DEFAULT 0,
  `lives_saved`          INT UNSIGNED DEFAULT 0,
  `donated_units`        INT UNSIGNED DEFAULT 0,
  `consent_form_url`     VARCHAR(500),
  `emergency_contact_name`  VARCHAR(150),
  `emergency_contact_phone` VARCHAR(20),
  `registered_date`      DATE,
  `created_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bd_user`      FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bd_verifier`  FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_bd_weight`   CHECK (`weight_kg` IS NULL OR `weight_kg` >= 0),
  INDEX `idx_donor_blood`      (`blood_group`),
  INDEX `idx_donor_available`  (`is_available`, `status`),
  INDEX `idx_donor_last_donation` (`last_donation_date`),
  INDEX `idx_donor_eligible`   (`is_eligible`),
  INDEX `idx_donor_emergency`  (`is_emergency_donor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blood donor profiles';

-- ---------------------------------------------------------------
-- T56: blood_donations — Donation history
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `blood_donations`;
CREATE TABLE `blood_donations` (
  `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `donor_id`            INT UNSIGNED NOT NULL,
  `donation_date`       DATE     NOT NULL,
  `blood_group`         ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `units`               TINYINT UNSIGNED NOT NULL,
  `donation_type`       ENUM('whole-blood','plasma','platelets','double-red-cells') DEFAULT 'whole-blood',
  `location`            VARCHAR(255),
  `hospital_name`       VARCHAR(255),
  `blood_bank_name`     VARCHAR(255),
  `recipient_info`      VARCHAR(255),
  `certificate_id`      VARCHAR(100),
  `certificate_url`     VARCHAR(500),
  `reward_points_earned` INT UNSIGNED DEFAULT 0,
  `verified_by`         CHAR(36) DEFAULT NULL,
  `notes`               TEXT,
  `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bdn_donor`     FOREIGN KEY (`donor_id`)     REFERENCES `blood_donors`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bdn_verifier`  FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_bdn_donor` (`donor_id`),
  INDEX `idx_bdn_date`  (`donation_date` DESC),
  INDEX `idx_bdn_type`  (`donation_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blood donation records';

-- ---------------------------------------------------------------
-- T57: blood_requests
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `blood_requests`;
CREATE TABLE `blood_requests` (
  `id`                  CHAR(36)     PRIMARY KEY,
  `request_number`      VARCHAR(50)  NOT NULL UNIQUE,
  `requested_by`        CHAR(36)     NOT NULL,
  `hospital_id`         CHAR(36)     DEFAULT NULL,
  `patient_name`        VARCHAR(150) NOT NULL,
  `patient_age`         TINYINT UNSIGNED,
  `blood_group`         ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `units_required`      TINYINT UNSIGNED NOT NULL,
  `urgency`             ENUM('normal','urgent','emergency') DEFAULT 'normal',
  `reason`              TEXT,
  `doctor_name`         VARCHAR(150),
  `status`              ENUM('pending','approved','processing','fulfilled','rejected','cancelled') DEFAULT 'pending',
  `approved_by`         CHAR(36)     DEFAULT NULL,
  `fulfilled_by`        CHAR(36)     DEFAULT NULL,
  `fulfilled_at`        TIMESTAMP    NULL,
  `rejection_reason`    TEXT,
  `required_by_date`   DATE,
  `created_at`          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_br_requester` FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_br_hospital`  FOREIGN KEY (`hospital_id`)   REFERENCES `hospitals`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_br_approver`  FOREIGN KEY (`approved_by`)   REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_br_fulfiller` FOREIGN KEY (`fulfilled_by`)  REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_br_blood`    (`blood_group`),
  INDEX `idx_br_status`   (`status`),
  INDEX `idx_br_urgency`  (`urgency`),
  INDEX `idx_br_number`   (`request_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blood unit requests';

-- ---------------------------------------------------------------
-- T58: blood_donation_camps
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `blood_donation_camps`;
CREATE TABLE `blood_donation_camps` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`              VARCHAR(255) NOT NULL,
  `organizer`         VARCHAR(255),
  `camp_date`         DATE     NOT NULL,
  `start_time`        TIME,
  `end_time`          TIME,
  `location`          VARCHAR(255),
  `address`           TEXT,
  `latitude`          DECIMAL(10,7),
  `longitude`         DECIMAL(10,7),
  `expected_donors`   INT UNSIGNED DEFAULT 0,
  `registered_donors` INT UNSIGNED DEFAULT 0,
  `blood_groups_needed` JSON DEFAULT NULL,
  `facilities`        JSON         DEFAULT NULL,
  `contact_phone`     VARCHAR(20),
  `status`            ENUM('upcoming','ongoing','completed') DEFAULT 'upcoming',
  `created_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_bdc_status` (`status`),
  INDEX `idx_bdc_date`   (`camp_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blood donation camps';

-- ---------------------------------------------------------------
-- T59: donor_rewards — Gamification rewards for blood donors
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `donor_rewards`;
CREATE TABLE `donor_rewards` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `donor_id`      INT UNSIGNED NOT NULL,
  `type`          ENUM('points','badge','certificate','gift-card') NOT NULL,
  `name`          VARCHAR(150) NOT NULL,
  `description`   TEXT,
  `points`        INT UNSIGNED DEFAULT 0,
  `earned_date`   DATE     NOT NULL,
  `expiry_date`   DATE,
  `status`        ENUM('active','used','expired') DEFAULT 'active',
  CONSTRAINT `fk_dr_donor` FOREIGN KEY (`donor_id`) REFERENCES `blood_donors`(`id`) ON DELETE CASCADE,
  INDEX `idx_dr_donor`  (`donor_id`),
  INDEX `idx_dr_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Donor gamification rewards';

-- ================================================================
-- ██████  PHASE 11: EMERGENCY SERVICES  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T60: ambulance_requests
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `ambulance_requests`;
CREATE TABLE `ambulance_requests` (
  `id`                  CHAR(36) PRIMARY KEY,
  `requested_by`        CHAR(36) NOT NULL,
  `patient_name`        VARCHAR(150) NOT NULL,
  `patient_phone`       VARCHAR(20),
  `pickup_latitude`     DECIMAL(10,7),
  `pickup_longitude`    DECIMAL(10,7),
  `pickup_address`      TEXT     NOT NULL,
  `drop_address`        TEXT,
  `emergency_type`      VARCHAR(100) COMMENT 'Accident,Heart Attack,...',
  `passenger_count`     TINYINT UNSIGNED DEFAULT 1,
  `needs_oxygen`       BOOLEAN  DEFAULT FALSE,
  `status`              ENUM('pending','dispatched','picked-up','arrived','completed','cancelled') DEFAULT 'pending',
  `ambulance_id`       INT UNSIGNED DEFAULT NULL,
  `estimated_arrival`  INT UNSIGNED COMMENT 'Minutes',
  `hospital_id`        CHAR(36) DEFAULT NULL,
  `dispatched_at`      TIMESTAMP NULL,
  `arrived_at`         TIMESTAMP NULL,
  `created_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_arb_requester` FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_arb_hospital`  FOREIGN KEY (`hospital_id`)  REFERENCES `hospitals`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_arb_ambulance` FOREIGN KEY (`ambulance_id`)  REFERENCES `hospital_ambulances`(`id`) ON DELETE SET NULL,
  INDEX `idx_amb_req_status`  (`status`),
  INDEX `idx_amb_req_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ambulance dispatch requests';

-- ---------------------------------------------------------------
-- T61: emergency_services — Available emergency service providers
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `emergency_services`;
CREATE TABLE `emergency_services` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`            VARCHAR(255) NOT NULL,
  `type`            ENUM('ambulance','blood','oxygen','doctor','emergency-room','helicopter') NOT NULL,
  `status`          ENUM('available','busy','dispatched','offline','maintenance') DEFAULT 'available',
  `provider`        VARCHAR(255),
  `phone`           VARCHAR(20),
  `latitude`        DECIMAL(10,7),
  `longitude`       DECIMAL(10,7),
  `address`         VARCHAR(500),
  `eta_minutes`     INT UNSIGNED,
  `capacity`        INT UNSIGNED,
  `current_load`    INT UNSIGNED,
  `vehicle_number`  VARCHAR(50),
  `crew_members`   TINYINT UNSIGNED,
  `equipment`       JSON DEFAULT NULL,
  `last_dispatched_at` TIMESTAMP NULL,
  `rating`          DECIMAL(2,1) DEFAULT 0.0,
  `price`           DECIMAL(10,2),
  INDEX `idx_es_type`     (`type`),
  INDEX `idx_es_status`   (`status`),
  INDEX `idx_es_location` (`latitude`, `longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Emergency service providers';

-- ---------------------------------------------------------------
-- T62: oxygen_requests — Oxygen cylinder delivery requests
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `oxygen_requests`;
CREATE TABLE `oxygen_requests` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `request_number`    VARCHAR(50) NOT NULL UNIQUE,
  `patient_name`      VARCHAR(150) NOT NULL,
  `patient_age`       TINYINT UNSIGNED,
  `patient_condition` TEXT,
  `oxygen_type`       VARCHAR(50),
  `cylinders_needed`  INT UNSIGNED DEFAULT 1,
  `urgency`          ENUM('normal','urgent','emergency') DEFAULT 'normal',
  `hospital_name`    VARCHAR(255),
  `doctor_name`      VARCHAR(150),
  `status`           ENUM('pending','approved','dispatched','delivered','cancelled') DEFAULT 'pending',
  `delivery_address` TEXT,
  `latitude`          DECIMAL(10,7),
  `longitude`         DECIMAL(10,7),
  `contact_phone`    VARCHAR(20),
  `contact_email`    VARCHAR(255),
  `request_date`     DATE     NOT NULL,
  `required_date`    DATE,
  `delivery_date`    DATE,
  `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_orq_status` (`status`),
  INDEX `idx_orq_date`   (`request_date` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Oxygen cylinder requests';

-- ================================================================
-- ██████  PHASE 12: COMMUNICATION  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T63: messages
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id`              CHAR(36) PRIMARY KEY,
  `sender_id`       CHAR(36) NOT NULL,
  `receiver_id`     CHAR(36) NOT NULL,
  `appointment_id`  CHAR(36) DEFAULT NULL,
  `message_body`    TEXT     NOT NULL,
  `message_type`    ENUM('text','image','file','system','voice') DEFAULT 'text',
  `file_url`        VARCHAR(500),
  `file_name`       VARCHAR(255),
  `file_size`       INT UNSIGNED,
  `is_read`         BOOLEAN  DEFAULT FALSE,
  `read_at`         TIMESTAMP NULL,
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_msg_sender`   FOREIGN KEY (`sender_id`)      REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_receiver` FOREIGN KEY (`receiver_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_appt`     FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE SET NULL,
  INDEX `idx_msg_sender`       (`sender_id`),
  INDEX `idx_msg_receiver`     (`receiver_id`, `is_read`),
  INDEX `idx_msg_created`      (`created_at` DESC),
  INDEX `idx_msg_conversation` (`sender_id`, `receiver_id`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Doctor-patient messages';

-- ---------------------------------------------------------------
-- T64: notifications
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id`          CHAR(36)     PRIMARY KEY,
  `user_id`     CHAR(36)     NOT NULL,
  `type`        VARCHAR(50)  NOT NULL  COMMENT 'appointment_reminder,prescription,order,system,message,review,blood_alert,donation_reminder,health_tip',
  `title`       VARCHAR(255) NOT NULL,
  `body`        TEXT,
  `data`        JSON         DEFAULT NULL  COMMENT 'Extra payload',
  `action_url`  VARCHAR(500),
  `priority`    ENUM('low','medium','high','urgent') DEFAULT 'medium',
  `is_read`     BOOLEAN      DEFAULT FALSE,
  `read_at`     TIMESTAMP    NULL,
  `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user`     (`user_id`, `is_read`),
  INDEX `idx_notif_created`  (`created_at` DESC),
  INDEX `idx_notif_type`     (`type`),
  INDEX `idx_notif_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User notifications';

-- ---------------------------------------------------------------
-- T65: women_health_notifications
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `women_health_notifications`;
CREATE TABLE `women_health_notifications` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`     CHAR(36) NOT NULL,
  `type`        ENUM('pregnancy','cycle','vaccine','appointment','health-tip','emergency') NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `message`     TEXT         NOT NULL,
  `priority`    ENUM('low','medium','high','urgent') DEFAULT 'medium',
  `is_read`     BOOLEAN      DEFAULT FALSE,
  `action_url`  VARCHAR(500),
  `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_whn_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_whn_user` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Women health notifications';

-- ---------------------------------------------------------------
-- T66: video_consultations
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `video_consultations`;
CREATE TABLE `video_consultations` (
  `id`              CHAR(36)     PRIMARY KEY,
  `appointment_id`  CHAR(36)     NOT NULL,
  `doctor_id`       INT UNSIGNED NOT NULL,
  `patient_id`      CHAR(36)     NOT NULL,
  `room_id`         VARCHAR(100) NOT NULL UNIQUE,
  `status`          ENUM('scheduled','waiting','in-progress','completed','missed') DEFAULT 'scheduled',
  `start_time`      TIMESTAMP    NULL,
  `end_time`        TIMESTAMP    NULL,
  `recording_url`   VARCHAR(500),
  `notes`           TEXT,
  `created_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_vc_appt`     FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vc_doctor`   FOREIGN KEY (`doctor_id`)      REFERENCES `doctor_profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vc_patient`  FOREIGN KEY (`patient_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_vc_appt`    (`appointment_id`),
  INDEX `idx_vc_room`    (`room_id`),
  INDEX `idx_vc_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Video consultation sessions';

-- ---------------------------------------------------------------
-- T67: emergency_announcements
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `emergency_announcements`;
CREATE TABLE `emergency_announcements` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`           VARCHAR(255) NOT NULL,
  `message`         TEXT         NOT NULL,
  `type`            ENUM('general','emergency','blood-camp','health-camp','awareness') NOT NULL,
  `priority`        ENUM('low','medium','high','critical') DEFAULT 'medium',
  `target_audience` ENUM('all','doctors','patients','staff','public') DEFAULT 'all',
  `created_by`      CHAR(36)     NOT NULL,
  `expires_at`      TIMESTAMP    NULL,
  `is_active`       BOOLEAN      DEFAULT TRUE,
  `attachments`     JSON         DEFAULT NULL,
  `created_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ea_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_ea_active`   (`is_active`, `priority`),
  INDEX `idx_ea_audience` (`target_audience`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Emergency announcements';

-- ================================================================
-- ██████  PHASE 13: ADMIN & ANALYTICS  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T68: admin_users
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`               CHAR(36) NOT NULL UNIQUE,
  `username`              VARCHAR(100) NOT NULL UNIQUE,
  `full_name`             VARCHAR(150) NOT NULL,
  `role`                  ENUM('super-admin','admin','moderator','support') NOT NULL DEFAULT 'admin',
  `permissions`           JSON         DEFAULT NULL  COMMENT '[{"module":"users","actions":["create","read","update","delete","approve"]}]',
  `is_active`            BOOLEAN      DEFAULT TRUE,
  `is_two_factor_enabled` BOOLEAN     DEFAULT FALSE,
  CONSTRAINT `fk_au_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_au_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Admin user accounts';

-- ---------------------------------------------------------------
-- T69: verification_requests
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `verification_requests`;
CREATE TABLE `verification_requests` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `entity_type`      ENUM('doctor','hospital','pharmacy','blood_donor') NOT NULL,
  `entity_id`        VARCHAR(36) NOT NULL,
  `entity_name`      VARCHAR(255),
  `documents`        JSON         DEFAULT NULL  COMMENT '[{"type":"license","name":"medical_license.pdf","fileUrl":"...","verified":false}]',
  `status`           ENUM('pending','approved','rejected','more-info') DEFAULT 'pending',
  `submitted_date`   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `reviewed_by`      CHAR(36)     DEFAULT NULL,
  `reviewed_date`    TIMESTAMP    NULL,
  `rejection_reason` TEXT,
  `notes`            TEXT,
  CONSTRAINT `fk_vr_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_vr_status` (`status`),
  INDEX `idx_vr_entity` (`entity_type`, `entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Entity verification requests';

-- ---------------------------------------------------------------
-- T70: audit_logs
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`       CHAR(36) DEFAULT NULL,
  `action`        VARCHAR(100) NOT NULL  COMMENT 'user.login,appointment.create,prescription.write',
  `entity_type`   VARCHAR(50)           COMMENT 'user,appointment,prescription',
  `entity_id`     VARCHAR(36)           COMMENT 'UUID of affected entity',
  `old_values`    JSON DEFAULT NULL,
  `new_values`    JSON DEFAULT NULL,
  `ip_address`    VARCHAR(45),
  `user_agent`    VARCHAR(500),
  `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_user`    (`user_id`),
  INDEX `idx_audit_action`  (`action`),
  INDEX `idx_audit_entity`  (`entity_type`, `entity_id`),
  INDEX `idx_audit_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System audit trail';

-- ---------------------------------------------------------------
-- T71: security_logs
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `security_logs`;
CREATE TABLE `security_logs` (
  `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `event`         VARCHAR(255) NOT NULL,
  `user_id`       CHAR(36) DEFAULT NULL,
  `user_name`     VARCHAR(150),
  `ip_address`    VARCHAR(45),
  `user_agent`    VARCHAR(500),
  `status`        ENUM('success','failed','blocked') DEFAULT 'success',
  `details`       TEXT,
  `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sl_user`    (`user_id`),
  INDEX `idx_sl_event`   (`event`),
  INDEX `idx_sl_status`  (`status`),
  INDEX `idx_sl_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Security event logs';

-- ---------------------------------------------------------------
-- T72: system_reports
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `system_reports`;
CREATE TABLE `system_reports` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`           VARCHAR(255) NOT NULL,
  `type`            ENUM('user','doctor','hospital','donation','financial','system') NOT NULL,
  `generated_by`   CHAR(36)     NOT NULL,
  `parameters`      JSON         DEFAULT NULL,
  `format`          ENUM('pdf','excel','csv') DEFAULT 'pdf',
  `download_url`    VARCHAR(500),
  `file_size`       VARCHAR(20),
  `created_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sr_generator` FOREIGN KEY (`generated_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_sr_type`    (`type`),
  INDEX `idx_sr_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Generated system reports';

-- ---------------------------------------------------------------
-- T73: system_health
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `system_health`;
CREATE TABLE `system_health` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `status`            ENUM('healthy','degraded','critical') DEFAULT 'healthy',
  `cpu_usage`         DECIMAL(5,2),
  `memory_usage`      DECIMAL(5,2),
  `disk_usage`        DECIMAL(5,2),
  `active_connections` INT UNSIGNED DEFAULT 0,
  `response_time_ms`  INT UNSIGNED,
  `last_incident`     TIMESTAMP NULL,
  `checked_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sh_checked` (`checked_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System health monitoring';

-- ---------------------------------------------------------------
-- T74: scheduled_meetings — Admin meeting system
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `scheduled_meetings`;
CREATE TABLE `scheduled_meetings` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`           VARCHAR(255) NOT NULL,
  `description`     TEXT,
  `organizer_id`    CHAR(36) NOT NULL,
  `meeting_date`     DATE     NOT NULL,
  `start_time`      TIME     NOT NULL,
  `end_time`        TIME     NOT NULL,
  `meeting_url`     VARCHAR(500),
  `status`          ENUM('scheduled','in-progress','completed','cancelled') DEFAULT 'scheduled',
  `participants`    JSON     DEFAULT NULL  COMMENT '["user_id1","user_id2"]',
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sm_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_sm_date`    (`meeting_date`),
  INDEX `idx_sm_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Scheduled meetings';

-- ================================================================
-- ██████  PHASE 14: AI, REVIEWS, BILLING, WELLNESS, MISC  ██████
-- ================================================================

-- ---------------------------------------------------------------
-- T75: ai_conversations
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `ai_conversations`;
CREATE TABLE `ai_conversations` (
  `id`          CHAR(36) PRIMARY KEY,
  `user_id`     CHAR(36) NOT NULL,
  `title`       VARCHAR(255),
  `status`      ENUM('active','archived','deleted') DEFAULT 'active',
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_aic_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_aic_user`   (`user_id`),
  INDEX `idx_aic_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI chat conversations';

-- ---------------------------------------------------------------
-- T76: ai_messages
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `ai_messages`;
CREATE TABLE `ai_messages` (
  `id`              CHAR(36) PRIMARY KEY,
  `conversation_id` CHAR(36) NOT NULL,
  `role`            ENUM('user','assistant','system') NOT NULL,
  `content`         TEXT     NOT NULL,
  `type`            ENUM('text','data','suggestion','error') DEFAULT 'text',
  `data`            JSON     DEFAULT NULL,
  `emotion`         ENUM('happy','neutral','concerned','excited'),
  `confidence`      DECIMAL(3,2),
  `suggestions`     JSON     DEFAULT NULL,
  `sql_query`       TEXT,
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_aim_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations`(`id`) ON DELETE CASCADE,
  INDEX `idx_aim_conversation` (`conversation_id`),
  INDEX `idx_aim_role`        (`role`),
  INDEX `idx_aim_created`     (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI chat messages';

-- ---------------------------------------------------------------
-- T77: ai_voice_sessions
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `ai_voice_sessions`;
CREATE TABLE `ai_voice_sessions` (
  `id`          CHAR(36) PRIMARY KEY,
  `user_id`     CHAR(36) NOT NULL,
  `transcript`  TEXT,
  `audio_url`   VARCHAR(500),
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_avs_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_avs_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI voice assistant sessions';

-- ---------------------------------------------------------------
-- T78: user_reviews
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `user_reviews`;
CREATE TABLE `user_reviews` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `reviewer_id`     CHAR(36) NOT NULL,
  `reviewable_type` ENUM('doctor','hospital','pharmacy','medicine') NOT NULL,
  `reviewable_id`   VARCHAR(36) NOT NULL  COMMENT 'UUID or ID of target',
  `rating`          TINYINT UNSIGNED NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `title`           VARCHAR(255),
  `review_text`     TEXT,
  `is_verified`     BOOLEAN DEFAULT FALSE,
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_review_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_review` (`reviewer_id`, `reviewable_type`, `reviewable_id`),
  INDEX `idx_review_target` (`reviewable_type`, `reviewable_id`),
  INDEX `idx_review_rating`  (`rating`),
  INDEX `idx_review_date`    (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User ratings and reviews';

-- ---------------------------------------------------------------
-- T79: feedback
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         CHAR(36)     NOT NULL,
  `user_name`       VARCHAR(150),
  `user_role`       VARCHAR(50),
  `type`            ENUM('complaint','suggestion','review','bug-report') NOT NULL,
  `subject`         VARCHAR(255) NOT NULL,
  `message`         TEXT         NOT NULL,
  `rating`          TINYINT UNSIGNED,
  `status`          ENUM('pending','reviewed','resolved','closed') DEFAULT 'pending',
  `priority`        ENUM('low','medium','high','urgent') DEFAULT 'medium',
  `submitted_date`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `resolved_by`     CHAR(36)     DEFAULT NULL,
  `resolved_date`   TIMESTAMP    NULL,
  `response`        TEXT,
  CONSTRAINT `fk_fb_user`      FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fb_resolver`  FOREIGN KEY (`resolved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_fb_status`   (`status`),
  INDEX `idx_fb_priority`  (`priority`),
  INDEX `idx_fb_type`      (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User feedback and complaints';

-- ---------------------------------------------------------------
-- T80: billing_invoices
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `billing_invoices`;
CREATE TABLE `billing_invoices` (
  `id`                CHAR(36)     PRIMARY KEY,
  `patient_id`        CHAR(36)     NOT NULL,
  `appointment_id`    CHAR(36)     DEFAULT NULL,
  `pharmacy_order_id` CHAR(36)    DEFAULT NULL,
  `invoice_number`    VARCHAR(50)  NOT NULL UNIQUE,
  `amount`            DECIMAL(10,2) NOT NULL,
  `tax`               DECIMAL(10,2) DEFAULT 0,
  `discount`          DECIMAL(10,2) DEFAULT 0,
  `total_amount`      DECIMAL(10,2) NOT NULL,
  `payment_method`    ENUM('cash','card','online','insurance') DEFAULT 'cash',
  `payment_status`    ENUM('pending','paid','refunded','partial') DEFAULT 'pending',
  `insurance_provider` VARCHAR(255),
  `insurance_policy_number` VARCHAR(100),
  `insurance_coverage` DECIMAL(10,2) DEFAULT 0,
  `patient_responsibility` DECIMAL(10,2) DEFAULT 0,
  `due_date`          DATE,
  `paid_at`           TIMESTAMP NULL,
  `pdf_url`           VARCHAR(500),
  `created_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bi_patient`    FOREIGN KEY (`patient_id`)        REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bi_appointment` FOREIGN KEY (`appointment_id`)   REFERENCES `appointments`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bi_order`      FOREIGN KEY (`pharmacy_order_id`) REFERENCES `medicine_orders`(`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_bi_total`     CHECK (`total_amount` >= 0),
  INDEX `idx_bi_patient` (`patient_id`),
  INDEX `idx_bi_status`  (`payment_status`),
  INDEX `idx_bi_number`  (`invoice_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Billing invoices';

-- ---------------------------------------------------------------
-- T81: insurance_claims
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `insurance_claims`;
CREATE TABLE `insurance_claims` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invoice_id`        CHAR(36)     NOT NULL,
  `provider`          VARCHAR(255) NOT NULL,
  `policy_number`     VARCHAR(100) NOT NULL,
  `claim_amount`      DECIMAL(10,2) NOT NULL,
  `approved_amount`   DECIMAL(10,2) DEFAULT 0,
  `status`            ENUM('submitted','under-review','approved','partially-approved','rejected') DEFAULT 'submitted',
  `submitted_date`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `processed_date`    TIMESTAMP    NULL,
  `rejection_reason`  TEXT,
  `documents`         JSON         DEFAULT NULL,
  CONSTRAINT `fk_ic_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `billing_invoices`(`id`) ON DELETE CASCADE,
  INDEX `idx_ic_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Insurance claims';

-- ---------------------------------------------------------------
-- T82: wellness_tracking — Mental health, nutrition, sleep, fitness
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `wellness_tracking`;
CREATE TABLE `wellness_tracking` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         CHAR(36) NOT NULL,
  `tracking_type`   ENUM('mental-health','nutrition','sleep','fitness','physiotherapy') NOT NULL,
  `record_date`     DATE     NOT NULL,
  `metrics`         JSON     NOT NULL  COMMENT '{"mood_score":7,"stress_level":"low","sleep_hours":8,"steps":5000,"calories":1800}',
  `notes`           TEXT,
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wt_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_wt_user`       (`user_id`),
  INDEX `idx_wt_type_date`  (`tracking_type`, `record_date` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Wellness tracking (mental, nutrition, sleep, fitness)';

-- ---------------------------------------------------------------
-- T83: development_milestones — Baby/child development milestones
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `development_milestones`;
CREATE TABLE `development_milestones` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `baby_id`         INT UNSIGNED NOT NULL,
  `category`        ENUM('physical','cognitive','social','language') NOT NULL,
  `name`            VARCHAR(255) NOT NULL,
  `expected_age_months` TINYINT UNSIGNED NOT NULL,
  `achieved_age_months` TINYINT UNSIGNED,
  `status`          ENUM('pending','achieved','delayed') DEFAULT 'pending',
  `notes`           TEXT,
  CONSTRAINT `fk_dm_baby` FOREIGN KEY (`baby_id`) REFERENCES `baby_profiles`(`id`) ON DELETE CASCADE,
  INDEX `idx_dm_baby` (`baby_id`),
  INDEX `idx_dm_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Child development milestones';

-- ---------------------------------------------------------------
-- T84: search_logs — Track user searches for analytics
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `search_logs`;
CREATE TABLE `search_logs` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         CHAR(36) DEFAULT NULL  COMMENT 'NULL for anonymous',
  `query`           VARCHAR(500) NOT NULL,
  `search_type`     ENUM('doctor','hospital','pharmacy','medicine','blood-donor','general') DEFAULT 'general',
  `results_count`   INT UNSIGNED DEFAULT 0,
  `ip_address`     VARCHAR(45),
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sl_query`  (`query`(100)),
  INDEX `idx_sl_type`   (`search_type`),
  INDEX `idx_sl_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User search analytics';

-- ---------------------------------------------------------------
-- T85: bed_bookings — Bed reservation tracking
-- ---------------------------------------------------------------
DROP TABLE IF EXISTS `bed_bookings`;
CREATE TABLE `bed_bookings` (
  `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hospital_id`         CHAR(36) NOT NULL,
  `bed_id`             INT UNSIGNED DEFAULT NULL,
  `patient_id`         CHAR(36) NOT NULL,
  `patient_name`       VARCHAR(150) NOT NULL,
  `bed_type`           VARCHAR(50),
  `admitted_at`         TIMESTAMP,
  `expected_discharge`  DATE,
  `status`             ENUM('pending','confirmed','admitted','discharged','cancelled') DEFAULT 'pending',
  `total_cost`         DECIMAL(10,2) DEFAULT 0,
  `created_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bb_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bb_bed`      FOREIGN KEY (`bed_id`)      REFERENCES `hospital_beds`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bb_patient`  FOREIGN KEY (`patient_id`)  REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_bb_hospital` (`hospital_id`),
  INDEX `idx_bb_patient`  (`patient_id`),
  INDEX `idx_bb_status`   (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bed booking records';



CREATE OR REPLACE VIEW `v_doctor_dashboard` AS
SELECT
  dp.id AS doctor_id,
  u.full_name AS doctor_name,
  dp.specialization,
  dp.rating,
  dp.total_patients,
  dp.total_consultations,
  dp.consultation_fee,
  COUNT(DISTINCT a.id) AS total_appointments,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) AS completed_appointments,
  COUNT(DISTINCT CASE WHEN a.appointment_date = CURDATE() THEN a.id END) AS today_appointments,
  SUM(CASE WHEN a.status = 'completed' THEN a.fee ELSE 0 END) AS total_revenue,
  COUNT(DISTINCT r.id) AS total_prescriptions
FROM doctor_profiles dp
JOIN users u ON dp.user_id = u.id
LEFT JOIN appointments a ON dp.id = a.doctor_id
LEFT JOIN prescriptions r ON dp.id = r.doctor_id
WHERE u.is_active = 1
GROUP BY dp.id;

CREATE OR REPLACE VIEW `v_hospital_bed_status` AS
SELECT
  h.id AS hospital_id,
  h.name AS hospital_name,
  h.city,
  h.total_beds,
  h.available_beds,
  ROUND((h.total_beds - h.available_beds) / NULLIF(h.total_beds, 0) * 100, 1) AS occupancy_rate,
  COUNT(hb.id) AS total_bed_records,
  COUNT(CASE WHEN hb.status = 'available' THEN 1 END) AS available_now,
  COUNT(CASE WHEN hb.status = 'occupied' THEN 1 END) AS occupied_now
FROM hospitals h
LEFT JOIN hospital_beds hb ON h.id = hb.hospital_id
WHERE h.is_active = 1
GROUP BY h.id;

CREATE OR REPLACE VIEW `v_pharmacy_inventory_status` AS
SELECT
  p.id AS pharmacy_id,
  p.name AS pharmacy_name,
  COUNT(pi.id) AS total_medicines,
  COUNT(CASE WHEN pi.quantity <= pi.min_stock THEN 1 END) AS low_stock_items,
  COUNT(CASE WHEN pi.quantity = 0 THEN 1 END) AS out_of_stock,
  COUNT(CASE WHEN pi.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 END) AS expiring_soon,
  SUM(pi.price * pi.quantity) AS inventory_value
FROM pharmacies p
LEFT JOIN pharmacy_inventory pi ON p.id = pi.pharmacy_id AND pi.is_available = 1
WHERE p.is_active = 1
GROUP BY p.id;

CREATE OR REPLACE VIEW `v_blood_donor_stats` AS
SELECT
  bd.blood_group,
  COUNT(*) AS total_donors,
  COUNT(CASE WHEN bd.is_available = 1 THEN 1 END) AS available_donors,
  COUNT(CASE WHEN bd.is_emergency_donor = 1 THEN 1 END) AS emergency_donors,
  SUM(bd.total_donations) AS total_donations,
  SUM(bd.lives_saved) AS total_lives_saved
FROM blood_donors bd
WHERE bd.status IN ('approved', 'active')
GROUP BY bd.blood_group;

CREATE OR REPLACE VIEW `v_appointment_analytics` AS
SELECT
  DATE_FORMAT(a.appointment_date, '%Y-%m') AS month,
  a.doctor_id,
  dp.specialization,
  COUNT(*) AS total_appointments,
  COUNT(CASE WHEN a.status = 'completed' THEN 1 END) AS completed,
  COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) AS cancelled,
  ROUND(COUNT(CASE WHEN a.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 1) AS completion_rate
FROM appointments a
JOIN doctor_profiles dp ON a.doctor_id = dp.id
GROUP BY month, a.doctor_id;

CREATE OR REPLACE VIEW `v_patient_health_summary` AS
SELECT
  u.id AS patient_id,
  u.full_name,
  u.blood_group,
  up.height_cm,
  up.weight_kg,
  ROUND(up.weight_kg / NULLIF(POWER(up.height_cm/100, 2), 0), 1) AS bmi,
  COUNT(DISTINCT a.id) AS total_appointments,
  COUNT(DISTINCT r.id) AS active_prescriptions,
  COUNT(DISTINCT pm.id) AS current_medications,
  COUNT(DISTINCT pv.id) AS vaccination_records
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN appointments a ON u.id = a.patient_id
LEFT JOIN prescriptions r ON u.id = r.patient_id AND r.status = 'active'
LEFT JOIN patient_medications pm ON u.id = pm.patient_id AND pm.is_active = 1
LEFT JOIN patient_vaccinations pv ON u.id = pv.patient_id
WHERE u.primary_role_id = (SELECT id FROM roles WHERE name = 'patient')
GROUP BY u.id;

CREATE OR REPLACE VIEW `v_platform_revenue` AS
SELECT
  DATE_FORMAT(created_at, '%Y-%m') AS month,
  'Appointments' AS source,
  SUM(CASE WHEN status = 'completed' THEN fee ELSE 0 END) AS revenue,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count
FROM appointments
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
UNION ALL
SELECT
  DATE_FORMAT(created_at, '%Y-%m'),
  'Pharmacy Orders',
  SUM(CASE WHEN order_status = 'delivered' THEN final_amount ELSE 0 END),
  COUNT(CASE WHEN order_status = 'delivered' THEN 1 END)
FROM medicine_orders
GROUP BY DATE_FORMAT(created_at, '%Y-%m');

CREATE OR REPLACE VIEW `v_system_overview` AS
SELECT
  (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) AS total_users,
  (SELECT COUNT(*) FROM users WHERE is_verified = 1 AND deleted_at IS NULL) AS verified_users,
  (SELECT COUNT(*) FROM doctor_profiles WHERE is_verified = 1) AS verified_doctors,
  (SELECT COUNT(*) FROM hospitals WHERE is_verified = 1) AS verified_hospitals,
  (SELECT COUNT(*) FROM pharmacies WHERE is_verified = 1) AS verified_pharmacies,
  (SELECT COUNT(*) FROM blood_donors WHERE status IN ('approved','active')) AS active_donors,
  (SELECT COUNT(*) FROM appointments WHERE appointment_date = CURDATE()) AS today_appointments,
  (SELECT COUNT(*) FROM appointments WHERE appointment_date >= CURDATE() AND status IN ('scheduled','confirmed')) AS upcoming_appointments;


-- ================================================================
-- ██████████████████████████████████████████████████████████████
-- ██████  STORED PROCEDURES (6)  ██████
-- ██████████████████████████████████████████████████████████████
-- ================================================================

-- SP1: Book Appointment with Conflict Detection
DELIMITER //
CREATE PROCEDURE `sp_book_appointment`(
  IN p_patient_id CHAR(36),
  IN p_doctor_id INT UNSIGNED,
  IN p_hospital_id CHAR(36),
  IN p_date DATE,
  IN p_start_time TIME,
  IN p_end_time TIME,
  IN p_type VARCHAR(50),
  IN p_location VARCHAR(50),
  IN p_reason TEXT,
  IN p_fee DECIMAL(10,2)
)
BEGIN
  DECLARE v_conflict INT DEFAULT 0;
  DECLARE v_new_id CHAR(36);

  SELECT COUNT(*) INTO v_conflict
  FROM appointments
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND status NOT IN ('cancelled', 'no-show')
    AND ((start_time < p_end_time AND end_time > p_start_time)
      OR (start_time = p_start_time));

  IF v_conflict > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Time slot conflict detected. Please choose another time.';
  ELSE
    SET v_new_id = UUID();
    INSERT INTO appointments (id, patient_id, doctor_id, hospital_id, appointment_date, start_time, end_time, type, location, reason, fee)
    VALUES (v_new_id, p_patient_id, p_doctor_id, p_hospital_id, p_date, p_start_time, p_end_time, p_type, p_location, p_reason, p_fee);

    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
    VALUES (p_patient_id, 'appointment.create', 'appointment', v_new_id,
            JSON_OBJECT('doctor_id', p_doctor_id, 'date', p_date, 'time', p_start_time));

    SELECT v_new_id AS appointment_id, 'Appointment booked successfully' AS message;
  END IF;
END //
DELIMITER ;

-- SP2: Cancel Appointment with Audit
DELIMITER //
CREATE PROCEDURE `sp_cancel_appointment`(
  IN p_appointment_id CHAR(36),
  IN p_user_id CHAR(36),
  IN p_reason VARCHAR(500)
)
BEGIN
  DECLARE v_old_status VARCHAR(20);
  SELECT status INTO v_old_status FROM appointments WHERE id = p_appointment_id;

  UPDATE appointments
  SET status = 'cancelled', cancellation_reason = p_reason, updated_at = CURRENT_TIMESTAMP
  WHERE id = p_appointment_id;

  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (p_user_id, 'appointment.cancel', 'appointment', p_appointment_id,
          JSON_OBJECT('status', v_old_status),
          JSON_OBJECT('status', 'cancelled', 'reason', p_reason));
END //
DELIMITER ;

-- SP3: Update Bed Status with Hospital Counter Sync
DELIMITER //
CREATE PROCEDURE `sp_update_bed_status`(
  IN p_bed_id INT UNSIGNED,
  IN p_new_status VARCHAR(20),
  IN p_patient_id CHAR(36),
  IN p_user_id CHAR(36)
)
BEGIN
  DECLARE v_old_status VARCHAR(20);
  DECLARE v_hospital_id CHAR(36);

  SELECT status, hospital_id INTO v_old_status, v_hospital_id FROM hospital_beds WHERE id = p_bed_id;

  UPDATE hospital_beds
  SET status = p_new_status,
      patient_id = CASE WHEN p_new_status = 'occupied' THEN p_patient_id ELSE NULL END,
      patient_name = CASE WHEN p_new_status = 'occupied' THEN (SELECT full_name FROM users WHERE id = p_patient_id) ELSE NULL END,
      admission_date = CASE WHEN p_new_status = 'occupied' THEN CURDATE() ELSE NULL END
  WHERE id = p_bed_id;

  UPDATE hospitals
  SET available_beds = (SELECT COUNT(*) FROM hospital_beds WHERE hospital_id = v_hospital_id AND status = 'available'),
      updated_at = CURRENT_TIMESTAMP
  WHERE id = v_hospital_id;

  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (p_user_id, 'bed.update', 'hospital_bed', p_bed_id,
          JSON_OBJECT('status', v_old_status),
          JSON_OBJECT('status', p_new_status));
END //
DELIMITER ;

-- SP4: Process Blood Request with Notification
DELIMITER //
CREATE PROCEDURE `sp_process_blood_request`(
  IN p_request_id CHAR(36),
  IN p_new_status VARCHAR(50),
  IN p_approved_by CHAR(36)
)
BEGIN
  UPDATE blood_requests
  SET status = p_new_status,
      approved_by = CASE WHEN p_new_status = 'approved' THEN p_approved_by ELSE approved_by END,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_request_id;

  IF p_new_status = 'approved' THEN
    INSERT INTO notifications (id, user_id, type, title, body, priority)
    VALUES (UUID(), (SELECT requested_by FROM blood_requests WHERE id = p_request_id),
            'blood_request', 'Blood Request Approved',
            CONCAT('Your blood request has been approved.'), 'high');
  END IF;
END //
DELIMITER ;

-- SP5: Create Prescription with Items
DELIMITER //
CREATE PROCEDURE `sp_create_prescription`(
  IN p_doctor_id INT UNSIGNED,
  IN p_patient_id CHAR(36),
  IN p_appointment_id CHAR(36),
  IN p_diagnosis TEXT,
  IN p_advice TEXT,
  IN p_follow_up_date DATE
)
BEGIN
  DECLARE v_new_id CHAR(36);
  SET v_new_id = UUID();

  INSERT INTO prescriptions (id, appointment_id, doctor_id, patient_id, diagnosis, advice, follow_up_date)
  VALUES (v_new_id, p_appointment_id, p_doctor_id, p_patient_id, p_diagnosis, p_advice, p_follow_up_date);

  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
  VALUES ((SELECT user_id FROM doctor_profiles WHERE id = p_doctor_id),
          'prescription.create', 'prescription', v_new_id,
          JSON_OBJECT('patient_id', p_patient_id, 'diagnosis', p_diagnosis));

  SELECT v_new_id AS prescription_id;
END //
DELIMITER ;

-- SP6: Generate Monthly Revenue Report
DELIMITER //
CREATE PROCEDURE `sp_monthly_revenue_report`(
  IN p_month DATE
)
BEGIN
  SELECT
    'Appointments' AS source,
    COUNT(*) AS transaction_count,
    SUM(fee) AS total_revenue,
    AVG(fee) AS avg_transaction
  FROM appointments
  WHERE appointment_date >= DATE_FORMAT(p_month, '%Y-%m-01')
    AND appointment_date < DATE_FORMAT(p_month + INTERVAL 1 MONTH, '%Y-%m-01')
    AND status = 'completed'

  UNION ALL

  SELECT
    'Pharmacy Orders',
    COUNT(*),
    SUM(final_amount),
    AVG(final_amount)
  FROM medicine_orders
  WHERE created_at >= DATE_FORMAT(p_month, '%Y-%m-01')
    AND created_at < DATE_FORMAT(p_month + INTERVAL 1 MONTH, '%Y-%m-01')
    AND order_status = 'delivered';
END //
DELIMITER ;



-- Trigger 1
DELIMITER //
CREATE TRIGGER `trg_bed_status_update`
AFTER UPDATE ON `hospital_beds`
FOR EACH ROW
BEGIN
  IF NEW.status != OLD.status THEN
    UPDATE hospitals
    SET available_beds = (SELECT COUNT(*) FROM hospital_beds WHERE hospital_id = NEW.hospital_id AND status = 'available'),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.hospital_id;
  END IF;
END //
DELIMITER ;

-- Trigger 2
DELIMITER //
CREATE TRIGGER `trg_session_activity`
AFTER UPDATE ON `user_sessions`
FOR EACH ROW
BEGIN
  IF NEW.last_activity_at != OLD.last_activity_at THEN
    UPDATE users SET is_online = TRUE WHERE id = NEW.user_id;
  END IF;
END //
DELIMITER ;

-- Trigger 3: 
DELIMITER //
CREATE TRIGGER `trg_order_delivered`
AFTER UPDATE ON `medicine_orders`
FOR EACH ROW
BEGIN
  IF NEW.order_status = 'delivered' AND OLD.order_status != 'delivered' THEN
    UPDATE pharmacy_inventory pi
    JOIN order_items oi ON pi.id = oi.inventory_id
    SET pi.quantity = GREATEST(pi.quantity - oi.quantity, 0),
        pi.updated_at = CURRENT_TIMESTAMP
    WHERE oi.order_id = NEW.id;
  END IF;
END //
DELIMITER ;

-- Trigger 4: Auto-update doctor stats on appointment completion
DELIMITER //
CREATE TRIGGER `trg_appointment_completed`
AFTER UPDATE ON `appointments`
FOR EACH ROW
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE doctor_profiles
    SET total_consultations = total_consultations + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.doctor_id;
  END IF;
END //
DELIMITER ;

-- Trigger 5
DELIMITER //
CREATE TRIGGER `trg_blood_donation_created`
AFTER INSERT ON `blood_donations`
FOR EACH ROW
BEGIN
  UPDATE blood_donors
  SET last_donation_date = NEW.donation_date,
      next_eligible_date = DATE_ADD(NEW.donation_date, INTERVAL 90 DAY),
      total_donations = total_donations + 1,
      donated_units = donated_units + NEW.units,
      is_available = FALSE
  WHERE id = NEW.donor_id;
END //
DELIMITER ;

-- Trigger 6
DELIMITER //
CREATE TRIGGER `trg_user_registration`
AFTER INSERT ON `users`
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
  VALUES (NEW.id, 'user.register', 'user', NEW.id,
          JSON_OBJECT('email', NEW.email, 'full_name', NEW.full_name, 'role_id', NEW.primary_role_id));
END //
DELIMITER ;



DELIMITER //
CREATE TRIGGER `trg_inventory_low_stock`
AFTER UPDATE ON `pharmacy_inventory`
FOR EACH ROW
BEGIN
  IF NEW.quantity <= NEW.min_stock AND OLD.quantity > OLD.min_stock THEN
    INSERT INTO stock_alerts (pharmacy_id, inventory_id, medicine_name, current_stock, min_stock, status)
    VALUES (NEW.pharmacy_id, NEW.id, NEW.medicine_name, NEW.quantity, NEW.min_stock,
            CASE WHEN NEW.quantity = 0 THEN 'out-of-stock' WHEN NEW.quantity <= NEW.min_stock / 2 THEN 'critical' ELSE 'low' END);
  END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER `trg_pharmacy_order_created`
AFTER INSERT ON `medicine_orders`
FOR EACH ROW
BEGIN
  UPDATE pharmacies SET total_orders = total_orders + 1 WHERE id = NEW.pharmacy_id;
END //
DELIMITER ;



INSERT INTO `roles` (`name`, `display_name`, `description`, `priority`, `is_system_role`) VALUES
('super_admin',           'Super Admin',           'Full system access with all privileges',             100, TRUE),
('admin',                 'Admin',                 'Platform management and user verification',              90, TRUE),
('moderator',            'Moderator',            'Content moderation and report handling',                70, TRUE),
('doctor',               'Doctor',               'Patient care and prescription management',               60, TRUE),
('hospital',              'Hospital Manager',     'Hospital bed, staff, and resource management',         50, TRUE),
('hospital_admin',       'Hospital Admin',       'Hospital administrative operations',                     45, TRUE),
('hospital_authority',   'Hospital Authority',   'Hospital oversight and compliance',                    40, TRUE),
('pharmacy',             'Pharmacy Manager',     'Medicine inventory and order processing',              50, TRUE),
('pharmacy_admin',       'Pharmacy Admin',       'Pharmacy administrative operations',                     45, TRUE),
('patient',              'Patient',              'Personal health and appointment management',             30, TRUE),
('client',               'Client',               'Basic platform access with upgrade path',               20, TRUE),
('normal_user',          'Normal User',          'Basic unverified platform access',                      10, TRUE),
('blood_donor',         'Blood Donor',         'Blood donation registration and management',            35, TRUE),
('emergency_volunteer',  'Emergency Volunteer',  'Emergency response and volunteer services',            25, TRUE),
('admin_applicant',      'Admin Applicant',      'Pending admin access request',                         15, TRUE);



CREATE INDEX `idx_appt_patient_date`     ON `appointments`(`patient_id`, `appointment_date` DESC);
CREATE INDEX `idx_hosp_beds_availability` ON `hospitals`(`available_beds`, `icu_available_beds`);
CREATE INDEX `idx_donor_blood_available` ON `blood_donors`(`blood_group`, `is_available`);
CREATE INDEX `idx_order_patient_status`  ON `medicine_orders`(`patient_id`, `order_status`);
CREATE INDEX `idx_msg_conversation_date` ON `messages`(`sender_id`, `receiver_id`, `created_at` DESC);
CREATE INDEX `idx_prescription_patient_active` ON `prescriptions`(`patient_id`, `status`);
CREATE INDEX `idx_doctor_specialty_verified` ON `doctor_profiles`(`specialization`, `is_verified`);
CREATE INDEX `idx_appointment_date_priority` ON `appointments`(`appointment_date`, `priority`);


SET FOREIGN_KEY_CHECKS = 1;