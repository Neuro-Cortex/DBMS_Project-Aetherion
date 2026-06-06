"""Generate realistic seed data SQL for Aetherion Healthcare database.
Uses named variables in f-strings (not tuple indexing) to avoid index-out-of-range errors.
"""
import uuid, os

NAMESPACE = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')

def U(seed):
    return str(uuid.uuid5(NAMESPACE, seed))

PWD = "$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi"
H1 = U("hospital_city_general")
H2 = U("hospital_metro_medical")
H3 = U("hospital_sunrise_specialty")
P1 = U("pharmacy_health_plus")
P2 = U("pharmacy_medicare_express")

# ─── Users (deterministic UUIDs) ───
U_SA  = U("user_super_admin")
U_AD  = U("user_admin")
U_MO  = U("user_moderator")
U_D1  = U("user_doctor_1")
U_D2  = U("user_doctor_2")
U_D3  = U("user_doctor_3")
U_D4  = U("user_doctor_4")
U_D5  = U("user_doctor_5")
U_D6  = U("user_doctor_6")
U_D7  = U("user_doctor_7")
U_D8  = U("user_doctor_8")
U_HA1 = U("user_hosp_admin_1")
U_HA2 = U("user_hosp_admin_2")
U_HA3 = U("user_hosp_admin_3")
U_PA1 = U("user_pharm_admin_1")
U_PA2 = U("user_pharm_admin_2")
U_P1  = U("user_patient_1")
U_P2  = U("user_patient_2")
U_P3  = U("user_patient_3")
U_P4  = U("user_patient_4")
U_P5  = U("user_patient_5")
U_P6  = U("user_patient_6")
U_P7  = U("user_patient_7")
U_P8  = U("user_patient_8")
U_P9  = U("user_patient_9")
U_P10 = U("user_patient_10")
U_BD1 = U("user_blood_donor_1")
U_BD2 = U("user_blood_donor_2")
U_BD3 = U("user_blood_donor_3")
U_BD4 = U("user_blood_donor_4")
U_BD5 = U("user_blood_donor_5")
U_EV1 = U("user_emergency_vol_1")
U_CL1 = U("user_client_1")
U_CL2 = U("user_client_2")

out = []
def Q(s): out.append(s)

def qstr(v):
    """Quote a string value for SQL, or return NULL if None."""
    if v is None or v == '':
        return 'NULL'
    return f"'{v}'"

def qnum(v):
    """Return numeric SQL value or NULL."""
    if v is None:
        return 'NULL'
    return str(v)

def qts(v):
    """Return timestamp string or NULL."""
    if v is None:
        return 'NULL'
    return f"'{v}'"

Q("-- ============================================")
Q("-- AETHERION HEALTHCARE - Realistic Seed Data")
Q("-- Database: aethion_bd")
Q("-- ============================================")
Q("SET FOREIGN_KEY_CHECKS = 0;")
Q("")
Q("-- Clear existing data in reverse FK order to avoid constraint issues")
Q("DELETE FROM `insurance_claims`; DELETE FROM `password_resets`; DELETE FROM `user_sessions`; DELETE FROM `system_reports`; DELETE FROM `system_health`;")
Q("DELETE FROM `scheduled_meetings`; DELETE FROM `security_logs`; DELETE FROM `audit_logs`; DELETE FROM `search_logs`; DELETE FROM `stock_alerts`;")
Q("DELETE FROM `user_role_upgrades`; DELETE FROM `verification_requests`; DELETE FROM `user_documents`; DELETE FROM `user_reviews`; DELETE FROM `feedback`;")
Q("DELETE FROM `hospital_activities`; DELETE FROM `emergency_announcements`; DELETE FROM `health_recommendations`; DELETE FROM `wellness_tracking`;")
Q("DELETE FROM `women_health_notifications`; DELETE FROM `gynecologist_consultations`; DELETE FROM `women_pregnancy_ultrasounds`;")
Q("DELETE FROM `pregnancy_medications`; DELETE FROM `pregnancy_symptoms`; DELETE FROM `development_milestones`; DELETE FROM `baby_growth_records`;")
Q("DELETE FROM `baby_vaccine_records`; DELETE FROM `baby_profiles`; DELETE FROM `women_pregnancy_tracking`; DELETE FROM `women_pregnancies`;")
Q("DELETE FROM `women_menstrual_cycles`; DELETE FROM `video_consultations`; DELETE FROM `messages`; DELETE FROM `doctor_earnings`;")
Q("DELETE FROM `doctor_activities`; DELETE FROM `doctor_notifications`; DELETE FROM `notifications`; DELETE FROM `ai_voice_sessions`;")
Q("DELETE FROM `ai_messages`; DELETE FROM `ai_conversations`; DELETE FROM `oxygen_requests`; DELETE FROM `emergency_services`;")
Q("DELETE FROM `ambulance_requests`; DELETE FROM `billing_invoices`; DELETE FROM `medicine_reminders`; DELETE FROM `order_items`;")
Q("DELETE FROM `medicine_orders`; DELETE FROM `patient_health_records`; DELETE FROM `patient_surgeries`; DELETE FROM `patient_medications`;")
Q("DELETE FROM `patient_vaccinations`; DELETE FROM `patient_family_history`; DELETE FROM `patient_medical_history`; DELETE FROM `prescription_tests`;")
Q("DELETE FROM `prescription_items`; DELETE FROM `prescriptions`; DELETE FROM `appointments`; DELETE FROM `doctor_patients`;")
Q("DELETE FROM `doctor_availability`; DELETE FROM `donor_rewards`; DELETE FROM `blood_donation_camps`; DELETE FROM `blood_requests`;")
Q("DELETE FROM `blood_donations`; DELETE FROM `blood_donors`; DELETE FROM `pharmacy_inventory`; DELETE FROM `pharmacies`;")
Q("DELETE FROM `hospital_oxygen_stock`; DELETE FROM `hospital_blood_stocks`; DELETE FROM `hospital_blood_bank`;")
Q("DELETE FROM `hospital_ambulances`; DELETE FROM `hospital_beds`; DELETE FROM `hospital_doctors`; DELETE FROM `hospital_departments`;")
Q("DELETE FROM `hospitals`; DELETE FROM `doctor_profiles`; DELETE FROM `user_notification_settings`; DELETE FROM `user_preferences`;")
Q("DELETE FROM `user_emergency_contacts`; DELETE FROM `user_addresses`; DELETE FROM `user_profiles`; DELETE FROM `admin_users`;")
Q("DELETE FROM `user_roles`; DELETE FROM `users`; DELETE FROM `roles`;")
Q("")

# ====================================================================
# ROLES
# ====================================================================
Q("-- ROLES")
Q("""INSERT INTO `roles` (`id`,`name`,`display_name`,`description`,`is_system_role`,`priority`) VALUES
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
(15,'normal_user','Normal User','Basic user',1,5);""")
Q("")

# ====================================================================
# USERS
# ====================================================================
Q("-- USERS")
users_rows = []
# super_admin
uid = U_SA; email="rajesh.kumar@aetherion.health"; phone="+1-555-0101"
name="Rajesh Kumar"; fname="Rajesh"; lname="Kumar"; gender="male"; dob="1975-03-15"
bg="O+"; rid=1; v=1; act=1; appr=1; onl=1; ev="2026-01-01 00:00:00"
ll="2026-05-28 09:30:00"; ca="2026-01-01 00:00:00"; ua="2026-05-28 09:30:00"
users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',{rid},{v},{act},{appr},{onl},'{ev}','{ll}','{ca}','{ua}')")

# admin
uid=U_AD; email="priya.sharma@aetherion.health"; phone="+1-555-0102"
name="Priya Sharma"; fname="Priya"; lname="Sharma"; gender="female"; dob="1985-07-22"
bg="A+"; rid=2; ev="2026-01-05 00:00:00"; ll="2026-05-27 14:00:00"; ca="2026-01-05 00:00:00"; ua="2026-05-27 14:00:00"
users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',{rid},{v},{act},{appr},{onl},'{ev}','{ll}','{ca}','{ua}')")

# moderator
uid=U_MO; email="anil.verma@aetherion.health"; phone="+1-555-0103"
name="Anil Verma"; fname="Anil"; lname="Verma"; gender="male"; dob="1990-11-08"
bg="B+"; rid=3; onl=0; ev="2026-01-10 00:00:00"; ll="2026-05-26 11:00:00"; ca="2026-01-10 00:00:00"; ua="2026-05-26 11:00:00"
users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',{rid},{v},{act},{appr},{onl},'{ev}','{ll}','{ca}','{ua}')")

# Doctors
docs_info = [
    (U_D1,"sarah.mitchell@aetherion.health","+1-555-0201","Dr. Sarah Mitchell","Sarah","Mitchell","female","1982-04-18","O-","2026-01-15 00:00:00","2026-05-30 08:15:00"),
    (U_D2,"james.wilson@aetherion.health","+1-555-0202","Dr. James Wilson","James","Wilson","male","1978-09-25","AB+","2026-01-15 00:00:00","2026-05-29 16:45:00"),
    (U_D3,"anita.desai@aetherion.health","+1-555-0203","Dr. Anita Desai","Anita","Desai","female","1986-01-12","A-","2026-02-01 00:00:00","2026-05-30 10:00:00"),
    (U_D4,"robert.chen@aetherion.health","+1-555-0204","Dr. Robert Chen","Robert","Chen","male","1974-06-30","B-","2026-02-01 00:00:00","2026-05-28 09:00:00"),
    (U_D5,"meera.patel@aetherion.health","+1-555-0205","Dr. Meera Patel","Meera","Patel","female","1988-12-05","O+","2026-02-15 00:00:00","2026-05-30 07:30:00"),
    (U_D6,"david.brown@aetherion.health","+1-555-0206","Dr. David Brown","David","Brown","male","1980-08-14","A+","2026-03-01 00:00:00","2026-05-27 13:00:00"),
    (U_D7,"fatima.khan@aetherion.health","+1-555-0207","Dr. Fatima Khan","Fatima","Khan","female","1983-02-28","B+","2026-03-01 00:00:00","2026-05-29 11:00:00"),
    (U_D8,"michael.lee@aetherion.health","+1-555-0208","Dr. Michael Lee","Michael","Lee","male","1976-10-20","O-","2026-03-15 00:00:00","2026-05-30 09:00:00"),
]
for uid,email,phone,name,fname,lname,gender,dob,bg,ev_ca,ll in docs_info:
    users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',4,1,1,1,1,'{ev_ca}','{ll}','{ev_ca}','{ll}')")

# Hospital admins
hosp_admins = [
    (U_HA1,"vikram.singh@aetherion.health","+1-555-0301","Vikram Singh","Vikram","Singh","male","1972-05-10","AB-","2026-01-10 00:00:00","2026-05-30 10:00:00"),
    (U_HA2,"diana.ross@aetherion.health","+1-555-0302","Diana Ross","Diana","Ross","female","1984-03-17","A+","2026-02-01 00:00:00","2026-05-29 09:00:00"),
    (U_HA3,"arjun.mehta@aetherion.health","+1-555-0303","Arjun Mehta","Arjun","Mehta","male","1979-07-08","B+","2026-02-15 00:00:00","2026-05-28 14:00:00"),
]
for uid,email,phone,name,fname,lname,gender,dob,bg,ev_ca,ll in hosp_admins:
    users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',6,1,1,1,1,'{ev_ca}','{ll}','{ev_ca}','{ll}')")

# Pharmacy admins
pharm_admins = [
    (U_PA1,"rakesh.gupta@aetherion.health","+1-555-0401","Rakesh Gupta","Rakesh","Gupta","male","1977-11-22","O+","2026-01-20 00:00:00","2026-05-30 08:00:00"),
    (U_PA2,"linda.johnson@aetherion.health","+1-555-0402","Linda Johnson","Linda","Johnson","female","1981-09-14","AB+","2026-02-01 00:00:00","2026-05-29 15:00:00"),
]
for uid,email,phone,name,fname,lname,gender,dob,bg,ev_ca,ll in pharm_admins:
    users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',9,1,1,1,1,'{ev_ca}','{ll}','{ev_ca}','{ll}')")

# Patients
patients = [
    (U_P1,"aarav.sharma@email.com","+1-555-0501","Aarav Sharma","Aarav","Sharma","male","1995-06-20","B+","2026-01-20 00:00:00","2026-05-30 07:00:00"),
    (U_P2,"emily.davis@email.com","+1-555-0502","Emily Davis","Emily","Davis","female","1992-03-15","O-","2026-01-25 00:00:00","2026-05-29 18:00:00"),
    (U_P3,"rohan.patel@email.com","+1-555-0503","Rohan Patel","Rohan","Patel","male","1998-08-12","A+","2026-02-01 00:00:00","2026-05-30 12:00:00"),
    (U_P4,"sophia.martinez@email.com","+1-555-0504","Sophia Martinez","Sophia","Martinez","female","1990-11-05","AB+","2026-02-10 00:00:00","2026-05-28 20:00:00"),
    (U_P5,"amit.kumar@email.com","+1-555-0505","Amit Kumar","Amit","Kumar","male","1993-04-28","O+","2026-02-15 00:00:00","2026-05-27 10:00:00"),
    (U_P6,"jessica.taylor@email.com","+1-555-0506","Jessica Taylor","Jessica","Taylor","female","1996-01-19","B-","2026-03-01 00:00:00","2026-05-30 06:00:00"),
    (U_P7,"neha.singh@email.com","+1-555-0507","Neha Singh","Neha","Singh","female","1994-07-30","A+","2026-03-05 00:00:00","2026-05-29 09:00:00"),
    (U_P8,"marcus.johnson@email.com","+1-555-0508","Marcus Johnson","Marcus","Johnson","male","1989-12-11","O+","2026-03-10 00:00:00","2026-05-28 16:00:00"),
    (U_P9,"kavita.reddy@email.com","+1-555-0509","Kavita Reddy","Kavita","Reddy","female","1997-05-22","B+","2026-03-15 00:00:00","2026-05-30 11:00:00"),
    (U_P10,"thomas.anderson@email.com","+1-555-0510","Thomas Anderson","Thomas","Anderson","male","1991-09-03","A-","2026-03-20 00:00:00","2026-05-27 22:00:00"),
]
for uid,email,phone,name,fname,lname,gender,dob,bg,ev_ca,ll in patients:
    users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',10,1,1,0,0,'{ev_ca}','{ll}','{ev_ca}','{ll}')")

# Blood donors
bd_info = [
    (U_BD1,"rahul.joshi@email.com","+1-555-0601","Rahul Joshi","Rahul","Joshi","male","1993-02-14","O+","2026-02-01 00:00:00","2026-05-25 10:00:00"),
    (U_BD2,"maria.garcia@email.com","+1-555-0602","Maria Garcia","Maria","Garcia","female","1987-06-25","A-","2026-02-10 00:00:00","2026-05-29 14:00:00"),
    (U_BD3,"suresh.babu@email.com","+1-555-0603","Suresh Babu","Suresh","Babu","male","1990-10-08","B+","2026-02-15 00:00:00","2026-05-20 08:00:00"),
    (U_BD4,"angela.white@email.com","+1-555-0604","Angela White","Angela","White","female","1985-04-19","AB-","2026-03-01 00:00:00","2026-05-15 12:00:00"),
    (U_BD5,"pradeep.nair@email.com","+1-555-0605","Pradeep Nair","Pradeep","Nair","male","1988-08-07","O+","2026-03-10 00:00:00","2026-05-22 09:00:00"),
]
for uid,email,phone,name,fname,lname,gender,dob,bg,ev_ca,ll in bd_info:
    users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',12,1,1,0,0,'{ev_ca}','{ll}','{ev_ca}','{ll}')")

# Emergency volunteer
users_rows.append(f"('{U_EV1}','captain.raj@email.com','+1-555-0701','{PWD}','Captain Raj','Captain','Raj','male','1980-03-22','A+',13,1,1,0,0,'2026-02-20 00:00:00','2026-05-28 07:00:00','2026-02-20 00:00:00','2026-05-28 07:00:00')")

# Clients
for uid,email,phone,name,fname,lname,gender,dob,bg,ev_ca,ll in [
    (U_CL1,"sunil.verma@corporate.com","+1-555-0801","Sunil Verma","Sunil","Verma","male","1975-12-01","B+","2026-03-01 00:00:00","2026-05-25 15:00:00"),
    (U_CL2,"karen.mitchell@corp.com","+1-555-0802","Karen Mitchell","Karen","Mitchell","female","1982-07-16","O+","2026-03-05 00:00:00","2026-05-29 10:00:00"),
]:
    users_rows.append(f"('{uid}','{email}','{phone}','{PWD}','{name}','{fname}','{lname}','{gender}','{dob}','{bg}',11,1,1,0,1,'{ev_ca}','{ll}','{ev_ca}','{ll}')")

Q("INSERT INTO `users` (`id`,`email`,`phone`,`password_hash`,`full_name`,`first_name`,`last_name`,`gender`,`date_of_birth`,`blood_group`,`primary_role_id`,`is_verified`,`is_active`,`is_admin_approved`,`is_online`,`email_verified_at`,`last_login_at`,`created_at`,`updated_at`) VALUES")
for i, row in enumerate(users_rows):
    comma = "," if i < len(users_rows) - 1 else ";"
    Q(f"{row}{comma}")
Q("")

# ====================================================================
# USER_ROLES
# ====================================================================
Q("-- USER_ROLES")
user_role_map = [
    (U_SA,1),(U_AD,2),(U_MO,3),(U_D1,4),(U_D2,4),(U_D3,4),(U_D4,4),(U_D5,4),(U_D6,4),(U_D7,4),(U_D8,4),
    (U_HA1,6),(U_HA2,6),(U_HA3,6),(U_PA1,9),(U_PA2,9),
    (U_P1,10),(U_P2,10),(U_P3,10),(U_P4,10),(U_P5,10),(U_P6,10),(U_P7,10),(U_P8,10),(U_P9,10),(U_P10,10),
    (U_BD1,12),(U_BD2,12),(U_BD3,12),(U_BD4,12),(U_BD5,12),
    (U_EV1,13),(U_CL1,11),(U_CL2,11),
]
Q("INSERT INTO `user_roles` (`user_id`,`role_id`,`is_primary`) VALUES")
for i,(uid,rid) in enumerate(user_role_map):
    comma = "," if i < len(user_role_map)-1 else ";"
    Q(f"('{uid}',{rid},1){comma}")
Q("")

# ====================================================================
# ADMIN_USERS
# ====================================================================
Q("-- ADMIN_USERS")
Q("""INSERT INTO `admin_users` (`user_id`,`username`,`full_name`,`role`,`permissions`,`is_active`,`is_two_factor_enabled`) VALUES
('""" + f"""{U_SA}','rajesh.admin','Rajesh Kumar','super-admin','[{{"module":"all","actions":["create","read","update","delete","approve"]}}]',1,0),
('{U_AD}','priya.admin','Priya Sharma','admin','[{{"module":"users","actions":["create","read","update","delete"]}},{{"module":"hospitals","actions":["read","update","approve"]}}]',1,0),
('{U_MO}','anil.mod','Anil Verma','moderator','[{{"module":"reviews","actions":["read","delete"]}},{{"module":"feedback","actions":["read","update"]}}]',1,0);""")
Q("")

# ====================================================================
# USER_PROFILES
# ====================================================================
Q("-- USER_PROFILES")
Q("""INSERT INTO `user_profiles` (`user_id`,`bio`,`height_cm`,`weight_kg`,`allergies`,`chronic_conditions`,`insurance_provider`,`insurance_policy_number`,`emergency_contact_name`,`emergency_contact_phone`,`emergency_contact_relation`,`theme_preference`,`notifications_enabled`) VALUES
('""" + f"""{U_P1}','Software engineer with an active lifestyle',175.0,72.0,'["Penicillin"]','[]','BlueCross BlueShield','BC-2024-78901','Ravi Sharma','+1-555-9901','father','dark',1),
('{U_P2}','Teacher and mother of two',163.0,58.0,'["Pollen","Latex"]','["Mild Asthma"]','Aetna','AE-2024-45678','Mark Davis','+1-555-9902','husband','light',1),
('{U_P3}','College student and fitness enthusiast',178.0,75.0,'[]','[]','UnitedHealth','UH-2024-12345','Sunita Patel','+1-555-9903','mother','dark',1),
('{U_P4}','Marketing professional',160.0,55.0,'["Sulfa drugs"]','["Migraine"]','Cigna','CG-2024-67890','Carlos Martinez','+1-555-9904','father','system',1),
('{U_P5}','Retired bank manager, manages diabetes',170.0,80.0,'[]','["Type 2 Diabetes","Hypertension"]','Humana','HM-2024-34567','Sunita Kumar','+1-555-9905','wife','light',1),
('{U_P6}','Graphic designer and artist',168.0,62.0,'["Aspirin"]','[]','Kaiser','KP-2024-23456','Robert Taylor','+1-555-9906','father','dark',1),
('{U_P7}','Nursing student, currently pregnant',162.0,60.0,'[]','[]','Anthem','AN-2024-56789','Raj Singh','+1-555-9907','husband','dark',1),
('{U_P8}','Fitness trainer and nutritionist',182.0,85.0,'[]','[]','BlueCross BlueShield','BC-2024-89012','Patricia Johnson','+1-555-9908','mother','system',1),
('{U_P9}','Research scientist',158.0,52.0,'["Ibuprofen"]','["Hypothyroidism"]','Aetna','AE-2024-90123','Venkat Reddy','+1-555-9909','father','dark',1),
('{U_P10}','Freelance writer',174.0,70.0,'[]','["Anxiety"]','UnitedHealth','UH-2024-01234','Linda Anderson','+1-555-9910','mother','light',1);""")
Q("")

# ====================================================================
# USER_ADDRESSES
# ====================================================================
Q("-- USER_ADDRESSES")
Q("""INSERT INTO `user_addresses` (`user_id`,`address_type`,`street`,`city`,`state`,`zip_code`,`country`,`landmark`,`latitude`,`longitude`,`is_default`) VALUES
('""" + f"""{U_P1}','home','742 Evergreen Terrace','Springfield','IL','62704','USA','Near City Park',39.7817210,-89.6501480,1),
('{U_P2}','home','1600 Pennsylvania Ave','Washington','DC','20500','USA','White House Area',38.8976763,-77.0365298,1),
('{U_P3}','home','221B Baker Street','New York','NY','10001','USA','Near Central Park',40.7484,-73.9857,1),
('{U_P4}','home','350 Fifth Avenue','New York','NY','10118','USA','Empire State Building',40.7484,-73.9857,1),
('{U_P5}','home','1 Infinite Loop','Cupertino','CA','95014','USA','Apple Park Area',37.3382,-122.0331,1),
('{U_P6}','home','200 N Spring St','Los Angeles','CA','90012','USA','City Hall Area',34.0522,-118.2437,1),
('{U_P7}','home','100 Market St','San Francisco','CA','94105','USA','Financial District',37.7749,-122.4194,1),
('{U_P8}','home','600 Congress Ave','Austin','TX','78701','USA','Downtown',30.2672,-97.7431,1),
('{U_P9}','home','401 S Carson St','Carson City','NV','89701','USA','State Capitol',39.1638,-119.7670,1),
('{U_P10}','home','900 W Randolph St','Chicago','IL','60607','USA','West Loop',41.8827,-87.6477,1),
('{U_D1}','work','100 Medical Center Blvd','Houston','TX','77030','USA','Texas Medical Center',29.7064,-95.4007,1),
('{U_D2}','work','55 Fruit Street','Boston','MA','02114','USA','Mass General Hospital',42.3631,-71.0688,1),
('{U_HA1}','work','4800 W 77th St','Chicago','IL','60638','USA','Near Airport',41.7529,-87.7932,1),
('{U_PA1}','work','300 Pharmacy Row','Houston','TX','77030','USA','Medical District',29.7065,-95.4018,1);""")
Q("")

# ====================================================================
# USER_EMERGENCY_CONTACTS
# ====================================================================
Q("-- USER_EMERGENCY_CONTACTS")
Q(f"""INSERT INTO `user_emergency_contacts` (`user_id`,`name`,`phone`,`email`,`relation`,`is_available`) VALUES
('{U_P1}','Ravi Sharma','+1-555-9901','ravi.sharma@email.com','father',1),
('{U_P2}','Mark Davis','+1-555-9902','mark.davis@email.com','husband',1),
('{U_P3}','Sunita Patel','+1-555-9903','sunita.patel@email.com','mother',1),
('{U_P4}','Carlos Martinez','+1-555-9904','carlos.martinez@email.com','father',1),
('{U_P5}','Sunita Kumar','+1-555-9905','sunita.kumar@email.com','wife',1),
('{U_P6}','Robert Taylor','+1-555-9906','robert.taylor@email.com','father',1),
('{U_P7}','Raj Singh','+1-555-9907','raj.singh@email.com','husband',1),
('{U_P8}','Patricia Johnson','+1-555-9908','patricia.j@email.com','mother',1),
('{U_P9}','Venkat Reddy','+1-555-9909','venkat.reddy@email.com','father',1),
('{U_P10}','Linda Anderson','+1-555-9910','linda.anderson@email.com','mother',1);""")
Q("")

# ====================================================================
# USER_PREFERENCES
# ====================================================================
Q("-- USER_PREFERENCES")
pref_users = [U_P1,U_P2,U_P3,U_P4,U_P5,U_P6,U_P7,U_P8,U_P9,U_P10,U_D1,U_D2,U_SA,U_AD]
Q("INSERT INTO `user_preferences` (`user_id`,`language`,`voice_enabled`,`font_size`,`sidebar_collapsed`) VALUES")
for i,uid in enumerate(pref_users):
    comma = "," if i < len(pref_users)-1 else ";"
    Q(f"('{uid}','en',0,'medium',0){comma}")
Q("")

# ====================================================================
# USER_NOTIFICATION_SETTINGS
# ====================================================================
Q("-- USER_NOTIFICATION_SETTINGS")
notif_users = [U_P1,U_P2,U_P3,U_P4,U_P5,U_P6,U_P7,U_P8,U_P9,U_P10,U_D1,U_D2,U_BD1,U_BD2]
Q("INSERT INTO `user_notification_settings` (`user_id`,`sms_enabled`,`email_enabled`,`push_enabled`,`emergency_alerts`,`donation_reminders`,`appointment_reminders`,`medicine_reminders`,`health_tips`,`review_notifications`) VALUES")
for i,uid in enumerate(notif_users):
    comma = "," if i < len(notif_users)-1 else ";"
    Q(f"('{uid}',1,1,1,1,1,1,0,1,1){comma}")
Q("")

# ====================================================================
# DOCTOR_PROFILES
# ====================================================================
Q("-- DOCTOR_PROFILES")
Q("""INSERT INTO `doctor_profiles` (`id`,`user_id`,`specialization`,`sub_specializations`,`license_number`,`medical_council`,`experience_years`,`qualifications`,`education`,`consultation_fee`,`follow_up_fee`,`video_consultation_fee`,`consultation_duration`,`hospital_affiliation`,`department`,`designation`,`languages`,`consultation_modes`,`max_patients_per_day`,`about`,`is_verified`,`verified_by`,`verified_at`,`rating`,`review_count`,`total_patients`,`total_consultations`,`success_rate`,`status`,`is_active`,`joined_date`) VALUES
(1,'""" + f"""{U_D1}','Cardiology','["Interventional Cardiology","Electrophysiology"]','MD-2024-001','Medical Council of India',15,'[{{"degree":"MD Cardiology","institution":"Johns Hopkins","year":2008,"country":"US"}}]','[{{"degree":"MBBS","institution":"AIIMS Delhi","year":2003}}]',250.00,100.00,300.00,30,'City General Hospital','Cardiology','Senior Consultant','["English","Hindi"]','["in-person","video"]',20,'Board-certified cardiologist with 15+ years of experience.',1,'{U_SA}','2026-02-01 10:00:00',4.8,45,320,580,96.50,'online',1,'2026-01-15'),
(2,'{U_D2}','Orthopedics','["Joint Replacement","Sports Medicine"]','MD-2024-002','National Medical Commission',20,'[{{"degree":"MS Orthopedics","institution":"Mayo Clinic","year":2005,"country":"US"}}]','[{{"degree":"MBBS","institution":"CMC Vellore","year":2000}}]',200.00,80.00,250.00,30,'Metro Medical Center','Orthopedics','Head of Department','["English","Tamil"]','["in-person","video","phone"]',15,'Expert in total knee and hip replacement surgeries.',1,'{U_SA}','2026-02-01 10:00:00',4.7,38,450,720,95.20,'online',1,'2026-01-15'),
(3,'{U_D3}','Gynecology','["Obstetrics","Infertility"]','MD-2024-003','Medical Council of India',12,'[{{"degree":"MS OB-GYN","institution":"Harvard Medical","year":2010,"country":"US"}}]','[{{"degree":"MBBS","institution":"KEM Hospital","year":2006}}]',300.00,120.00,350.00,30,'City General Hospital','Gynecology','Senior Consultant','["English","Hindi","Marathi"]','["in-person","video"]',15,'Specializing in high-risk pregnancies and fertility treatments.',1,'{U_SA}','2026-02-01 10:00:00',4.9,52,280,450,97.80,'online',1,'2026-02-01'),
(4,'{U_D4}','Neurology','["Stroke Medicine","Epilepsy"]','MD-2024-004','National Medical Commission',22,'[{{"degree":"DM Neurology","institution":"NIMHANS","year":2002,"country":"IN"}}]','[{{"degree":"MBBS","institution":"AIIMS Delhi","year":1997}}]',350.00,150.00,400.00,45,'Sunrise Specialty Hospital','Neurology','Director','["English","Hindi","Kannada"]','["in-person","video"]',10,'Renowned neurologist with expertise in stroke management.',1,'{U_SA}','2026-02-01 10:00:00',4.6,30,380,600,94.30,'busy',1,'2026-02-01'),
(5,'{U_D5}','Pediatrics','["Neonatology","Pediatric Cardiology"]','MD-2024-005','Medical Council of India',8,'[{{"degree":"MD Pediatrics","institution":"Stanford","year":2015,"country":"US"}}]','[{{"degree":"MBBS","institution":"Maulana Azad","year":2011}}]',180.00,70.00,220.00,20,'City General Hospital','Pediatrics','Consultant','["English","Hindi","Gujarati"]','["in-person","video","phone"]',25,'Passionate pediatrician specializing in newborn care.',1,'{U_AD}','2026-02-15 10:00:00',4.9,60,200,350,98.50,'online',1,'2026-02-15'),
(6,'{U_D6}','Dermatology','["Cosmetic Dermatology","Laser Therapy"]','MD-2024-006','Medical Council of India',10,'[{{"degree":"MD Dermatology","institution":"University of Miami","year":2013,"country":"US"}}]','[{{"degree":"MBBS","institution":"Grant Medical","year":2009}}]',150.00,60.00,180.00,15,'Metro Medical Center','Dermatology','Consultant','["English","Hindi"]','["in-person","video"]',30,'Expert in cosmetic dermatology and laser treatments.',1,'{U_AD}','2026-03-01 10:00:00',4.5,25,180,300,93.80,'offline',1,'2026-03-01'),
(7,'{U_D7}','General Medicine','["Internal Medicine","Diabetes Management"]','MD-2024-007','National Medical Commission',14,'[{{"degree":"MD General Medicine","institution":"Cleveland Clinic","year":2009,"country":"US"}}]','[{{"degree":"MBBS","institution":"JIPMER","year":2005}}]',120.00,50.00,150.00,15,'City General Hospital','General Medicine','Senior Resident','["English","Hindi","Urdu"]','["in-person","video","phone"]',35,'Experienced internist with focus on chronic disease management.',1,'{U_AD}','2026-03-01 10:00:00',4.7,40,420,680,95.60,'online',1,'2026-03-01'),
(8,'{U_D8}','ENT','["Head & Neck Surgery","Cochlear Implants"]','MD-2024-008','Medical Council of India',18,'[{{"degree":"MS ENT","institution":"Johns Hopkins","year":2006,"country":"US"}}]','[{{"degree":"MBBS","institution":"AIIMS Delhi","year":2001}}]',200.00,80.00,250.00,20,'Sunrise Specialty Hospital','ENT','Senior Consultant','["English","Hindi","Telugu"]','["in-person","video"]',15,'Specialist in cochlear implantation and head-neck surgery.',1,'{U_SA}','2026-03-15 10:00:00',4.8,35,300,520,96.20,'online',1,'2026-03-15');""")
Q("")

# ====================================================================
# HOSPITALS
# ====================================================================
Q("-- HOSPITALS")
Q(f"""INSERT INTO `hospitals` (`id`,`admin_user_id`,`name`,`registration_number`,`type`,`phone`,`emergency_phone`,`email`,`website`,`street`,`city`,`state`,`zip_code`,`country`,`latitude`,`longitude`,`total_beds`,`available_beds`,`icu_total_beds`,`icu_available_beds`,`icu_with_ventilator`,`icu_without_ventilator`,`ambulance_count`,`ambulance_available`,`emergency_service`,`emergency_response_time`,`total_doctors`,`total_nurses`,`total_staff`,`rating`,`review_count`,`is_verified`,`is_active`,`verified_by`,`verified_at`,`services`,`facilities`,`insurance_accepted`,`working_hours`,`established_year`,`image_url`) VALUES
('{H1}','{U_HA1}','City General Hospital','HOS-REG-001','multispecialty','+1-555-1001','+1-555-9111','info@citygeneral.health','www.citygeneral.health','100 Medical Center Blvd','Houston','TX','77030','USA',29.7064,-95.4007,500,320,80,25,30,50,8,5,'active','12 min',120,350,800,4.7,89,1,1,'{U_SA}','2026-02-01 10:00:00','["Emergency","Cardiology","Orthopedics","Pediatrics","Gynecology","Neurology","Oncology","General Surgery"]','["ICU","NICU","Blood Bank","Pharmacy","Lab","Radiology","MRI","CT Scan","Cath Lab","Rehabilitation"]','["BlueCross BlueShield","Aetna","UnitedHealth","Cigna","Humana"]','{{"monday":{{"open":"00:00","close":"23:59","isOpen":true}},"tuesday":{{"open":"00:00","close":"23:59","isOpen":true}},"wednesday":{{"open":"00:00","close":"23:59","isOpen":true}},"thursday":{{"open":"00:00","close":"23:59","isOpen":true}},"friday":{{"open":"00:00","close":"23:59","isOpen":true}},"saturday":{{"open":"00:00","close":"23:59","isOpen":true}},"sunday":{{"open":"00:00","close":"23:59","isOpen":true}}}}',1995,'/images/hospitals/city-general.jpg'),
('{H2}','{U_HA2}','Metro Medical Center','HOS-REG-002','private','+1-555-1002','+1-555-9112','info@metromedical.health','www.metromedical.health','55 Fruit Street','Boston','MA','02114','USA',42.3631,-71.0688,350,180,50,15,20,30,6,4,'active','15 min',85,220,500,4.5,62,1,1,'{U_SA}','2026-02-01 10:00:00','["Emergency","Orthopedics","Dermatology","ENT","General Medicine","Dental"]','["ICU","Blood Bank","Pharmacy","Lab","X-Ray","Ultrasound","Physiotherapy"]','["BlueCross BlueShield","Aetna","Kaiser","Anthem"]','{{"monday":{{"open":"06:00","close":"22:00","isOpen":true}},"tuesday":{{"open":"06:00","close":"22:00","isOpen":true}},"wednesday":{{"open":"06:00","close":"22:00","isOpen":true}},"thursday":{{"open":"06:00","close":"22:00","isOpen":true}},"friday":{{"open":"06:00","close":"22:00","isOpen":true}},"saturday":{{"open":"08:00","close":"20:00","isOpen":true}},"sunday":{{"open":"09:00","close":"18:00","isOpen":true}}}}',2005,'/images/hospitals/metro-medical.jpg'),
('{H3}','{U_HA3}','Sunrise Specialty Hospital','HOS-REG-003','specialized','+1-555-1003','+1-555-9113','info@sunrise.health','www.sunrise.health','200 Wellness Drive','San Francisco','CA','94105','USA',37.7749,-122.4194,200,95,30,8,12,18,4,2,'active','18 min',60,150,350,4.8,45,1,1,'{U_SA}','2026-02-01 10:00:00','["Neurology","ENT","Ophthalmology","Plastic Surgery","Urology","Gynecology"]','["ICU","NICU","Blood Bank","Pharmacy","Lab","MRI","CT Scan","Operation Theater"]','["UnitedHealth","Cigna","Anthem","Kaiser"]','{{"monday":{{"open":"07:00","close":"21:00","isOpen":true}},"tuesday":{{"open":"07:00","close":"21:00","isOpen":true}},"wednesday":{{"open":"07:00","close":"21:00","isOpen":true}},"thursday":{{"open":"07:00","close":"21:00","isOpen":true}},"friday":{{"open":"07:00","close":"21:00","isOpen":true}},"saturday":{{"open":"08:00","close":"18:00","isOpen":true}},"sunday":{{"open":"closed","close":"closed","isOpen":false}}}}',2010,'/images/hospitals/sunrise-specialty.jpg');""")
Q("")

# ====================================================================
# HOSPITAL_DEPARTMENTS
# ====================================================================
Q("-- HOSPITAL_DEPARTMENTS")
Q("""INSERT INTO `hospital_departments` (`id`,`hospital_id`,`name`,`description`,`head_doctor_id`,`total_beds`,`available_beds`,`total_doctors`,`total_nurses`,`services`,`timings`,`is_active`) VALUES
(1,'""" + f'{H1}' + """','Cardiology','Heart and cardiovascular care',1,80,25,15,30,'["ECG","Echocardiography","Cardiac Catheterization","Angioplasty","Pacemaker"]','24/7',1),
(2,'""" + f'{H1}' + """','Orthopedics','Bone and joint care',2,60,20,10,25,'["Joint Replacement","Fracture Care","Arthroscopy","Spine Surgery"]','08:00-20:00',1),
(3,'""" + f'{H1}' + """','Gynecology','Women health and maternity',3,70,30,12,35,'["Prenatal Care","Delivery","Fertility","Laparoscopy"]','08:00-20:00',1),
(4,'""" + f'{H1}' + """','Pediatrics','Child healthcare',5,50,15,8,20,'["Vaccinations","Growth Monitoring","Neonatal Care","Pediatric Surgery"]','08:00-20:00',1),
(5,'""" + f'{H1}' + """','General Medicine','Internal medicine and primary care',7,100,40,20,40,'["Consultations","Health Checkup","Chronic Disease Management","Diabetes Care"]','24/7',1),
(6,'""" + f'{H1}' + """','Emergency','Emergency and trauma care',NULL,40,10,15,35,'["Trauma Care","Heart Attack","Stroke","Accident"]','24/7',1),
(7,'""" + f'{H2}' + """','Orthopedics','Bone and joint care',2,50,18,8,20,'["Joint Replacement","Sports Injury","Spine Care"]','08:00-20:00',1),
(8,'""" + f'{H2}' + """','Dermatology','Skin and hair care',6,30,12,5,10,'["Skin Treatment","Laser Therapy","Cosmetic Procedures"]','09:00-17:00',1),
(9,'""" + f'{H2}' + """','ENT','Ear nose and throat care',8,25,8,4,10,'["Hearing Tests","Sinus Surgery","Tonsillectomy"]','09:00-17:00',1),
(10,'""" + f'{H3}' + """','Neurology','Brain and nervous system care',4,40,10,8,15,'["EEG","EMG","Stroke Treatment","Epilepsy Management"]','08:00-20:00',1),
(11,'""" + f'{H3}' + """','ENT','Ear nose and throat care',8,20,5,3,8,'["Cochlear Implant","Head-Neck Surgery","Voice Therapy"]','08:00-18:00',1);""")
Q("")

# ====================================================================
# HOSPITAL_DOCTORS
# ====================================================================
Q("-- HOSPITAL_DOCTORS")
Q(f"""INSERT INTO `hospital_doctors` (`id`,`hospital_id`,`doctor_profile_id`,`department_id`,`designation`,`consultation_fee`,`availability`,`rating`,`review_count`,`status`,`joined_date`) VALUES
(1,'{H1}',1,1,'Senior Consultant',250.00,'[{{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":15}}]',4.8,45,'active','2020-01-15'),
(2,'{H1}',3,3,'Senior Consultant',300.00,'[{{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":12}}]',4.9,52,'active','2021-03-01'),
(3,'{H1}',5,4,'Consultant',180.00,'[{{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":20}}]',4.9,60,'active','2022-06-15'),
(4,'{H1}',7,5,'Senior Resident',120.00,'[{{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":25}}]',4.7,40,'active','2022-01-01'),
(5,'{H2}',2,7,'Head of Department',200.00,'[{{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":10}}]',4.7,38,'active','2019-07-01'),
(6,'{H2}',6,8,'Consultant',150.00,'[{{"day":"Monday","startTime":"10:00","endTime":"16:00","maxPatients":20}}]',4.5,25,'active','2023-01-15'),
(7,'{H3}',4,10,'Director',350.00,'[{{"day":"Monday","startTime":"09:00","endTime":"15:00","maxPatients":8}}]',4.6,30,'active','2018-05-01'),
(8,'{H3}',8,11,'Senior Consultant',200.00,'[{{"day":"Monday","startTime":"09:00","endTime":"17:00","maxPatients":12}}]',4.8,35,'active','2020-09-01');""")
Q("")

# ====================================================================
# HOSPITAL_BEDS
# ====================================================================
Q("-- HOSPITAL_BEDS")
Q("INSERT INTO `hospital_beds` (`hospital_id`,`department_id`,`bed_number`,`bed_type`,`floor`,`ward`,`status`,`patient_id`,`patient_name`,`has_ventilator`,`has_monitor`,`price_per_day`,`daily_charge`) VALUES")

bed_types = [("general",100.00),("semi-private",200.00),("private",500.00),("icu",1500.00),("nicu",1200.00),("emergency",800.00)]
floors = ["Ground","1st","2nd","3rd","4th","5th"]
statuses = ["available","available","available","occupied","available","occupied","reserved","available","available","occupied"]
patient_names = ["Aarav Sharma","Emily Davis","Rohan Patel","Sophia Martinez","Amit Kumar","Neha Singh"]
patient_ids = [U_P1,U_P2,U_P3,U_P4,U_P5,U_P7]
pidx = 0
bed_rows = []
for h_idx, hosp_id in enumerate([H1,H2,H3]):
    for dept in range(1 + h_idx*3, 4 + h_idx*3):
        for room in range(1, 6):
            bt_idx = room % len(bed_types)
            bt_name = bed_types[bt_idx][0]
            bt_price = bed_types[bt_idx][1]
            st = statuses[(pidx) % len(statuses)]
            pid_str = "NULL"
            pname_str = "NULL"
            if st == "occupied":
                pid_str = f"'{patient_ids[pidx % len(patient_ids)]}'"
                pname_str = f"'{patient_names[pidx % len(patient_names)]}'"
                pidx += 1
            else:
                pidx += 0  # don't advance
            floor = floors[(dept-1) % len(floors)]
            ward = f"Ward-{chr(64+dept)}"
            bed_num = f"{h_idx+1}-{dept:02d}-{room:02d}"
            has_vent = 1 if bt_name == 'icu' else 0
            has_mon = 1 if bt_name in ('icu','emergency') else 0
            bed_rows.append(f"('{hosp_id}',{dept},'{bed_num}','{bt_name}','{floor}','{ward}','{st}',{pid_str},{pname_str},{has_vent},{has_mon},{bt_price},{bt_price})")

# Reset pidx for a simpler approach - just ensure some beds are occupied
bed_rows = []
pidx = 0
bed_count = 0
for h_idx, hosp_id in enumerate([H1,H2,H3]):
    for dept in range(1 + h_idx*3, 4 + h_idx*3):
        for room in range(1, 6):
            bed_count += 1
            bt = bed_types[room % len(bed_types)]
            st = statuses[(bed_count) % len(statuses)]
            pid_str = "NULL"
            pname_str = "NULL"
            if st == "occupied":
                pi = pidx % len(patient_ids)
                pid_str = f"'{patient_ids[pi]}'"
                pname_str = f"'{patient_names[pi]}'"
                pidx += 1
            floor = floors[(dept-1) % len(floors)]
            ward = f"Ward-{chr(64+dept)}"
            bed_num = f"{h_idx+1}-{dept:02d}-{room:02d}"
            hv = 1 if bt[0]=='icu' else 0
            hm = 1 if bt[0] in ('icu','emergency') else 0
            comma = ";" if bed_count == 45 else ","
            Q(f"('{hosp_id}',{dept},'{bed_num}','{bt[0]}','{floor}','{ward}','{st}',{pid_str},{pname_str},{hv},{hm},{bt[1]},{bt[1]}){comma}")
Q("")

# ====================================================================
# HOSPITAL_AMBULANCES
# ====================================================================
Q("-- HOSPITAL_AMBULANCES")
Q(f"""INSERT INTO `hospital_ambulances` (`hospital_id`,`vehicle_number`,`type`,`status`,`current_latitude`,`current_longitude`,`current_address`,`driver_name`,`driver_phone`,`paramedic_name`,`equipment`,`has_oxygen_support`) VALUES
('{H1}','AMB-CGH-001','advanced','available',29.7064,-95.4007,'100 Medical Center Blvd','Mike Johnson','+1-555-8001','Sarah Williams','["Defibrillator","Oxygen","Ventilator","Stretcher","ECG Monitor"]',1),
('{H1}','AMB-CGH-002','basic','on-call',29.7100,-95.3950,'Downtown Houston','Tom Brown','+1-555-8002','Lisa Anderson','["Oxygen","Stretcher","First Aid Kit"]',1),
('{H1}','AMB-CGH-003','cardiac','dispatched',29.7200,-95.4100,'Memorial Park Area','Jake Wilson','+1-555-8003','Emily Chen','["Defibrillator","Oxygen","Cardiac Monitor","Ventilator"]',1),
('{H2}','AMB-MMC-001','basic','available',42.3631,-71.0688,'55 Fruit Street','Peter Davis','+1-555-8004','Amy White','["Oxygen","Stretcher","First Aid Kit"]',1),
('{H2}','AMB-MMC-002','advanced','maintenance',42.3600,-71.0700,'Boston Common','Chris Lee','+1-555-8005','Nina Patel','["Defibrillator","Oxygen","Ventilator"]',1),
('{H3}','AMB-SSH-001','neonatal','available',37.7749,-122.4194,'200 Wellness Drive','Sam Miller','+1-555-8006','Rachel Kim','["Incubator","Oxygen","Neonatal Ventilator"]',1),
('{H3}','AMB-SSH-002','basic','available',37.7800,-122.4100,'Mission District','Dan Thompson','+1-555-8007','Kate Brown','["Oxygen","Stretcher","First Aid Kit"]',1);""")
Q("")

# ====================================================================
# HOSPITAL_BLOOD_BANK
# ====================================================================
Q("-- HOSPITAL_BLOOD_BANK")
Q(f"""INSERT INTO `hospital_blood_bank` (`hospital_id`,`is_available`,`total_units`,`expiry_alerts`) VALUES
('{H1}',1,180,3),
('{H2}',1,95,1),
('{H3}',1,60,2);""")
Q("")

# ====================================================================
# HOSPITAL_BLOOD_STOCKS
# ====================================================================
Q("-- HOSPITAL_BLOOD_STOCKS")
Q("INSERT INTO `hospital_blood_stocks` (`blood_bank_id`,`blood_group`,`units`,`expiry_date`,`status`) VALUES")
bg_list = ["A+","A-","B+","B-","AB+","AB-","O+","O-"]
s_rows = []
for bid in [1,2,3]:
    units_map = {1:{"A+":25,"A-":8,"B+":20,"B-":5,"AB+":12,"AB-":3,"O+":30,"O-":7},
                 2:{"A+":12,"A-":4,"B+":10,"B-":3,"AB+":6,"AB-":2,"O+":15,"O-":4},
                 3:{"A+":8,"A-":2,"B+":6,"B-":2,"AB+":4,"AB-":1,"O+":10,"O-":3}}
    for bg in bg_list:
        units = units_map[bid][bg]
        status = "sufficient" if units > 10 else ("low" if units > 3 else "critical")
        s_rows.append(f"({bid},'{bg}',{units},'2026-09-30','{status}')")
for i, r in enumerate(s_rows):
    comma = ";" if i == len(s_rows)-1 else ","
    Q(f"{r}{comma}")
Q("")

# ====================================================================
# HOSPITAL_OXYGEN_STOCK
# ====================================================================
Q("-- HOSPITAL_OXYGEN_STOCK")
Q(f"""INSERT INTO `hospital_oxygen_stock` (`hospital_id`,`total_cylinders`,`available_cylinders`,`in_use_cylinders`,`reserved_cylinders`,`cylinder_types`,`last_refilled`,`next_refill_date`,`supplier`,`supplier_contact`,`status`,`emergency_support`) VALUES
('{H1}',100,45,40,15,'[{{"type":"A-type","capacity":"10L","total":50,"available":25}},{{"type":"B-type","capacity":"50L","total":30,"available":12}},{{"type":"C-type","capacity":"5L","total":20,"available":8}}]','2026-05-15','2026-06-15','AirLinx Medical','+1-555-9001','sufficient',1),
('{H2}',60,25,25,10,'[{{"type":"A-type","capacity":"10L","total":30,"available":15}},{{"type":"B-type","capacity":"50L","total":20,"available":6}},{{"type":"C-type","capacity":"5L","total":10,"available":4}}]','2026-05-10','2026-06-10','MedGas Supply','+1-555-9002','low',0),
('{H3}',40,15,18,7,'[{{"type":"A-type","capacity":"10L","total":20,"available":8}},{{"type":"B-type","capacity":"50L","total":15,"available":5}},{{"type":"C-type","capacity":"5L","total":5,"available":2}}]','2026-05-20','2026-06-20','O2Pure Inc','+1-555-9003','sufficient',1);""")
Q("")

# ====================================================================
# PHARMACIES
# ====================================================================
Q("-- PHARMACIES")
Q(f"""INSERT INTO `pharmacies` (`id`,`admin_user_id`,`name`,`registration_number`,`license_number`,`gst_number`,`pharmacist_name`,`pharmacist_license`,`owner_name`,`operating_hours`,`opening_time`,`closing_time`,`is_24x7`,`phone`,`emergency_phone`,`email`,`website`,`street`,`city`,`state`,`zip_code`,`latitude`,`longitude`,`delivery_available`,`delivery_radius`,`emergency_service`,`services`,`is_verified`,`is_active`,`is_open`,`status`,`verified_by`,`verified_at`,`rating`,`review_count`,`total_orders`) VALUES
('{P1}','{U_PA1}','HealthPlus Pharmacy','PH-REG-001','LIC-2024-001','GST-27-AABCT1234F1Z5','Rakesh Gupta','RPH-001','Rakesh Gupta','08:00-22:00','08:00:00','22:00:00',0,'+1-555-5001','+1-555-5091','info@healthplus.pharmacy','www.healthplus.pharmacy','150 Main Street','Houston','TX','77002','USA',29.7589,-95.3694,1,5.0,1,'["prescription","otc","delivery","compounding"]',1,1,1,'active','{U_SA}','2026-02-01 10:00:00',4.6,55,320),
('{P2}','{U_PA2}','Medicare Express Pharmacy','PH-REG-002','LIC-2024-002','GST-29-AABCM5678G2H9','Linda Johnson','RPH-002','Robert Johnson','24 Hours','00:00:00','23:59:00',1,'+1-555-5002','+1-555-5092','info@medicareexpress.pharmacy','www.medicareexpress.pharmacy','75 Health Avenue','Boston','MA','02101','USA',42.3601,-71.0589,1,3.0,0,'["prescription","otc","delivery","24x7"]',1,1,1,'active','{U_SA}','2026-02-01 10:00:00',4.4,38,180);""")
Q("")

# ====================================================================
# PHARMACY_INVENTORY
# ====================================================================
Q("-- PHARMACY_INVENTORY")
Q(f"""INSERT INTO `pharmacy_inventory` (`id`,`pharmacy_id`,`medicine_name`,`generic_name`,`brand_name`,`category`,`type`,`description`,`dosage`,`side_effects`,`price`,`discounted_price`,`quantity`,`min_stock`,`unit`,`pack_size`,`strength`,`form`,`requires_prescription`,`is_available`,`is_expired`,`rating`,`review_count`) VALUES
(1,'{P1}','Amoxicillin 500mg','Amoxicillin','Amoxil','antibiotics','prescription','Broad-spectrum antibiotic','500mg every 8 hours','["Nausea","Diarrhea","Skin Rash"]',12.99,10.99,500,50,'tablet','10 per strip','500mg','tablet',1,1,0,4.3,18),
(2,'{P1}','Metformin 500mg','Metformin','Glucophage','diabetes','prescription','Oral antidiabetic for Type 2 diabetes','500mg twice daily','["Nausea","Stomach Upset","Diarrhea"]',8.99,7.49,800,100,'tablet','10 per strip','500mg','tablet',1,1,0,4.5,25),
(3,'{P1}','Atorvastatin 10mg','Atorvastatin','Lipitor','cardiac','prescription','Cholesterol-lowering statin','10mg once daily at bedtime','["Muscle Pain","Headache","Nausea"]',15.99,13.49,300,40,'tablet','10 per strip','10mg','tablet',1,1,0,4.4,20),
(4,'{P1}','Omeprazole 20mg','Omeprazole','Prilosec','gastroenterology','prescription','Proton pump inhibitor for acid reflux','20mg before breakfast','["Headache","Abdominal Pain","Diarrhea"]',6.99,5.99,600,60,'capsule','10 per strip','20mg','capsule',1,1,0,4.2,15),
(5,'{P1}','Cetirizine 10mg','Cetirizine','Zyrtec','respiratory','otc','Antihistamine for allergies','10mg once daily','["Drowsiness","Dry Mouth","Headache"]',4.99,3.99,1000,100,'tablet','10 per strip','10mg','tablet',0,1,0,4.6,32),
(6,'{P1}','Ibuprofen 400mg','Ibuprofen','Advil','pain-relief','otc','NSAID for pain and inflammation','400mg every 6-8 hours','["Stomach Upset","Nausea","Dizziness"]',5.99,4.99,800,80,'tablet','10 per strip','400mg','tablet',0,1,0,4.5,28),
(7,'{P1}','Amlodipine 5mg','Amlodipine','Norvasc','cardiac','prescription','Calcium channel blocker for hypertension','5mg once daily','["Swelling","Dizziness","Flushing"]',9.99,8.49,400,50,'tablet','10 per strip','5mg','tablet',1,1,0,4.3,16),
(8,'{P1}','Pantoprazole 40mg','Pantoprazole','Protonix','gastroenterology','prescription','Proton pump inhibitor for GERD','40mg before breakfast','["Headache","Diarrhea","Nausea"]',11.99,9.99,350,40,'tablet','10 per strip','40mg','tablet',1,1,0,4.1,12),
(9,'{P2}','Lisinopril 10mg','Lisinopril','Zestril','cardiac','prescription','ACE inhibitor for high blood pressure','10mg once daily','["Dry Cough","Dizziness","Headache"]',7.99,6.49,450,50,'tablet','10 per strip','10mg','tablet',1,1,0,4.4,14),
(10,'{P2}','Levothyroxine 50mcg','Levothyroxine','Synthroid','endocrinology','prescription','Thyroid hormone replacement','50mcg once daily on empty stomach','["Weight Changes","Headache","Insomnia"]',9.99,8.49,350,40,'tablet','10 per strip','50mcg','tablet',1,1,0,4.6,22),
(11,'{P2}','Azithromycin 250mg','Azithromycin','Zithromax','antibiotics','prescription','Macrolide antibiotic','250mg daily for 3-5 days','["Nausea","Diarrhea","Abdominal Pain"]',14.99,12.49,250,30,'tablet','6 per pack','250mg','tablet',1,1,0,4.2,10),
(12,'{P2}','Vitamin D3 1000IU','Cholecalciferol','D-Rise','vitamins','otc','Vitamin D supplement','1000IU once daily','["None significant at normal doses"]',3.99,2.99,1200,100,'capsule','15 per bottle','1000IU','capsule',0,1,0,4.7,35),
(13,'{P2}','Paracetamol 500mg','Acetaminophen','Tylenol','pain-relief','otc','Pain reliever and fever reducer','500mg every 4-6 hours','["Liver Damage (overdose)","Allergic Reaction"]',2.99,1.99,2000,200,'tablet','10 per strip','500mg','tablet',0,1,0,4.8,45),
(14,'{P2}','Salbutamol Inhaler','Albuterol','Ventolin','respiratory','prescription','Bronchodilator for asthma relief','2 puffs every 4-6 hours as needed','["Tremor","Headache","Palpitations"]',24.99,21.99,100,15,'inhaler','1 unit','100mcg/puff','inhaler',1,1,0,4.5,20),
(15,'{P2}','Prenatal Vitamins','Multivitamin','PregnaCare','gynecology','otc','Complete prenatal vitamin supplement','1 tablet daily','["Nausea","Constipation"]',19.99,16.99,150,20,'tablet','30 per bottle','Comprehensive','tablet',0,1,0,4.8,42);""")
Q("")

# ====================================================================
# BLOOD_DONORS
# ====================================================================
Q("-- BLOOD_DONORS")
Q(f"""INSERT INTO `blood_donors` (`id`,`user_id`,`blood_group`,`age`,`weight_kg`,`gender`,`last_donation_date`,`total_donations`,`next_eligible_date`,`is_eligible`,`is_available`,`is_emergency_donor`,`medical_conditions`,`is_on_medication`,`current_medications`,`has_tattoo`,`has_piercing`,`has_traveled_abroad`,`status`,`deferral_reason`,`is_verified`,`verified_by`,`verified_at`,`preferred_donation_center`,`preferred_time`,`reward_points`,`lives_saved`,`donated_units`,`registered_date`) VALUES
(1,'{U_BD1}','O+',28,78.0,'male','2026-03-15',4,'2026-06-15',1,1,1,'[]',0,'[]',0,0,0,'active',NULL,1,'{U_SA}','2026-02-01 10:00:00','City General Hospital','morning',40,12,4,'2026-02-01'),
(2,'{U_BD2}','A-',35,62.0,'female','2026-04-20',3,'2026-07-20',1,1,0,'[]',0,'[]',0,0,0,'active',NULL,1,'{U_AD}','2026-02-10 10:00:00','Metro Medical Center','afternoon',30,9,3,'2026-02-10'),
(3,'{U_BD3}','B+',32,82.0,'male','2026-01-10',6,'2026-04-10',0,1,1,'[]',0,'[]',0,0,0,'temporary-deferred','Recently traveled to malaria-endemic region',1,'{U_AD}','2026-02-15 10:00:00','City General Hospital','morning',60,18,6,'2026-02-15'),
(4,'{U_BD4}','AB-',38,58.0,'female','2026-02-28',2,'2026-05-28',1,1,0,'["Hypothyroidism"]',1,'["Levothyroxine 50mcg"]',0,0,0,'active',NULL,1,'{U_SA}','2026-03-01 10:00:00','Sunrise Specialty Hospital','evening',20,6,2,'2026-03-01'),
(5,'{U_BD5}','O+',30,75.0,'male','2026-05-01',5,'2026-08-01',1,1,1,'[]',0,'[]',0,0,0,'active',NULL,1,'{U_AD}','2026-03-10 10:00:00','City General Hospital','morning',50,15,5,'2026-03-10');""")
Q("")

# ====================================================================
# BLOOD_DONATIONS
# ====================================================================
Q("-- BLOOD_DONATIONS")
Q("""INSERT INTO `blood_donations` (`id`,`donor_id`,`donation_date`,`blood_group`,`units`,`donation_type`,`location`,`hospital_name`,`blood_bank_name`,`certificate_id`,`reward_points_earned`,`verified_by`,`notes`) VALUES
(1,1,'2026-03-15','O+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-001',10,'""" + f"""{U_SA}','Regular donation'),
(2,2,'2026-04-20','A-',1,'plasma','Metro Medical Center','Metro Medical Center','Metro Blood Bank','CERT-BD-002',15,'{U_AD}','Plasma donation'),
(3,3,'2026-01-10','B+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-003',10,'{U_SA}','Regular donation'),
(4,4,'2026-02-28','AB-',1,'platelets','Sunrise Specialty Hospital','Sunrise Specialty Hospital','Sunrise Blood Bank','CERT-BD-004',20,'{U_AD}','Platelet donation'),
(5,5,'2026-05-01','O+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-005',10,'{U_SA}','Emergency donation'),
(6,1,'2025-12-15','O+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-006',10,'{U_AD}','Regular donation'),
(7,3,'2025-11-01','B+',1,'whole-blood','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-007',10,'{U_SA}','Regular donation'),
(8,5,'2026-02-15','O+',2,'double-red-cells','City General Hospital','City General Hospital','City General Blood Bank','CERT-BD-008',25,'{U_SA}','Double red cell donation');""")
Q("")

# ====================================================================
# BLOOD_REQUESTS
# ====================================================================
BR1 = U("br1"); BR2 = U("br2"); BR3 = U("br3"); BR4 = U("br4"); BR5 = U("br5")
Q("-- BLOOD_REQUESTS")
Q(f"""INSERT INTO `blood_requests` (`id`,`request_number`,`requested_by`,`hospital_id`,`patient_name`,`patient_age`,`blood_group`,`units_required`,`urgency`,`reason`,`doctor_name`,`status`,`approved_by`,`required_by_date`) VALUES
('{BR1}','BR-2026-001','{U_P5}','{H1}','Amit Kumar',55,'O+',2,'urgent','Emergency surgery scheduled','Dr. Fatima Khan','approved','{U_SA}','2026-06-05'),
('{BR2}','BR-2026-002','{U_P4}','{H3}','Sophia Martinez',32,'AB-',1,'emergency','Postpartum hemorrhage','Dr. Anita Desai','fulfilled','{U_AD}','2026-05-25'),
('{BR3}','BR-2026-003','{U_HA1}','{H1}','Unknown Patient',45,'B+',3,'normal','Scheduled surgery next week','Dr. James Wilson','pending',NULL,'2026-06-15'),
('{BR4}','BR-2026-004','{U_HA2}','{H2}','Emergency Patient',60,'A-',2,'emergency','Accident victim needs immediate transfusion','Dr. David Brown','approved','{U_SA}','2026-06-01'),
('{BR5}','BR-2026-005','{U_P2}','{H1}','Emily Davis',30,'O-',1,'normal','Pre-surgery preparation','Dr. Sarah Mitchell','pending',NULL,'2026-06-10');""")
Q("")

# ====================================================================
# BLOOD_DONATION_CAMPS
# ====================================================================
Q("-- BLOOD_DONATION_CAMPS")
Q("""INSERT INTO `blood_donation_camps` (`id`,`name`,`organizer`,`camp_date`,`start_time`,`end_time`,`location`,`address`,`latitude`,`longitude`,`expected_donors`,`registered_donors`,`blood_groups_needed`,`facilities`,`contact_phone`,`status`) VALUES
(1,'City Blood Drive 2026','Red Cross Society','2026-06-15','09:00:00','17:00:00','City General Hospital','100 Medical Center Blvd, Houston, TX',29.7064,-95.4007,200,85,'["A+","B+","O+","O-"]','["Refreshments","Certificate","Health Checkup","Free T-shirt"]','+1-555-7001','upcoming'),
(2,'Metro Donation Camp','Metro Health Foundation','2026-05-20','08:00:00','16:00:00','Metro Medical Center','55 Fruit Street, Boston, MA',42.3631,-71.0688,150,62,'["A-","B-","AB+","AB-"]','["Refreshments","Certificate","Health Screening"]','+1-555-7002','completed'),
(3,'Emergency Blood Camp','Aetherion Health','2026-06-05','07:00:00','19:00:00','Sunrise Specialty Hospital','200 Wellness Drive, San Francisco, CA',37.7749,-122.4194,300,45,'["O+","O-","A+","B+"]','["Refreshments","Certificate","Emergency Kit","Free Consultation"]','+1-555-7003','upcoming');""")
Q("")

# ====================================================================
# DONOR_REWARDS
# ====================================================================
Q("-- DONOR_REWARDS")
Q("""INSERT INTO `donor_rewards` (`donor_id`,`type`,`name`,`description`,`points`,`earned_date`,`expiry_date`,`status`) VALUES
(1,'badge','Bronze Donor','Completed 3+ donations',10,'2026-01-15','2027-01-15','active'),
(2,'badge','Silver Donor','Completed plasma donation',15,'2026-04-20','2027-04-20','active'),
(3,'points','Loyalty Points','Points for 5+ donations',60,'2026-01-10','2027-01-10','active'),
(5,'certificate','Emergency Hero','Donated during emergency',25,'2026-05-01','2027-05-01','active'),
(1,'points','Referral Bonus','Referred a new donor',20,'2026-03-20','2027-03-20','active');""")
Q("")

# ====================================================================
# DOCTOR_AVAILABILITY
# ====================================================================
Q("-- DOCTOR_AVAILABILITY")
Q("INSERT INTO `doctor_availability` (`doctor_id`,`day_of_week`,`start_time`,`end_time`,`max_patients`,`current_patients`,`is_available`) VALUES")
avail_rows = []
for doc_id in range(1,9):
    for day in range(1,6):
        avail_rows.append((doc_id, day, "09:00:00", "17:00:00", 15 + doc_id*2, 3 + doc_id, 1))
    avail_rows.append((doc_id, 6, "09:00:00", "13:00:00", 8, 2, 1))
for i, a in enumerate(avail_rows):
    comma = ";" if i == len(avail_rows)-1 else ","
    Q(f"({a[0]},{a[1]},'{a[2]}','{a[3]}',{a[4]},{a[5]},{a[6]}){comma}")
Q("")

# ====================================================================
# DOCTOR_PATIENTS
# ====================================================================
Q("-- DOCTOR_PATIENTS")
Q(f"""INSERT INTO `doctor_patients` (`doctor_id`,`patient_id`,`first_visit_date`,`last_visit_date`,`total_visits`,`is_active`,`notes`) VALUES
(1,'{U_P1}','2026-02-10','2026-05-15',5,1,'Cardiac follow-up patient'),
(1,'{U_P5}','2026-03-01','2026-05-20',4,1,'Hypertension with cardiac risk'),
(2,'{U_P3}','2026-02-20','2026-04-15',2,1,'Sports injury recovery'),
(3,'{U_P4}','2026-01-15','2026-05-28',8,1,'Prenatal care patient'),
(3,'{U_P7}','2026-03-10','2026-05-30',6,1,'High-risk pregnancy monitoring'),
(4,'{U_P5}','2026-02-05','2026-05-18',7,1,'Stroke recovery patient'),
(5,'{U_P8}','2026-04-01','2026-05-25',3,1,'Child vaccination and checkup'),
(7,'{U_P1}','2026-01-20','2026-05-10',4,1,'General health checkup'),
(7,'{U_P2}','2026-02-15','2026-05-22',3,1,'Asthma management'),
(7,'{U_P9}','2026-03-05','2026-05-28',5,1,'Thyroid disorder management');""")
Q("")

# ====================================================================
# APPOINTMENTS
# ====================================================================
APT1 = U("apt1"); APT2 = U("apt2"); APT3 = U("apt3"); APT4 = U("apt4"); APT5 = U("apt5")
APT6 = U("apt6"); APT7 = U("apt7"); APT8 = U("apt8"); APT9 = U("apt9"); APT10 = U("apt10")
APT11 = U("apt11"); APT12 = U("apt12")
Q("-- APPOINTMENTS")
Q(f"""INSERT INTO `appointments` (`id`,`patient_id`,`doctor_id`,`hospital_id`,`department_id`,`appointment_date`,`start_time`,`end_time`,`duration_minutes`,`type`,`status`,`location`,`priority`,`reason`,`symptoms`,`notes`,`is_emergency`,`is_first_visit`,`fee`,`payment_status`,`created_at`,`updated_at`) VALUES
('{APT1}','{U_P1}',1,'{H1}',1,'2026-06-02','10:00:00','10:30:00',30,'consultation','confirmed','in-person','medium','Chest pain evaluation','["Chest Pain","Shortness of Breath"]',NULL,0,0,250.00,'pending','2026-05-28 09:00:00','2026-05-28 09:00:00'),
('{APT2}','{U_P5}',1,'{H1}',1,'2026-06-01','11:00:00','11:30:00',30,'follow-up','confirmed','in-person','medium','Blood pressure follow-up','["Headache","Dizziness"]',NULL,0,0,100.00,'paid','2026-05-25 14:00:00','2026-05-25 14:00:00'),
('{APT3}','{U_P3}',2,'{H1}',2,'2026-06-03','09:00:00','09:30:00',30,'consultation','scheduled','in-person','low','Knee pain assessment','["Knee Pain","Swelling"]',NULL,0,1,200.00,'pending','2026-05-27 10:00:00','2026-05-27 10:00:00'),
('{APT4}','{U_P4}',3,'{H1}',3,'2026-06-02','14:00:00','14:30:00',30,'follow-up','confirmed','in-person','medium','Prenatal checkup - 28 weeks',NULL,NULL,0,0,300.00,'insurance','2026-05-20 08:00:00','2026-05-20 08:00:00'),
('{APT5}','{U_P7}',3,'{H1}',3,'2026-06-01','15:00:00','15:30:00',30,'follow-up','confirmed','in-person','high','Pregnancy monitoring - 22 weeks',NULL,NULL,0,0,300.00,'paid','2026-05-22 11:00:00','2026-05-22 11:00:00'),
('{APT6}','{U_P5}',4,'{H3}',10,'2026-06-04','10:00:00','10:30:00',30,'follow-up','scheduled','in-person','medium','Post-stroke evaluation',NULL,NULL,0,0,350.00,'pending','2026-05-26 09:00:00','2026-05-26 09:00:00'),
('{APT7}','{U_P2}',7,'{H1}',5,'2026-06-02','11:00:00','11:15:00',15,'consultation','scheduled','in-person','low','Asthma routine check',NULL,NULL,0,0,120.00,'pending','2026-05-28 15:00:00','2026-05-28 15:00:00'),
('{APT8}','{U_P9}',7,'{H1}',5,'2026-06-03','14:00:00','14:15:00',15,'follow-up','confirmed','in-person','medium','Thyroid medication review',NULL,NULL,0,0,50.00,'paid','2026-05-24 08:00:00','2026-05-24 08:00:00'),
('{APT9}','{U_P6}',6,'{H2}',8,'2026-06-05','10:00:00','10:15:00',15,'consultation','scheduled','video','low','Skin rash evaluation','["Skin Rash","Itching"]',NULL,0,1,150.00,'pending','2026-05-29 10:00:00','2026-05-29 10:00:00'),
('{APT10}','{U_P1}',7,'{H1}',5,'2026-05-15','09:00:00','09:15:00',15,'checkup','completed','in-person','low','Annual health checkup',NULL,NULL,0,0,120.00,'paid','2026-05-10 08:00:00','2026-05-15 09:15:00'),
('{APT11}','{U_P10}',6,'{H2}',8,'2026-06-06','11:00:00','11:15:00',15,'consultation','scheduled','in-person','low','Acne treatment consultation',NULL,NULL,0,1,150.00,'pending','2026-05-30 08:00:00','2026-05-30 08:00:00'),
('{APT12}','{U_P8}',5,'{H1}',4,'2026-06-04','09:00:00','09:20:00',20,'checkup','scheduled','in-person','low','Child wellness checkup',NULL,NULL,0,0,180.00,'pending','2026-05-28 12:00:00','2026-05-28 12:00:00');""")
Q("")

# ====================================================================
# PRESCRIPTIONS
# ====================================================================
RX1 = U("rx1"); RX2 = U("rx2"); RX3 = U("rx3"); RX4 = U("rx4")
Q("-- PRESCRIPTIONS")
Q(f"""INSERT INTO `prescriptions` (`id`,`appointment_id`,`doctor_id`,`patient_id`,`hospital_id`,`diagnosis`,`symptoms`,`advice`,`notes`,`follow_up_date`,`valid_until`,`status`,`created_at`) VALUES
('{RX1}','{APT10}',7,'{U_P1}','{H1}','General good health, mild Vitamin D deficiency','["Fatigue"]','Take Vitamin D supplements, increase sun exposure','Follow up in 3 months','2026-08-15','2026-09-15','active','2026-05-15 09:15:00'),
('{RX2}','{APT2}',1,'{U_P5}','{H1}','Essential Hypertension, well controlled','["Headache","Dizziness"]','Continue current medication, reduce salt intake','Monitor BP weekly','2026-06-15','2026-07-15','active','2026-05-20 11:30:00'),
('{RX3}','{APT8}',7,'{U_P9}','{H1}','Hypothyroidism, stable on medication',NULL,'Continue Levothyroxine, repeat TSH in 6 weeks','Fasting blood test recommended','2026-07-15','2026-08-15','active','2026-05-28 14:15:00'),
('{RX4}','{APT5}',3,'{U_P7}','{H1}','Pregnancy - 22 weeks, normal progression',NULL,'Continue prenatal vitamins, iron supplements','High-risk pregnancy monitoring continues','2026-06-15','2026-07-15','active','2026-05-22 15:30:00');""")
Q("")

# ====================================================================
# PRESCRIPTION_ITEMS
# ====================================================================
Q("-- PRESCRIPTION_ITEMS")
Q(f"""INSERT INTO `prescription_items` (`prescription_id`,`medicine_name`,`dosage`,`frequency`,`duration`,`timing`,`route`,`quantity`,`refills`,`instructions`) VALUES
('{RX1}','Vitamin D3 1000IU','1000IU','Once daily','3 months','after-food','oral',1,2,'Take with fatty meal for better absorption'),
('{RX2}','Amlodipine 5mg','5mg','Once daily','Ongoing','after-food','oral',1,5,'Take at same time daily'),
('{RX2}','Metformin 500mg','500mg','Twice daily','Ongoing','with-food','oral',2,5,'Monitor blood sugar regularly'),
('{RX3}','Levothyroxine 50mcg','50mcg','Once daily','Ongoing','empty-stomach','oral',1,6,'Take 30 min before breakfast'),
('{RX4}','Prenatal Vitamins','1 tablet','Once daily','Throughout pregnancy','after-food','oral',1,0,'Take with evening meal'),
('{RX4}','Iron Supplement 65mg','65mg','Once daily','Throughout pregnancy','after-food','oral',1,0,'Take with Vitamin C for absorption');""")
Q("")

# ====================================================================
# PRESCRIPTION_TESTS
# ====================================================================
Q("-- PRESCRIPTION_TESTS")
Q(f"""INSERT INTO `prescription_tests` (`prescription_id`,`test_name`,`test_type`,`instructions`,`is_urgent`,`result_url`) VALUES
('{RX1}','25-OH Vitamin D','Blood Test','Fasting not required',0,NULL),
('{RX2}','Lipid Profile','Blood Test','Fasting 12 hours required',0,NULL),
('{RX2}','HbA1c','Blood Test','No special preparation',0,NULL),
('{RX3}','TSH','Blood Test','Early morning, fasting',0,NULL),
('{RX4}','Complete Blood Count','Blood Test','Fasting not required',0,NULL),
('{RX4}','Glucose Tolerance Test','Blood Test','Fasting 8 hours required',0,NULL);""")
Q("")

# ====================================================================
# PATIENT_MEDICAL_HISTORY
# ====================================================================
Q("-- PATIENT_MEDICAL_HISTORY")
Q(f"""INSERT INTO `patient_medical_history` (`patient_id`,`condition_name`,`diagnosed_date`,`status`,`notes`) VALUES
('{U_P1}','Vitamin D Deficiency','2026-01-15','managed','Mild deficiency, on supplementation'),
('{U_P2}','Mild Asthma','2020-03-10','managed','Well-controlled with inhaler'),
('{U_P5}','Type 2 Diabetes','2018-06-20','ongoing','Managed with Metformin and lifestyle'),
('{U_P5}','Essential Hypertension','2019-01-15','managed','On Amlodipine, BP well controlled'),
('{U_P9}','Hypothyroidism','2022-04-01','managed','On Levothyroxine, TSH stable'),
('{U_P10}','Generalized Anxiety Disorder','2023-08-15','managed','On therapy, doing well'),
('{U_P4}','Migraine','2019-05-20','managed','Occasional episodes, triggers identified');""")
Q("")

# ====================================================================
# PATIENT_FAMILY_HISTORY
# ====================================================================
Q("-- PATIENT_FAMILY_HISTORY")
Q(f"""INSERT INTO `patient_family_history` (`patient_id`,`relation`,`condition_name`,`notes`) VALUES
('{U_P1}','father','Coronary Artery Disease','Bypass surgery at age 60'),
('{U_P2}','mother','Diabetes Type 2','Diagnosed at age 55'),
('{U_P5}','father','Diabetes Type 2','Diet-controlled'),
('{U_P5}','mother','Hypertension','On medication since age 50'),
('{U_P9}','mother','Hypothyroidism','Autoimmune origin'),
('{U_P10}','father','Depression','Chronic condition');""")
Q("")

# ====================================================================
# PATIENT_VACCINATIONS
# ====================================================================
Q("-- PATIENT_VACCINATIONS")
Q(f"""INSERT INTO `patient_vaccinations` (`patient_id`,`vaccine_name`,`disease`,`dose_number`,`scheduled_date`,`administered_at`,`next_due_date`,`administered_by`,`facility_name`,`hospital_name`,`batch_number`,`status`,`side_effects`,`notes`) VALUES
('{U_P1}','COVID-19 Booster','COVID-19',1,'2026-04-15','2026-04-15','2027-04-15','Dr. Sarah Mitchell','City General Hospital','City General Hospital','CVT-2026-0415','completed','Mild soreness at injection site','Pfizer-BioNTech'),
('{U_P2}','Influenza Vaccine','Influenza',1,'2026-10-01',NULL,'2027-10-01',NULL,'Metro Medical Center',NULL,NULL,'scheduled',NULL,'Annual flu shot'),
('{U_P3}','Hepatitis B','Hepatitis B',3,'2026-03-01','2026-03-01',NULL,'Dr. David Brown','City General Hospital','City General Hospital','HBT-2026-0301','completed',NULL,'Final dose in series'),
('{U_P4}','TDaP','Tetanus, Diphtheria, Pertussis',1,'2026-01-20','2026-01-20',NULL,'Dr. Anita Desai','City General Hospital','City General Hospital','TDP-2026-0120','completed',NULL,'Pregnancy dose'),
('{U_P7}','TDaP','Tetanus, Diphtheria, Pertussis',1,'2026-05-10','2026-05-10',NULL,'Dr. Anita Desai','City General Hospital','City General Hospital','TDP-2026-0510','completed','Mild arm soreness','Pregnancy dose'),
('{U_P8}','COVID-19 Booster','COVID-19',1,'2026-05-01','2026-05-01','2027-05-01','Dr. Meera Patel','City General Hospital','City General Hospital','CVT-2026-0501','completed',NULL,'Moderna');""")
Q("")

# ====================================================================
# PATIENT_MEDICATIONS
# ====================================================================
Q("-- PATIENT_MEDICATIONS")
Q(f"""INSERT INTO `patient_medications` (`patient_id`,`medicine_name`,`dosage`,`frequency`,`route`,`start_date`,`end_date`,`prescribed_by`,`prescription_id`,`is_active`,`reminder_time`,`reminder_enabled`,`notes`) VALUES
('{U_P1}','Vitamin D3 1000IU','1000IU','Once daily','oral','2026-01-20',NULL,7,'{RX1}',1,'08:00:00',1,'Take with breakfast'),
('{U_P5}','Amlodipine 5mg','5mg','Once daily','oral','2019-01-15',NULL,1,'{RX2}',1,'07:00:00',1,'Morning dose'),
('{U_P5}','Metformin 500mg','500mg','Twice daily','oral','2018-06-25',NULL,1,'{RX2}',1,'08:00:00',1,'With meals'),
('{U_P9}','Levothyroxine 50mcg','50mcg','Once daily','oral','2022-04-15',NULL,7,'{RX3}',1,'06:30:00',1,'30 min before breakfast'),
('{U_P7}','Prenatal Vitamins','1 tablet','Once daily','oral','2026-03-10',NULL,3,'{RX4}',1,'20:00:00',1,'With evening meal'),
('{U_P7}','Iron Supplement 65mg','65mg','Once daily','oral','2026-03-10',NULL,3,'{RX4}',1,'12:00:00',1,'Take with Vitamin C'),
('{U_P2}','Salbutamol Inhaler','2 puffs','As needed','inhalation','2020-03-15',NULL,NULL,NULL,1,NULL,0,'For acute asthma episodes');""")
Q("")

# ====================================================================
# PATIENT_SURGERIES
# ====================================================================
Q("-- PATIENT_SURGERIES")
Q(f"""INSERT INTO `patient_surgeries` (`patient_id`,`surgery_name`,`surgery_date`,`hospital`,`doctor_name`,`notes`) VALUES
('{U_P3}','ACL Reconstruction','2025-11-15','Metro Medical Center','Dr. James Wilson','Full recovery expected in 9 months'),
('{U_P5}','Cataract Surgery','2024-08-20','City General Hospital','Dr. Robert Chen','Successful, no complications');""")
Q("")

# ====================================================================
# PATIENT_HEALTH_RECORDS
# ====================================================================
HR1 = U("hr1"); HR2 = U("hr2"); HR3 = U("hr3"); HR4 = U("hr4"); HR5 = U("hr5"); HR6 = U("hr6"); HR7 = U("hr7")
Q("-- PATIENT_HEALTH_RECORDS")
Q(f"""INSERT INTO `patient_health_records` (`id`,`patient_id`,`record_type`,`title`,`description`,`file_url`,`file_type`,`file_size`,`recorded_by`,`is_shared`) VALUES
('{HR1}','{U_P1}','lab_report','Complete Blood Count','Annual checkup CBC results','/uploads/records/cbc_2026.pdf','pdf',245000,'{U_D7}',0),
('{HR2}','{U_P1}','measurement','Blood Pressure Reading','BP: 128/82 mmHg',NULL,NULL,NULL,'{U_D1}',0),
('{HR3}','{U_P5}','lab_report','HbA1c Result','HbA1c: 6.8%','/uploads/records/hba1c_2026.pdf','pdf',180000,'{U_D1}',0),
('{HR4}','{U_P5}','lab_report','Lipid Profile','Total Cholesterol: 210 mg/dL','/uploads/records/lipid_2026.pdf','pdf',195000,'{U_D1}',0),
('{HR5}','{U_P9}','lab_report','Thyroid Panel','TSH: 3.2 mIU/L','/uploads/records/thyroid_2026.pdf','pdf',210000,'{U_D7}',0),
('{HR6}','{U_P4}','imaging','Obstetric Ultrasound','28-week growth scan','/uploads/records/us_28w.pdf','pdf',5200000,'{U_D3}',0),
('{HR7}','{U_P2}','document','Asthma Action Plan','Updated asthma management plan','/uploads/records/asthma_plan.pdf','pdf',150000,'{U_D7}',1);""")
Q("")

# ====================================================================
# MEDICINE_ORDERS
# ====================================================================
MO1 = U("mo1"); MO2 = U("mo2"); MO3 = U("mo3"); MO4 = U("mo4"); MO5 = U("mo5")
Q("-- MEDICINE_ORDERS")
Q(f"""INSERT INTO `medicine_orders` (`id`,`order_number`,`patient_id`,`pharmacy_id`,`prescription_id`,`total_amount`,`discount`,`final_amount`,`payment_method`,`payment_status`,`delivery_address`,`delivery_status`,`order_status`,`created_at`,`updated_at`) VALUES
('{MO1}','ORD-2026-001','{U_P5}','{P1}','{RX2}',45.97,5.00,40.97,'card','paid','170 Grand Ave, Houston, TX','delivered','delivered','2026-05-20 10:00:00','2026-05-22 14:00:00'),
('{MO2}','ORD-2026-002','{U_P1}','{P1}','{RX1}',10.99,0.00,10.99,'online','paid','742 Evergreen Terrace, Springfield, IL','delivered','delivered','2026-05-15 11:00:00','2026-05-18 09:00:00'),
('{MO3}','ORD-2026-003','{U_P9}','{P2}','{RX3}',8.49,0.00,8.49,'card','paid','401 S Carson St, Carson City, NV','in-transit','shipped','2026-05-28 08:00:00','2026-05-30 06:00:00'),
('{MO4}','ORD-2026-004','{U_P7}','{P1}','{RX4}',36.98,2.00,34.98,'insurance','pending','100 Market St, San Francisco, CA','pending','confirmed','2026-05-29 12:00:00','2026-05-29 12:00:00'),
('{MO5}','ORD-2026-005','{U_P2}','{P1}',NULL,24.97,0.00,24.97,'cash','paid','1600 Pennsylvania Ave, Washington, DC','delivered','delivered','2026-05-10 15:00:00','2026-05-13 10:00:00');""")
Q("")

# ====================================================================
# ORDER_ITEMS
# ====================================================================
Q("-- ORDER_ITEMS")
Q(f"""INSERT INTO `order_items` (`order_id`,`inventory_id`,`medicine_name`,`quantity`,`unit_price`) VALUES
('{MO1}',2,'Metformin 500mg',2,8.99),
('{MO1}',7,'Amlodipine 5mg',1,9.99),
('{MO1}',4,'Omeprazole 20mg',1,6.99),
('{MO2}',12,'Vitamin D3 1000IU',1,3.99),
('{MO3}',10,'Levothyroxine 50mcg',1,8.49),
('{MO4}',15,'Prenatal Vitamins',1,16.99),
('{MO4}',5,'Cetirizine 10mg',1,4.99),
('{MO5}',14,'Salbutamol Inhaler',1,21.99),
('{MO5}',6,'Cetirizine 10mg',1,3.99);""")
Q("")

# ====================================================================
# MEDICINE_REMINDERS
# ====================================================================
Q("-- MEDICINE_REMINDERS")
Q(f"""INSERT INTO `medicine_reminders` (`patient_id`,`medication_id`,`medicine_name`,`dosage`,`frequency`,`reminder_times`,`start_date`,`end_date`,`is_active`,`notes`) VALUES
('{U_P5}',2,'Metformin 500mg','500mg','Twice daily','["08:00","20:00"]','2018-06-25',NULL,1,'Take with meals'),
('{U_P5}',3,'Amlodipine 5mg','5mg','Once daily','["07:00"]','2019-01-15',NULL,1,'Morning dose'),
('{U_P9}',4,'Levothyroxine 50mcg','50mcg','Once daily','["06:30"]','2022-04-15',NULL,1,'30 min before breakfast'),
('{U_P7}',5,'Prenatal Vitamins','1 tablet','Once daily','["20:00"]','2026-03-10',NULL,1,'With evening meal'),
('{U_P1}',1,'Vitamin D3 1000IU','1000IU','Once daily','["08:00"]','2026-01-20','2026-10-20',1,'Take with breakfast');""")
Q("")

# ====================================================================
# BILLING_INVOICES
# ====================================================================
INV1 = U("inv1"); INV2 = U("inv2"); INV3 = U("inv3"); INV4 = U("inv4")
Q("-- BILLING_INVOICES")
Q(f"""INSERT INTO `billing_invoices` (`id`,`patient_id`,`appointment_id`,`invoice_number`,`amount`,`tax`,`discount`,`total_amount`,`payment_method`,`payment_status`,`insurance_provider`,`insurance_policy_number`,`insurance_coverage`,`patient_responsibility`,`due_date`,`paid_at`) VALUES
('{INV1}','{U_P1}','{APT10}','INV-2026-001',120.00,10.80,0.00,130.80,'card','paid',NULL,NULL,0.00,130.80,NULL,'2026-05-15 09:20:00'),
('{INV2}','{U_P5}','{APT2}','INV-2026-002',100.00,9.00,0.00,109.00,'card','paid',NULL,NULL,0.00,109.00,NULL,'2026-05-20 11:35:00'),
('{INV3}','{U_P4}','{APT4}','INV-2026-003',300.00,27.00,0.00,327.00,'insurance','paid','Cigna','CG-2024-67890',261.60,65.40,NULL,'2026-05-20 08:10:00'),
('{INV4}','{U_P9}','{APT8}','INV-2026-004',50.00,4.50,0.00,54.50,'card','paid',NULL,NULL,0.00,54.50,NULL,'2026-05-28 14:20:00');""")
Q("")

# ====================================================================
# AMBULANCE_REQUESTS
# ====================================================================
AMBR1 = U("ambr1"); AMBR2 = U("ambr2"); AMBR3 = U("ambr3")
Q("-- AMBULANCE_REQUESTS")
Q(f"""INSERT INTO `ambulance_requests` (`id`,`requested_by`,`patient_name`,`patient_phone`,`pickup_latitude`,`pickup_longitude`,`pickup_address`,`drop_address`,`emergency_type`,`passenger_count`,`needs_oxygen`,`status`,`ambulance_id`,`estimated_arrival`,`hospital_id`,`dispatched_at`) VALUES
('{AMBR1}','{U_P5}','Amit Kumar','+1-555-0505',29.7500,-95.3600,'170 Grand Ave, Houston, TX','100 Medical Center Blvd, Houston, TX','Heart Attack',1,1,'completed',1,12,'{H1}','2026-04-10 14:00:00'),
('{AMBR2}','{U_EV1}','Emergency Patient','+1-555-0711',42.3600,-71.0700,'Downtown Boston','55 Fruit Street, Boston, MA','Accident',2,0,'completed',4,8,'{H2}','2026-03-20 22:00:00'),
('{AMBR3}','{U_P2}','Emily Davis','+1-555-0502',38.9000,-77.0400,'Downtown Washington','100 Medical Center Blvd, Houston, TX','Respiratory Distress',1,1,'dispatched',NULL,15,'{H1}',NULL);""")
Q("")

# ====================================================================
# EMERGENCY_SERVICES
# ====================================================================
Q("-- EMERGENCY_SERVICES")
Q("""INSERT INTO `emergency_services` (`name`,`type`,`status`,`provider`,`phone`,`latitude`,`longitude`,`address`,`eta_minutes`,`capacity`,`current_load`,`vehicle_number`,`crew_members`,`equipment`,`rating`,`price`) VALUES
('City General Ambulance Service','ambulance','available','City General Hospital','+1-555-9111',29.7064,-95.4007,'100 Medical Center Blvd',12,5,2,'AMB-001',3,'["Defibrillator","Oxygen","Stretcher"]',4.5,150.00),
('Metro Emergency Response','ambulance','busy','Metro Medical Center','+1-555-9112',42.3631,-71.0688,'55 Fruit Street',15,3,3,'AMB-002',2,'["Oxygen","First Aid"]',4.2,120.00),
('Sunrise Medical Transport','ambulance','available','Sunrise Specialty Hospital','+1-555-9113',37.7749,-122.4194,'200 Wellness Drive',18,2,0,'AMB-003',2,'["Oxygen","Stretcher","Monitor"]',4.7,180.00),
('Red Cross Blood Service','blood','available','Red Cross','+1-555-9120',29.7600,-95.3700,'Red Cross Center, Houston',30,NULL,NULL,NULL,NULL,'[]',4.6,NULL),
('AirLinx Oxygen Supply','oxygen','available','AirLinx Medical','+1-555-9001',29.7100,-95.3950,'AirLinx Warehouse, Houston',45,NULL,NULL,NULL,NULL,'[]',4.4,NULL),
('Dr. On-Call Emergency','doctor','available','Aetherion Health','+1-555-9130',29.7200,-95.4100,'Virtual Service',5,NULL,NULL,NULL,NULL,'[]',4.8,200.00);""")
Q("")

# ====================================================================
# OXYGEN_REQUESTS
# ====================================================================
Q("-- OXYGEN_REQUESTS")
Q("""INSERT INTO `oxygen_requests` (`request_number`,`patient_name`,`patient_age`,`patient_condition`,`oxygen_type`,`cylinders_needed`,`urgency`,`hospital_name`,`doctor_name`,`status`,`delivery_address`,`contact_phone`,`request_date`,`required_date`) VALUES
('O2-2026-001','Amit Kumar',55,'COPD Exacerbation','B-type (50L)',2,'urgent','City General Hospital','Dr. Sarah Mitchell','approved','170 Grand Ave, Houston, TX','+1-555-0505','2026-05-28','2026-05-29'),
('O2-2026-002','Emergency Patient',72,'Severe Pneumonia','A-type (10L)',1,'emergency','Metro Medical Center','Dr. David Brown','dispatched','45 Park Ave, Boston, MA','+1-555-0712','2026-05-30','2026-05-30'),
('O2-2026-003','Home Care Patient',65,'Chronic Oxygen Therapy','C-type (5L)',3,'normal','Sunrise Specialty Hospital','Dr. Michael Lee','pending','300 Oak St, San Francisco, CA','+1-555-0713','2026-05-31','2026-06-02');""")
Q("")

# ====================================================================
# AI_CONVERSATIONS
# ====================================================================
CONV1 = U("conv1"); CONV2 = U("conv2"); CONV3 = U("conv3"); CONV4 = U("conv4"); CONV5 = U("conv5"); CONV6 = U("conv6")
Q("-- AI_CONVERSATIONS")
Q(f"""INSERT INTO `ai_conversations` (`id`,`user_id`,`title`,`status`) VALUES
('{CONV1}','{U_P1}','Heart Health Discussion','active'),
('{CONV2}','{U_P2}','Asthma Management Tips','active'),
('{CONV3}','{U_P5}','Diabetes Diet Plan','active'),
('{CONV4}','{U_P7}','Pregnancy Week 22 Guide','active'),
('{CONV5}','{U_P3}','Knee Rehabilitation','archived'),
('{CONV6}','{U_P9}','Thyroid Questions','active');""")
Q("")

# ====================================================================
# AI_MESSAGES
# ====================================================================
MSG1 = U("msg1"); MSG2 = U("msg2"); MSG3 = U("msg3"); MSG4 = U("msg4"); MSG5 = U("msg5"); MSG6 = U("msg6")
Q("-- AI_MESSAGES")
Q(f"""INSERT INTO `ai_messages` (`id`,`conversation_id`,`role`,`content`,`type`,`emotion`,`confidence`,`suggestions`) VALUES
('{MSG1}','{CONV1}','user','I have been having chest pain when exercising. Should I be concerned?','text',NULL,NULL,NULL),
('{MSG2}','{CONV1}','assistant','Chest pain during exercise can be a sign of angina or other cardiac conditions. I recommend scheduling an appointment with a cardiologist immediately. Dr. Sarah Mitchell at City General Hospital specializes in cardiology and has excellent ratings.','text','concerned',0.85,'["Schedule appointment with Dr. Sarah Mitchell","Learn about angina symptoms","Read about heart-healthy exercises"]'),
('{MSG3}','{CONV4}','user','What should I expect at 22 weeks pregnant?','text',NULL,NULL,NULL),
('{MSG4}','{CONV4}','assistant','At 22 weeks, your baby is about the size of a papaya! You may notice more movement, and your belly is showing. Common experiences include: back pain, Braxton Hicks contractions, and increased appetite. Make sure to continue prenatal vitamins and attend all scheduled checkups.','text','happy',0.92,'["Track your pregnancy symptoms","Schedule prenatal checkup","Read about 22-week milestones"]'),
('{MSG5}','{CONV3}','user','What foods should I avoid with Type 2 diabetes?','text',NULL,NULL,NULL),
('{MSG6}','{CONV3}','assistant','With Type 2 diabetes, limit or avoid: refined sugars, white bread, sugary drinks, processed snacks, and high-glycemic fruits. Focus on: whole grains, lean proteins, vegetables, and healthy fats. Your HbA1c of 6.8% shows good control - keep up the Metformin and balanced diet!','suggestion','neutral',0.88,'["View diabetic meal plans","Monitor blood sugar levels","Read about Metformin"]');""")
Q("")

# ====================================================================
# AI_VOICE_SESSIONS
# ====================================================================
VS1 = U("vs1"); VS2 = U("vs2")
Q("-- AI_VOICE_SESSIONS")
Q(f"""INSERT INTO `ai_voice_sessions` (`id`,`user_id`,`transcript`,`audio_url`) VALUES
('{VS1}','{U_P1}','I have been feeling tired lately and want to check my vitamin levels.','/uploads/voice/vs1.webm'),
('{VS2}','{U_P5}','Can you remind me about my blood pressure medication schedule?','/uploads/voice/vs2.webm');""")
Q("")

# ====================================================================
# NOTIFICATIONS
# ====================================================================
NOTIF1 = U("notif1"); NOTIF2 = U("notif2"); NOTIF3 = U("notif3")
NOTIF4 = U("notif4"); NOTIF5 = U("notif5"); NOTIF6 = U("notif6"); NOTIF7 = U("notif7")
Q("-- NOTIFICATIONS")
Q(f"""INSERT INTO `notifications` (`id`,`user_id`,`type`,`title`,`body`,`priority`,`is_read`,`created_at`) VALUES
('{NOTIF1}','{U_P1}','appointment_reminder','Upcoming Appointment','Your appointment with Dr. Sarah Mitchell is tomorrow at 10:00 AM','high',0,'2026-06-01 09:00:00'),
('{NOTIF2}','{U_P5}','prescription','Prescription Refill Due','Your Metformin prescription is due for refill in 5 days','medium',0,'2026-05-30 10:00:00'),
('{NOTIF3}','{U_P7}','health_tip','Pregnancy Tip of the Day','Stay hydrated during pregnancy. Aim for 8-10 glasses of water daily.','low',1,'2026-05-29 08:00:00'),
('{NOTIF4}','{U_BD1}','donation_reminder','Donation Eligible','You are now eligible to donate blood again! Schedule your next donation.','medium',0,'2026-05-28 10:00:00'),
('{NOTIF5}','{U_D1}','appointment','New Appointment Booked','Aarav Sharma has booked a consultation for June 2nd','high',0,'2026-05-28 09:05:00'),
('{NOTIF6}','{U_P2}','system','Welcome to Aetherion Health','Complete your health profile to get personalized recommendations','medium',1,'2026-01-25 00:00:00'),
('{NOTIF7}','{U_D3}','appointment','Upcoming Appointment','Sophia Martinez prenatal checkup tomorrow at 2:00 PM','high',0,'2026-06-01 08:00:00');""")
Q("")

# ====================================================================
# DOCTOR_NOTIFICATIONS
# ====================================================================
Q("-- DOCTOR_NOTIFICATIONS")
Q("""INSERT INTO `doctor_notifications` (`doctor_id`,`type`,`title`,`message`,`priority`,`is_read`) VALUES
(1,'appointment','New Appointment','Aarav Sharma booked for June 2nd, 10:00 AM','high',0),
(3,'appointment','Appointment Confirmed','Sophia Martinez confirmed for June 2nd, 2:00 PM','medium',1),
(7,'prescription','Prescription Refill Request','Thomas Anderson requested a refill for Levothyroxine','medium',0),
(5,'review','New Review','Marcus Johnson left a 5-star review','low',1),
(1,'blood_request','Blood Request','Emergency O+ blood needed for surgery','urgent',0);""")
Q("")

# ====================================================================
# DOCTOR_ACTIVITIES
# ====================================================================
Q("-- DOCTOR_ACTIVITIES")
Q("""INSERT INTO `doctor_activities` (`doctor_id`,`type`,`description`,`patient_name`,`status`,`created_at`) VALUES
(1,'appointment','Completed consultation with Aarav Sharma','Aarav Sharma','completed','2026-05-15 09:30:00'),
(1,'prescription','Wrote prescription for Amit Kumar','Amit Kumar','completed','2026-05-20 11:45:00'),
(3,'consultation','Prenatal checkup - 28 weeks','Sophia Martinez','completed','2026-05-20 14:30:00'),
(7,'appointment','General health checkup completed','Aarav Sharma','completed','2026-05-15 09:15:00'),
(7,'prescription','Refilled prescription for Kavita Reddy','Kavita Reddy','completed','2026-05-28 14:20:00'),
(2,'appointment','ACL follow-up assessment','Rohan Patel','completed','2026-04-15 10:00:00');""")
Q("")

# ====================================================================
# DOCTOR_EARNINGS
# ====================================================================
Q("-- DOCTOR_EARNINGS")
Q("""INSERT INTO `doctor_earnings` (`doctor_id`,`earning_date`,`consultation_revenue`,`video_revenue`,`follow_up_revenue`,`total_revenue`,`total_appointments`,`completed_appointments`) VALUES
(1,'2026-05-28',1250.00,600.00,200.00,2050.00,8,7),
(1,'2026-05-27',1000.00,450.00,150.00,1600.00,6,6),
(3,'2026-05-28',1800.00,700.00,300.00,2800.00,10,9),
(7,'2026-05-28',600.00,200.00,100.00,900.00,12,11),
(7,'2026-05-27',480.00,150.00,50.00,680.00,8,7);""")
Q("")

# ====================================================================
# MESSAGES
# ====================================================================
MSG_D1 = U("msg_d1"); MSG_P1 = U("msg_p1"); MSG_D3 = U("msg_d3")
MSG_D7 = U("msg_d7"); MSG_P7 = U("msg_p7")
Q("-- MESSAGES")
Q(f"""INSERT INTO `messages` (`id`,`sender_id`,`receiver_id`,`appointment_id`,`message_body`,`message_type`,`is_read`,`created_at`) VALUES
('{MSG_D1}','{U_D1}','{U_P1}','{APT1}','Hi Aarav, please bring your previous ECG reports to the appointment tomorrow.','text',0,'2026-06-01 08:00:00'),
('{MSG_P1}','{U_P1}','{U_D1}','{APT1}','Thank you Dr. Mitchell, I will bring them along.','text',1,'2026-06-01 08:15:00'),
('{MSG_D3}','{U_D3}','{U_P4}','{APT4}','Sophia, your lab results look good. See you at the next checkup.','text',1,'2026-05-22 16:00:00'),
('{MSG_D7}','{U_D7}','{U_P9}','{APT8}','Kavita, please get fasting blood work done before our next visit.','text',0,'2026-05-28 14:30:00'),
('{MSG_P7}','{U_P7}','{U_D3}','{APT5}','Dr. Desai, I felt the baby moving more today. Is that normal at 22 weeks?','text',0,'2026-05-30 20:00:00');""")
Q("")

# ====================================================================
# VIDEO_CONSULTATIONS
# ====================================================================
VC1 = U("vc1")
Q("-- VIDEO_CONSULTATIONS")
Q(f"""INSERT INTO `video_consultations` (`id`,`appointment_id`,`doctor_id`,`patient_id`,`room_id`,`status`,`notes`) VALUES
('{VC1}','{APT9}',6,'{U_P6}','room-jessica-skin-0605','scheduled',NULL);""")
Q("")

# ====================================================================
# WOMEN_MENSTRUAL_CYCLES
# ====================================================================
Q("-- WOMEN_MENSTRUAL_CYCLES")
Q(f"""INSERT INTO `women_menstrual_cycles` (`user_id`,`start_date`,`end_date`,`cycle_length`,`period_length`,`flow_intensity`,`is_regular`,`symptoms`,`mood`,`notes`,`next_period_date`,`ovulation_date`,`fertile_window_start`,`fertile_window_end`,`reminder_enabled`) VALUES
('{U_P4}','2026-04-28','2026-05-02',28,5,'medium',1,'["Mild Cramps","Bloating"]','Stable',NULL,'2026-05-26','2026-05-12','2026-05-09','2026-05-14',1),
('{U_P7}','2026-05-10',NULL,30,4,'light',1,'["Mild Fatigue"]','Good','Currently pregnant - no cycle',NULL,NULL,NULL,NULL,0),
('{U_P9}','2026-05-20','2026-05-24',32,5,'medium',0,'["Cramps","Headache","Fatigue"]','Irritable','Irregular cycles due to thyroid','2026-06-21','2026-06-07','2026-06-04','2026-06-09',1);""")
Q("")

# ====================================================================
# WOMEN_PREGNANCIES
# ====================================================================
Q("-- WOMEN_PREGNANCIES")
Q(f"""INSERT INTO `women_pregnancies` (`id`,`user_id`,`lmp_date`,`estimated_due_date`,`current_week`,`current_trimester`,`pregnancy_number`,`is_first_pregnancy`,`high_risk`,`risk_notes`,`assigned_doctor_id`,`baby_gender`,`baby_name`,`status`,`delivery_date`,`delivery_type`) VALUES
(1,'{U_P4}','2025-11-15','2026-08-22',28,'third',2,0,0,NULL,3,'girl',NULL,'active',NULL,NULL),
(2,'{U_P7}','2025-12-20','2026-09-25',22,'second',1,1,1,'History of preeclampsia in family',3,'unknown',NULL,'active',NULL,NULL);""")
Q("")

# ====================================================================
# WOMEN_PREGNANCY_TRACKING
# ====================================================================
Q("-- WOMEN_PREGNANCY_TRACKING")
Q("""INSERT INTO `women_pregnancy_tracking` (`pregnancy_id`,`week_number`,`weight_kg`,`blood_pressure_systolic`,`blood_pressure_diastolic`,`blood_sugar`,`blood_sugar_type`,`hemoglobin`,`fetal_movement_count`,`symptoms`,`notes`,`recorded_at`) VALUES
(1,28,72.0,118,76,95.0,'fasting',12.1,10,'["Mild Back Pain"]','All vitals normal','2026-05-20'),
(1,24,70.0,115,74,88.0,'fasting',12.5,8,'["Heartburn"]','Growth on track','2026-04-22'),
(2,22,64.0,122,80,102.0,'post-meal',11.8,6,'["Fatigue","Mild Swelling"]','Monitoring closely for preeclampsia','2026-05-28'),
(2,18,62.0,118,78,90.0,'fasting',12.2,4,'["Morning Sickness"]','Second trimester improvement','2026-04-30');""")
Q("")

# ====================================================================
# BABY_PROFILES
# ====================================================================
Q("-- BABY_PROFILES")
Q(f"""INSERT INTO `baby_profiles` (`mother_id`,`baby_name`,`date_of_birth`,`gender`,`blood_group`,`pregnancy_id`) VALUES
('{U_P4}','Emma Martinez','2024-03-15','girl','O+',1);""")
Q("")

# ====================================================================
# BABY_VACCINE_RECORDS
# ====================================================================
Q("-- BABY_VACCINE_RECORDS")
Q("""INSERT INTO `baby_vaccine_records` (`baby_id`,`vaccine_name`,`disease`,`dose_number`,`scheduled_date`,`administered_date`,`administered_by`,`hospital_name`,`status`,`next_dose_date`) VALUES
(1,'BCG','Tuberculosis',1,'2024-03-15','2024-03-15','Dr. Meera Patel','City General Hospital','completed','2026-03-15'),
(1,'Hepatitis B','Hepatitis B',1,'2024-03-15','2024-03-15','Dr. Meera Patel','City General Hospital','completed',NULL),
(1,'OPV','Polio',1,'2024-04-15','2024-04-15','Dr. Meera Patel','City General Hospital','completed','2024-06-15'),
(1,'DPT','Diphtheria, Pertussis, Tetanus',1,'2024-06-15','2024-06-15','Dr. Meera Patel','City General Hospital','completed','2024-10-15'),
(1,'MMR','Measles, Mumps, Rubella',1,'2025-03-15','2025-03-15','Dr. Meera Patel','City General Hospital','completed',NULL);""")
Q("")

# ====================================================================
# BABY_GROWTH_RECORDS
# ====================================================================
Q("-- BABY_GROWTH_RECORDS")
Q("""INSERT INTO `baby_growth_records` (`baby_id`,`record_date`,`age_months`,`weight_kg`,`height_cm`,`head_circumference_cm`,`bmi`) VALUES
(1,'2024-04-15',1,4.2,54.5,37.0,14.12),
(1,'2024-06-15',3,5.8,60.2,39.5,16.02),
(1,'2024-09-15',6,7.5,66.0,42.0,17.20),
(1,'2024-12-15',9,8.8,70.5,44.0,17.69),
(1,'2025-03-15',12,9.5,74.0,45.5,17.30),
(1,'2025-09-15',18,10.8,80.0,47.0,16.88),
(1,'2026-03-15',24,12.0,86.0,48.5,16.20);""")
Q("")

# ====================================================================
# DEVELOPMENT_MILESTONES
# ====================================================================
Q("-- DEVELOPMENT_MILESTONES")
Q("""INSERT INTO `development_milestones` (`baby_id`,`category`,`name`,`expected_age_months`,`achieved_age_months`,`status`,`notes`) VALUES
(1,'physical','Held Head Up',2,2,'achieved','On track'),
(1,'physical','Rolled Over',4,4,'achieved','Both directions'),
(1,'physical','Sat Without Support',6,6,'achieved','Stable sitting'),
(1,'cognitive','First Smile',2,2,'achieved','Social smile'),
(1,'language','First Word',12,11,'achieved','Said mama'),
(1,'social','Waved Bye-Bye',10,10,'achieved','Responsive waving'),
(1,'physical','First Steps',12,13,'achieved','Walking independently'),
(1,'language','Two-Word Phrases',24,NULL,'pending','Working on it');""")
Q("")

# ====================================================================
# PREGNANCY_SYMPTOMS
# ====================================================================
Q("-- PREGNANCY_SYMPTOMS")
Q("""INSERT INTO `pregnancy_symptoms` (`pregnancy_id`,`symptom_name`,`severity`,`start_date`,`end_date`,`notes`) VALUES
(1,'Heartburn','moderate','2026-04-01',NULL,'Worse after spicy food'),
(1,'Back Pain','mild','2026-05-01',NULL,'Third trimester onset'),
(2,'Morning Sickness','moderate','2026-01-20','2026-03-15','Resolved in second trimester'),
(2,'Fatigue','mild','2026-02-01',NULL,'Ongoing, manageable');""")
Q("")

# ====================================================================
# PREGNANCY_MEDICATIONS
# ====================================================================
Q("-- PREGNANCY_MEDICATIONS")
Q(f"""INSERT INTO `pregnancy_medications` (`pregnancy_id`,`medicine_name`,`dosage`,`frequency`,`start_date`,`prescribed_by`,`purpose`,`is_safe`,`reminders`) VALUES
(1,'Prenatal Vitamins','1 tablet','Once daily','2025-11-15','Dr. Anita Desai','Nutritional support',1,0),
(1,'Iron Supplement','65mg','Once daily','2026-02-01','Dr. Anita Desai','Anemia prevention',1,0),
(2,'Prenatal Vitamins','1 tablet','Once daily','2025-12-20','Dr. Anita Desai','Nutritional support',1,1),
(2,'Low-Dose Aspirin','81mg','Once daily','2026-02-01','Dr. Anita Desai','Preeclampsia prevention',1,1);""")
Q("")

# ====================================================================
# WOMEN_PREGNANCY_ULTRASOUNDS
# ====================================================================
Q("-- WOMEN_PREGNANCY_ULTRASOUNDS")
Q("""INSERT INTO `women_pregnancy_ultrasounds` (`pregnancy_id`,`week_number`,`ultrasound_date`,`type`,`findings`,`images`,`report_url`,`performed_by`) VALUES
(1,12,'2026-02-07','Dating Scan','Normal single intrauterine pregnancy, CRL consistent with dates','["/uploads/ultrasound/p1-12w.jpg"]','/uploads/ultrasound/p1-12w-report.pdf','Dr. Anita Desai'),
(1,20,'2026-04-05','Anomaly Scan','All fetal measurements normal, no structural anomalies detected','["/uploads/ultrasound/p1-20w.jpg"]','/uploads/ultrasound/p1-20w-report.pdf','Dr. Anita Desai'),
(2,12,'2026-03-14','Dating Scan','Normal single intrauterine pregnancy','["/uploads/ultrasound/p2-12w.jpg"]','/uploads/ultrasound/p2-12w-report.pdf','Dr. Anita Desai'),
(2,20,'2026-05-08','Anomaly Scan','Normal anatomy, growth on 50th centile','["/uploads/ultrasound/p2-20w.jpg"]','/uploads/ultrasound/p2-20w-report.pdf','Dr. Anita Desai');""")
Q("")

# ====================================================================
# GYNECOLOGIST_CONSULTATIONS
# ====================================================================
Q("-- GYNECOLOGIST_CONSULTATIONS")
Q(f"""INSERT INTO `gynecologist_consultations` (`user_id`,`doctor_name`,`doctor_specialization`,`hospital_name`,`consultation_date`,`consultation_time`,`type`,`reason`,`diagnosis`,`prescription`,`follow_up_date`,`status`,`notes`) VALUES
('{U_P4}','Dr. Anita Desai','Gynecology','City General Hospital','2026-05-20','14:00:00','in-person','28-week prenatal checkup','Normal pregnancy progression','Continue prenatal vitamins and iron',NULL,'completed','All vitals normal'),
('{U_P7}','Dr. Anita Desai','Gynecology','City General Hospital','2026-05-28','15:00:00','in-person','22-week prenatal checkup','High-risk pregnancy, monitoring closely','Continue low-dose aspirin and prenatal vitamins','2026-06-11','completed','BP slightly elevated, monitoring');""")
Q("")

# ====================================================================
# WOMEN_HEALTH_NOTIFICATIONS
# ====================================================================
Q("-- WOMEN_HEALTH_NOTIFICATIONS")
Q(f"""INSERT INTO `women_health_notifications` (`user_id`,`type`,`title`,`message`,`priority`,`is_read`) VALUES
('{U_P4}','pregnancy','28-Week Milestone','You have reached 28 weeks! Third trimester begins. Time for glucose tolerance test.','medium',0),
('{U_P7}','appointment','Upcoming Checkup','Your prenatal checkup with Dr. Desai is scheduled for June 11th.','high',0),
('{U_P7}','health-tip','Pregnancy Nutrition','Increase iron-rich foods in your diet. Spinach, beans, and lean meat are great sources.','low',1),
('{U_P9}','cycle','Period Expected','Your period is expected in 3 days based on your cycle tracking.','medium',0);""")
Q("")

# ====================================================================
# WELLNESS_TRACKING
# ====================================================================
Q("-- WELLNESS_TRACKING")
Q(f"""INSERT INTO `wellness_tracking` (`user_id`,`tracking_type`,`record_date`,`metrics`,`notes`) VALUES
('{U_P1}','fitness','2026-05-28','{{"steps":8500,"calories":2200,"active_minutes":45,"distance_km":6.2}}','Good day, hit step goal'),
('{U_P1}','mental-health','2026-05-28','{{"mood_score":8,"stress_level":"low","meditation_minutes":15}}','Feeling positive'),
('{U_P5}','nutrition','2026-05-28','{{"calories":1800,"protein_g":85,"carbs_g":200,"fat_g":55,"water_glasses":8}}','Staying within diabetic meal plan'),
('{U_P3}','fitness','2026-05-27','{{"steps":12000,"calories":2800,"active_minutes":90,"distance_km":8.5}}','Intense workout day'),
('{U_P8}','fitness','2026-05-28','{{"steps":15000,"calories":3200,"active_minutes":120,"distance_km":10.5}}','Personal training session'),
('{U_P10}','mental-health','2026-05-27','{{"mood_score":6,"stress_level":"moderate","meditation_minutes":20}}','Therapy session helped'),
('{U_P2}','sleep','2026-05-28','{{"sleep_hours":7.5,"sleep_quality":"good","bedtime":"22:30","wakeup":"06:00"}}','Used inhaler before bed');""")
Q("")

# ====================================================================
# HEALTH_RECOMMENDATIONS
# ====================================================================
Q("-- HEALTH_RECOMMENDATIONS")
Q(f"""INSERT INTO `health_recommendations` (`patient_id`,`type`,`title`,`description`,`priority`,`category`,`is_read`) VALUES
('{U_P1}','food','Increase Omega-3 Intake','Add fatty fish like salmon to your diet 2-3 times per week for heart health.','medium','recommend',0),
('{U_P5}','food','Reduce Sodium Intake','Limit salt to less than 2300mg per day. Use herbs and spices instead.','high','recommend',1),
('{U_P5}','exercise','Daily Walking','30 minutes of moderate walking can significantly improve blood sugar control.','medium','recommend',0),
('{U_P9}','lifestyle','Regular Thyroid Testing','Get TSH levels checked every 6-8 weeks to ensure medication dosage is correct.','high','recommend',0),
('{U_P7}','food','Iron-Rich Foods','Increase iron intake with spinach, lentils, and lean meat during pregnancy.','medium','recommend',0),
('{U_P2}','warning','Avoid Allergen Exposure','Minimize exposure to pollen and latex to prevent asthma triggers.','high','avoid',1);""")
Q("")

# ====================================================================
# EMERGENCY_ANNOUNCEMENTS
# ====================================================================
Q("-- EMERGENCY_ANNOUNCEMENTS")
Q(f"""INSERT INTO `emergency_announcements` (`title`,`message`,`type`,`priority`,`target_audience`,`created_by`,`expires_at`,`is_active`) VALUES
('Blood Drive This Weekend','City General Hospital is hosting a blood drive this Saturday. Walk-ins welcome!','blood-camp','medium','public','{U_SA}','2026-06-16 23:59:59',1),
('Flu Season Advisory','Flu season is here. Get your flu shot at any participating pharmacy.','awareness','low','all','{U_AD}','2026-12-31 23:59:59',1),
('Emergency Services Update','All emergency services are currently operational. Average response time: 12 minutes.','general','medium','all','{U_SA}','2026-07-01 23:59:59',1);""")
Q("")

# ====================================================================
# HOSPITAL_ACTIVITIES
# ====================================================================
Q("-- HOSPITAL_ACTIVITIES")
Q(f"""INSERT INTO `hospital_activities` (`hospital_id`,`type`,`description`,`department`,`user_name`,`created_at`) VALUES
('{H1}','admission','New patient admitted to Cardiology ward','Cardiology','Aarav Sharma','2026-05-28 08:00:00'),
('{H1}','emergency','Emergency ambulance dispatched','Emergency',NULL,'2026-05-28 14:30:00'),
('{H1}','discharge','Patient discharged from Orthopedics','Orthopedics','Rohan Patel','2026-05-27 10:00:00'),
('{H2}','surgery','Knee arthroscopy completed','Orthopedics','Rohan Patel','2026-05-20 09:00:00'),
('{H3}','blood','Blood donation camp completed','Blood Bank','Maria Garcia','2026-05-20 16:00:00');""")
Q("")

# ====================================================================
# FEEDBACK
# ====================================================================
Q("-- FEEDBACK")
Q(f"""INSERT INTO `feedback` (`user_id`,`user_name`,`user_role`,`type`,`subject`,`message`,`rating`,`status`,`priority`) VALUES
('{U_P1}','Aarav Sharma','patient','review','Great Appointment Experience','Dr. Mitchell was very thorough and explained everything clearly. Highly recommended!',5,'reviewed','low'),
('{U_P3}','Rohan Patel','patient','suggestion','Add Video Consultation Feature','It would be great to have video consultation options for follow-up appointments.',NULL,'pending','medium'),
('{U_P5}','Amit Kumar','patient','complaint','Long Wait Time','I waited over 45 minutes beyond my scheduled appointment time.',2,'reviewed','medium'),
('{U_P2}','Emily Davis','patient','review','Excellent Prenatal Care','Dr. Desai is amazing. Very caring and professional throughout my pregnancy.',5,'reviewed','low'),
('{U_BD1}','Rahul Joshi','blood_donor','suggestion','Blood Donation Scheduling','Would love to see a feature for scheduling recurring donations.',NULL,'pending','low');""")
Q("")

# ====================================================================
# USER_REVIEWS
# ====================================================================
Q("-- USER_REVIEWS")
Q(f"""INSERT INTO `user_reviews` (`reviewer_id`,`reviewable_type`,`reviewable_id`,`rating`,`title`,`review_text`,`is_verified`) VALUES
('{U_P1}','doctor','1',5,'Excellent Cardiologist','Dr. Mitchell is incredibly knowledgeable and patient. She took the time to answer all my questions.',1),
('{U_P5}','doctor','1',4,'Good Doctor, Long Wait','Dr. Mitchell is great but the wait time can be quite long. Otherwise excellent care.',1),
('{U_P2}','doctor','3',5,'Best Gynecologist','Dr. Desai made me feel comfortable throughout my pregnancy. Highly recommend!',1),
('{U_P3}','doctor','2',5,'Expert Orthopedic Surgeon','Dr. Wilson did my ACL surgery. Recovery is going great!',1),
('{U_P1}','hospital','{H1}',4,'Good Hospital, Clean Facilities','City General Hospital has excellent facilities. The staff is friendly and professional.',1),
('{U_P8}','hospital','{H1}',5,'Great Pediatric Department','The pediatric team is wonderful. My child loves visiting Dr. Patel.',1),
('{U_P5}','pharmacy','{P1}',4,'Quick Delivery','HealthPlus Pharmacy delivers medicines quickly. Good service overall.',1);""")
Q("")

# ====================================================================
# USER_DOCUMENTS
# ====================================================================
Q("-- USER_DOCUMENTS")
Q(f"""INSERT INTO `user_documents` (`user_id`,`document_type`,`name`,`file_url`,`file_type`,`file_size`,`is_verified`,`verified_by`) VALUES
('{U_D1}','license','Medical License - Sarah Mitchell','/uploads/docs/md-license-mitchell.pdf','pdf',245000,1,'{U_SA}'),
('{U_D2}','license','Medical License - James Wilson','/uploads/docs/md-license-wilson.pdf','pdf',230000,1,'{U_SA}'),
('{U_D3}','license','Medical License - Anita Desai','/uploads/docs/md-license-desai.pdf','pdf',255000,1,'{U_SA}'),
('{U_BD1}','donation-certificate','Blood Donation Certificate','/uploads/docs/bd-cert-joshi.pdf','pdf',120000,1,'{U_SA}'),
('{U_P5}','id-proof','Insurance Card','/uploads/docs/insurance-kumar.jpg','jpg',85000,0,NULL);""")
Q("")

# ====================================================================
# VERIFICATION_REQUESTS
# ====================================================================
Q("-- VERIFICATION_REQUESTS")
Q(f"""INSERT INTO `verification_requests` (`entity_type`,`entity_id`,`entity_name`,`documents`,`status`,`submitted_date`,`reviewed_by`,`reviewed_date`) VALUES
('doctor','1','Dr. Sarah Mitchell','[{{"type":"license","name":"medical_license.pdf","fileUrl":"/uploads/docs/md-license-mitchell.pdf","verified":true}}]','approved','2026-01-20 10:00:00','{U_SA}','2026-02-01 10:00:00'),
('doctor','2','Dr. James Wilson','[{{"type":"license","name":"medical_license.pdf","fileUrl":"/uploads/docs/md-license-wilson.pdf","verified":true}}]','approved','2026-01-20 10:00:00','{U_SA}','2026-02-01 10:00:00'),
('hospital','{H1}','City General Hospital','[{{"type":"registration","name":"hospital_registration.pdf","fileUrl":"/uploads/docs/hosp-reg.pdf","verified":true}}]','approved','2026-01-15 10:00:00','{U_SA}','2026-02-01 10:00:00'),
('pharmacy','{P1}','HealthPlus Pharmacy','[{{"type":"license","name":"pharmacy_license.pdf","fileUrl":"/uploads/docs/pharm-license.pdf","verified":true}}]','approved','2026-01-18 10:00:00','{U_SA}','2026-02-01 10:00:00'),
('blood_donor','{U_BD1}','Rahul Joshi','[{{"type":"id-proof","name":"donor_id.pdf","fileUrl":"/uploads/docs/donor-id.pdf","verified":true}}]','approved','2026-02-01 10:00:00','{U_AD}','2026-02-05 10:00:00');""")
Q("")

# ====================================================================
# USER_ROLE_UPGRADES
# ====================================================================
Q("-- USER_ROLE_UPGRADES")
Q(f"""INSERT INTO `user_role_upgrades` (`user_id`,`upgrade_type`,`status`,`requested_at`,`reviewed_by`,`reviewed_at`) VALUES
('{U_BD1}','blood_donor','approved','2026-01-28 10:00:00','{U_AD}','2026-02-05 10:00:00'),
('{U_EV1}','emergency_volunteer','approved','2026-02-10 10:00:00','{U_SA}','2026-02-15 10:00:00'),
('{U_CL1}','client','approved','2026-02-20 10:00:00','{U_AD}','2026-02-25 10:00:00'),
('{U_P7}','client_patient','pending','2026-05-01 10:00:00',NULL,NULL);""")
Q("")

# ====================================================================
# STOCK_ALERTS
# ====================================================================
Q("-- STOCK_ALERTS")
Q(f"""INSERT INTO `stock_alerts` (`pharmacy_id`,`inventory_id`,`medicine_name`,`current_stock`,`min_stock`,`status`,`is_read`) VALUES
('{P1}',4,'Omeprazole 20mg',15,40,'low',0),
('{P1}',8,'Pantoprazole 40mg',8,40,'critical',0),
('{P2}',11,'Azithromycin 250mg',12,30,'low',1);""")
Q("")

# ====================================================================
# SEARCH_LOGS
# ====================================================================
Q("-- SEARCH_LOGS")
Q(f"""INSERT INTO `search_logs` (`user_id`,`query`,`search_type`,`results_count`,`created_at`) VALUES
('{U_P1}','cardiologist near me','doctor',5,'2026-05-28 09:00:00'),
('{U_P5}','diabetes doctor Houston','doctor',3,'2026-05-25 14:00:00'),
('{U_P3}','orthopedic surgeon','doctor',4,'2026-05-20 10:00:00'),
('{U_P7}','gynecologist pregnancy','doctor',6,'2026-03-05 08:00:00'),
('{U_P2}','pharmacy delivery','pharmacy',2,'2026-05-10 15:00:00'),
(NULL,'hospital emergency room','hospital',3,'2026-05-30 22:00:00'),
('{U_P4}','prenatal vitamins','medicine',8,'2026-05-15 11:00:00'),
('{U_BD1}','blood donation center','blood-donor',4,'2026-05-25 09:00:00');""")
Q("")

# ====================================================================
# AUDIT_LOGS
# ====================================================================
Q("-- AUDIT_LOGS")
Q(f"""INSERT INTO `audit_logs` (`user_id`,`action`,`entity_type`,`entity_id`,`ip_address`,`created_at`) VALUES
('{U_SA}','user.login','user','{U_SA}','192.168.1.1','2026-05-28 09:00:00'),
('{U_AD}','appointment.create','appointment','{APT1}','192.168.1.2','2026-05-28 09:05:00'),
('{U_D1}','prescription.write','prescription','{RX1}','192.168.1.3','2026-05-15 09:20:00'),
('{U_P1}','appointment.book','appointment','{APT1}','192.168.1.10','2026-05-28 09:00:00'),
('{U_SA}','hospital.verify','hospital','{H1}','192.168.1.1','2026-02-01 10:00:00'),
('{U_P5}','order.place','medicine_order','{MO1}','192.168.1.15','2026-05-20 10:00:00');""")
Q("")

# ====================================================================
# SECURITY_LOGS
# ====================================================================
Q("-- SECURITY_LOGS")
Q(f"""INSERT INTO `security_logs` (`event`,`user_id`,`user_name`,`ip_address`,`status`,`details`,`created_at`) VALUES
('login.success','{U_SA}','Rajesh Kumar','192.168.1.1','success','Admin login from trusted IP','2026-05-28 09:00:00'),
('login.success','{U_P1}','Aarav Sharma','192.168.1.10','success','Patient login','2026-05-28 07:00:00'),
('login.failed',NULL,'unknown','10.0.0.99','failed','Invalid credentials for admin@aetherion.health','2026-05-27 03:00:00'),
('password.change','{U_P2}','Emily Davis','192.168.1.20','success','Password changed successfully','2026-05-15 14:00:00'),
('api.rate_limit',NULL,'unknown','10.0.0.50','blocked','Rate limit exceeded: 100 requests/minute','2026-05-26 22:00:00');""")
Q("")

# ====================================================================
# SCHEDULED_MEETINGS
# ====================================================================
Q("-- SCHEDULED_MEETINGS")
Q(f"""INSERT INTO `scheduled_meetings` (`title`,`description`,`organizer_id`,`meeting_date`,`start_time`,`end_time`,`meeting_url`,`status`,`participants`) VALUES
('Weekly Medical Staff Review','Review patient cases and department updates','{U_SA}','2026-06-02','09:00:00','10:00:00','https://meet.aetherion.health/weekly-review','scheduled','["1","2","3","4","5"]'),
('Emergency Protocol Update','Updated emergency response procedures','{U_SA}','2026-06-05','14:00:00','15:00:00','https://meet.aetherion.health/emergency-protocol','scheduled','["1","4","7"]'),
('Pharmacy Stock Review','Monthly inventory and stock audit meeting','{U_PA1}','2026-06-03','11:00:00','12:00:00','https://meet.aetherion.health/pharmacy-stock','scheduled','["1","2"]');""")
Q("")

# ====================================================================
# SYSTEM_HEALTH
# ====================================================================
Q("-- SYSTEM_HEALTH")
Q("""INSERT INTO `system_health` (`status`,`cpu_usage`,`memory_usage`,`disk_usage`,`active_connections`,`response_time_ms`) VALUES
('healthy',23.5,45.2,38.7,42,85),
('healthy',18.2,42.1,38.7,38,72),
('healthy',35.8,51.3,38.8,55,120),
('degraded',72.4,78.9,39.1,120,450),
('healthy',25.1,47.5,38.7,40,90);""")
Q("")

# ====================================================================
# SYSTEM_REPORTS
# ====================================================================
Q("-- SYSTEM_REPORTS")
Q(f"""INSERT INTO `system_reports` (`title`,`type`,`generated_by`,`parameters`,`format`,`download_url`,`file_size`) VALUES
('Monthly User Activity Report - May 2026','user','{U_SA}','{{"month":"2026-05"}}','pdf','/uploads/reports/users-may-2026.pdf','2.4 MB'),
('Doctor Performance Q1 2026','doctor','{U_AD}','{{"quarter":"Q1-2026"}}','excel','/uploads/reports/doctors-q1-2026.xlsx','1.8 MB'),
('Hospital Utilization Report','hospital','{U_SA}','{{"period":"2026-05"}}','pdf','/uploads/reports/hospital-utilization-may-2026.pdf','3.1 MB'),
('Blood Donation Statistics 2026','donation','{U_AD}','{{"year":"2026"}}','csv','/uploads/reports/blood-donation-2026.csv','0.5 MB');""")
Q("")

# ====================================================================
# USER_SESSIONS
# ====================================================================
SESS1 = U("sess1"); SESS2 = U("sess2"); SESS3 = U("sess3"); SESS4 = U("sess4")
Q("-- USER_SESSIONS")
Q(f"""INSERT INTO `user_sessions` (`id`,`user_id`,`refresh_token`,`device_type`,`user_agent`,`ip_address`,`is_active`,`expires_at`,`last_activity_at`) VALUES
('{SESS1}','{U_P1}','rt_aarav_20260528','web','Mozilla/5.0 Chrome/125.0','192.168.1.10',1,'2026-06-04 07:00:00','2026-05-28 07:00:00'),
('{SESS2}','{U_D1}','rt_sarah_20260528','web','Mozilla/5.0 Chrome/125.0','192.168.1.3',1,'2026-06-04 08:15:00','2026-05-30 08:15:00'),
('{SESS3}','{U_SA}','rt_rajesh_20260528','desktop','Mozilla/5.0 Firefox/126.0','192.168.1.1',1,'2026-06-04 09:30:00','2026-05-28 09:30:00'),
('{SESS4}','{U_P5}','rt_amit_20260527','android','AetherionHealth/2.0 Android/14','192.168.1.15',1,'2026-06-03 10:00:00','2026-05-27 10:00:00');""")
Q("")

# ====================================================================
# PASSWORD_RESETS
# ====================================================================
Q("-- PASSWORD_RESETS")
Q("""INSERT INTO `password_resets` (`email`,`token`,`is_used`,`expires_at`) VALUES
('emily.davis@email.com','tok_emily_reset_001',1,'2026-05-16 14:00:00'),
('thomas.anderson@email.com','tok_thomas_reset_001',0,'2026-06-01 00:00:00');""")
Q("")

# ====================================================================
# INSURANCE_CLAIMS
# ====================================================================
Q("-- INSURANCE_CLAIMS")
Q(f"""INSERT INTO `insurance_claims` (`invoice_id`,`provider`,`policy_number`,`claim_amount`,`approved_amount`,`status`,`submitted_date`,`processed_date`) VALUES
('{INV3}','Cigna','CG-2024-67890',327.00,261.60,'approved','2026-05-20 08:15:00','2026-05-22 10:00:00');""")
Q("")

# ====================================================================
Q("SET FOREIGN_KEY_CHECKS = 1;")
Q("")
Q("-- ============================================")
Q("-- Seed data insertion complete!")
Q("-- Total tables populated: 60+")
Q("-- ============================================")

# Write to file
output_path = os.path.join(os.path.dirname(__file__), "seed_data.sql")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(out))

print(f"Generated {len(out)} lines of SQL to {output_path}")
