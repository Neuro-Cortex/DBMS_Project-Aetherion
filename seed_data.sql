-- ============================================
-- AETHERION HEALTHCARE - Realistic Seed Data
-- Database: aethion_bd
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;

-- Clear all existing data
DELETE FROM `insurance_claims`;
DELETE FROM `password_resets`;
DELETE FROM `user_sessions`;
DELETE FROM `order_items`;
DELETE FROM `stock_alerts`;
DELETE FROM `medicine_reminders`;
DELETE FROM `prescription_items`;
DELETE FROM `prescription_tests`;
DELETE FROM `pregnancy_symptoms`;
DELETE FROM `pregnancy_medications`;
DELETE FROM `development_milestones`;
DELETE FROM `baby_growth_records`;
DELETE FROM `baby_vaccine_records`;
DELETE FROM `women_pregnancy_ultrasounds`;
DELETE FROM `women_pregnancy_tracking`;
DELETE FROM `baby_profiles`;
DELETE FROM `women_pregnancies`;
DELETE FROM `women_menstrual_cycles`;
DELETE FROM `women_health_notifications`;
DELETE FROM `gynecologist_consultations`;
DELETE FROM `wellness_tracking`;
DELETE FROM `health_recommendations`;
DELETE FROM `emergency_announcements`;
DELETE FROM `hospital_activities`;
DELETE FROM `feedback`;
DELETE FROM `user_reviews`;
DELETE FROM `user_documents`;
DELETE FROM `verification_requests`;
DELETE FROM `user_role_upgrades`;
DELETE FROM `search_logs`;
DELETE FROM `audit_logs`;
DELETE FROM `security_logs`;
DELETE FROM `scheduled_meetings`;
DELETE FROM `system_health`;
DELETE FROM `system_reports`;
DELETE FROM `ai_messages`;
DELETE FROM `ai_conversations`;
DELETE FROM `ai_voice_sessions`;
DELETE FROM `doctor_notifications`;
DELETE FROM `doctor_activities`;
DELETE FROM `doctor_earnings`;
DELETE FROM `messages`;
DELETE FROM `video_consultations`;
DELETE FROM `notifications`;
DELETE FROM `billing_invoices`;
DELETE FROM `ambulance_requests`;
DELETE FROM `oxygen_requests`;
DELETE FROM `patient_medications`;
DELETE FROM `patient_vaccinations`;
DELETE FROM `patient_surgeries`;
DELETE FROM `patient_family_history`;
DELETE FROM `patient_medical_history`;
DELETE FROM `patient_health_records`;
DELETE FROM `medicine_orders`;
DELETE FROM `prescriptions`;
DELETE FROM `appointments`;
DELETE FROM `doctor_patients`;
DELETE FROM `doctor_availability`;
DELETE FROM `donor_rewards`;
DELETE FROM `blood_donations`;
DELETE FROM `blood_donation_camps`;
DELETE FROM `blood_requests`;
DELETE FROM `pharmacy_inventory`;
DELETE FROM `hospital_beds`;
DELETE FROM `hospital_ambulances`;
DELETE FROM `hospital_blood_stocks`;
DELETE FROM `hospital_blood_bank`;
DELETE FROM `hospital_oxygen_stock`;
DELETE FROM `hospital_doctors`;
DELETE FROM `hospital_departments`;
DELETE FROM `emergency_services`;
DELETE FROM `user_notification_settings`;
DELETE FROM `user_preferences`;
DELETE FROM `user_emergency_contacts`;
DELETE FROM `user_addresses`;
DELETE FROM `user_profiles`;
DELETE FROM `admin_users`;
DELETE FROM `user_roles`;
DELETE FROM `doctor_profiles`;
DELETE FROM `blood_donors`;
DELETE FROM `hospitals`;
DELETE FROM `pharmacies`;
DELETE FROM `users`;
DELETE FROM `roles`;

-- ROLES
INSERT INTO `roles` (`id`,`name`,`display_name`,`description`,`is_system_role`,`priority`) VALUES
(1,'super_admin','Super Admin','Full system access',1,100),
(2,'admin','Administrator','System administrator',1,90),
(3,'moderator','Moderator','Content moderation',1,70),
(4,'doctor','Doctor','Medical professional',1,60),
(5,'hospital','Hospital','Hospital entity',1,50),
(6,'hospital_admin','Hospital Admin','Hospital administrator',1,55),
(7,'hospital_authority','Hospital Authority','Hospital authority reviewer',1,58),
(8,'pharmacy','Pharmacy','Pharmacy entity',1,50),
(9,'pharmacy_admin','Pharmacy Admin','Pharmacy administrator',1,55),
(10,'patient','Patient','Healthcare patient',1,20),
(11,'client','Client','Corporate client',1,25),
(12,'blood_donor','Blood Donor','Registered donor',1,15),
(13,'emergency_volunteer','Emergency Volunteer','Emergency responder',1,30),
(14,'admin_applicant','Admin Applicant','Pending application',1,10),
(15,'normal_user','Normal User','Basic user',1,5);

-- USERS
INSERT INTO `users` (`id`,`email`,`phone`,`password_hash`,`full_name`,`first_name`,`last_name`,`gender`,`date_of_birth`,`blood_group`,`primary_role_id`,`is_verified`,`is_active`,`is_admin_approved`,`is_online`,`email_verified_at`,`last_login_at`,`created_at`,`updated_at`) VALUES
('e4dea08c-0e25-5f6d-bccd-c79a07c6324b','rajesh.kumar@aetherion.health','+1-555-0101','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Rajesh Kumar','Rajesh','Kumar','male','1975-03-15','O+',1,1,1,1,1,'2026-01-01 00:00:00','2026-05-28 09:30:00','2026-01-01 00:00:00','2026-05-28 09:30:00'),
('8e04675f-927d-5de9-9ea5-062d18510c48','priya.sharma@aetherion.health','+1-555-0102','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Priya Sharma','Priya','Sharma','female','1985-07-22','A+',2,1,1,1,1,'2026-01-05 00:00:00','2026-05-27 14:00:00','2026-01-05 00:00:00','2026-05-27 14:00:00'),
('b6366b0f-f5c0-54de-9a5c-42344e6c2eee','anil.verma@aetherion.health','+1-555-0103','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Anil Verma','Anil','Verma','male','1990-11-08','B+',3,1,1,1,0,'2026-01-10 00:00:00','2026-05-26 11:00:00','2026-01-10 00:00:00','2026-05-26 11:00:00'),
('9f3305dc-31e4-5ed4-a1b7-079368c00b20','sarah.mitchell@aetherion.health','+1-555-0201','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Dr. Sarah Mitchell','Sarah','Mitchell','female','1982-04-18','O-',4,1,1,1,1,'2026-01-15 00:00:00','2026-05-30 08:15:00','2026-01-15 00:00:00','2026-05-30 08:15:00'),
('8e9f258c-2b51-5f32-b979-9cf56275b17e','james.wilson@aetherion.health','+1-555-0202','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Dr. James Wilson','James','Wilson','male','1978-09-25','AB+',4,1,1,1,1,'2026-01-15 00:00:00','2026-05-29 16:45:00','2026-01-15 00:00:00','2026-05-29 16:45:00'),
('452d0ca6-ae39-56c1-a87d-800902d420c5','anita.desai@aetherion.health','+1-555-0203','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Dr. Anita Desai','Anita','Desai','female','1986-01-12','A-',4,1,1,1,1,'2026-02-01 00:00:00','2026-05-30 10:00:00','2026-02-01 00:00:00','2026-05-30 10:00:00'),
('9e7ffe9d-b111-5437-bcec-9691470c26fe','robert.chen@aetherion.health','+1-555-0204','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Dr. Robert Chen','Robert','Chen','male','1974-06-30','B-',4,1,1,1,1,'2026-02-01 00:00:00','2026-05-28 09:00:00','2026-02-01 00:00:00','2026-05-28 09:00:00'),
('563c8335-edaf-55ea-a436-1a108546a90b','meera.patel@aetherion.health','+1-555-0205','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Dr. Meera Patel','Meera','Patel','female','1988-12-05','O+',4,1,1,1,1,'2026-02-15 00:00:00','2026-05-30 07:30:00','2026-02-15 00:00:00','2026-05-30 07:30:00'),
('140b2cae-5507-5109-85b3-81e5ec53e170','david.brown@aetherion.health','+1-555-0206','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Dr. David Brown','David','Brown','male','1980-08-14','A+',4,1,1,1,1,'2026-03-01 00:00:00','2026-05-27 13:00:00','2026-03-01 00:00:00','2026-05-27 13:00:00'),
('0a489b23-3281-5aed-b3ff-804492121ee5','fatima.khan@aetherion.health','+1-555-0207','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Dr. Fatima Khan','Fatima','Khan','female','1983-02-28','B+',4,1,1,1,1,'2026-03-01 00:00:00','2026-05-29 11:00:00','2026-03-01 00:00:00','2026-05-29 11:00:00'),
('69f3d55c-2125-593e-9729-6dd70d29e6b5','michael.lee@aetherion.health','+1-555-0208','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Dr. Michael Lee','Michael','Lee','male','1976-10-20','O-',4,1,1,1,1,'2026-03-15 00:00:00','2026-05-30 09:00:00','2026-03-15 00:00:00','2026-05-30 09:00:00'),
('1992d7c8-4f0f-5bc5-bb6c-965e44ef8602','vikram.singh@aetherion.health','+1-555-0301','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Vikram Singh','Vikram','Singh','male','1972-05-10','AB-',6,1,1,1,1,'2026-01-10 00:00:00','2026-05-30 10:00:00','2026-01-10 00:00:00','2026-05-30 10:00:00'),
('0f7de2ca-8c34-54a7-ab57-ecd07e35fbb2','diana.ross@aetherion.health','+1-555-0302','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Diana Ross','Diana','Ross','female','1984-03-17','A+',6,1,1,1,1,'2026-02-01 00:00:00','2026-05-29 09:00:00','2026-02-01 00:00:00','2026-05-29 09:00:00'),
('dec62327-bcc2-5121-a1d2-e6d7f4a8cb3d','arjun.mehta@aetherion.health','+1-555-0303','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Arjun Mehta','Arjun','Mehta','male','1979-07-08','B+',6,1,1,1,1,'2026-02-15 00:00:00','2026-05-28 14:00:00','2026-02-15 00:00:00','2026-05-28 14:00:00'),
('21367ea7-f277-5a17-8ce5-d714929f3802','rakesh.gupta@aetherion.health','+1-555-0401','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Rakesh Gupta','Rakesh','Gupta','male','1977-11-22','O+',9,1,1,1,1,'2026-01-20 00:00:00','2026-05-30 08:00:00','2026-01-20 00:00:00','2026-05-30 08:00:00'),
('b6cdd07b-e935-521b-b509-296923273f04','linda.johnson@aetherion.health','+1-555-0402','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Linda Johnson','Linda','Johnson','female','1981-09-14','AB+',9,1,1,1,1,'2026-02-01 00:00:00','2026-05-29 15:00:00','2026-02-01 00:00:00','2026-05-29 15:00:00'),
('84e818cd-f344-5ad8-9b9a-82be450cbd13','aarav.sharma@email.com','+1-555-0501','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Aarav Sharma','Aarav','Sharma','male','1995-06-20','B+',10,1,1,0,0,'2026-01-20 00:00:00','2026-05-30 07:00:00','2026-01-20 00:00:00','2026-05-30 07:00:00'),
('aa536c99-b7e7-5f30-897a-c0e586d834de','emily.davis@email.com','+1-555-0502','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Emily Davis','Emily','Davis','female','1992-03-15','O-',10,1,1,0,0,'2026-01-25 00:00:00','2026-05-29 18:00:00','2026-01-25 00:00:00','2026-05-29 18:00:00'),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','rohan.patel@email.com','+1-555-0503','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Rohan Patel','Rohan','Patel','male','1998-08-12','A+',10,1,1,0,0,'2026-02-01 00:00:00','2026-05-30 12:00:00','2026-02-01 00:00:00','2026-05-30 12:00:00'),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','sophia.martinez@email.com','+1-555-0504','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Sophia Martinez','Sophia','Martinez','female','1990-11-05','AB+',10,1,1,0,0,'2026-02-10 00:00:00','2026-05-28 20:00:00','2026-02-10 00:00:00','2026-05-28 20:00:00'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','amit.kumar@email.com','+1-555-0505','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Amit Kumar','Amit','Kumar','male','1993-04-28','O+',10,1,1,0,0,'2026-02-15 00:00:00','2026-05-27 10:00:00','2026-02-15 00:00:00','2026-05-27 10:00:00'),
('e6147795-11e7-5e06-927e-c47e140ea4dd','jessica.taylor@email.com','+1-555-0506','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Jessica Taylor','Jessica','Taylor','female','1996-01-19','B-',10,1,1,0,0,'2026-03-01 00:00:00','2026-05-30 06:00:00','2026-03-01 00:00:00','2026-05-30 06:00:00'),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','neha.singh@email.com','+1-555-0507','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Neha Singh','Neha','Singh','female','1994-07-30','A+',10,1,1,0,0,'2026-03-05 00:00:00','2026-05-29 09:00:00','2026-03-05 00:00:00','2026-05-29 09:00:00'),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','marcus.johnson@email.com','+1-555-0508','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Marcus Johnson','Marcus','Johnson','male','1989-12-11','O+',10,1,1,0,0,'2026-03-10 00:00:00','2026-05-28 16:00:00','2026-03-10 00:00:00','2026-05-28 16:00:00'),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','kavita.reddy@email.com','+1-555-0509','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Kavita Reddy','Kavita','Reddy','female','1997-05-22','B+',10,1,1,0,0,'2026-03-15 00:00:00','2026-05-30 11:00:00','2026-03-15 00:00:00','2026-05-30 11:00:00'),
('89c54d30-0980-59f7-a561-f20ba21fa925','thomas.anderson@email.com','+1-555-0510','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Thomas Anderson','Thomas','Anderson','male','1991-09-03','A-',10,1,1,0,0,'2026-03-20 00:00:00','2026-05-27 22:00:00','2026-03-20 00:00:00','2026-05-27 22:00:00'),
('5c1032f2-ab89-5387-aba1-a7a55cb764fd','rahul.joshi@email.com','+1-555-0601','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Rahul Joshi','Rahul','Joshi','male','1993-02-14','O+',12,1,1,0,0,'2026-02-01 00:00:00','2026-05-25 10:00:00','2026-02-01 00:00:00','2026-05-25 10:00:00'),
('8b0a6305-6241-5559-8a00-53b8d4469a79','maria.garcia@email.com','+1-555-0602','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Maria Garcia','Maria','Garcia','female','1987-06-25','A-',12,1,1,0,0,'2026-02-10 00:00:00','2026-05-29 14:00:00','2026-02-10 00:00:00','2026-05-29 14:00:00'),
('90e5b8ab-4768-52ba-b45c-47d92f6d3623','suresh.babu@email.com','+1-555-0603','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Suresh Babu','Suresh','Babu','male','1990-10-08','B+',12,1,1,0,0,'2026-02-15 00:00:00','2026-05-20 08:00:00','2026-02-15 00:00:00','2026-05-20 08:00:00'),
('2b5a80bf-7974-59d5-b4e4-0ee457e5b51d','angela.white@email.com','+1-555-0604','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Angela White','Angela','White','female','1985-04-19','AB-',12,1,1,0,0,'2026-03-01 00:00:00','2026-05-15 12:00:00','2026-03-01 00:00:00','2026-05-15 12:00:00'),
('7b21fc6f-7092-519d-b2bf-b1ef953c43f5','pradeep.nair@email.com','+1-555-0605','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Pradeep Nair','Pradeep','Nair','male','1988-08-07','O+',12,1,1,0,0,'2026-03-10 00:00:00','2026-05-22 09:00:00','2026-03-10 00:00:00','2026-05-22 09:00:00'),
('363b68fc-93b2-5e09-b3e5-2c371526fdf8','captain.raj@email.com','+1-555-0701','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Captain Raj','Captain','Raj','male','1980-03-22','A+',13,1,1,0,0,'2026-02-20 00:00:00','2026-05-28 07:00:00','2026-02-20 00:00:00','2026-05-28 07:00:00'),
('5787eeb5-429c-5b88-af60-b603af678d92','sunil.verma@corporate.com','+1-555-0801','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Sunil Verma','Sunil','Verma','male','1975-12-01','B+',11,1,1,0,1,'2026-03-01 00:00:00','2026-05-25 15:00:00','2026-03-01 00:00:00','2026-05-25 15:00:00'),
('0fbe3a13-b2f7-54da-81af-45b3e9300ef8','karen.mitchell@corp.com','+1-555-0802','$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi','Karen Mitchell','Karen','Mitchell','female','1982-07-16','O+',11,1,1,0,1,'2026-03-05 00:00:00','2026-05-29 10:00:00','2026-03-05 00:00:00','2026-05-29 10:00:00');

-- USER_ROLES
INSERT INTO `user_roles` (`user_id`,`role_id`,`is_primary`) VALUES
('e4dea08c-0e25-5f6d-bccd-c79a07c6324b',1,1),
('8e04675f-927d-5de9-9ea5-062d18510c48',2,1),
('b6366b0f-f5c0-54de-9a5c-42344e6c2eee',3,1),
('9f3305dc-31e4-5ed4-a1b7-079368c00b20',4,1),
('8e9f258c-2b51-5f32-b979-9cf56275b17e',4,1),
('452d0ca6-ae39-56c1-a87d-800902d420c5',4,1),
('9e7ffe9d-b111-5437-bcec-9691470c26fe',4,1),
('563c8335-edaf-55ea-a436-1a108546a90b',4,1),
('140b2cae-5507-5109-85b3-81e5ec53e170',4,1),
('0a489b23-3281-5aed-b3ff-804492121ee5',4,1),
('69f3d55c-2125-593e-9729-6dd70d29e6b5',4,1),
('1992d7c8-4f0f-5bc5-bb6c-965e44ef8602',6,1),
('0f7de2ca-8c34-54a7-ab57-ecd07e35fbb2',6,1),
('dec62327-bcc2-5121-a1d2-e6d7f4a8cb3d',6,1),
('21367ea7-f277-5a17-8ce5-d714929f3802',9,1),
('b6cdd07b-e935-521b-b509-296923273f04',9,1),
('84e818cd-f344-5ad8-9b9a-82be450cbd13',10,1),
('aa536c99-b7e7-5f30-897a-c0e586d834de',10,1),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb',10,1),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51',10,1),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26',10,1),
('e6147795-11e7-5e06-927e-c47e140ea4dd',10,1),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46',10,1),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff',10,1),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d',10,1),
('89c54d30-0980-59f7-a561-f20ba21fa925',10,1),
('5c1032f2-ab89-5387-aba1-a7a55cb764fd',12,1),
('8b0a6305-6241-5559-8a00-53b8d4469a79',12,1),
('90e5b8ab-4768-52ba-b45c-47d92f6d3623',12,1),
('2b5a80bf-7974-59d5-b4e4-0ee457e5b51d',12,1),
('7b21fc6f-7092-519d-b2bf-b1ef953c43f5',12,1),
('363b68fc-93b2-5e09-b3e5-2c371526fdf8',13,1),
('5787eeb5-429c-5b88-af60-b603af678d92',11,1),
('0fbe3a13-b2f7-54da-81af-45b3e9300ef8',11,1);

-- ADMIN_USERS
INSERT INTO `admin_users` (`user_id`,`username`,`full_name`,`role`,`permissions`,`is_active`,`is_two_factor_enabled`) VALUES
('e4dea08c-0e25-5f6d-bccd-c79a07c6324b','rajesh.admin','Rajesh Kumar','super-admin','[{"module":"all","actions":["create","read","update","delete","approve"]}]',1,0),
('8e04675f-927d-5de9-9ea5-062d18510c48','priya.admin','Priya Sharma','admin','[{"module":"users","actions":["create","read","update","delete"]},{"module":"hospitals","actions":["read","update","approve"]}]',1,0),
('b6366b0f-f5c0-54de-9a5c-42344e6c2eee','anil.mod','Anil Verma','moderator','[{"module":"reviews","actions":["read","delete"]},{"module":"feedback","actions":["read","update"]}]',1,0);

-- USER_PROFILES
INSERT INTO `user_profiles` (`user_id`,`bio`,`height_cm`,`weight_kg`,`allergies`,`chronic_conditions`,`insurance_provider`,`insurance_policy_number`,`emergency_contact_name`,`emergency_contact_phone`,`emergency_contact_relation`,`theme_preference`,`notifications_enabled`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','Software engineer with an active lifestyle',175.0,72.0,'["Penicillin"]','[]','BlueCross BlueShield','BC-2024-78901','Ravi Sharma','+1-555-9901','father','dark',1),
('aa536c99-b7e7-5f30-897a-c0e586d834de','Teacher and mother of two',163.0,58.0,'["Pollen","Latex"]','["Mild Asthma"]','Aetna','AE-2024-45678','Mark Davis','+1-555-9902','husband','light',1),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','College student and fitness enthusiast',178.0,75.0,'[]','[]','UnitedHealth','UH-2024-12345','Sunita Patel','+1-555-9903','mother','dark',1),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','Marketing professional',160.0,55.0,'["Sulfa drugs"]','["Migraine"]','Cigna','CG-2024-67890','Carlos Martinez','+1-555-9904','father','system',1),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Retired bank manager, manages diabetes',170.0,80.0,'[]','["Type 2 Diabetes","Hypertension"]','Humana','HM-2024-34567','Sunita Kumar','+1-555-9905','wife','light',1),
('e6147795-11e7-5e06-927e-c47e140ea4dd','Graphic designer and artist',168.0,62.0,'["Aspirin"]','[]','Kaiser','KP-2024-23456','Robert Taylor','+1-555-9906','father','dark',1),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','Nursing student, currently pregnant',162.0,60.0,'[]','[]','Anthem','AN-2024-56789','Raj Singh','+1-555-9907','husband','dark',1),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','Fitness trainer and nutritionist',182.0,85.0,'[]','[]','BlueCross BlueShield','BC-2024-89012','Patricia Johnson','+1-555-9908','mother','system',1),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','Research scientist',158.0,52.0,'["Ibuprofen"]','["Hypothyroidism"]','Aetna','AE-2024-90123','Venkat Reddy','+1-555-9909','father','dark',1),
('89c54d30-0980-59f7-a561-f20ba21fa925','Freelance writer',174.0,70.0,'[]','["Anxiety"]','UnitedHealth','UH-2024-01234','Linda Anderson','+1-555-9910','mother','light',1);

-- USER_ADDRESSES
INSERT INTO `user_addresses` (`user_id`,`address_type`,`street`,`city`,`state`,`zip_code`,`country`,`landmark`,`latitude`,`longitude`,`is_default`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','home','742 Evergreen Terrace','Springfield','IL','62704','USA','Near City Park',39.7817210,-89.6501480,1),
('aa536c99-b7e7-5f30-897a-c0e586d834de','home','1600 Pennsylvania Ave','Washington','DC','20500','USA','White House Area',38.8976763,-77.0365298,1),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','home','221B Baker Street','New York','NY','10001','USA','Near Central Park',40.7484,-73.9857,1),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','home','350 Fifth Avenue','New York','NY','10118','USA','Empire State Building',40.7484,-73.9857,1),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','home','1 Infinite Loop','Cupertino','CA','95014','USA','Apple Park Area',37.3382,-122.0331,1),
('e6147795-11e7-5e06-927e-c47e140ea4dd','home','200 N Spring St','Los Angeles','CA','90012','USA','City Hall Area',34.0522,-118.2437,1),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','home','100 Market St','San Francisco','CA','94105','USA','Financial District',37.7749,-122.4194,1),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','home','600 Congress Ave','Austin','TX','78701','USA','Downtown',30.2672,-97.7431,1),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','home','401 S Carson St','Carson City','NV','89701','USA','State Capitol',39.1638,-119.7670,1),
('89c54d30-0980-59f7-a561-f20ba21fa925','home','900 W Randolph St','Chicago','IL','60607','USA','West Loop',41.8827,-87.6477,1),
('9f3305dc-31e4-5ed4-a1b7-079368c00b20','work','100 Medical Center Blvd','Houston','TX','77030','USA','Texas Medical Center',29.7064,-95.4007,1),
('8e9f258c-2b51-5f32-b979-9cf56275b17e','work','55 Fruit Street','Boston','MA','02114','USA','Mass General Hospital',42.3631,-71.0688,1),
('1992d7c8-4f0f-5bc5-bb6c-965e44ef8602','work','4800 W 77th St','Chicago','IL','60638','USA','Near Airport',41.7529,-87.7932,1),
('21367ea7-f277-5a17-8ce5-d714929f3802','work','300 Pharmacy Row','Houston','TX','77030','USA','Medical District',29.7065,-95.4018,1);

-- USER_EMERGENCY_CONTACTS
INSERT INTO `user_emergency_contacts` (`user_id`,`name`,`phone`,`email`,`relation`,`is_available`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','Ravi Sharma','+1-555-9901','ravi.sharma@email.com','father',1),
('aa536c99-b7e7-5f30-897a-c0e586d834de','Mark Davis','+1-555-9902','mark.davis@email.com','husband',1),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','Sunita Patel','+1-555-9903','sunita.patel@email.com','mother',1),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','Carlos Martinez','+1-555-9904','carlos.martinez@email.com','father',1),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Sunita Kumar','+1-555-9905','sunita.kumar@email.com','wife',1),
('e6147795-11e7-5e06-927e-c47e140ea4dd','Robert Taylor','+1-555-9906','robert.taylor@email.com','father',1),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','Raj Singh','+1-555-9907','raj.singh@email.com','husband',1),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','Patricia Johnson','+1-555-9908','patricia.j@email.com','mother',1),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','Venkat Reddy','+1-555-9909','venkat.reddy@email.com','father',1),
('89c54d30-0980-59f7-a561-f20ba21fa925','Linda Anderson','+1-555-9910','linda.anderson@email.com','mother',1);

-- USER_PREFERENCES
INSERT INTO `user_preferences` (`user_id`,`language`,`voice_enabled`,`font_size`,`sidebar_collapsed`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','en',0,'medium',0),
('aa536c99-b7e7-5f30-897a-c0e586d834de','en',0,'medium',0),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','en',0,'medium',0),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','en',0,'medium',0),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','en',0,'medium',0),
('e6147795-11e7-5e06-927e-c47e140ea4dd','en',0,'medium',0),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','en',0,'medium',0),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','en',0,'medium',0),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','en',0,'medium',0),
('89c54d30-0980-59f7-a561-f20ba21fa925','en',0,'medium',0),
('9f3305dc-31e4-5ed4-a1b7-079368c00b20','en',0,'medium',0),
('8e9f258c-2b51-5f32-b979-9cf56275b17e','en',0,'medium',0),
('e4dea08c-0e25-5f6d-bccd-c79a07c6324b','en',0,'medium',0),
('8e04675f-927d-5de9-9ea5-062d18510c48','en',0,'medium',0);

-- USER_NOTIFICATION_SETTINGS
INSERT INTO `user_notification_settings` (`user_id`,`sms_enabled`,`email_enabled`,`push_enabled`,`emergency_alerts`,`donation_reminders`,`appointment_reminders`,`medicine_reminders`,`health_tips`,`review_notifications`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13',1,1,1,1,1,1,0,1,1),
('aa536c99-b7e7-5f30-897a-c0e586d834de',1,1,1,1,1,1,0,1,1),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb',1,1,1,1,1,1,0,1,1),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51',1,1,1,1,1,1,0,1,1),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26',1,1,1,1,1,1,0,1,1),
('e6147795-11e7-5e06-927e-c47e140ea4dd',1,1,1,1,1,1,0,1,1),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46',1,1,1,1,1,1,0,1,1),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff',1,1,1,1,1,1,0,1,1),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d',1,1,1,1,1,1,0,1,1),
('89c54d30-0980-59f7-a561-f20ba21fa925',1,1,1,1,1,1,0,1,1),
('9f3305dc-31e4-5ed4-a1b7-079368c00b20',1,1,1,1,1,1,0,1,1),
('8e9f258c-2b51-5f32-b979-9cf56275b17e',1,1,1,1,1,1,0,1,1),
('5c1032f2-ab89-5387-aba1-a7a55cb764fd',1,1,1,1,1,1,0,1,1),
('8b0a6305-6241-5559-8a00-53b8d4469a79',1,1,1,1,1,1,0,1,1);

-- DOCTOR_PROFILES
INSERT INTO `doctor_profiles` (`id`,`user_id`,`specialization`,`sub_specializations`,`license_number`,`medical_council`,`experience_years`,`qualifications`,`education`,`consultation_fee`,`follow_up_fee`,`video_consultation_fee`,`consultation_duration`,`hospital_affiliation`,`department`,`designation`,`languages`,`consultation_modes`,`max_patients_per_day`,`about`,`is_verified`,`verified_by`,`verified_at`,`rating`,`review_count`,`total_patients`,`total_consultations`,`success_rate`,`status`,`is_active`,`joined_date`) VALUES
(1,'9f3305dc-31e4-5ed4-a1b7-079368c00b20','Cardiology','["Interventional Cardiology","Electrophysiology"]','MD-2024-001','Medical Council of India',15,'[{"degree":"MD Cardiology","institution":"Johns Hopkins","year":2008,"country":"US"}]','[{"degree":"MBBS","institution":"AIIMS Delhi","year":2003}]',250.00,100.00,300.00,30,'City General Hospital','Cardiology','Senior Consultant','["English","Hindi"]','["in-person","video"]',20,'Board-certified cardiologist with 15+ years of experience.',1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00',4.8,45,320,580,96.50,'online',1,'2026-01-15'),
(2,'8e9f258c-2b51-5f32-b979-9cf56275b17e','Orthopedics','["Joint Replacement","Sports Medicine"]','MD-2024-002','National Medical Commission',20,'[{"degree":"MS Orthopedics","institution":"Mayo Clinic","year":2005,"country":"US"}]','[{"degree":"MBBS","institution":"CMC Vellore","year":2000}]',200.00,80.00,250.00,30,'Metro Medical Center','Orthopedics','Head of Department','["English","Tamil"]','["in-person","video","phone"]',15,'Expert in total knee and hip replacement surgeries.',1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00',4.7,38,450,720,95.20,'online',1,'2026-01-15'),
(3,'452d0ca6-ae39-56c1-a87d-800902d420c5','Gynecology','["Obstetrics","Infertility"]','MD-2024-003','Medical Council of India',12,'[{"degree":"MS OB-GYN","institution":"Harvard Medical","year":2010,"country":"US"}]','[{"degree":"MBBS","institution":"KEM Hospital","year":2006}]',300.00,120.00,350.00,30,'City General Hospital','Gynecology','Senior Consultant','["English","Hindi","Marathi"]','["in-person","video"]',15,'Specializing in high-risk pregnancies and fertility treatments.',1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00',4.9,52,280,450,97.80,'online',1,'2026-02-01'),
(4,'9e7ffe9d-b111-5437-bcec-9691470c26fe','Neurology','["Stroke Medicine","Epilepsy"]','MD-2024-004','National Medical Commission',22,'[{"degree":"DM Neurology","institution":"NIMHANS","year":2002,"country":"IN"}]','[{"degree":"MBBS","institution":"AIIMS Delhi","year":1997}]',350.00,150.00,400.00,45,'Sunrise Specialty Hospital','Neurology','Director','["English","Hindi","Kannada"]','["in-person","video"]',10,'Renowned neurologist with expertise in stroke management.',1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00',4.6,30,380,600,94.30,'busy',1,'2026-02-01'),
(5,'563c8335-edaf-55ea-a436-1a108546a90b','Pediatrics','["Neonatology","Pediatric Cardiology"]','MD-2024-005','Medical Council of India',8,'[{"degree":"MD Pediatrics","institution":"Stanford","year":2015,"country":"US"}]','[{"degree":"MBBS","institution":"Maulana Azad","year":2011}]',180.00,70.00,220.00,20,'City General Hospital','Pediatrics','Consultant','["English","Hindi","Gujarati"]','["in-person","video","phone"]',25,'Passionate pediatrician specializing in newborn care.',1,'8e04675f-927d-5de9-9ea5-062d18510c48','2026-02-15 10:00:00',4.9,60,200,350,98.50,'online',1,'2026-02-15'),
(6,'140b2cae-5507-5109-85b3-81e5ec53e170','Dermatology','["Cosmetic Dermatology","Laser Therapy"]','MD-2024-006','Medical Council of India',10,'[{"degree":"MD Dermatology","institution":"University of Miami","year":2013,"country":"US"}]','[{"degree":"MBBS","institution":"Grant Medical","year":2009}]',150.00,60.00,180.00,15,'Metro Medical Center','Dermatology','Consultant','["English","Hindi"]','["in-person","video"]',30,'Expert in cosmetic dermatology and laser treatments.',1,'8e04675f-927d-5de9-9ea5-062d18510c48','2026-03-01 10:00:00',4.5,25,180,300,93.80,'offline',1,'2026-03-01'),
(7,'0a489b23-3281-5aed-b3ff-804492121ee5','General Medicine','["Internal Medicine","Diabetes Management"]','MD-2024-007','National Medical Commission',14,'[{"degree":"MD General Medicine","institution":"Cleveland Clinic","year":2009,"country":"US"}]','[{"degree":"MBBS","institution":"JIPMER","year":2005}]',120.00,50.00,150.00,15,'City General Hospital','General Medicine','Senior Resident','["English","Hindi","Urdu"]','["in-person","video","phone"]',35,'Experienced internist with focus on chronic disease management.',1,'8e04675f-927d-5de9-9ea5-062d18510c48','2026-03-01 10:00:00',4.7,40,420,680,95.60,'online',1,'2026-03-01'),
(8,'69f3d55c-2125-593e-9729-6dd70d29e6b5','ENT','["Head & Neck Surgery","Cochlear Implants"]','MD-2024-008','Medical Council of India',18,'[{"degree":"MS ENT","institution":"Johns Hopkins","year":2006,"country":"US"}]','[{"degree":"MBBS","institution":"AIIMS Delhi","year":2001}]',200.00,80.00,250.00,20,'Sunrise Specialty Hospital','ENT','Senior Consultant','["English","Hindi","Telugu"]','["in-person","video"]',15,'Specialist in cochlear implantation and head-neck surgery.',1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-03-15 10:00:00',4.8,35,300,520,96.20,'online',1,'2026-03-15');

-- HOSPITALS
INSERT INTO `hospitals` (`id`,`admin_user_id`,`name`,`registration_number`,`type`,`phone`,`emergency_phone`,`email`,`website`,`street`,`city`,`state`,`zip_code`,`country`,`latitude`,`longitude`,`total_beds`,`available_beds`,`icu_total_beds`,`icu_available_beds`,`icu_with_ventilator`,`icu_without_ventilator`,`ambulance_count`,`ambulance_available`,`emergency_service`,`emergency_response_time`,`total_doctors`,`total_nurses`,`total_staff`,`rating`,`review_count`,`is_verified`,`is_active`,`verified_by`,`verified_at`,`services`,`facilities`,`insurance_accepted`,`working_hours`,`established_year`,`image_url`) VALUES
('21084c3f-61b9-53c2-b259-a307ae428d38','1992d7c8-4f0f-5bc5-bb6c-965e44ef8602','City General Hospital','HOS-REG-001','multispecialty','+1-555-1001','+1-555-9111','info@citygeneral.health','www.citygeneral.health','100 Medical Center Blvd','Houston','TX','77030','USA',29.7064,-95.4007,500,320,80,25,30,50,8,5,'active','12 min',120,350,800,4.7,89,1,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00','["Emergency","Cardiology","Orthopedics","Pediatrics","Gynecology","Neurology","Oncology","General Surgery"]','["ICU","NICU","Blood Bank","Pharmacy","Lab","Radiology","MRI","CT Scan","Cath Lab","Rehabilitation"]','["BlueCross BlueShield","Aetna","UnitedHealth","Cigna","Humana"]','{"monday":{"open":"00:00","close":"23:59","isOpen":true},"tuesday":{"open":"00:00","close":"23:59","isOpen":true},"wednesday":{"open":"00:00","close":"23:59","isOpen":true},"thursday":{"open":"00:00","close":"23:59","isOpen":true},"friday":{"open":"00:00","close":"23:59","isOpen":true},"saturday":{"open":"00:00","close":"23:59","isOpen":true},"sunday":{"open":"00:00","close":"23:59","isOpen":true}}',1995,'/images/hospitals/city-general.jpg'),
('90d3182d-2285-5829-8c04-238ac032a327','0f7de2ca-8c34-54a7-ab57-ecd07e35fbb2','Metro Medical Center','HOS-REG-002','private','+1-555-1002','+1-555-9112','info@metromedical.health','www.metromedical.health','55 Fruit Street','Boston','MA','02114','USA',42.3631,-71.0688,350,180,50,15,20,30,6,4,'active','15 min',85,220,500,4.5,62,1,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00','["Emergency","Orthopedics","Dermatology","ENT","General Medicine","Dental"]','["ICU","Blood Bank","Pharmacy","Lab","X-Ray","Ultrasound","Physiotherapy"]','["BlueCross BlueShield","Aetna","Kaiser","Anthem"]','{"monday":{"open":"06:00","close":"22:00","isOpen":true},"tuesday":{"open":"06:00","close":"22:00","isOpen":true},"wednesday":{"open":"06:00","close":"22:00","isOpen":true},"thursday":{"open":"06:00","close":"22:00","isOpen":true},"friday":{"open":"06:00","close":"22:00","isOpen":true},"saturday":{"open":"08:00","close":"20:00","isOpen":true},"sunday":{"open":"09:00","close":"18:00","isOpen":true}}',2005,'/images/hospitals/metro-medical.jpg'),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7','dec62327-bcc2-5121-a1d2-e6d7f4a8cb3d','Sunrise Specialty Hospital','HOS-REG-003','specialized','+1-555-1003','+1-555-9113','info@sunrise.health','www.sunrise.health','200 Wellness Drive','San Francisco','CA','94105','USA',37.7749,-122.4194,200,95,30,8,12,18,4,2,'active','18 min',60,150,350,4.8,45,1,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00','["Neurology","ENT","Ophthalmology","Plastic Surgery","Urology","Gynecology"]','["ICU","NICU","Blood Bank","Pharmacy","Lab","MRI","CT Scan","Operation Theater"]','["UnitedHealth","Cigna","Anthem","Kaiser"]','{"monday":{"open":"07:00","close":"21:00","isOpen":true},"tuesday":{"open":"07:00","close":"21:00","isOpen":true},"wednesday":{"open":"07:00","close":"21:00","isOpen":true},"thursday":{"open":"07:00","close":"21:00","isOpen":true},"friday":{"open":"07:00","close":"21:00","isOpen":true},"saturday":{"open":"08:00","close":"18:00","isOpen":true},"sunday":{"open":"closed","close":"closed","isOpen":false}}',2010,'/images/hospitals/sunrise-specialty.jpg');

-- HOSPITAL_DEPARTMENTS
INSERT INTO `hospital_departments` (`id`,`hospital_id`,`name`,`description`,`head_doctor_id`,`total_beds`,`available_beds`,`total_doctors`,`total_nurses`,`services`,`timings`,`is_active`) VALUES
(1,'21084c3f-61b9-53c2-b259-a307ae428d38','Cardiology','Heart and cardiovascular care',1,80,25,15,30,'["ECG","Echocardiography","Cardiac Catheterization","Angioplasty","Pacemaker"]','24/7',1),
(2,'21084c3f-61b9-53c2-b259-a307ae428d38','Orthopedics','Bone and joint care',2,60,20,10,25,'["Joint Replacement","Fracture Care","Arthroscopy","Spine Surgery"]','08:00-20:00',1),
(3,'21084c3f-61b9-53c2-b259-a307ae428d38','Gynecology','Women health and maternity',3,70,30,12,35,'["Prenatal Care","Delivery","Fertility","Laparoscopy"]','08:00-20:00',1),
(4,'21084c3f-61b9-53c2-b259-a307ae428d38','Pediatrics','Child healthcare',5,50,15,8,20,'["Vaccinations","Growth Monitoring","Neonatal Care","Pediatric Surgery"]','08:00-20:00',1),
(5,'21084c3f-61b9-53c2-b259-a307ae428d38','General Medicine','Internal medicine and primary care',7,100,40,20,40,'["Consultations","Health Checkup","Chronic Disease Management","Diabetes Care"]','24/7',1),
(6,'21084c3f-61b9-53c2-b259-a307ae428d38','Emergency','Emergency and trauma care',NULL,40,10,15,35,'["Trauma Care","Heart Attack","Stroke","Accident"]','24/7',1),
(7,'90d3182d-2285-5829-8c04-238ac032a327','Orthopedics','Bone and joint care',2,50,18,8,20,'["Joint Replacement","Sports Injury","Spine Care"]','08:00-20:00',1),
(8,'90d3182d-2285-5829-8c04-238ac032a327','Dermatology','Skin and hair care',6,30,12,5,10,'["Skin Treatment","Laser Therapy","Cosmetic Procedures"]','09:00-17:00',1),
(9,'90d3182d-2285-5829-8c04-238ac032a327','ENT','Ear nose and throat care',8,25,8,4,10,'["Hearing Tests","Sinus Surgery","Tonsillectomy"]','09:00-17:00',1),
(10,'51ee9186-b9a5-503e-8dc0-71afcd63eaf7','Neurology','Brain and nervous system care',4,40,10,8,15,'["EEG","EMG","Stroke Treatment","Epilepsy Management"]','08:00-20:00',1),
(11,'51ee9186-b9a5-503e-8dc0-71afcd63eaf7','ENT','Ear nose and throat care',8,20,5,3,8,'["Cochlear Implant","Head-Neck Surgery","Voice Therapy"]','08:00-18:00',1);

-- HOSPITAL_DOCTORS
INSERT INTO `hospital_doctors` (`id`,`hospital_id`,`doctor_profile_id`,`department_id`,`designation`,`consultation_fee`,`availability`,`rating`,`review_count`,`status`,`joined_date`) VALUES
(1,'21084c3f-61b9-53c2-b259-a307ae428d38',1,1,'Senior Consultant',250.00,'[{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":15}]',4.8,45,'active','2020-01-15'),
(2,'21084c3f-61b9-53c2-b259-a307ae428d38',3,3,'Senior Consultant',300.00,'[{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":12}]',4.9,52,'active','2021-03-01'),
(3,'21084c3f-61b9-53c2-b259-a307ae428d38',5,4,'Consultant',180.00,'[{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":20}]',4.9,60,'active','2022-06-15'),
(4,'21084c3f-61b9-53c2-b259-a307ae428d38',7,5,'Senior Resident',120.00,'[{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":25}]',4.7,40,'active','2022-01-01'),
(5,'90d3182d-2285-5829-8c04-238ac032a327',2,7,'Head of Department',200.00,'[{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":10}]',4.7,38,'active','2019-07-01'),
(6,'90d3182d-2285-5829-8c04-238ac032a327',6,8,'Consultant',150.00,'[{"day":"Monday","startTime":"10:00","endTime":"16:00","maxPatients":20}]',4.5,25,'active','2023-01-15'),
(7,'51ee9186-b9a5-503e-8dc0-71afcd63eaf7',4,10,'Director',350.00,'[{"day":"Monday","startTime":"09:00","endTime":"15:00","maxPatients":8}]',4.6,30,'active','2018-05-01'),
(8,'51ee9186-b9a5-503e-8dc0-71afcd63eaf7',8,11,'Senior Consultant',200.00,'[{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":12}]',4.8,35,'active','2020-09-01');

-- HOSPITAL_BEDS
INSERT INTO `hospital_beds` (`hospital_id`,`department_id`,`bed_number`,`bed_type`,`floor`,`ward`,`status`,`patient_id`,`patient_name`,`has_ventilator`,`has_monitor`,`price_per_day`,`daily_charge`) VALUES
('21084c3f-61b9-53c2-b259-a307ae428d38',1,'1-01-01','semi-private','Ground','Ward-A','available',NULL,NULL,0,0,200.0,200.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',1,'1-01-02','private','Ground','Ward-A','available',NULL,NULL,0,0,500.0,500.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',1,'1-01-03','icu','Ground','Ward-A','occupied','84e818cd-f344-5ad8-9b9a-82be450cbd13','Aarav Sharma',1,1,1500.0,1500.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',1,'1-01-04','nicu','Ground','Ward-A','available',NULL,NULL,0,0,1200.0,1200.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',1,'1-01-05','emergency','Ground','Ward-A','occupied','aa536c99-b7e7-5f30-897a-c0e586d834de','Emily Davis',0,1,800.0,800.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',2,'1-02-01','semi-private','1st','Ward-B','reserved',NULL,NULL,0,0,200.0,200.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',2,'1-02-02','private','1st','Ward-B','available',NULL,NULL,0,0,500.0,500.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',2,'1-02-03','icu','1st','Ward-B','available',NULL,NULL,1,1,1500.0,1500.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',2,'1-02-04','nicu','1st','Ward-B','occupied','8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','Rohan Patel',0,0,1200.0,1200.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',2,'1-02-05','emergency','1st','Ward-B','available',NULL,NULL,0,1,800.0,800.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',3,'1-03-01','semi-private','2nd','Ward-C','available',NULL,NULL,0,0,200.0,200.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',3,'1-03-02','private','2nd','Ward-C','available',NULL,NULL,0,0,500.0,500.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',3,'1-03-03','icu','2nd','Ward-C','occupied','f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','Sophia Martinez',1,1,1500.0,1500.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',3,'1-03-04','nicu','2nd','Ward-C','available',NULL,NULL,0,0,1200.0,1200.0),
('21084c3f-61b9-53c2-b259-a307ae428d38',3,'1-03-05','emergency','2nd','Ward-C','occupied','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Amit Kumar',0,1,800.0,800.0),
('90d3182d-2285-5829-8c04-238ac032a327',4,'2-04-01','semi-private','3rd','Ward-D','reserved',NULL,NULL,0,0,200.0,200.0),
('90d3182d-2285-5829-8c04-238ac032a327',4,'2-04-02','private','3rd','Ward-D','available',NULL,NULL,0,0,500.0,500.0),
('90d3182d-2285-5829-8c04-238ac032a327',4,'2-04-03','icu','3rd','Ward-D','available',NULL,NULL,1,1,1500.0,1500.0),
('90d3182d-2285-5829-8c04-238ac032a327',4,'2-04-04','nicu','3rd','Ward-D','occupied','7255e49b-5f6e-544d-8ef2-3dedd546ad46','Neha Singh',0,0,1200.0,1200.0),
('90d3182d-2285-5829-8c04-238ac032a327',4,'2-04-05','emergency','3rd','Ward-D','available',NULL,NULL,0,1,800.0,800.0),
('90d3182d-2285-5829-8c04-238ac032a327',5,'2-05-01','semi-private','4th','Ward-E','available',NULL,NULL,0,0,200.0,200.0),
('90d3182d-2285-5829-8c04-238ac032a327',5,'2-05-02','private','4th','Ward-E','available',NULL,NULL,0,0,500.0,500.0),
('90d3182d-2285-5829-8c04-238ac032a327',5,'2-05-03','icu','4th','Ward-E','occupied','84e818cd-f344-5ad8-9b9a-82be450cbd13','Aarav Sharma',1,1,1500.0,1500.0),
('90d3182d-2285-5829-8c04-238ac032a327',5,'2-05-04','nicu','4th','Ward-E','available',NULL,NULL,0,0,1200.0,1200.0),
('90d3182d-2285-5829-8c04-238ac032a327',5,'2-05-05','emergency','4th','Ward-E','occupied','aa536c99-b7e7-5f30-897a-c0e586d834de','Emily Davis',0,1,800.0,800.0),
('90d3182d-2285-5829-8c04-238ac032a327',6,'2-06-01','semi-private','5th','Ward-F','reserved',NULL,NULL,0,0,200.0,200.0),
('90d3182d-2285-5829-8c04-238ac032a327',6,'2-06-02','private','5th','Ward-F','available',NULL,NULL,0,0,500.0,500.0),
('90d3182d-2285-5829-8c04-238ac032a327',6,'2-06-03','icu','5th','Ward-F','available',NULL,NULL,1,1,1500.0,1500.0),
('90d3182d-2285-5829-8c04-238ac032a327',6,'2-06-04','nicu','5th','Ward-F','occupied','8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','Rohan Patel',0,0,1200.0,1200.0),
('90d3182d-2285-5829-8c04-238ac032a327',6,'2-06-05','emergency','5th','Ward-F','available',NULL,NULL,0,1,800.0,800.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',7,'3-07-01','semi-private','Ground','Ward-G','available',NULL,NULL,0,0,200.0,200.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',7,'3-07-02','private','Ground','Ward-G','available',NULL,NULL,0,0,500.0,500.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',7,'3-07-03','icu','Ground','Ward-G','occupied','f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','Sophia Martinez',1,1,1500.0,1500.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',7,'3-07-04','nicu','Ground','Ward-G','available',NULL,NULL,0,0,1200.0,1200.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',7,'3-07-05','emergency','Ground','Ward-G','occupied','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Amit Kumar',0,1,800.0,800.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',8,'3-08-01','semi-private','1st','Ward-H','reserved',NULL,NULL,0,0,200.0,200.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',8,'3-08-02','private','1st','Ward-H','available',NULL,NULL,0,0,500.0,500.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',8,'3-08-03','icu','1st','Ward-H','available',NULL,NULL,1,1,1500.0,1500.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',8,'3-08-04','nicu','1st','Ward-H','occupied','7255e49b-5f6e-544d-8ef2-3dedd546ad46','Neha Singh',0,0,1200.0,1200.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',8,'3-08-05','emergency','1st','Ward-H','available',NULL,NULL,0,1,800.0,800.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',9,'3-09-01','semi-private','2nd','Ward-I','available',NULL,NULL,0,0,200.0,200.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',9,'3-09-02','private','2nd','Ward-I','available',NULL,NULL,0,0,500.0,500.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',9,'3-09-03','icu','2nd','Ward-I','occupied','84e818cd-f344-5ad8-9b9a-82be450cbd13','Aarav Sharma',1,1,1500.0,1500.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',9,'3-09-04','nicu','2nd','Ward-I','available',NULL,NULL,0,0,1200.0,1200.0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',9,'3-09-05','emergency','2nd','Ward-I','occupied','aa536c99-b7e7-5f30-897a-c0e586d834de','Emily Davis',0,1,800.0,800.0);

-- HOSPITAL_AMBULANCES
INSERT INTO `hospital_ambulances` (`hospital_id`,`vehicle_number`,`type`,`status`,`current_latitude`,`current_longitude`,`current_address`,`driver_name`,`driver_phone`,`paramedic_name`,`equipment`,`has_oxygen_support`) VALUES
('21084c3f-61b9-53c2-b259-a307ae428d38','AMB-CGH-001','advanced','available',29.7064,-95.4007,'100 Medical Center Blvd','Mike Johnson','+1-555-8001','Sarah Williams','["Defibrillator","Oxygen","Ventilator","Stretcher","ECG Monitor"]',1),
('21084c3f-61b9-53c2-b259-a307ae428d38','AMB-CGH-002','basic','on-call',29.7100,-95.3950,'Downtown Houston','Tom Brown','+1-555-8002','Lisa Anderson','["Oxygen","Stretcher","First Aid Kit"]',1),
('21084c3f-61b9-53c2-b259-a307ae428d38','AMB-CGH-003','cardiac','dispatched',29.7200,-95.4100,'Memorial Park Area','Jake Wilson','+1-555-8003','Emily Chen','["Defibrillator","Oxygen","Cardiac Monitor","Ventilator"]',1),
('90d3182d-2285-5829-8c04-238ac032a327','AMB-MMC-001','basic','available',42.3631,-71.0688,'55 Fruit Street','Peter Davis','+1-555-8004','Amy White','["Oxygen","Stretcher","First Aid Kit"]',1),
('90d3182d-2285-5829-8c04-238ac032a327','AMB-MMC-002','advanced','maintenance',42.3600,-71.0700,'Boston Common','Chris Lee','+1-555-8005','Nina Patel','["Defibrillator","Oxygen","Ventilator"]',1),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7','AMB-SSH-001','neonatal','available',37.7749,-122.4194,'200 Wellness Drive','Sam Miller','+1-555-8006','Rachel Kim','["Incubator","Oxygen","Neonatal Ventilator"]',1),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7','AMB-SSH-002','basic','available',37.7800,-122.4100,'Mission District','Dan Thompson','+1-555-8007','Kate Brown','["Oxygen","Stretcher","First Aid Kit"]',1);

-- HOSPITAL_BLOOD_BANK
INSERT INTO `hospital_blood_bank` (`hospital_id`,`is_available`,`total_units`,`expiry_alerts`) VALUES
('21084c3f-61b9-53c2-b259-a307ae428d38',1,180,3),
('90d3182d-2285-5829-8c04-238ac032a327',1,95,1),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',1,60,2);

-- HOSPITAL_BLOOD_STOCKS
INSERT INTO `hospital_blood_stocks` (`blood_bank_id`,`blood_group`,`units`,`expiry_date`,`status`) VALUES
(1,'A+',25,'2026-09-30','sufficient'),
(1,'A-',8,'2026-09-30','low'),
(1,'B+',20,'2026-09-30','sufficient'),
(1,'B-',5,'2026-09-30','low'),
(1,'AB+',12,'2026-09-30','sufficient'),
(1,'AB-',3,'2026-09-30','critical'),
(1,'O+',30,'2026-09-30','sufficient'),
(1,'O-',7,'2026-09-30','low'),
(2,'A+',12,'2026-09-30','sufficient'),
(2,'A-',4,'2026-09-30','low'),
(2,'B+',10,'2026-09-30','low'),
(2,'B-',3,'2026-09-30','critical'),
(2,'AB+',6,'2026-09-30','low'),
(2,'AB-',2,'2026-09-30','critical'),
(2,'O+',15,'2026-09-30','sufficient'),
(2,'O-',4,'2026-09-30','low'),
(3,'A+',8,'2026-09-30','low'),
(3,'A-',2,'2026-09-30','critical'),
(3,'B+',6,'2026-09-30','low'),
(3,'B-',2,'2026-09-30','critical'),
(3,'AB+',4,'2026-09-30','low'),
(3,'AB-',1,'2026-09-30','critical'),
(3,'O+',10,'2026-09-30','low'),
(3,'O-',3,'2026-09-30','critical');

-- HOSPITAL_OXYGEN_STOCK
INSERT INTO `hospital_oxygen_stock` (`hospital_id`,`total_cylinders`,`available_cylinders`,`in_use_cylinders`,`reserved_cylinders`,`cylinder_types`,`last_refilled`,`next_refill_date`,`supplier`,`supplier_contact`,`status`,`emergency_support`) VALUES
('21084c3f-61b9-53c2-b259-a307ae428d38',100,45,40,15,'[{"type":"A-type","capacity":"10L","total":50,"available":25},{"type":"B-type","capacity":"50L","total":30,"available":12},{"type":"C-type","capacity":"5L","total":20,"available":8}]','2026-05-15','2026-06-15','AirLinx Medical','+1-555-9001','sufficient',1),
('90d3182d-2285-5829-8c04-238ac032a327',60,25,25,10,'[{"type":"A-type","capacity":"10L","total":30,"available":15},{"type":"B-type","capacity":"50L","total":20,"available":6},{"type":"C-type","capacity":"5L","total":10,"available":4}]','2026-05-10','2026-06-10','MedGas Supply','+1-555-9002','low',0),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7',40,15,18,7,'[{"type":"A-type","capacity":"10L","total":20,"available":8},{"type":"B-type","capacity":"50L","total":15,"available":5},{"type":"C-type","capacity":"5L","total":5,"available":2}]','2026-05-20','2026-06-20','O2Pure Inc','+1-555-9003','sufficient',1);

-- PHARMACIES
INSERT INTO `pharmacies` (`id`,`admin_user_id`,`name`,`registration_number`,`license_number`,`gst_number`,`pharmacist_name`,`pharmacist_license`,`owner_name`,`operating_hours`,`opening_time`,`closing_time`,`is_24x7`,`phone`,`emergency_phone`,`email`,`website`,`street`,`city`,`state`,`zip_code`,`latitude`,`longitude`,`delivery_available`,`delivery_radius`,`emergency_service`,`services`,`is_verified`,`is_active`,`is_open`,`status`,`verified_by`,`verified_at`,`rating`,`review_count`,`total_orders`,`image_url`,`created_at`,`updated_at`) VALUES
('8d1505e6-a115-5642-bc97-00d000192241','21367ea7-f277-5a17-8ce5-d714929f3802','HealthPlus Pharmacy','PH-REG-001','LIC-2024-001','GST-27-AABCT1234F1Z5','Rakesh Gupta','RPH-001','Rakesh Gupta','08:00-22:00','08:00:00','22:00:00',0,'+1-555-5001','+1-555-5091','info@healthplus.pharmacy','www.healthplus.pharmacy','150 Main Street','Houston','TX','77002',29.7589,-95.3694,1,5.0,1,'["prescription","otc","delivery","compounding"]',1,1,1,'active','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00',4.6,55,320,NULL,'2026-01-20 00:00:00','2026-05-30 08:00:00'),
('e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','b6cdd07b-e935-521b-b509-296923273f04','Medicare Express Pharmacy','PH-REG-002','LIC-2024-002','GST-29-AABCM5678G2H9','Linda Johnson','RPH-002','Robert Johnson','24 Hours','00:00:00','23:59:00',1,'+1-555-5002','+1-555-5092','info@medicareexpress.pharmacy','www.medicareexpress.pharmacy','75 Health Avenue','Boston','MA','02101',42.3601,-71.0589,1,3.0,0,'["prescription","otc","delivery","24x7"]',1,1,1,'active','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00',4.4,38,180,NULL,'2026-02-01 00:00:00','2026-05-29 15:00:00');

-- PHARMACY_INVENTORY
INSERT INTO `pharmacy_inventory` (`id`,`pharmacy_id`,`medicine_name`,`generic_name`,`brand_name`,`category`,`type`,`description`,`dosage`,`side_effects`,`price`,`discounted_price`,`quantity`,`min_stock`,`unit`,`pack_size`,`strength`,`form`,`requires_prescription`,`is_available`,`is_expired`,`rating`,`review_count`) VALUES
(1,'8d1505e6-a115-5642-bc97-00d000192241','Amoxicillin 500mg','Amoxicillin','Amoxil','antibiotics','prescription','Broad-spectrum antibiotic','500mg every 8 hours','["Nausea","Diarrhea","Skin Rash"]',12.99,10.99,500,50,'tablet','10 per strip','500mg','tablet',1,1,0,4.3,18),
(2,'8d1505e6-a115-5642-bc97-00d000192241','Metformin 500mg','Metformin','Glucophage','diabetes','prescription','Oral antidiabetic for Type 2 diabetes','500mg twice daily','["Nausea","Stomach Upset","Diarrhea"]',8.99,7.49,800,100,'tablet','10 per strip','500mg','tablet',1,1,0,4.5,25),
(3,'8d1505e6-a115-5642-bc97-00d000192241','Atorvastatin 10mg','Atorvastatin','Lipitor','cardiac','prescription','Cholesterol-lowering statin','10mg once daily at bedtime','["Muscle Pain","Headache","Nausea"]',15.99,13.49,300,40,'tablet','10 per strip','10mg','tablet',1,1,0,4.4,20),
(4,'8d1505e6-a115-5642-bc97-00d000192241','Omeprazole 20mg','Omeprazole','Prilosec','gastroenterology','prescription','Proton pump inhibitor for acid reflux','20mg before breakfast','["Headache","Abdominal Pain","Diarrhea"]',6.99,5.99,600,60,'capsule','10 per strip','20mg','capsule',1,1,0,4.2,15),
(5,'8d1505e6-a115-5642-bc97-00d000192241','Cetirizine 10mg','Cetirizine','Zyrtec','respiratory','otc','Antihistamine for allergies','10mg once daily','["Drowsiness","Dry Mouth","Headache"]',4.99,3.99,1000,100,'tablet','10 per strip','10mg','tablet',0,1,0,4.6,32),
(6,'8d1505e6-a115-5642-bc97-00d000192241','Ibuprofen 400mg','Ibuprofen','Advil','pain-relief','otc','NSAID for pain and inflammation','400mg every 6-8 hours','["Stomach Upset","Nausea","Dizziness"]',5.99,4.99,800,80,'tablet','10 per strip','400mg','tablet',0,1,0,4.5,28),
(7,'8d1505e6-a115-5642-bc97-00d000192241','Amlodipine 5mg','Amlodipine','Norvasc','cardiac','prescription','Calcium channel blocker for hypertension','5mg once daily','["Swelling","Dizziness","Flushing"]',9.99,8.49,400,50,'tablet','10 per strip','5mg','tablet',1,1,0,4.3,16),
(8,'8d1505e6-a115-5642-bc97-00d000192241','Pantoprazole 40mg','Pantoprazole','Protonix','gastroenterology','prescription','Proton pump inhibitor for GERD','40mg before breakfast','["Headache","Diarrhea","Nausea"]',11.99,9.99,350,40,'tablet','10 per strip','40mg','tablet',1,1,0,4.1,12),
(9,'e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','Lisinopril 10mg','Lisinopril','Zestril','cardiac','prescription','ACE inhibitor for high blood pressure','10mg once daily','["Dry Cough","Dizziness","Headache"]',7.99,6.49,450,50,'tablet','10 per strip','10mg','tablet',1,1,0,4.4,14),
(10,'e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','Levothyroxine 50mcg','Levothyroxine','Synthroid','endocrinology','prescription','Thyroid hormone replacement','50mcg once daily on empty stomach','["Weight Changes","Headache","Insomnia"]',9.99,8.49,350,40,'tablet','10 per strip','50mcg','tablet',1,1,0,4.6,22),
(11,'e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','Azithromycin 250mg','Azithromycin','Zithromax','antibiotics','prescription','Macrolide antibiotic','250mg daily for 3-5 days','["Nausea","Diarrhea","Abdominal Pain"]',14.99,12.49,250,30,'tablet','6 per pack','250mg','tablet',1,1,0,4.2,10),
(12,'e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','Vitamin D3 1000IU','Cholecalciferol','D-Rise','vitamins','otc','Vitamin D supplement','1000IU once daily','["None significant at normal doses"]',3.99,2.99,1200,100,'capsule','15 per bottle','1000IU','capsule',0,1,0,4.7,35),
(13,'e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','Paracetamol 500mg','Acetaminophen','Tylenol','pain-relief','otc','Pain reliever and fever reducer','500mg every 4-6 hours','["Liver Damage (overdose)","Allergic Reaction"]',2.99,1.99,2000,200,'tablet','10 per strip','500mg','tablet',0,1,0,4.8,45),
(14,'e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','Salbutamol Inhaler','Albuterol','Ventolin','respiratory','prescription','Bronchodilator for asthma relief','2 puffs every 4-6 hours as needed','["Tremor","Headache","Palpitations"]',24.99,21.99,100,15,'inhaler','1 unit','100mcg/puff','inhaler',1,1,0,4.5,20),
(15,'e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','Prenatal Vitamins','Multivitamin','PregnaCare','gynecology','otc','Complete prenatal vitamin supplement','1 tablet daily','["Nausea","Constipation"]',19.99,16.99,150,20,'tablet','30 per bottle','Comprehensive','tablet',0,1,0,4.8,42);

-- BLOOD_DONORS
INSERT INTO `blood_donors` (`id`,`user_id`,`blood_group`,`age`,`weight_kg`,`gender`,`last_donation_date`,`total_donations`,`next_eligible_date`,`is_eligible`,`is_available`,`is_emergency_donor`,`medical_conditions`,`is_on_medication`,`current_medications`,`has_tattoo`,`has_piercing`,`has_traveled_abroad`,`status`,`deferral_reason`,`is_verified`,`verified_by`,`verified_at`,`preferred_donation_center`,`preferred_time`,`reward_points`,`lives_saved`,`donated_units`,`registered_date`) VALUES
(1,'5c1032f2-ab89-5387-aba1-a7a55cb764fd','O+',28,78.0,'male','2026-03-15',4,'2026-06-15',1,1,1,'[]',0,'[]',0,0,0,'active',NULL,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00','City General Hospital','morning',40,12,4,'2026-02-01'),
(2,'8b0a6305-6241-5559-8a00-53b8d4469a79','A-',35,62.0,'female','2026-04-20',3,'2026-07-20',1,1,0,'[]',0,'[]',0,0,0,'active',NULL,1,'8e04675f-927d-5de9-9ea5-062d18510c48','2026-02-10 10:00:00','Metro Medical Center','afternoon',30,9,3,'2026-02-10'),
(3,'90e5b8ab-4768-52ba-b45c-47d92f6d3623','B+',32,82.0,'male','2026-01-10',6,'2026-04-10',0,1,1,'[]',0,'[]',0,0,0,'temporary-deferred','Recently traveled to malaria-endemic region',1,'8e04675f-927d-5de9-9ea5-062d18510c48','2026-02-15 10:00:00','City General Hospital','morning',60,18,6,'2026-02-15'),
(4,'2b5a80bf-7974-59d5-b4e4-0ee457e5b51d','AB-',38,58.0,'female','2026-02-28',2,'2026-05-28',1,1,0,'["Hypothyroidism"]',1,'["Levothyroxine 50mcg"]',0,0,0,'active',NULL,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-03-01 10:00:00','Sunrise Specialty Hospital','evening',20,6,2,'2026-03-01'),
(5,'7b21fc6f-7092-519d-b2bf-b1ef953c43f5','O+',30,75.0,'male','2026-05-01',5,'2026-08-01',1,1,1,'[]',0,'[]',0,0,0,'active',NULL,1,'8e04675f-927d-5de9-9ea5-062d18510c48','2026-03-10 10:00:00','City General Hospital','morning',50,15,5,'2026-03-10');

-- BLOOD_DONATIONS
INSERT INTO `blood_donations` (`id`,`donor_id`,`donation_date`,`blood_group`,`units`,`donation_type`,`location`,`hospital_name`,`blood_bank_name`,`certificate_id`,`reward_points_earned`,`verified_by`,`notes`) VALUES
(1,1,'2026-03-15','O+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-001',10,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','Regular donation'),
(2,2,'2026-04-20','A-',1,'plasma','Metro Medical Center','Metro Medical Center','Metro Blood Bank','CERT-BD-002',15,'8e04675f-927d-5de9-9ea5-062d18510c48','Plasma donation'),
(3,3,'2026-01-10','B+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-003',10,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','Regular donation'),
(4,4,'2026-02-28','AB-',1,'platelets','Sunrise Specialty Hospital','Sunrise Specialty Hospital','Sunrise Blood Bank','CERT-BD-004',20,'8e04675f-927d-5de9-9ea5-062d18510c48','Platelet donation'),
(5,5,'2026-05-01','O+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-005',10,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','Emergency donation'),
(6,1,'2025-12-15','O+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-006',10,'8e04675f-927d-5de9-9ea5-062d18510c48','Regular donation'),
(7,3,'2025-11-01','B+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-007',10,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','Regular donation'),
(8,5,'2026-02-15','O+',2,'double-red-cells','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-008',25,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b','Double red cell donation');

-- BLOOD_REQUESTS
INSERT INTO `blood_requests` (`id`,`request_number`,`requested_by`,`hospital_id`,`patient_name`,`patient_age`,`blood_group`,`units_required`,`urgency`,`reason`,`doctor_name`,`status`,`approved_by`,`required_by_date`) VALUES
('400512af-d4b7-567a-873c-08ab639a99d9','BR-2026-001','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','21084c3f-61b9-53c2-b259-a307ae428d38','Amit Kumar',55,'O+',2,'urgent','Emergency surgery scheduled','Dr. Fatima Khan','approved','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-06-05'),
('ca5296df-45c4-5dee-9e9d-b9ebccc86b57','BR-2026-002','f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','51ee9186-b9a5-503e-8dc0-71afcd63eaf7','Sophia Martinez',32,'AB-',1,'emergency','Postpartum hemorrhage','Dr. Anita Desai','fulfilled','8e04675f-927d-5de9-9ea5-062d18510c48','2026-05-25'),
('682360ea-01d9-5658-85ee-6ba6683fed06','BR-2026-003','1992d7c8-4f0f-5bc5-bb6c-965e44ef8602','21084c3f-61b9-53c2-b259-a307ae428d38','Unknown Patient',45,'B+',3,'normal','Scheduled surgery next week','Dr. James Wilson','pending',NULL,'2026-06-15'),
('e17002f1-e805-5453-a6ef-f52704bbe0e4','BR-2026-004','0f7de2ca-8c34-54a7-ab57-ecd07e35fbb2','90d3182d-2285-5829-8c04-238ac032a327','Emergency Patient',60,'A-',2,'emergency','Accident victim needs immediate transfusion','Dr. David Brown','approved','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-06-01'),
('41f47d9f-309f-5b05-ad8a-e35f5de189c5','BR-2026-005','aa536c99-b7e7-5f30-897a-c0e586d834de','21084c3f-61b9-53c2-b259-a307ae428d38','Emily Davis',30,'O-',1,'normal','Pre-surgery preparation','Dr. Sarah Mitchell','pending',NULL,'2026-06-10');

-- BLOOD_DONATION_CAMPS
INSERT INTO `blood_donation_camps` (`id`,`name`,`organizer`,`camp_date`,`start_time`,`end_time`,`location`,`address`,`latitude`,`longitude`,`expected_donors`,`registered_donors`,`blood_groups_needed`,`facilities`,`contact_phone`,`status`) VALUES
(1,'City Blood Drive 2026','Red Cross Society','2026-06-15','09:00:00','17:00:00','City General Hospital','100 Medical Center Blvd, Houston, TX',29.7064,-95.4007,200,85,'["A+","B+","O+","O-"]','["Refreshments","Certificate","Health Checkup","Free T-shirt"]','+1-555-7001','upcoming'),
(2,'Metro Donation Camp','Metro Health Foundation','2026-05-20','08:00:00','16:00:00','Metro Medical Center','55 Fruit Street, Boston, MA',42.3631,-71.0688,150,62,'["A-","B-","AB+","AB-"]','["Refreshments","Certificate","Health Screening"]','+1-555-7002','completed'),
(3,'Emergency Blood Camp','Aetherion Health','2026-06-05','07:00:00','19:00:00','Sunrise Specialty Hospital','200 Wellness Drive, San Francisco, CA',37.7749,-122.4194,300,45,'["O+","O-","A+","B+"]','["Refreshments","Certificate","Emergency Kit","Free Consultation"]','+1-555-7003','upcoming');

-- DONOR_REWARDS
INSERT INTO `donor_rewards` (`donor_id`,`type`,`name`,`description`,`points`,`earned_date`,`expiry_date`,`status`) VALUES
(1,'badge','Bronze Donor','Completed 3+ donations',10,'2026-01-15','2027-01-15','active'),
(2,'badge','Silver Donor','Completed plasma donation',15,'2026-04-20','2027-04-20','active'),
(3,'points','Loyalty Points','Points for 5+ donations',60,'2026-01-10','2027-01-10','active'),
(5,'certificate','Emergency Hero','Donated during emergency',25,'2026-05-01','2027-05-01','active'),
(1,'points','Referral Bonus','Referred a new donor',20,'2026-03-20','2027-03-20','active');

-- DOCTOR_AVAILABILITY
INSERT INTO `doctor_availability` (`doctor_id`,`day_of_week`,`start_time`,`end_time`,`max_patients`,`current_patients`,`is_available`) VALUES
(1,1,'09:00:00','17:00:00',17,4,1),
(1,2,'09:00:00','17:00:00',17,4,1),
(1,3,'09:00:00','17:00:00',17,4,1),
(1,4,'09:00:00','17:00:00',17,4,1),
(1,5,'09:00:00','17:00:00',17,4,1),
(1,6,'09:00:00','13:00:00',8,2,1),
(2,1,'09:00:00','17:00:00',19,5,1),
(2,2,'09:00:00','17:00:00',19,5,1),
(2,3,'09:00:00','17:00:00',19,5,1),
(2,4,'09:00:00','17:00:00',19,5,1),
(2,5,'09:00:00','17:00:00',19,5,1),
(2,6,'09:00:00','13:00:00',8,2,1),
(3,1,'09:00:00','17:00:00',21,6,1),
(3,2,'09:00:00','17:00:00',21,6,1),
(3,3,'09:00:00','17:00:00',21,6,1),
(3,4,'09:00:00','17:00:00',21,6,1),
(3,5,'09:00:00','17:00:00',21,6,1),
(3,6,'09:00:00','13:00:00',8,2,1),
(4,1,'09:00:00','17:00:00',23,7,1),
(4,2,'09:00:00','17:00:00',23,7,1),
(4,3,'09:00:00','17:00:00',23,7,1),
(4,4,'09:00:00','17:00:00',23,7,1),
(4,5,'09:00:00','17:00:00',23,7,1),
(4,6,'09:00:00','13:00:00',8,2,1),
(5,1,'09:00:00','17:00:00',25,8,1),
(5,2,'09:00:00','17:00:00',25,8,1),
(5,3,'09:00:00','17:00:00',25,8,1),
(5,4,'09:00:00','17:00:00',25,8,1),
(5,5,'09:00:00','17:00:00',25,8,1),
(5,6,'09:00:00','13:00:00',8,2,1),
(6,1,'09:00:00','17:00:00',27,9,1),
(6,2,'09:00:00','17:00:00',27,9,1),
(6,3,'09:00:00','17:00:00',27,9,1),
(6,4,'09:00:00','17:00:00',27,9,1),
(6,5,'09:00:00','17:00:00',27,9,1),
(6,6,'09:00:00','13:00:00',8,2,1),
(7,1,'09:00:00','17:00:00',29,10,1),
(7,2,'09:00:00','17:00:00',29,10,1),
(7,3,'09:00:00','17:00:00',29,10,1),
(7,4,'09:00:00','17:00:00',29,10,1),
(7,5,'09:00:00','17:00:00',29,10,1),
(7,6,'09:00:00','13:00:00',8,2,1),
(8,1,'09:00:00','17:00:00',31,11,1),
(8,2,'09:00:00','17:00:00',31,11,1),
(8,3,'09:00:00','17:00:00',31,11,1),
(8,4,'09:00:00','17:00:00',31,11,1),
(8,5,'09:00:00','17:00:00',31,11,1),
(8,6,'09:00:00','13:00:00',8,2,1);

-- DOCTOR_PATIENTS
INSERT INTO `doctor_patients` (`doctor_id`,`patient_id`,`first_visit_date`,`last_visit_date`,`total_visits`,`is_active`,`notes`) VALUES
(1,'84e818cd-f344-5ad8-9b9a-82be450cbd13','2026-02-10','2026-05-15',5,1,'Cardiac follow-up patient'),
(1,'fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','2026-03-01','2026-05-20',4,1,'Hypertension with cardiac risk'),
(2,'8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','2026-02-20','2026-04-15',2,1,'Sports injury recovery'),
(3,'f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','2026-01-15','2026-05-28',8,1,'Prenatal care patient'),
(3,'7255e49b-5f6e-544d-8ef2-3dedd546ad46','2026-03-10','2026-05-30',6,1,'High-risk pregnancy monitoring'),
(4,'fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','2026-02-05','2026-05-18',7,1,'Stroke recovery patient'),
(5,'1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','2026-04-01','2026-05-25',3,1,'Child vaccination and checkup'),
(7,'84e818cd-f344-5ad8-9b9a-82be450cbd13','2026-01-20','2026-05-10',4,1,'General health checkup'),
(7,'aa536c99-b7e7-5f30-897a-c0e586d834de','2026-02-15','2026-05-22',3,1,'Asthma management'),
(7,'59f20e23-5a51-5002-af7f-7ddaf4c2346d','2026-03-05','2026-05-28',5,1,'Thyroid disorder management');

-- APPOINTMENTS
INSERT INTO `appointments` (`id`,`patient_id`,`doctor_id`,`hospital_id`,`department_id`,`appointment_date`,`start_time`,`end_time`,`duration_minutes`,`type`,`status`,`location`,`priority`,`reason`,`symptoms`,`notes`,`is_emergency`,`is_first_visit`,`fee`,`payment_status`,`created_at`,`updated_at`) VALUES
('616f4f07-c17a-5c5c-a27c-6113a190f20b','84e818cd-f344-5ad8-9b9a-82be450cbd13',1,'21084c3f-61b9-53c2-b259-a307ae428d38',1,'2026-06-02','10:00:00','10:30:00',30,'consultation','confirmed','in-person','medium','Chest pain evaluation','["Chest Pain","Shortness of Breath"]',NULL,0,0,250.00,'pending','2026-05-28 09:00:00','2026-05-28 09:00:00'),
('28785a2f-3224-585f-b043-33ca70e6fbc0','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26',1,'21084c3f-61b9-53c2-b259-a307ae428d38',1,'2026-06-01','11:00:00','11:30:00',30,'follow-up','confirmed','in-person','medium','Blood pressure follow-up','["Headache","Dizziness"]',NULL,0,0,100.00,'paid','2026-05-25 14:00:00','2026-05-25 14:00:00'),
('840aa65f-668c-5bc5-bef8-f6ebfd1f209f','8facd827-1b00-52b3-bc84-e1cd5d8fd5bb',2,'21084c3f-61b9-53c2-b259-a307ae428d38',2,'2026-06-03','09:00:00','09:30:00',30,'consultation','scheduled','in-person','low','Knee pain assessment','["Knee Pain","Swelling"]',NULL,0,1,200.00,'pending','2026-05-27 10:00:00','2026-05-27 10:00:00'),
('4b0c1752-9960-5a17-b019-be7e229b649b','f0b17a8e-8055-5cd1-b465-4cf38a5e0d51',3,'21084c3f-61b9-53c2-b259-a307ae428d38',3,'2026-06-02','14:00:00','14:30:00',30,'follow-up','confirmed','in-person','medium','Prenatal checkup - 28 weeks',NULL,NULL,0,0,300.00,'insurance','2026-05-20 08:00:00','2026-05-20 08:00:00'),
('db6d3c61-44b7-5bda-9470-eeaec2facac8','7255e49b-5f6e-544d-8ef2-3dedd546ad46',3,'21084c3f-61b9-53c2-b259-a307ae428d38',3,'2026-06-01','15:00:00','15:30:00',30,'follow-up','confirmed','in-person','high','Pregnancy monitoring - 22 weeks',NULL,NULL,0,0,300.00,'paid','2026-05-22 11:00:00','2026-05-22 11:00:00'),
('12f7cad4-9185-5d34-afdb-6b83bc64cbe4','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26',4,'51ee9186-b9a5-503e-8dc0-71afcd63eaf7',10,'2026-06-04','10:00:00','10:30:00',30,'follow-up','scheduled','in-person','medium','Post-stroke evaluation',NULL,NULL,0,0,350.00,'pending','2026-05-26 09:00:00','2026-05-26 09:00:00'),
('7f65fdfb-5952-5686-9de8-202b38263945','aa536c99-b7e7-5f30-897a-c0e586d834de',7,'21084c3f-61b9-53c2-b259-a307ae428d38',5,'2026-06-02','11:00:00','11:15:00',15,'consultation','scheduled','in-person','low','Asthma routine check',NULL,NULL,0,0,120.00,'pending','2026-05-28 15:00:00','2026-05-28 15:00:00'),
('d9bc8803-9c21-5af5-9e1d-42b519ad89f9','59f20e23-5a51-5002-af7f-7ddaf4c2346d',7,'21084c3f-61b9-53c2-b259-a307ae428d38',5,'2026-06-03','14:00:00','14:15:00',15,'follow-up','confirmed','in-person','medium','Thyroid medication review',NULL,NULL,0,0,50.00,'paid','2026-05-24 08:00:00','2026-05-24 08:00:00'),
('9462f15b-e6cc-56ae-8f1a-81526a422c56','e6147795-11e7-5e06-927e-c47e140ea4dd',6,'90d3182d-2285-5829-8c04-238ac032a327',8,'2026-06-05','10:00:00','10:15:00',15,'consultation','scheduled','video','low','Skin rash evaluation','["Skin Rash","Itching"]',NULL,0,1,150.00,'pending','2026-05-29 10:00:00','2026-05-29 10:00:00'),
('b9d3b355-3e00-56e2-96a1-c7f23c7e58d9','84e818cd-f344-5ad8-9b9a-82be450cbd13',7,'21084c3f-61b9-53c2-b259-a307ae428d38',5,'2026-05-15','09:00:00','09:15:00',15,'checkup','completed','in-person','low','Annual health checkup',NULL,NULL,0,0,120.00,'paid','2026-05-10 08:00:00','2026-05-15 09:15:00'),
('879146dc-52bd-541d-93f6-f23545ff3002','89c54d30-0980-59f7-a561-f20ba21fa925',6,'90d3182d-2285-5829-8c04-238ac032a327',8,'2026-06-06','11:00:00','11:15:00',15,'consultation','scheduled','in-person','low','Acne treatment consultation',NULL,NULL,0,1,150.00,'pending','2026-05-30 08:00:00','2026-05-30 08:00:00'),
('c8a3b36e-6e16-5f80-960c-daf91900a996','1802faf0-b4ed-55bf-8dc2-84a221e5c6ff',5,'21084c3f-61b9-53c2-b259-a307ae428d38',4,'2026-06-04','09:00:00','09:20:00',20,'checkup','scheduled','in-person','low','Child wellness checkup',NULL,NULL,0,0,180.00,'pending','2026-05-28 12:00:00','2026-05-28 12:00:00');

-- PRESCRIPTIONS
INSERT INTO `prescriptions` (`id`,`appointment_id`,`doctor_id`,`patient_id`,`hospital_id`,`diagnosis`,`symptoms`,`advice`,`notes`,`follow_up_date`,`valid_until`,`status`,`created_at`) VALUES
('7a6a6889-2773-5ad2-9288-9135d40766eb','b9d3b355-3e00-56e2-96a1-c7f23c7e58d9',7,'84e818cd-f344-5ad8-9b9a-82be450cbd13','21084c3f-61b9-53c2-b259-a307ae428d38','General good health, mild Vitamin D deficiency','["Fatigue"]','Take Vitamin D supplements, increase sun exposure','Follow up in 3 months','2026-08-15','2026-09-15','active','2026-05-15 09:15:00'),
('304ec3ec-627b-5455-8739-87785feb93c8','28785a2f-3224-585f-b043-33ca70e6fbc0',1,'fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','21084c3f-61b9-53c2-b259-a307ae428d38','Essential Hypertension, well controlled','["Headache","Dizziness"]','Continue current medication, reduce salt intake','Monitor BP weekly','2026-06-15','2026-07-15','active','2026-05-20 11:30:00'),
('cacb3977-cc5a-5b4a-96fb-78c696d66030','d9bc8803-9c21-5af5-9e1d-42b519ad89f9',7,'59f20e23-5a51-5002-af7f-7ddaf4c2346d','21084c3f-61b9-53c2-b259-a307ae428d38','Hypothyroidism, stable on medication',NULL,'Continue Levothyroxine, repeat TSH in 6 weeks','Fasting blood test recommended','2026-07-15','2026-08-15','active','2026-05-28 14:15:00'),
('b8437a4d-3944-5811-9b82-dcb02a079e70','db6d3c61-44b7-5bda-9470-eeaec2facac8',3,'7255e49b-5f6e-544d-8ef2-3dedd546ad46','21084c3f-61b9-53c2-b259-a307ae428d38','Pregnancy - 22 weeks, normal progression',NULL,'Continue prenatal vitamins, iron supplements','High-risk pregnancy monitoring continues','2026-06-15','2026-07-15','active','2026-05-22 15:30:00');

-- PRESCRIPTION_ITEMS
INSERT INTO `prescription_items` (`prescription_id`,`medicine_name`,`dosage`,`frequency`,`duration`,`timing`,`route`,`quantity`,`refills`,`instructions`) VALUES
('7a6a6889-2773-5ad2-9288-9135d40766eb','Vitamin D3 1000IU','1000IU','Once daily','3 months','after-food','oral',1,2,'Take with fatty meal for better absorption'),
('304ec3ec-627b-5455-8739-87785feb93c8','Amlodipine 5mg','5mg','Once daily','Ongoing','after-food','oral',1,5,'Take at same time daily'),
('304ec3ec-627b-5455-8739-87785feb93c8','Metformin 500mg','500mg','Twice daily','Ongoing','with-food','oral',2,5,'Monitor blood sugar regularly'),
('cacb3977-cc5a-5b4a-96fb-78c696d66030','Levothyroxine 50mcg','50mcg','Once daily','Ongoing','empty-stomach','oral',1,6,'Take 30 min before breakfast'),
('b8437a4d-3944-5811-9b82-dcb02a079e70','Prenatal Vitamins','1 tablet','Once daily','Throughout pregnancy','after-food','oral',1,0,'Take with evening meal'),
('b8437a4d-3944-5811-9b82-dcb02a079e70','Iron Supplement 65mg','65mg','Once daily','Throughout pregnancy','after-food','oral',1,0,'Take with Vitamin C for absorption');

-- PRESCRIPTION_TESTS
INSERT INTO `prescription_tests` (`prescription_id`,`test_name`,`test_type`,`instructions`,`is_urgent`,`result_url`) VALUES
('7a6a6889-2773-5ad2-9288-9135d40766eb','25-OH Vitamin D','Blood Test','Fasting not required',0,NULL),
('304ec3ec-627b-5455-8739-87785feb93c8','Lipid Profile','Blood Test','Fasting 12 hours required',0,NULL),
('304ec3ec-627b-5455-8739-87785feb93c8','HbA1c','Blood Test','No special preparation',0,NULL),
('cacb3977-cc5a-5b4a-96fb-78c696d66030','TSH','Blood Test','Early morning, fasting',0,NULL),
('b8437a4d-3944-5811-9b82-dcb02a079e70','Complete Blood Count','Blood Test','Fasting not required',0,NULL),
('b8437a4d-3944-5811-9b82-dcb02a079e70','Glucose Tolerance Test','Blood Test','Fasting 8 hours required',0,NULL);

-- PATIENT_MEDICAL_HISTORY
INSERT INTO `patient_medical_history` (`patient_id`,`condition_name`,`diagnosed_date`,`status`,`notes`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','Vitamin D Deficiency','2026-01-15','managed','Mild deficiency, on supplementation'),
('aa536c99-b7e7-5f30-897a-c0e586d834de','Mild Asthma','2020-03-10','managed','Well-controlled with inhaler'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Type 2 Diabetes','2018-06-20','ongoing','Managed with Metformin and lifestyle'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Essential Hypertension','2019-01-15','managed','On Amlodipine, BP well controlled'),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','Hypothyroidism','2022-04-01','managed','On Levothyroxine, TSH stable'),
('89c54d30-0980-59f7-a561-f20ba21fa925','Generalized Anxiety Disorder','2023-08-15','managed','On therapy, doing well'),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','Migraine','2019-05-20','managed','Occasional episodes, triggers identified');

-- PATIENT_FAMILY_HISTORY
INSERT INTO `patient_family_history` (`patient_id`,`relation`,`condition_name`,`notes`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','father','Coronary Artery Disease','Bypass surgery at age 60'),
('aa536c99-b7e7-5f30-897a-c0e586d834de','mother','Diabetes Type 2','Diagnosed at age 55'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','father','Diabetes Type 2','Diet-controlled'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','mother','Hypertension','On medication since age 50'),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','mother','Hypothyroidism','Autoimmune origin'),
('89c54d30-0980-59f7-a561-f20ba21fa925','father','Depression','Chronic condition');

-- PATIENT_VACCINATIONS
INSERT INTO `patient_vaccinations` (`patient_id`,`vaccine_name`,`disease`,`dose_number`,`scheduled_date`,`administered_at`,`next_due_date`,`administered_by`,`facility_name`,`hospital_name`,`batch_number`,`status`,`side_effects`,`notes`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','COVID-19 Booster','COVID-19',1,'2026-04-15','2026-04-15','2027-04-15','Dr. Sarah Mitchell','City General Hospital','City General Hospital','CVT-2026-0415','completed','Mild soreness at injection site','Pfizer-BioNTech'),
('aa536c99-b7e7-5f30-897a-c0e586d834de','Influenza Vaccine','Influenza',1,'2026-10-01',NULL,'2027-10-01',NULL,'Metro Medical Center',NULL,NULL,'scheduled',NULL,'Annual flu shot'),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','Hepatitis B','Hepatitis B',3,'2026-03-01','2026-03-01',NULL,'Dr. David Brown','City General Hospital','City General Hospital','HBT-2026-0301','completed',NULL,'Final dose in series'),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','TDaP','Tetanus, Diphtheria, Pertussis',1,'2026-01-20','2026-01-20',NULL,'Dr. Anita Desai','City General Hospital','City General Hospital','TDP-2026-0120','completed',NULL,'Pregnancy dose'),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','TDaP','Tetanus, Diphtheria, Pertussis',1,'2026-05-10','2026-05-10',NULL,'Dr. Anita Desai','City General Hospital','City General Hospital','TDP-2026-0510','completed','Mild arm soreness','Pregnancy dose'),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','COVID-19 Booster','COVID-19',1,'2026-05-01','2026-05-01','2027-05-01','Dr. Meera Patel','City General Hospital','City General Hospital','CVT-2026-0501','completed',NULL,'Moderna');

-- PATIENT_MEDICATIONS
INSERT INTO `patient_medications` (`patient_id`,`medicine_name`,`dosage`,`frequency`,`route`,`start_date`,`end_date`,`prescribed_by`,`prescription_id`,`is_active`,`reminder_time`,`reminder_enabled`,`notes`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','Vitamin D3 1000IU','1000IU','Once daily','oral','2026-01-20',NULL,7,'7a6a6889-2773-5ad2-9288-9135d40766eb',1,'08:00:00',1,'Take with breakfast'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Amlodipine 5mg','5mg','Once daily','oral','2019-01-15',NULL,1,'304ec3ec-627b-5455-8739-87785feb93c8',1,'07:00:00',1,'Morning dose'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Metformin 500mg','500mg','Twice daily','oral','2018-06-25',NULL,1,'304ec3ec-627b-5455-8739-87785feb93c8',1,'08:00:00',1,'With meals'),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','Levothyroxine 50mcg','50mcg','Once daily','oral','2022-04-15',NULL,7,'cacb3977-cc5a-5b4a-96fb-78c696d66030',1,'06:30:00',1,'30 min before breakfast'),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','Prenatal Vitamins','1 tablet','Once daily','oral','2026-03-10',NULL,3,'b8437a4d-3944-5811-9b82-dcb02a079e70',1,'20:00:00',1,'With evening meal'),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','Iron Supplement 65mg','65mg','Once daily','oral','2026-03-10',NULL,3,'b8437a4d-3944-5811-9b82-dcb02a079e70',1,'12:00:00',1,'Take with Vitamin C'),
('aa536c99-b7e7-5f30-897a-c0e586d834de','Salbutamol Inhaler','2 puffs','As needed','inhalation','2020-03-15',NULL,NULL,NULL,1,NULL,0,'For acute asthma episodes');

-- PATIENT_SURGERIES
INSERT INTO `patient_surgeries` (`patient_id`,`surgery_name`,`surgery_date`,`hospital`,`doctor_name`,`notes`) VALUES
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','ACL Reconstruction','2025-11-15','Metro Medical Center','Dr. James Wilson','Full recovery expected in 9 months'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Cataract Surgery','2024-08-20','City General Hospital','Dr. Robert Chen','Successful, no complications');

-- PATIENT_HEALTH_RECORDS
INSERT INTO `patient_health_records` (`id`,`patient_id`,`record_type`,`title`,`description`,`file_url`,`file_type`,`file_size`,`recorded_by`,`is_shared`) VALUES
('ff50b17e-380b-5cc8-bdb4-f310fa52cc7a','84e818cd-f344-5ad8-9b9a-82be450cbd13','lab_report','Complete Blood Count','Annual checkup CBC results','/uploads/records/cbc_2026.pdf','pdf',245000,'0a489b23-3281-5aed-b3ff-804492121ee5',0),
('89e3047c-3369-597f-8b56-39d1d174048b','84e818cd-f344-5ad8-9b9a-82be450cbd13','measurement','Blood Pressure Reading','BP: 128/82 mmHg',NULL,NULL,NULL,'9f3305dc-31e4-5ed4-a1b7-079368c00b20',0),
('5b987b0e-798c-587c-b083-359eba29659a','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','lab_report','HbA1c Result','HbA1c: 6.8%','/uploads/records/hba1c_2026.pdf','pdf',180000,'9f3305dc-31e4-5ed4-a1b7-079368c00b20',0),
('044b4cc5-3e95-5a43-bfbe-802d4ece8bd8','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','lab_report','Lipid Profile','Total Cholesterol: 210 mg/dL','/uploads/records/lipid_2026.pdf','pdf',195000,'9f3305dc-31e4-5ed4-a1b7-079368c00b20',0),
('2c30c213-3615-550d-9308-0ab33e6dac69','59f20e23-5a51-5002-af7f-7ddaf4c2346d','lab_report','Thyroid Panel','TSH: 3.2 mIU/L','/uploads/records/thyroid_2026.pdf','pdf',210000,'0a489b23-3281-5aed-b3ff-804492121ee5',0),
('759f6494-7de2-5838-ac42-57ba13cb5e57','f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','imaging','Obstetric Ultrasound','28-week growth scan','/uploads/records/us_28w.pdf','pdf',5200000,'452d0ca6-ae39-56c1-a87d-800902d420c5',0),
('8f8205f8-c2ea-5d8a-82ab-006550ee8397','aa536c99-b7e7-5f30-897a-c0e586d834de','document','Asthma Action Plan','Updated asthma management plan','/uploads/records/asthma_plan.pdf','pdf',150000,'0a489b23-3281-5aed-b3ff-804492121ee5',1);

-- MEDICINE_ORDERS
INSERT INTO `medicine_orders` (`id`,`order_number`,`patient_id`,`pharmacy_id`,`prescription_id`,`total_amount`,`discount`,`final_amount`,`payment_method`,`payment_status`,`delivery_address`,`delivery_status`,`order_status`,`created_at`,`updated_at`) VALUES
('e4cf2ee4-aed8-5249-be44-299d0005a9e5','ORD-2026-001','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','8d1505e6-a115-5642-bc97-00d000192241','304ec3ec-627b-5455-8739-87785feb93c8',45.97,5.00,40.97,'card','paid','170 Grand Ave, Houston, TX','delivered','delivered','2026-05-20 10:00:00','2026-05-22 14:00:00'),
('cbbdb3c7-78be-5112-b89b-6fd1508f14e4','ORD-2026-002','84e818cd-f344-5ad8-9b9a-82be450cbd13','8d1505e6-a115-5642-bc97-00d000192241','7a6a6889-2773-5ad2-9288-9135d40766eb',10.99,0.00,10.99,'online','paid','742 Evergreen Terrace, Springfield, IL','delivered','delivered','2026-05-15 11:00:00','2026-05-18 09:00:00'),
('6b1c00f2-faf6-5343-9fd5-9ddb77879a14','ORD-2026-003','59f20e23-5a51-5002-af7f-7ddaf4c2346d','e250ae4b-d0fb-5af0-ac98-4f55bedae2f0','cacb3977-cc5a-5b4a-96fb-78c696d66030',8.49,0.00,8.49,'card','paid','401 S Carson St, Carson City, NV','in-transit','shipped','2026-05-28 08:00:00','2026-05-30 06:00:00'),
('4cb5120b-3ec8-56c0-86af-8f718e276cf3','ORD-2026-004','7255e49b-5f6e-544d-8ef2-3dedd546ad46','8d1505e6-a115-5642-bc97-00d000192241','b8437a4d-3944-5811-9b82-dcb02a079e70',36.98,2.00,34.98,'insurance','pending','100 Market St, San Francisco, CA','pending','confirmed','2026-05-29 12:00:00','2026-05-29 12:00:00'),
('ad0c9900-4088-5717-a6a7-cf05b4d9261f','ORD-2026-005','aa536c99-b7e7-5f30-897a-c0e586d834de','8d1505e6-a115-5642-bc97-00d000192241',NULL,24.97,0.00,24.97,'cash','paid','1600 Pennsylvania Ave, Washington, DC','delivered','delivered','2026-05-10 15:00:00','2026-05-13 10:00:00');

-- ORDER_ITEMS
INSERT INTO `order_items` (`order_id`,`inventory_id`,`medicine_name`,`quantity`,`unit_price`) VALUES
('e4cf2ee4-aed8-5249-be44-299d0005a9e5',2,'Metformin 500mg',2,8.99),
('e4cf2ee4-aed8-5249-be44-299d0005a9e5',7,'Amlodipine 5mg',1,9.99),
('e4cf2ee4-aed8-5249-be44-299d0005a9e5',4,'Omeprazole 20mg',1,6.99),
('cbbdb3c7-78be-5112-b89b-6fd1508f14e4',12,'Vitamin D3 1000IU',1,3.99),
('6b1c00f2-faf6-5343-9fd5-9ddb77879a14',10,'Levothyroxine 50mcg',1,8.49),
('4cb5120b-3ec8-56c0-86af-8f718e276cf3',15,'Prenatal Vitamins',1,16.99),
('4cb5120b-3ec8-56c0-86af-8f718e276cf3',5,'Cetirizine 10mg',1,4.99),
('ad0c9900-4088-5717-a6a7-cf05b4d9261f',14,'Salbutamol Inhaler',1,21.99),
('ad0c9900-4088-5717-a6a7-cf05b4d9261f',6,'Cetirizine 10mg',1,3.99);

-- MEDICINE_REMINDERS
INSERT INTO `medicine_reminders` (`patient_id`,`medication_id`,`medicine_name`,`dosage`,`frequency`,`reminder_times`,`start_date`,`end_date`,`is_active`,`notes`) VALUES
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26',2,'Metformin 500mg','500mg','Twice daily','["08:00","20:00"]','2018-06-25',NULL,1,'Take with meals'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26',3,'Amlodipine 5mg','5mg','Once daily','["07:00"]','2019-01-15',NULL,1,'Morning dose'),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d',4,'Levothyroxine 50mcg','50mcg','Once daily','["06:30"]','2022-04-15',NULL,1,'30 min before breakfast'),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46',5,'Prenatal Vitamins','1 tablet','Once daily','["20:00"]','2026-03-10',NULL,1,'With evening meal'),
('84e818cd-f344-5ad8-9b9a-82be450cbd13',1,'Vitamin D3 1000IU','1000IU','Once daily','["08:00"]','2026-01-20','2026-10-20',1,'Take with breakfast');

-- BILLING_INVOICES
INSERT INTO `billing_invoices` (`id`,`patient_id`,`appointment_id`,`invoice_number`,`amount`,`tax`,`discount`,`total_amount`,`payment_method`,`payment_status`,`insurance_provider`,`insurance_policy_number`,`insurance_coverage`,`patient_responsibility`,`due_date`,`paid_at`) VALUES
('1a4210fa-4720-5e23-bc96-92800d26e337','84e818cd-f344-5ad8-9b9a-82be450cbd13','b9d3b355-3e00-56e2-96a1-c7f23c7e58d9','INV-2026-001',120.00,10.80,0.00,130.80,'card','paid',NULL,NULL,0.00,130.80,NULL,'2026-05-15 09:20:00'),
('09c0e279-1a57-5ea2-bcf1-2b014b495249','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','28785a2f-3224-585f-b043-33ca70e6fbc0','INV-2026-002',100.00,9.00,0.00,109.00,'card','paid',NULL,NULL,0.00,109.00,NULL,'2026-05-20 11:35:00'),
('8745215e-c85c-554c-8d93-e7072e407469','f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','4b0c1752-9960-5a17-b019-be7e229b649b','INV-2026-003',300.00,27.00,0.00,327.00,'insurance','paid','Cigna','CG-2024-67890',261.60,65.40,NULL,'2026-05-20 08:10:00'),
('381da2e7-188a-554e-ab72-f673cfe51341','59f20e23-5a51-5002-af7f-7ddaf4c2346d','d9bc8803-9c21-5af5-9e1d-42b519ad89f9','INV-2026-004',50.00,4.50,0.00,54.50,'card','paid',NULL,NULL,0.00,54.50,NULL,'2026-05-28 14:20:00');

-- AMBULANCE_REQUESTS
INSERT INTO `ambulance_requests` (`id`,`requested_by`,`patient_name`,`patient_phone`,`pickup_latitude`,`pickup_longitude`,`pickup_address`,`drop_address`,`emergency_type`,`passenger_count`,`needs_oxygen`,`status`,`ambulance_id`,`estimated_arrival`,`hospital_id`,`dispatched_at`) VALUES
('f314f7e4-dfc2-59fb-af27-f6ecfcabee25','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Amit Kumar','+1-555-0505',29.7500,-95.3600,'170 Grand Ave, Houston, TX','100 Medical Center Blvd, Houston, TX','Heart Attack',1,1,'completed',1,12,'21084c3f-61b9-53c2-b259-a307ae428d38','2026-04-10 14:00:00'),
('112cb213-013b-575e-b9df-25dbc23c07c2','363b68fc-93b2-5e09-b3e5-2c371526fdf8','Emergency Patient','+1-555-0711',42.3600,-71.0700,'Downtown Boston','55 Fruit Street, Boston, MA','Accident',2,0,'completed',4,8,'90d3182d-2285-5829-8c04-238ac032a327','2026-03-20 22:00:00'),
('cc6d4b91-bc4c-5ae0-afa0-c47ca0a8b6ee','aa536c99-b7e7-5f30-897a-c0e586d834de','Emily Davis','+1-555-0502',38.9000,-77.0400,'Downtown Washington','100 Medical Center Blvd, Houston, TX','Respiratory Distress',1,1,'dispatched',NULL,15,'21084c3f-61b9-53c2-b259-a307ae428d38',NULL);

-- EMERGENCY_SERVICES
INSERT INTO `emergency_services` (`name`,`type`,`status`,`provider`,`phone`,`latitude`,`longitude`,`address`,`eta_minutes`,`capacity`,`current_load`,`vehicle_number`,`crew_members`,`equipment`,`rating`,`price`) VALUES
('City General Ambulance Service','ambulance','available','City General Hospital','+1-555-9111',29.7064,-95.4007,'100 Medical Center Blvd',12,5,2,'AMB-001',3,'["Defibrillator","Oxygen","Stretcher"]',4.5,150.00),
('Metro Emergency Response','ambulance','busy','Metro Medical Center','+1-555-9112',42.3631,-71.0688,'55 Fruit Street',15,3,3,'AMB-002',2,'["Oxygen","First Aid"]',4.2,120.00),
('Sunrise Medical Transport','ambulance','available','Sunrise Specialty Hospital','+1-555-9113',37.7749,-122.4194,'200 Wellness Drive',18,2,0,'AMB-003',2,'["Oxygen","Stretcher","Monitor"]',4.7,180.00),
('Red Cross Blood Service','blood','available','Red Cross','+1-555-9120',29.7600,-95.3700,'Red Cross Center, Houston',30,NULL,NULL,NULL,NULL,'[]',4.6,NULL),
('AirLinx Oxygen Supply','oxygen','available','AirLinx Medical','+1-555-9001',29.7100,-95.3950,'AirLinx Warehouse, Houston',45,NULL,NULL,NULL,NULL,'[]',4.4,NULL),
('Dr. On-Call Emergency','doctor','available','Aetherion Health','+1-555-9130',29.7200,-95.4100,'Virtual Service',5,NULL,NULL,NULL,NULL,'[]',4.8,200.00);

-- OXYGEN_REQUESTS
INSERT INTO `oxygen_requests` (`request_number`,`patient_name`,`patient_age`,`patient_condition`,`oxygen_type`,`cylinders_needed`,`urgency`,`hospital_name`,`doctor_name`,`status`,`delivery_address`,`contact_phone`,`request_date`,`required_date`) VALUES
('O2-2026-001','Amit Kumar',55,'COPD Exacerbation','B-type (50L)',2,'urgent','City General Hospital','Dr. Sarah Mitchell','approved','170 Grand Ave, Houston, TX','+1-555-0505','2026-05-28','2026-05-29'),
('O2-2026-002','Emergency Patient',72,'Severe Pneumonia','A-type (10L)',1,'emergency','Metro Medical Center','Dr. David Brown','dispatched','45 Park Ave, Boston, MA','+1-555-0712','2026-05-30','2026-05-30'),
('O2-2026-003','Home Care Patient',65,'Chronic Oxygen Therapy','C-type (5L)',3,'normal','Sunrise Specialty Hospital','Dr. Michael Lee','pending','300 Oak St, San Francisco, CA','+1-555-0713','2026-05-31','2026-06-02');

-- AI_CONVERSATIONS
INSERT INTO `ai_conversations` (`id`,`user_id`,`title`,`status`) VALUES
('8e21ddd2-d34f-59e9-8412-c19ecab96780','84e818cd-f344-5ad8-9b9a-82be450cbd13','Heart Health Discussion','active'),
('5879356f-980c-5fc0-8028-1f523e6c30f2','aa536c99-b7e7-5f30-897a-c0e586d834de','Asthma Management Tips','active'),
('d3b2edc3-991b-5e44-8320-199fbc61b051','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Diabetes Diet Plan','active'),
('9091503a-34aa-5fdc-b244-918aed9a0dae','7255e49b-5f6e-544d-8ef2-3dedd546ad46','Pregnancy Week 22 Guide','active'),
('a9f6b776-aa9a-5627-aa7a-68fcc524b205','8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','Knee Rehabilitation','archived'),
('bc17f658-3593-52e9-a91b-848332527717','59f20e23-5a51-5002-af7f-7ddaf4c2346d','Thyroid Questions','active');

-- AI_MESSAGES
INSERT INTO `ai_messages` (`id`,`conversation_id`,`role`,`content`,`type`,`emotion`,`confidence`,`suggestions`) VALUES
('487e0156-a04c-5aeb-b42c-52c752bc2dd7','8e21ddd2-d34f-59e9-8412-c19ecab96780','user','I have been having chest pain when exercising. Should I be concerned?','text',NULL,NULL,NULL),
('269ffb39-eee6-584a-b6c3-7e8d363056e5','8e21ddd2-d34f-59e9-8412-c19ecab96780','assistant','Chest pain during exercise can be a sign of angina or other cardiac conditions. I recommend scheduling an appointment with a cardiologist immediately. Dr. Sarah Mitchell at City General Hospital specializes in cardiology and has excellent ratings.','text','concerned',0.85,'["Schedule appointment with Dr. Sarah Mitchell","Learn about angina symptoms","Read about heart-healthy exercises"]'),
('fdf39143-3087-595c-8efc-3f00cd2fbda9','9091503a-34aa-5fdc-b244-918aed9a0dae','user','What should I expect at 22 weeks pregnant?','text',NULL,NULL,NULL),
('ea443182-4ac5-585c-bc27-6ddf87b692c7','9091503a-34aa-5fdc-b244-918aed9a0dae','assistant','At 22 weeks, your baby is about the size of a papaya! You may notice more movement, and your belly is showing. Common experiences include: back pain, Braxton Hicks contractions, and increased appetite. Make sure to continue prenatal vitamins and attend all scheduled checkups.','text','happy',0.92,'["Track your pregnancy symptoms","Schedule prenatal checkup","Read about 22-week milestones"]'),
('d4fb46c8-8a28-57dd-bee6-2c041011e0a5','d3b2edc3-991b-5e44-8320-199fbc61b051','user','What foods should I avoid with Type 2 diabetes?','text',NULL,NULL,NULL),
('5c940d55-7bca-5cdf-879c-72b32945d25d','d3b2edc3-991b-5e44-8320-199fbc61b051','assistant','With Type 2 diabetes, limit or avoid: refined sugars, white bread, sugary drinks, processed snacks, and high-glycemic fruits. Focus on: whole grains, lean proteins, vegetables, and healthy fats. Your HbA1c of 6.8% shows good control - keep up the Metformin and balanced diet!','suggestion','neutral',0.88,'["View diabetic meal plans","Monitor blood sugar levels","Read about Metformin"]');

-- AI_VOICE_SESSIONS
INSERT INTO `ai_voice_sessions` (`id`,`user_id`,`transcript`,`audio_url`) VALUES
('c659a762-9dff-562f-bd37-d2576261aec0','84e818cd-f344-5ad8-9b9a-82be450cbd13','I have been feeling tired lately and want to check my vitamin levels.','/uploads/voice/vs1.webm'),
('13b295bd-b0ab-56f8-8e8f-6e9fa7f3cfc3','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Can you remind me about my blood pressure medication schedule?','/uploads/voice/vs2.webm');

-- NOTIFICATIONS
INSERT INTO `notifications` (`id`,`user_id`,`type`,`title`,`body`,`priority`,`is_read`,`created_at`) VALUES
('d4e8853d-ec61-540e-9a02-86dac818b75f','84e818cd-f344-5ad8-9b9a-82be450cbd13','appointment_reminder','Upcoming Appointment','Your appointment with Dr. Sarah Mitchell is tomorrow at 10:00 AM','high',0,'2026-06-01 09:00:00'),
('30cfa024-fd67-513d-88e5-3a18c1f3ce05','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','prescription','Prescription Refill Due','Your Metformin prescription is due for refill in 5 days','medium',0,'2026-05-30 10:00:00'),
('2497030c-df75-5e58-adf7-e028b9f957de','7255e49b-5f6e-544d-8ef2-3dedd546ad46','health_tip','Pregnancy Tip of the Day','Stay hydrated during pregnancy. Aim for 8-10 glasses of water daily.','low',1,'2026-05-29 08:00:00'),
('26341f60-5f37-5dba-b34f-5ce6637c9cb7','5c1032f2-ab89-5387-aba1-a7a55cb764fd','donation_reminder','Donation Eligible','You are now eligible to donate blood again! Schedule your next donation.','medium',0,'2026-05-28 10:00:00'),
('67957f93-24f4-5ccb-a717-4ab928ae34a5','9f3305dc-31e4-5ed4-a1b7-079368c00b20','appointment','New Appointment Booked','Aarav Sharma has booked a consultation for June 2nd','high',0,'2026-05-28 09:05:00'),
('38d16874-754b-58e8-838b-67fee5afe129','aa536c99-b7e7-5f30-897a-c0e586d834de','system','Welcome to Aetherion Health','Complete your health profile to get personalized recommendations','medium',1,'2026-01-25 00:00:00'),
('13caaf0e-09d1-5b4e-9ca2-b33fd20237a6','452d0ca6-ae39-56c1-a87d-800902d420c5','appointment','Upcoming Appointment','Sophia Martinez prenatal checkup tomorrow at 2:00 PM','high',0,'2026-06-01 08:00:00');

-- DOCTOR_NOTIFICATIONS
INSERT INTO `doctor_notifications` (`doctor_id`,`type`,`title`,`message`,`priority`,`is_read`) VALUES
(1,'appointment','New Appointment','Aarav Sharma booked for June 2nd, 10:00 AM','high',0),
(3,'appointment','Appointment Confirmed','Sophia Martinez confirmed for June 2nd, 2:00 PM','medium',1),
(7,'prescription','Prescription Refill Request','Thomas Anderson requested a refill for Levothyroxine','medium',0),
(5,'review','New Review','Marcus Johnson left a 5-star review','low',1),
(1,'blood_request','Blood Request','Emergency O+ blood needed for surgery','urgent',0);

-- DOCTOR_ACTIVITIES
INSERT INTO `doctor_activities` (`doctor_id`,`type`,`description`,`patient_name`,`status`,`created_at`) VALUES
(1,'appointment','Completed consultation with Aarav Sharma','Aarav Sharma','completed','2026-05-15 09:30:00'),
(1,'prescription','Wrote prescription for Amit Kumar','Amit Kumar','completed','2026-05-20 11:45:00'),
(3,'consultation','Prenatal checkup - 28 weeks','Sophia Martinez','completed','2026-05-20 14:30:00'),
(7,'appointment','General health checkup completed','Aarav Sharma','completed','2026-05-15 09:15:00'),
(7,'prescription','Refilled prescription for Kavita Reddy','Kavita Reddy','completed','2026-05-28 14:20:00'),
(2,'appointment','ACL follow-up assessment','Rohan Patel','completed','2026-04-15 10:00:00');

-- DOCTOR_EARNINGS
INSERT INTO `doctor_earnings` (`doctor_id`,`earning_date`,`consultation_revenue`,`video_revenue`,`follow_up_revenue`,`total_revenue`,`total_appointments`,`completed_appointments`) VALUES
(1,'2026-05-28',1250.00,600.00,200.00,2050.00,8,7),
(1,'2026-05-27',1000.00,450.00,150.00,1600.00,6,6),
(3,'2026-05-28',1800.00,700.00,300.00,2800.00,10,9),
(7,'2026-05-28',600.00,200.00,100.00,900.00,12,11),
(7,'2026-05-27',480.00,150.00,50.00,680.00,8,7);

-- MESSAGES
INSERT INTO `messages` (`id`,`sender_id`,`receiver_id`,`appointment_id`,`message_body`,`message_type`,`is_read`,`created_at`) VALUES
('e850b618-f737-5d16-9c7e-470e10411a45','9f3305dc-31e4-5ed4-a1b7-079368c00b20','84e818cd-f344-5ad8-9b9a-82be450cbd13','616f4f07-c17a-5c5c-a27c-6113a190f20b','Hi Aarav, please bring your previous ECG reports to the appointment tomorrow.','text',0,'2026-06-01 08:00:00'),
('fc9a9379-5074-5dd5-8fcd-4cfd7bf6e20e','84e818cd-f344-5ad8-9b9a-82be450cbd13','9f3305dc-31e4-5ed4-a1b7-079368c00b20','616f4f07-c17a-5c5c-a27c-6113a190f20b','Thank you Dr. Mitchell, I will bring them along.','text',1,'2026-06-01 08:15:00'),
('f9b16b20-538d-553c-a9da-ab59c53d769c','452d0ca6-ae39-56c1-a87d-800902d420c5','f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','4b0c1752-9960-5a17-b019-be7e229b649b','Sophia, your lab results look good. See you at the next checkup.','text',1,'2026-05-22 16:00:00'),
('8ebc9dfc-ffd7-5fa6-9c2b-a6d7543fe7eb','0a489b23-3281-5aed-b3ff-804492121ee5','59f20e23-5a51-5002-af7f-7ddaf4c2346d','d9bc8803-9c21-5af5-9e1d-42b519ad89f9','Kavita, please get fasting blood work done before our next visit.','text',0,'2026-05-28 14:30:00'),
('0bd39f05-204b-5a21-8968-ed52a6bf2920','7255e49b-5f6e-544d-8ef2-3dedd546ad46','452d0ca6-ae39-56c1-a87d-800902d420c5','db6d3c61-44b7-5bda-9470-eeaec2facac8','Dr. Desai, I felt the baby moving more today. Is that normal at 22 weeks?','text',0,'2026-05-30 20:00:00');

-- VIDEO_CONSULTATIONS
INSERT INTO `video_consultations` (`id`,`appointment_id`,`doctor_id`,`patient_id`,`room_id`,`status`,`notes`) VALUES
('0be611cf-07ac-58c5-8ce2-68b289c657a0','9462f15b-e6cc-56ae-8f1a-81526a422c56',6,'e6147795-11e7-5e06-927e-c47e140ea4dd','room-jessica-skin-0605','scheduled',NULL);

-- WOMEN_MENSTRUAL_CYCLES
INSERT INTO `women_menstrual_cycles` (`user_id`,`start_date`,`end_date`,`cycle_length`,`period_length`,`flow_intensity`,`is_regular`,`symptoms`,`mood`,`notes`,`next_period_date`,`ovulation_date`,`fertile_window_start`,`fertile_window_end`,`reminder_enabled`) VALUES
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','2026-04-28','2026-05-02',28,5,'medium',1,'["Mild Cramps","Bloating"]','Stable',NULL,'2026-05-26','2026-05-12','2026-05-09','2026-05-14',1),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','2026-05-10',NULL,30,4,'light',1,'["Mild Fatigue"]','Good','Currently pregnant - no cycle',NULL,NULL,NULL,NULL,0),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','2026-05-20','2026-05-24',32,5,'medium',0,'["Cramps","Headache","Fatigue"]','Irritable','Irregular cycles due to thyroid','2026-06-21','2026-06-07','2026-06-04','2026-06-09',1);

-- WOMEN_PREGNANCIES
INSERT INTO `women_pregnancies` (`id`,`user_id`,`lmp_date`,`estimated_due_date`,`current_week`,`current_trimester`,`pregnancy_number`,`is_first_pregnancy`,`high_risk`,`risk_notes`,`assigned_doctor_id`,`baby_gender`,`baby_name`,`status`,`delivery_date`,`delivery_type`) VALUES
(1,'f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','2025-11-15','2026-08-22',28,'third',2,0,0,NULL,3,'girl',NULL,'active',NULL,NULL),
(2,'7255e49b-5f6e-544d-8ef2-3dedd546ad46','2025-12-20','2026-09-25',22,'second',1,1,1,'History of preeclampsia in family',3,'unknown',NULL,'active',NULL,NULL);

-- WOMEN_PREGNANCY_TRACKING
INSERT INTO `women_pregnancy_tracking` (`pregnancy_id`,`week_number`,`weight_kg`,`blood_pressure_systolic`,`blood_pressure_diastolic`,`blood_sugar`,`blood_sugar_type`,`hemoglobin`,`fetal_movement_count`,`symptoms`,`notes`,`recorded_at`) VALUES
(1,28,72.0,118,76,95.0,'fasting',12.1,10,'["Mild Back Pain"]','All vitals normal','2026-05-20'),
(1,24,70.0,115,74,88.0,'fasting',12.5,8,'["Heartburn"]','Growth on track','2026-04-22'),
(2,22,64.0,122,80,102.0,'post-meal',11.8,6,'["Fatigue","Mild Swelling"]','Monitoring closely for preeclampsia','2026-05-28'),
(2,18,62.0,118,78,90.0,'fasting',12.2,4,'["Morning Sickness"]','Second trimester improvement','2026-04-30');

-- BABY_PROFILES
INSERT INTO `baby_profiles` (`mother_id`,`baby_name`,`date_of_birth`,`gender`,`blood_group`,`pregnancy_id`) VALUES
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','Emma Martinez','2024-03-15','girl','O+',1);

-- BABY_VACCINE_RECORDS
INSERT INTO `baby_vaccine_records` (`baby_id`,`vaccine_name`,`disease`,`dose_number`,`scheduled_date`,`administered_date`,`administered_by`,`hospital_name`,`status`,`next_dose_date`) VALUES
(1,'BCG','Tuberculosis',1,'2024-03-15','2024-03-15','Dr. Meera Patel','City General Hospital','completed','2026-03-15'),
(1,'Hepatitis B','Hepatitis B',1,'2024-03-15','2024-03-15','Dr. Meera Patel','City General Hospital','completed',NULL),
(1,'OPV','Polio',1,'2024-04-15','2024-04-15','Dr. Meera Patel','City General Hospital','completed','2024-06-15'),
(1,'DPT','Diphtheria, Pertussis, Tetanus',1,'2024-06-15','2024-06-15','Dr. Meera Patel','City General Hospital','completed','2024-10-15'),
(1,'MMR','Measles, Mumps, Rubella',1,'2025-03-15','2025-03-15','Dr. Meera Patel','City General Hospital','completed',NULL);

-- BABY_GROWTH_RECORDS
INSERT INTO `baby_growth_records` (`baby_id`,`record_date`,`age_months`,`weight_kg`,`height_cm`,`head_circumference_cm`,`bmi`) VALUES
(1,'2024-04-15',1,4.2,54.5,37.0,14.12),
(1,'2024-06-15',3,5.8,60.2,39.5,16.02),
(1,'2024-09-15',6,7.5,66.0,42.0,17.20),
(1,'2024-12-15',9,8.8,70.5,44.0,17.69),
(1,'2025-03-15',12,9.5,74.0,45.5,17.30),
(1,'2025-09-15',18,10.8,80.0,47.0,16.88),
(1,'2026-03-15',24,12.0,86.0,48.5,16.20);

-- DEVELOPMENT_MILESTONES
INSERT INTO `development_milestones` (`baby_id`,`category`,`name`,`expected_age_months`,`achieved_age_months`,`status`,`notes`) VALUES
(1,'physical','Held Head Up',2,2,'achieved','On track'),
(1,'physical','Rolled Over',4,4,'achieved','Both directions'),
(1,'physical','Sat Without Support',6,6,'achieved','Stable sitting'),
(1,'cognitive','First Smile',2,2,'achieved','Social smile'),
(1,'language','First Word',12,11,'achieved','Said mama'),
(1,'social','Waved Bye-Bye',10,10,'achieved','Responsive waving'),
(1,'physical','First Steps',12,13,'achieved','Walking independently'),
(1,'language','Two-Word Phrases',24,NULL,'pending','Working on it');

-- PREGNANCY_SYMPTOMS
INSERT INTO `pregnancy_symptoms` (`pregnancy_id`,`symptom_name`,`severity`,`start_date`,`end_date`,`notes`) VALUES
(1,'Heartburn','moderate','2026-04-01',NULL,'Worse after spicy food'),
(1,'Back Pain','mild','2026-05-01',NULL,'Third trimester onset'),
(2,'Morning Sickness','moderate','2026-01-20','2026-03-15','Resolved in second trimester'),
(2,'Fatigue','mild','2026-02-01',NULL,'Ongoing, manageable');

-- PREGNANCY_MEDICATIONS
INSERT INTO `pregnancy_medications` (`pregnancy_id`,`medicine_name`,`dosage`,`frequency`,`start_date`,`prescribed_by`,`purpose`,`is_safe`,`reminders`) VALUES
(1,'Prenatal Vitamins','1 tablet','Once daily','2025-11-15','Dr. Anita Desai','Nutritional support',1,0),
(1,'Iron Supplement','65mg','Once daily','2026-02-01','Dr. Anita Desai','Anemia prevention',1,0),
(2,'Prenatal Vitamins','1 tablet','Once daily','2025-12-20','Dr. Anita Desai','Nutritional support',1,1),
(2,'Low-Dose Aspirin','81mg','Once daily','2026-02-01','Dr. Anita Desai','Preeclampsia prevention',1,1);

-- WOMEN_PREGNANCY_ULTRASOUNDS
INSERT INTO `women_pregnancy_ultrasounds` (`pregnancy_id`,`week_number`,`ultrasound_date`,`type`,`findings`,`images`,`report_url`,`performed_by`) VALUES
(1,12,'2026-02-07','Dating Scan','Normal single intrauterine pregnancy, CRL consistent with dates','["/uploads/ultrasound/p1-12w.jpg"]','/uploads/ultrasound/p1-12w-report.pdf','Dr. Anita Desai'),
(1,20,'2026-04-05','Anomaly Scan','All fetal measurements normal, no structural anomalies detected','["/uploads/ultrasound/p1-20w.jpg"]','/uploads/ultrasound/p1-20w-report.pdf','Dr. Anita Desai'),
(2,12,'2026-03-14','Dating Scan','Normal single intrauterine pregnancy','["/uploads/ultrasound/p2-12w.jpg"]','/uploads/ultrasound/p2-12w-report.pdf','Dr. Anita Desai'),
(2,20,'2026-05-08','Anomaly Scan','Normal anatomy, growth on 50th centile','["/uploads/ultrasound/p2-20w.jpg"]','/uploads/ultrasound/p2-20w-report.pdf','Dr. Anita Desai');

-- GYNECOLOGIST_CONSULTATIONS
INSERT INTO `gynecologist_consultations` (`user_id`,`doctor_name`,`doctor_specialization`,`hospital_name`,`consultation_date`,`consultation_time`,`type`,`reason`,`diagnosis`,`prescription`,`follow_up_date`,`status`,`notes`) VALUES
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','Dr. Anita Desai','Gynecology','City General Hospital','2026-05-20','14:00:00','in-person','28-week prenatal checkup','Normal pregnancy progression','Continue prenatal vitamins and iron',NULL,'completed','All vitals normal'),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','Dr. Anita Desai','Gynecology','City General Hospital','2026-05-28','15:00:00','in-person','22-week prenatal checkup','High-risk pregnancy, monitoring closely','Continue low-dose aspirin and prenatal vitamins','2026-06-11','completed','BP slightly elevated, monitoring');

-- WOMEN_HEALTH_NOTIFICATIONS
INSERT INTO `women_health_notifications` (`user_id`,`type`,`title`,`message`,`priority`,`is_read`) VALUES
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','pregnancy','28-Week Milestone','You have reached 28 weeks! Third trimester begins. Time for glucose tolerance test.','medium',0),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','appointment','Upcoming Checkup','Your prenatal checkup with Dr. Desai is scheduled for June 11th.','high',0),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','health-tip','Pregnancy Nutrition','Increase iron-rich foods in your diet. Spinach, beans, and lean meat are great sources.','low',1),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','cycle','Period Expected','Your period is expected in 3 days based on your cycle tracking.','medium',0);

-- WELLNESS_TRACKING
INSERT INTO `wellness_tracking` (`user_id`,`tracking_type`,`record_date`,`metrics`,`notes`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','fitness','2026-05-28','{"steps":8500,"calories":2200,"active_minutes":45,"distance_km":6.2}','Good day, hit step goal'),
('84e818cd-f344-5ad8-9b9a-82be450cbd13','mental-health','2026-05-28','{"mood_score":8,"stress_level":"low","meditation_minutes":15}','Feeling positive'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','nutrition','2026-05-28','{"calories":1800,"protein_g":85,"carbs_g":200,"fat_g":55,"water_glasses":8}','Staying within diabetic meal plan'),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','fitness','2026-05-27','{"steps":12000,"calories":2800,"active_minutes":90,"distance_km":8.5}','Intense workout day'),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','fitness','2026-05-28','{"steps":15000,"calories":3200,"active_minutes":120,"distance_km":10.5}','Personal training session'),
('89c54d30-0980-59f7-a561-f20ba21fa925','mental-health','2026-05-27','{"mood_score":6,"stress_level":"moderate","meditation_minutes":20}','Therapy session helped'),
('aa536c99-b7e7-5f30-897a-c0e586d834de','sleep','2026-05-28','{"sleep_hours":7.5,"sleep_quality":"good","bedtime":"22:30","wakeup":"06:00"}','Used inhaler before bed');

-- HEALTH_RECOMMENDATIONS
INSERT INTO `health_recommendations` (`patient_id`,`type`,`title`,`description`,`priority`,`category`,`is_read`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','food','Increase Omega-3 Intake','Add fatty fish like salmon to your diet 2-3 times per week for heart health.','medium','recommend',0),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','food','Reduce Sodium Intake','Limit salt to less than 2300mg per day. Use herbs and spices instead.','high','recommend',1),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','exercise','Daily Walking','30 minutes of moderate walking can significantly improve blood sugar control.','medium','recommend',0),
('59f20e23-5a51-5002-af7f-7ddaf4c2346d','lifestyle','Regular Thyroid Testing','Get TSH levels checked every 6-8 weeks to ensure medication dosage is correct.','high','recommend',0),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','food','Iron-Rich Foods','Increase iron intake with spinach, lentils, and lean meat during pregnancy.','medium','recommend',0),
('aa536c99-b7e7-5f30-897a-c0e586d834de','warning','Avoid Allergen Exposure','Minimize exposure to pollen and latex to prevent asthma triggers.','high','avoid',1);

-- EMERGENCY_ANNOUNCEMENTS
INSERT INTO `emergency_announcements` (`title`,`message`,`type`,`priority`,`target_audience`,`created_by`,`expires_at`,`is_active`) VALUES
('Blood Drive This Weekend','City General Hospital is hosting a blood drive this Saturday. Walk-ins welcome!','blood-camp','medium','public','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-06-16 23:59:59',1),
('Flu Season Advisory','Flu season is here. Get your flu shot at any participating pharmacy.','awareness','low','all','8e04675f-927d-5de9-9ea5-062d18510c48','2026-12-31 23:59:59',1),
('Emergency Services Update','All emergency services are currently operational. Average response time: 12 minutes.','general','medium','all','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-07-01 23:59:59',1);

-- HOSPITAL_ACTIVITIES
INSERT INTO `hospital_activities` (`hospital_id`,`type`,`description`,`department`,`user_name`,`created_at`) VALUES
('21084c3f-61b9-53c2-b259-a307ae428d38','admission','New patient admitted to Cardiology ward','Cardiology','Aarav Sharma','2026-05-28 08:00:00'),
('21084c3f-61b9-53c2-b259-a307ae428d38','emergency','Emergency ambulance dispatched','Emergency',NULL,'2026-05-28 14:30:00'),
('21084c3f-61b9-53c2-b259-a307ae428d38','discharge','Patient discharged from Orthopedics','Orthopedics','Rohan Patel','2026-05-27 10:00:00'),
('90d3182d-2285-5829-8c04-238ac032a327','surgery','Knee arthroscopy completed','Orthopedics','Rohan Patel','2026-05-20 09:00:00'),
('51ee9186-b9a5-503e-8dc0-71afcd63eaf7','blood','Blood donation camp completed','Blood Bank','Maria Garcia','2026-05-20 16:00:00');

-- FEEDBACK
INSERT INTO `feedback` (`user_id`,`user_name`,`user_role`,`type`,`subject`,`message`,`rating`,`status`,`priority`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','Aarav Sharma','patient','review','Great Appointment Experience','Dr. Mitchell was very thorough and explained everything clearly. Highly recommended!',5,'reviewed','low'),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','Rohan Patel','patient','suggestion','Add Video Consultation Feature','It would be great to have video consultation options for follow-up appointments.',NULL,'pending','medium'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','Amit Kumar','patient','complaint','Long Wait Time','I waited over 45 minutes beyond my scheduled appointment time.',2,'reviewed','medium'),
('aa536c99-b7e7-5f30-897a-c0e586d834de','Emily Davis','patient','review','Excellent Prenatal Care','Dr. Desai is amazing. Very caring and professional throughout my pregnancy.',5,'reviewed','low'),
('5c1032f2-ab89-5387-aba1-a7a55cb764fd','Rahul Joshi','blood_donor','suggestion','Blood Donation Scheduling','Would love to see a feature for scheduling recurring donations.',NULL,'pending','low');

-- USER_REVIEWS
INSERT INTO `user_reviews` (`reviewer_id`,`reviewable_type`,`reviewable_id`,`rating`,`title`,`review_text`,`is_verified`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','doctor','1',5,'Excellent Cardiologist','Dr. Mitchell is incredibly knowledgeable and patient. She took the time to answer all my questions.',1),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','doctor','1',4,'Good Doctor, Long Wait','Dr. Mitchell is great but the wait time can be quite long. Otherwise excellent care.',1),
('aa536c99-b7e7-5f30-897a-c0e586d834de','doctor','3',5,'Best Gynecologist','Dr. Desai made me feel comfortable throughout my pregnancy. Highly recommend!',1),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','doctor','2',5,'Expert Orthopedic Surgeon','Dr. Wilson did my ACL surgery. Recovery is going great!',1),
('84e818cd-f344-5ad8-9b9a-82be450cbd13','hospital','21084c3f-61b9-53c2-b259-a307ae428d38',4,'Good Hospital, Clean Facilities','City General Hospital has excellent facilities. The staff is friendly and professional.',1),
('1802faf0-b4ed-55bf-8dc2-84a221e5c6ff','hospital','21084c3f-61b9-53c2-b259-a307ae428d38',5,'Great Pediatric Department','The pediatric team is wonderful. My child loves visiting Dr. Patel.',1),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','pharmacy','8d1505e6-a115-5642-bc97-00d000192241',4,'Quick Delivery','HealthPlus Pharmacy delivers medicines quickly. Good service overall.',1);

-- USER_DOCUMENTS
INSERT INTO `user_documents` (`user_id`,`document_type`,`name`,`file_url`,`file_type`,`file_size`,`is_verified`,`verified_by`) VALUES
('9f3305dc-31e4-5ed4-a1b7-079368c00b20','license','Medical License - Sarah Mitchell','/uploads/docs/md-license-mitchell.pdf','pdf',245000,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b'),
('8e9f258c-2b51-5f32-b979-9cf56275b17e','license','Medical License - James Wilson','/uploads/docs/md-license-wilson.pdf','pdf',230000,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b'),
('452d0ca6-ae39-56c1-a87d-800902d420c5','license','Medical License - Anita Desai','/uploads/docs/md-license-desai.pdf','pdf',255000,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b'),
('5c1032f2-ab89-5387-aba1-a7a55cb764fd','donation-certificate','Blood Donation Certificate','/uploads/docs/bd-cert-joshi.pdf','pdf',120000,1,'e4dea08c-0e25-5f6d-bccd-c79a07c6324b'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','id-proof','Insurance Card','/uploads/docs/insurance-kumar.jpg','jpg',85000,0,NULL);

-- VERIFICATION_REQUESTS
INSERT INTO `verification_requests` (`entity_type`,`entity_id`,`entity_name`,`documents`,`status`,`submitted_date`,`reviewed_by`,`reviewed_date`) VALUES
('doctor','1','Dr. Sarah Mitchell','[{"type":"license","name":"medical_license.pdf","fileUrl":"/uploads/docs/md-license-mitchell.pdf","verified":true}]','approved','2026-01-20 10:00:00','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00'),
('doctor','2','Dr. James Wilson','[{"type":"license","name":"medical_license.pdf","fileUrl":"/uploads/docs/md-license-wilson.pdf","verified":true}]','approved','2026-01-20 10:00:00','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00'),
('hospital','21084c3f-61b9-53c2-b259-a307ae428d38','City General Hospital','[{"type":"registration","name":"hospital_registration.pdf","fileUrl":"/uploads/docs/hosp-reg.pdf","verified":true}]','approved','2026-01-15 10:00:00','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00'),
('pharmacy','8d1505e6-a115-5642-bc97-00d000192241','HealthPlus Pharmacy','[{"type":"license","name":"pharmacy_license.pdf","fileUrl":"/uploads/docs/pharm-license.pdf","verified":true}]','approved','2026-01-18 10:00:00','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-01 10:00:00'),
('blood_donor','5c1032f2-ab89-5387-aba1-a7a55cb764fd','Rahul Joshi','[{"type":"id-proof","name":"donor_id.pdf","fileUrl":"/uploads/docs/donor-id.pdf","verified":true}]','approved','2026-02-01 10:00:00','8e04675f-927d-5de9-9ea5-062d18510c48','2026-02-05 10:00:00');

-- USER_ROLE_UPGRADES
INSERT INTO `user_role_upgrades` (`user_id`,`upgrade_type`,`status`,`requested_at`,`reviewed_by`,`reviewed_at`) VALUES
('5c1032f2-ab89-5387-aba1-a7a55cb764fd','blood_donor','approved','2026-01-28 10:00:00','8e04675f-927d-5de9-9ea5-062d18510c48','2026-02-05 10:00:00'),
('363b68fc-93b2-5e09-b3e5-2c371526fdf8','emergency_volunteer','approved','2026-02-10 10:00:00','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-02-15 10:00:00'),
('5787eeb5-429c-5b88-af60-b603af678d92','client','approved','2026-02-20 10:00:00','8e04675f-927d-5de9-9ea5-062d18510c48','2026-02-25 10:00:00'),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','client_patient','pending','2026-05-01 10:00:00',NULL,NULL);

-- STOCK_ALERTS
INSERT INTO `stock_alerts` (`pharmacy_id`,`inventory_id`,`medicine_name`,`current_stock`,`min_stock`,`status`,`is_read`) VALUES
('8d1505e6-a115-5642-bc97-00d000192241',4,'Omeprazole 20mg',15,40,'low',0),
('8d1505e6-a115-5642-bc97-00d000192241',8,'Pantoprazole 40mg',8,40,'critical',0),
('e250ae4b-d0fb-5af0-ac98-4f55bedae2f0',11,'Azithromycin 250mg',12,30,'low',1);

-- SEARCH_LOGS
INSERT INTO `search_logs` (`user_id`,`query`,`search_type`,`results_count`,`created_at`) VALUES
('84e818cd-f344-5ad8-9b9a-82be450cbd13','cardiologist near me','doctor',5,'2026-05-28 09:00:00'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','diabetes doctor Houston','doctor',3,'2026-05-25 14:00:00'),
('8facd827-1b00-52b3-bc84-e1cd5d8fd5bb','orthopedic surgeon','doctor',4,'2026-05-20 10:00:00'),
('7255e49b-5f6e-544d-8ef2-3dedd546ad46','gynecologist pregnancy','doctor',6,'2026-03-05 08:00:00'),
('aa536c99-b7e7-5f30-897a-c0e586d834de','pharmacy delivery','pharmacy',2,'2026-05-10 15:00:00'),
(NULL,'hospital emergency room','hospital',3,'2026-05-30 22:00:00'),
('f0b17a8e-8055-5cd1-b465-4cf38a5e0d51','prenatal vitamins','medicine',8,'2026-05-15 11:00:00'),
('5c1032f2-ab89-5387-aba1-a7a55cb764fd','blood donation center','blood-donor',4,'2026-05-25 09:00:00');

-- AUDIT_LOGS
INSERT INTO `audit_logs` (`user_id`,`action`,`entity_type`,`entity_id`,`ip_address`,`created_at`) VALUES
('e4dea08c-0e25-5f6d-bccd-c79a07c6324b','user.login','user','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','192.168.1.1','2026-05-28 09:00:00'),
('8e04675f-927d-5de9-9ea5-062d18510c48','appointment.create','appointment','616f4f07-c17a-5c5c-a27c-6113a190f20b','192.168.1.2','2026-05-28 09:05:00'),
('9f3305dc-31e4-5ed4-a1b7-079368c00b20','prescription.write','prescription','7a6a6889-2773-5ad2-9288-9135d40766eb','192.168.1.3','2026-05-15 09:20:00'),
('84e818cd-f344-5ad8-9b9a-82be450cbd13','appointment.book','appointment','616f4f07-c17a-5c5c-a27c-6113a190f20b','192.168.1.10','2026-05-28 09:00:00'),
('e4dea08c-0e25-5f6d-bccd-c79a07c6324b','hospital.verify','hospital','21084c3f-61b9-53c2-b259-a307ae428d38','192.168.1.1','2026-02-01 10:00:00'),
('fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','order.place','medicine_order','e4cf2ee4-aed8-5249-be44-299d0005a9e5','192.168.1.15','2026-05-20 10:00:00');

-- SECURITY_LOGS
INSERT INTO `security_logs` (`event`,`user_id`,`user_name`,`ip_address`,`status`,`details`,`created_at`) VALUES
('login.success','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','Rajesh Kumar','192.168.1.1','success','Admin login from trusted IP','2026-05-28 09:00:00'),
('login.success','84e818cd-f344-5ad8-9b9a-82be450cbd13','Aarav Sharma','192.168.1.10','success','Patient login','2026-05-28 07:00:00'),
('login.failed',NULL,'unknown','10.0.0.99','failed','Invalid credentials for admin@aetherion.health','2026-05-27 03:00:00'),
('password.change','aa536c99-b7e7-5f30-897a-c0e586d834de','Emily Davis','192.168.1.20','success','Password changed successfully','2026-05-15 14:00:00'),
('api.rate_limit',NULL,'unknown','10.0.0.50','blocked','Rate limit exceeded: 100 requests/minute','2026-05-26 22:00:00');

-- SCHEDULED_MEETINGS
INSERT INTO `scheduled_meetings` (`title`,`description`,`organizer_id`,`meeting_date`,`start_time`,`end_time`,`meeting_url`,`status`,`participants`) VALUES
('Weekly Medical Staff Review','Review patient cases and department updates','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-06-02','09:00:00','10:00:00','https://meet.aetherion.health/weekly-review','scheduled','["1","2","3","4","5"]'),
('Emergency Protocol Update','Updated emergency response procedures','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','2026-06-05','14:00:00','15:00:00','https://meet.aetherion.health/emergency-protocol','scheduled','["1","4","7"]'),
('Pharmacy Stock Review','Monthly inventory and stock audit meeting','21367ea7-f277-5a17-8ce5-d714929f3802','2026-06-03','11:00:00','12:00:00','https://meet.aetherion.health/pharmacy-stock','scheduled','["1","2"]');

-- SYSTEM_HEALTH
INSERT INTO `system_health` (`status`,`cpu_usage`,`memory_usage`,`disk_usage`,`active_connections`,`response_time_ms`) VALUES
('healthy',23.5,45.2,38.7,42,85),
('healthy',18.2,42.1,38.7,38,72),
('healthy',35.8,51.3,38.8,55,120),
('degraded',72.4,78.9,39.1,120,450),
('healthy',25.1,47.5,38.7,40,90);

-- SYSTEM_REPORTS
INSERT INTO `system_reports` (`title`,`type`,`generated_by`,`parameters`,`format`,`download_url`,`file_size`) VALUES
('Monthly User Activity Report - May 2026','user','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','{"month":"2026-05"}','pdf','/uploads/reports/users-may-2026.pdf','2.4 MB'),
('Doctor Performance Q1 2026','doctor','8e04675f-927d-5de9-9ea5-062d18510c48','{"quarter":"Q1-2026"}','excel','/uploads/reports/doctors-q1-2026.xlsx','1.8 MB'),
('Hospital Utilization Report','hospital','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','{"period":"2026-05"}','pdf','/uploads/reports/hospital-utilization-may-2026.pdf','3.1 MB'),
('Blood Donation Statistics 2026','donation','8e04675f-927d-5de9-9ea5-062d18510c48','{"year":"2026"}','csv','/uploads/reports/blood-donation-2026.csv','0.5 MB');

-- USER_SESSIONS
INSERT INTO `user_sessions` (`id`,`user_id`,`refresh_token`,`device_type`,`user_agent`,`ip_address`,`is_active`,`expires_at`,`last_activity_at`) VALUES
('9483f12e-25a0-5472-ad91-b55b35598e8e','84e818cd-f344-5ad8-9b9a-82be450cbd13','rt_aarav_20260528','web','Mozilla/5.0 Chrome/125.0','192.168.1.10',1,'2026-06-04 07:00:00','2026-05-28 07:00:00'),
('49a6797e-877c-51c6-aeef-76564bf031a3','9f3305dc-31e4-5ed4-a1b7-079368c00b20','rt_sarah_20260528','web','Mozilla/5.0 Chrome/125.0','192.168.1.3',1,'2026-06-04 08:15:00','2026-05-30 08:15:00'),
('975afadd-66b6-5ce2-a740-b89120a17302','e4dea08c-0e25-5f6d-bccd-c79a07c6324b','rt_rajesh_20260528','desktop','Mozilla/5.0 Firefox/126.0','192.168.1.1',1,'2026-06-04 09:30:00','2026-05-28 09:30:00'),
('1a8c7b26-090f-514f-9357-699183c19c3b','fd8b5b6b-0caa-5db3-894f-e0c96cc83a26','rt_amit_20260527','android','AetherionHealth/2.0 Android/14','192.168.1.15',1,'2026-06-03 10:00:00','2026-05-27 10:00:00');

-- PASSWORD_RESETS
INSERT INTO `password_resets` (`email`,`token`,`is_used`,`expires_at`) VALUES
('emily.davis@email.com','tok_emily_reset_001',1,'2026-05-16 14:00:00'),
('thomas.anderson@email.com','tok_thomas_reset_001',0,'2026-06-01 00:00:00');

-- INSURANCE_CLAIMS
INSERT INTO `insurance_claims` (`invoice_id`,`provider`,`policy_number`,`claim_amount`,`approved_amount`,`status`,`submitted_date`,`processed_date`) VALUES
('8745215e-c85c-554c-8d93-e7072e407469','Cigna','CG-2024-67890',327.00,261.60,'approved','2026-05-20 08:15:00','2026-05-22 10:00:00');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Seed data insertion complete!
-- Total tables populated: 60+
-- ============================================