```

there ar e6 types of account 
clint 
patient 
doctor 

pharmaecy authority 
 FEATURES ADDED:
Feature	Description
🔍 Search	Search by name, generic name, category, manufacturer
📋 Type Filter	Filter Prescription / OTC
📦 Stock Filter	Filter Available / Low Stock / Out of Stock
⏰ Expiry Filter	Filter Expiring Soon / Expired
👁️ Availability Toggle	Show/Hide unavailable medicines
📊 Medicine Stats	8 stat cards (Total, Available, Low, Out, Expiring, Expired, Rx, OTC)
🏷️ Active Filters	See & remove applied filters
⚠️ Low Stock Alerts	Yellow warning box
🚫 Expired Alerts	Red warning box
📋 Result Count	Shows filtered count vs total
🗑️ Clear All Filters	One-click reset


hospital authoriy 
admin authoriy 


Apnar Age Theke Je Code Chilo:
text
✅ Client Panel (16 files)
✅ Doctor Panel (6 files)
✅ Hospital Panel (8 files)
✅ Blood Donation (5 files)
✅ Oxygen Network (5 files)
✅ Pharmacy (8 files)
✅ Admin Panel (12 files)
✅ Women Care (9 files)
✅ Common Components (20 files)
✅ AI Assistant (8 files)
✅ Redux Store (10 files)
✅ Custom Hooks (10 files)
✅ Layout (6 files)
✅ Types (8 files)
✅ Services (6 files)
🆕 Ami Extra Ja Add Korechi:
✅ MedicalHistory Component     (Patient er jonno)
✅ ClientSidebar                (Navigation)
✅ NotificationBell             (Real-time alerts)
✅ SecurityManager              (Admin)
✅ EmergencyMonitor             (Admin)
✅ UserManager                  (Admin)
✅ DoctorVerification           (Admin)
✅ HospitalAccount              (Hospital profile)
✅ ProfileConverter             (Patient → Client)
✅ AppWrapper (Redux Persist)   (App.tsx)
✅ Settings Page                (User settings)
✅ NearbyDonors                 (Blood donor search)
✅ OxygenDashboard              (Oxygen network)
✅ PharmacyDashboard            (Pharmacy management)
✅ useAIAssistant hook          (AI chat logic)
✅ useDoctor hook               (Doctor data)
✅ useHospital hook             (Hospital data)
✅ useEmergency hook            (Emergency requests)
✅ adminSlice                   (Redux)
✅ hospitalSlice                (Redux)
✅ pharmacySlice                (Redux)


---

## 1. 👤 CLIENT/PATIENT PANEL
```
✅ ClientDashboard         - Health score, vitals, appointments
✅ ClientProfile           - Full profile with all sections
✅ ClientSidebar           - Navigation with icons & badges
✅ Appointments            - Book, view, cancel appointments
✅ Prescriptions           - Medicine list with details
✅ BloodDonation           - History, eligibility, rewards
✅ EmergencyRequest        - SOS, ambulance, blood emergency
✅ Recommendations         - AI health tips
✅ VaccineTracking         - Vaccine records
✅ MedicalReports          - Lab reports & results
✅ Physiotherapy           - Therapy tracking
✅ DoctorComparison        - Compare doctors by rating/fee
✅ ClientNearbyDonors      - Blood donor search with maps
✅ ClientOrders            - Pharmacy medicine orders
✅ HealthRecords           - All health records
✅ ProfileConverter        - Patient → Client upgrade
ALL 12 COMMON COMPONENTS USED:
Component	Where Used	How Many Times
Avatar	Card header, Detail modal	12 times
Badge	Stats, Tags, Status indicators	30+ times
Button	Clear filters, View, Reset, Modal action	5 times
Card	Search bar, Discovery cards, Empty state	12 times
GlassmorphicCard	Stats overview cards	4 times
Input	Search field	1 time
Select	Badge filter dropdown	1 time
Tab	Category navigation	6 tabs
Loader	Loading state	1 time
Modal	Item detail popup	1 time



```

---

## 2. 👨‍⚕️ DOCTOR PANEL
```
✅ DoctorDashboard         - Today's patients, earnings, alerts
✅ DoctorProfile           - Doctor profile with qualifications
✅ DoctorSchedule          - Weekly schedule with time slots
✅ DoctorRanking           - Doctor ranking system
✅ Doctors                 - Doctor listing page
✅ BookingForm             - Appointment booking form
```

---

## 3. 🏥 HOSPITAL AUTHORITY PANEL
```
✅ HospitalDashboard       - Beds, ICU, blood, emergency stats
✅ HospitalAdminPanel      - Full admin control panel
✅ HospitalAccount         - Hospital profile & management
✅ HospitalSidebar         - Navigation for hospital
✅ BedAvailability         - Bed tracking system
✅ ICUTracker              - ICU monitoring with maps
✅ EmergencyServices       - Emergency management
✅ HospitalCard            - Hospital display card
```

---

## 4. 🩸 BLOOD DONATION SYSTEM
```
✅ BloodDonorRegistration  - Multi-step registration
✅ BloodDonorDashboard     - Donor stats & history
✅ BloodDonorSearch        - Search by location/blood group
✅ BloodDonationHistory    - Complete donation records
✅ BloodStockMonitor       - Live blood stock tracking
```

---

## 5. 🫁 OXYGEN NETWORK SYSTEM
```
✅ OxygenDashboard         - Live oxygen monitoring
✅ OxygenCenterList        - Hospital-wise availability
✅ OxygenEmergencyAlert    - Emergency alerts
✅ OxygenTracker           - Cylinder tracking
✅ NearestOxygenCenter     - Find nearest center
```

---

## 6. 💊 PHARMACY MANAGEMENT
```
✅ PharmacyDashboard       - Orders, stock, revenue
✅ PharmacyLogin           - Pharmacy authentication
✅ MedicineSearch          - Search medicines
✅ MedicineInfo            - Medicine details
✅ OrderSystem             - Order management
✅ DeliveryTracker         - Delivery tracking
✅ StockAlerts             - Low stock alerts
✅ SalesAnalytics          - Sales reports
```

---

## 7. 👑 ADMIN PANEL
```
✅ AdminDashboard          - System overview & stats
✅ AdminLogin              - Secure login with 2FA
✅ AdminSidebar            - Admin navigation
✅ UserManager             - User CRUD operations
✅ DoctorVerification      - Approve/reject doctors
✅ HospitalVerification    - Hospital approval
✅ PharmacyVerification    - Pharmacy approval
✅ EmergencyMonitor        - Real-time emergency tracking
✅ SecurityManager         - Security logs & alerts
✅ SystemAnalytics         - Charts & analytics
✅ ReportGenerator         - Report generation
✅ FeedbackManager         - User feedback management
```

---

## 8. 🤰 WOMEN CARE SYSTEM
```
✅ WomenCareDashboard      - Pregnancy & health overview
✅ PregnancyTracker        - Week-by-week tracking
✅ MedicineRecord          - Pregnancy medications
✅ MenstrualCycleTracker   - Cycle tracking & prediction
✅ MotherHealthMonitor     - Health metrics monitoring
✅ VaccineSchedule         - Baby vaccine schedule
✅ SpecialCare             - Special care instructions
✅ GynecologistCard        - Gynecologist finder
```

---

## 9. 🗺️ COMMON COMPONENTS
```
✅ Avatar                  - Profile pictures with status
✅ Badge                   - Status badges (6 variants)
✅ Button                  - All buttons (5 variants, 3 sizes)
✅ Card                    - Content cards
✅ Dropdown                - Dropdown menus
✅ GlassmorphicCard        - Premium glass effect
✅ Input                   - Form inputs with validation
✅ Loader                  - Loading animations
✅ Modal                   - Popup modals
✅ Select                  - Dropdown selects
✅ Tab                     - Tab navigation
✅ Table                   - Data tables
✅ NotificationBell        - Real-time notifications
✅ NotificationCenter      - Notification panel
✅ GoogleMap               - Google Maps integration
✅ SearchBar               - Search component
✅ SmartSearch             - AI-powered search
✅ QRMedicalCard           - QR medical ID
✅ BreadCrumb              - Navigation breadcrumbs
✅ TestimonialsSection     - Patient testimonials
```

---

## 10. 🤖 AI ASSISTANT
```
✅ AIAssistant             - Floating chat interface
✅ AIChatBox               - Chat messages
✅ AIInputBox              - Message input
✅ AIVoiceButton           - Voice input/output
✅ AIResponseCard          - AI response display
✅ AIUserContext           - User recognition
✅ AISuggestionChips       - Quick suggestions
✅ AIMemoryPanel           - Conversation memory
```

---

## 11. 🗄️ STATE MANAGEMENT (REDUX)
```
✅ store/index.ts          - Main store with persist
✅ slices/authSlice        - Auth + Multi-role management
✅ slices/clientSlice      - Client state
✅ slices/doctorSlice      - Doctor state
✅ slices/hospitalSlice    - Hospital state
✅ slices/pharmacySlice    - Pharmacy state
✅ slices/adminSlice       - Admin state
✅ slices/uiSlice          - UI preferences
✅ slices/appointmentSlice - Appointment state
✅ slices/emergencySlice   - Emergency state
```

---

## 12. 🎣 CUSTOM HOOKS
```
✅ useAIAssistant          - AI chat logic
✅ useAppointment          - Appointment CRUD
✅ useAuth                 - Authentication
✅ useDebounce             - Search optimization
✅ useDoctor               - Doctor data fetching
✅ useEmergency            - Emergency requests
✅ useHospital             - Hospital data
✅ useLocalStorage         - Persistent state
✅ useMediaQuery           - Responsive checks
```

---

## 13. 📄 PAGES
```
✅ Home                    - Landing page
✅ About                   - About page
✅ Login                   - Login page
✅ Register                - Registration
✅ RoleSelection           - Role selection
✅ Emergency               - Public emergency page
✅ Profile                 - User profile
✅ Settings                - User settings
✅ NotFound                - 404 page
```

---

## 📊 GRAND TOTAL:

| Category | Count |
|----------|-------|
| **Client Panel** | 16 files |
| **Doctor Panel** | 6 files |
| **Hospital Panel** | 8 files |
| **Blood Donation** | 5 files |
| **Oxygen Network** | 5 files |
| **Pharmacy** | 8 files |
| **Admin Panel** | 12 files |
| **Women Care** | 9 files |
| **Common Components** | 20 files |
| **AI Assistant** | 8 files |
| **Redux Store** | 10 files |
| **Custom Hooks** | 10 files |
| **Pages** | 9 files |
| **Types** | 8 files |
| **Services** | 6 files |
| **Layout** | 6 files |
| **TOTAL** | **145+ FILES** |

---

## 📝 CODE LINES: **15,000+ LINES** 

---

## 🎯 ALL SYSTEMS READY! 🚀✅

**Project Aetherion - Complete Healthcare Management System!** 🏥


Read [](file:///b%3A/DBMS/Project/aetherion)

Read [](file:///b%3A/DBMS/Project/aetherion/package.json)

Searched for files matching `**/*.md`.

এই একটি **Aetherion Smart Healthcare Ecosystem** প্রজেক্ট, যা একটি React + TypeScript + Vite দিয়ে তৈরি ফ্রন্টএন্ড অ্যাপ্লিকেশন। এখন প্রজেক্টের বিস্তারিত এক্সপ্লোর করছি:

Read [](file:///b%3A/DBMS/Project/aetherion/src)

Searched for files matching `**/*.tsx`, 137 results

**🏥 AETHERION - Smart Healthcare Ecosystem**

এই প্রজেক্টে অনেক ফিচার ইতিমধ্যে বিল্ট হয়েছে। এখানে সবকিছু বলছি:

## ✅ **যা এখন আছে:**

### **1. User Authentication & Roles**
- রোল সিলেকশন (পেশেন্ট, ডাক্তার, হাসপাতাল, ডোনার, এডমিন)
- লগইন/রেজিস্টার সিস্টেম
- ফায়ারবেস ইন্টিগ্রেশন

### **2. Patient/Client Dashboard**
- প্রোফাইল ম্যানেজমেন্ট
- অ্যাপয়েন্টমেন্ট বুকিং ও ক্যালেন্ডার
- মেডিকেল রিপোর্ট ট্র্যাকিং
- প্রেসক্রিপশন ম্যানেজমেন্ট
- হেলথ রেকর্ডস
- মেডিসিন রিমাইন্ডার
- ভ্যাকসিন ট্র্যাকিং
- ব্লাড ডোনার সার্চ

### **3. Doctor Features**
- ডাক্তার ড্যাশবোর্ড
- প্রোফাইল ম্যানেজমেন্ট
- শিডিউল ম্যানেজমেন্ট
- অ্যাপয়েন্টমেন্ট লিস্ট

### **4. Hospital Management**
- হাসপাতাল ড্যাশবোর্ড
- বেড অ্যাভেইলেবিলিটি ট্র্যাকার
- ICU ট্র্যাকার
- ইমার্জেন্সি সার্ভিস ম্যানেজমেন্ট
- এডমিন প্যানেল

### **5. Special Features**
- ✨ **AI Assistant** (চ্যাটবট, সিমপটম চেকার, স্মার্ট রিকমেন্ডেশন)
- 🩸 **ব্লাড ডোনেশন সিস্টেম**
- 👶 **বেবি কেয়ার এডভাইস**
- 🤰 **প্রেগন্যান্সি ট্র্যাকিং & মেন্সট্রুয়াল সাইকেল ট্র্যাকার**
- 🏥 **ফার্মেসি ম্যানেজমেন্ট**
- 🚑 **ইমার্জেন্সি রিকোয়েস্ট**

### **6. Admin Panel**
- ইউজার ম্যানেজমেন্ট
- ডাক্তার ভেরিফিকেশন
- সিকিউরিটি ম্যানেজমেন্ট
- ইমার্জেন্সি মনিটরিং

### **7. Design & UI**
- Tailwind CSS স্টাইলিং
- গ্লাসমরফিক ডিজাইন এলিমেন্ট
- রেসপন্সিভ লেআউট
- Framer Motion এনিমেশন

---

## 🔮 **Future এ যা আরো তৈরি হতে পারে:**

আপনার প্রজেক্টে আরো যোগ করার সম্ভাবনা:

1. **🔐 Two-Factor Authentication (2FA)**
2. **📱 Mobile App Version** (React Native/Flutter)
3. **📊 Advanced Analytics & Reports**
4. **🤖 Machine Learning Integration** (Predictive health issues)
5. **💬 Real-time Messaging** (Socket.io already imported!)
6. **📹 Telemedicine/Video Consultation** (WebRTC)
7. **📍 Geolocation Services** (হাসপাতাল খুঁজে পেতে)
8. **💳 Payment Integration** (Stripe/bKash/Nagad)
9. **🔔 Push Notifications**
10. **📈 Health Insurance Integration**
11. **🏥 Multi-language Support**
12. **♿ Accessibility Features (A11y)**

---

কোনো **স্পেসিফিক ফিচার ডেভেলপ করতে চান**, নাকি কিছু বাগ ফিক্স করতে চান? বলুন! 🎯

#Project Aetherion


---
Technology Stack

## Frontend
* React.js
* Tailwind CSS
* TypeScript
* Redux Toolkit

## Backend
Python 

## Database
MySQL 

## Authentication
* Firebase Authentication / JWT

## Real-Time Services
* Socket.io

## Maps & Location
* Google Maps API
---






---Possible System Modules---
1 Authentication System
2 Client Management
3 Doctor Management
4 Hospital Management
5 Blood Donation Management
6 Oxygen Network Management
7 Pharmacy Management
8 Emergency Management
9 Women Care System
10 AI Recommendation System




Features You Can Add
## Emergency & Ambulance
* Live ambulance tracking
* One-click ambulance request
* Emergency route optimization

## Fitness & Wellness
* Daily health tips
* BMI calculator
* Exercise tracking
* Diet planner

## Community Features
* Health forums
* Doctor Q&A section
* Health awareness campaigns

## Insurance System
* Health insurance support
* Insurance claim tracking

## IoT & Smart Device Integration
* Smartwatch integration
* Heartbeat monitoring
* Blood pressure monitoring

## Advanced Analytics
* Disease prediction
* Hospital performance analytics
* Blood demand prediction





.






Project Terget :


When a user creates an account, the system will ask which type of account they want to create.
# Account Types

* Normal User / Client
* Doctor
* Hospital Authority
* Blood Donor
* Pharmacy
* Apply for Admin Access
Users can also select:

* Male
* Female

A Normal User account can later be upgraded into:

* Client/Patient Profile
* Blood Donor Profile
* Pharmacy User
* Emergency Volunteer

A single user can access multiple roles from one account.

Example:

* A normal user can also become a blood donor
* A doctor can also manage a pharmacy
* A hospital authority can also access emergency systems

---







# 2. Smart Client (Patient) Panel

The “Patient” tag can be replaced with *Client Profile* for a more modern healthcare experience.

## Features

* Account Registration & Login
* Personal Profile Management
* Blood Group Information
* Previous Blood Donation History
* Next Eligible Blood Donation Date
* Doctor Appointment Booking
* Doctor Search & Comparison System
* Doctor Ranking & Rating System
* Doctor Consultation Fee Comparison
* Available Time & Schedule Tracking
* Doctor Availability Status
* Prescription View & Download
* Medical Report Upload & Download
* Emergency Blood Request
* Nearby Blood Donor Search
* Notification System
* Personal Dashboard
* Vaccine Record Tracking
* Medicine History
* Full Health Record System
* Birth Date & Medical History
* Old Medical Record Storage
* Physiotherapy Course & Therapy Tracking

---

## Smart Health Recommendation System
The system can show:

* Recovery estimation time
* Food recommendations
* Foods to avoid
* Health improvement suggestions
* Medicine reminders

## Client Dashboard Features

* Upcoming Appointments
* Blood Donation Status
* Health Reports
* Emergency Requests
* Connected Doctors
* Connected Hospitals
* Medicine Reminder Alerts
* Health Activity Timeline

✅ FINAL VERIFICATION - ALL FEATURES PRESERVED:
#	Feature	Status	Section
1	Upcoming Appointments	✅	Left Column - Section 1
2	Blood Donation Status	✅	Right Sidebar - Section 6
3	Health Reports	✅	Quick Stats + Data
4	Emergency Requests	✅	Banner + SOS Modal
5	Connected Doctors	✅	Appointments + Quick Access
6	Connected Hospitals	✅	Right Sidebar - Section 9
7	Medicine Reminder Alerts	✅	Right Sidebar - Section 5
8	Health Activity Timeline	✅	Left Column - Section 4
PLUS:

✅ Health Score

✅ Vitals Monitoring (8 cards)

✅ Health Metrics with Sparklines

✅ Weekly Activity Chart

✅ AI Recommendations

✅ Quick Access Navigation (10 buttons)

✅ Mobile Bottom Navigation

✅ Notifications Dropdown

✅ Emergency SOS Modal

📊 Features:
Feature	Status
All Records View	✅
Filter by Type (Tabs)	✅
Search Records	✅
Download Reports	✅
Detail Modal	✅
Status Badges	✅
Summary Cards	✅
Empty State	✅
Loading State	✅
Responsive Design	✅

commmunication 
## Features

* SMS Notifications
* Email Alerts
* Live Chat Support
* Emergency Notification System
* Video Consultation Calls
Features Included:
Feature	Status
Prescription Number	✅
Doctor Name & Info	✅
Patient Name & Info	✅
Diagnosis & Symptoms	✅
Medicines List	✅
Tests Recommended	✅
Cost Breakdown	✅
Consultation Fee	✅
Medicine Cost	✅
Test Cost	✅
Total Amount	✅
Payment Status	✅
Instructions	✅
Diet Advice	✅
Follow-up Date	✅
Digital Signature	✅
Download PDF	✅
Print Option	✅
Search & Filter	✅
## Client Pharmacy Dashboard

* Order history
* Prescription history
* Medicine reminders
* Refill reminders
 Features Included:
Feature	Status
Blood Group Filter	✅ (A+, A-, B+, B-, AB+, AB-, O+, O-)
Distance Filter	✅ (5km, 10km, 25km, 50km)
Availability Filter	✅ (All, Available, Emergency)
Sort Options	✅ (Distance, Rating, Donations)
Search by Name/Address	✅
Google Maps Placeholder	✅ (Ready for API)
Directions Button	✅ (Opens Google Maps)
Call Button	✅
Request Blood Button	✅
Donor Profile Preview	✅
Contact Modal	✅
Can Donate Now Status	✅
Donation History	✅
Response Time	✅
Verified Badge	✅
Rating Display	✅
🚀 Route:
typescript
<Route path="/client/nearby-donors" element={<ClientNearbyDonors />} />
Nearby Blood Donor Search COMPLETE! 🩸🗺️✅
Dashboard       → /client/dashboard
My Profile      → /client/profile
Appointments    → /client/appointments
Prescriptions   → /client/prescriptions
Health Records  → /client/health-records
Medical Reports → /client/reports
Vaccine Records → /client/vaccines
Physiotherapy   → /client/physiotherapy
Find Doctors    → /client/doctor-comparison
Nearby Donors   → /client/nearby-donors
Blood Donation  → /client/blood-donation
My Orders       → /client/orders
Emergency       → /client/emergency
Health Tips     → /client/recommendations
Women Care      → /women-care
Settings        → /settings
Logout          → Logout action
---

# 3. Smart Doctor Panel
commmunication  ## Features
* SMS Notifications
* Email Alerts
* Live Chat Support
* Emergency Notification System
* Video Consultation Calls
## Features
* Doctor Registration & Login
* Professional Doctor Profile
* Specialization Information
* Patient List Management
* Appointment Management
* Prescription Creation
* Blood Request Approval
* Availability Schedule
* Video Consultation System
* Experience & Qualification Display
* Personal Doctor Dashboard
## Doctor Information Section
The system will display:
* Which hospital the doctor works at
* Doctor specialization
* Experience level
* Consultation fee
* Available schedule
* Online/Offline status
* Patient ratings & reviews
## Doctor Dashboard Features
* Today's appointments
* Emergency patient requests
* Prescription management
* Video consultation requests
* Hospital activity
* Earnings analytics
* Patient reports
---
# 4. Smart Hospital Authority Panel
commmunication ## Features
* SMS Notifications
* Email Alerts
* Live Chat Support
* Emergency Notification System
* Video Consultation Calls
## Features
* Manage Doctors
* Manage Blood Stock
* Approve Blood Donors
* Emergency Announcements
* Hospital Department Management
* Bed Availability Tracking
* ICU Management
* Ambulance Management
* Blood Request Tracking
* Oxygen Cylinder Management
## Smart Hospital Card System
Each hospital card will display:
* Hospital Name
* Hospital Rating
* Available Beds
* ICU Beds
* Oxygen Availability
* Ambulance Availability
* Emergency Contact
* Emergency Service Status
## ICU Network System
A real-time ICU monitoring network connected with Google Maps.
The system will show:
* Which hospital has ICU beds
* How many ICU beds are available
* Distance from user location
* Estimated travel time
* Emergency route guidance
* Hospital analytics
* ICU monitoring
* Blood stock analytics
* Oxygen management
* Emergency requests
* Ambulance tracking

---
# 5. Smart Blood Donation System
only clint >> Narmal User << can share blood with anyoother 
## Features
commmunication 
## Features
* SMS Notifications
* Email Alerts
* Live Chat Support
* Emergency Notification System
* Video Consultation Calls
* Blood Donor Registration
* Blood Group Filtering
* Last Donation Date
* Next Eligible Donation Date Calculator
* Donation Certificate
* Donation Reward Points
* Emergency Blood Donor Alert
* Live Blood Stock Monitoring
## Smart Blood Features
* Search donor by location
* Search donor by blood group
* Instant emergency notifications
* Donation history tracking
* Nearby emergency donor system
---

# 6. Oxygen Network System
A smart oxygen emergency support system.
## Features
* Live Oxygen Stock Monitoring
* Hospital-wise Oxygen Availability
* Emergency Oxygen Alerts
* Oxygen Cylinder Tracking
* Real-time Availability Updates
## System Will Show
* Which hospital has oxygen
* Number of available oxygen cylinders
* Emergency oxygen support status
* Nearest oxygen support center


# 7. Smart Admin Panel
commmunication 
## Features
* SMS Notifications
* Email Alerts
* Live Chat Support
* Emergency Notification System
* Video Consultation Calls
## Features
* Secure Admin Login
* User Management
* Doctor Verification & Approval
* Hospital Verification
* Pharmacy Verification
* Block/Delete Users
* Dashboard Analytics
* Total Doctors, Clients & Donors
* Blood Stock Analytics
* Report Generation
* Feedback Management
* Emergency Monitoring

## Admin Dashboard Features
* System analytics
* Emergency monitoring
* User activities
* Hospital analytics
* Donation analytics
* Security management
---
# 8. Women Extra Caring Section
## Features
* Pregnancy Tracking Record * Medicine Record
* Gynecologist Consultation Record* Baby Vaccine Record
* Mother Health Monitoring* Pregnancy Appointment Tracking
* Child Growth Information* Women Health Notifications
* Menstrual Cycle Tracking* Emergency Pregnancy Support

# 9. Smart Pharmacy Management System
A modern pharmacy support system connected with hospitals and clients.
All users can access the pharmacy system from their accounts.
## Pharmacy Features
* Pharmacy Registration & Login
* Pharmacy Verification
* Medicine Management
* Medicine Stock Management
* Expiry Date Tracking
* Online Medicine Ordering
* Prescription Upload System
* Emergency Medicine Support
* 24/7 Pharmacy Support
## Smart Medicine Search
Users can:
 Search medicines by name
* Search nearby pharmacies
* Compare medicine prices
* Compare medicine brands
* Check medicine availability
* View medicine ratings
## Google Maps Pharmacy Integration
The system can show:
* Pharmacy location
* Distance from user
* Open/Close status
* Navigation route
* Estimated travel time
* Nearby emergency pharmacy
## Smart Medicine Information
The system will display:
* Medicine name
* Usage instructions
* Side effects
* Dosage instructions
* Manufacturer details
* Alternative medicines

---
## Pharmacy Delivery System
* Home delivery support
* Delivery tracking
* Delivery status updates
## Pharmacy Dashboard Features
* Total orders
* Medicine stock status
* Low stock alerts
* Sales analytics
* Expired medicine alerts
---
# 10. AI & Smart Automation Features
## AI Features
* AI Health Assistant
* Smart Symptom Checker
* AI Medicine Recommendation
* Drug Interaction Warning
* Smart Dosage Reminder
* Recovery Prediction System
* AI Emergency Support Chatbot
### 🏗️ TOTAL: 9 MAJOR SYSTEMS + AI + ADMIN
# 11. Security System
## Security Features
* JWT Authentication
* OTP Verification
* Email Verification
* Role-Based Access Control
* Encrypted Medical Records
* Two-Factor Authentication
# Additional Advanced Features
* Dark Mode
* Multi-language Support
* Mobile Responsive Design
* Google Maps Integration
* Emergency SOS Button
* QR Code Medical Card
* Real-time Notification System
* Online Consultation
* Health Blog Section
* Voice Assistant
* Smart Search System
---

Project-Aetherion/
│
├── frontend/
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── robots.txt
│   │   └── manifest.json
│   │
│   ├── src/
│   │   │
│   │   ├── app/
│   │   │   ├── store.ts
│   │   │   ├── providers/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── ReduxProvider.tsx
│   │   │   │   ├── SocketProvider.tsx
│   │   │   │   ├── ThemeProvider.tsx
│   │   │   │   ├── AuthProvider.tsx
│   │   │   │   └── NotificationProvider.tsx
│   │   │   │
│   │   │   └── routes/
│   │   │       ├── index.tsx
│   │   │       ├── PublicRoutes.tsx
│   │   │       ├── PrivateRoutes.tsx
│   │   │       ├── RoleBasedRoutes.tsx
│   │   │       ├── AdminRoutes.tsx
│   │   │       ├── DoctorRoutes.tsx
│   │   │       ├── HospitalRoutes.tsx
│   │   │       ├── PharmacyRoutes.tsx
│   │   │       └── EmergencyRoutes.tsx
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── logo/
│   │   │   │   ├── icons/
│   │   │   │   ├── illustrations/
│   │   │   │   ├── doctors/
│   │   │   │   ├── hospitals/
│   │   │   │   └── emergency/
│   │   │   │
│   │   │   ├── fonts/
│   │   │   ├── animations/
│   │   │   ├── audio/
│   │   │   └── videos/
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   ├── Drawer.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── Accordion.tsx
│   │   │   │   ├── Calendar.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   ├── Dropdown.tsx
│   │   │   │   ├── Switch.tsx
│   │   │   │   └── Table.tsx
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── AppointmentForm.tsx
│   │   │   │   ├── BloodRequestForm.tsx
│   │   │   │   ├── PrescriptionForm.tsx
│   │   │   │   ├── PharmacyForm.tsx
│   │   │   │   ├── EmergencyForm.tsx
│   │   │   │   └── PaymentForm.tsx
│   │   │   │
│   │   │   ├── cards/
│   │   │   │   ├── DoctorCard.tsx
│   │   │   │   ├── HospitalCard.tsx
│   │   │   │   ├── BloodDonorCard.tsx
│   │   │   │   ├── MedicineCard.tsx
│   │   │   │   ├── AppointmentCard.tsx
│   │   │   │   ├── AmbulanceCard.tsx
│   │   │   │   ├── ICUCard.tsx
│   │   │   │   ├── OxygenCard.tsx
│   │   │   │   └── EmergencyCard.tsx
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── BloodStockChart.tsx
│   │   │   │   ├── HospitalLoadChart.tsx
│   │   │   │   ├── EmergencyTrends.tsx
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   ├── AnalyticsChart.tsx
│   │   │   │   └── AIReportChart.tsx
│   │   │   │
│   │   │   ├── modals/
│   │   │   │   ├── ConfirmModal.tsx
│   │   │   │   ├── VideoCallModal.tsx
│   │   │   │   ├── PrescriptionModal.tsx
│   │   │   │   ├── ReportModal.tsx
│   │   │   │   ├── SOSModal.tsx
│   │   │   │   └── PaymentModal.tsx
│   │   │   │
│   │   │   ├── tables/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── AppointmentsTable.tsx
│   │   │   │   ├── PatientsTable.tsx
│   │   │   │   ├── OrdersTable.tsx
│   │   │   │   ├── BloodStockTable.tsx
│   │   │   │   └── AnalyticsTable.tsx
│   │   │   │
│   │   │   ├── communication/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── VideoCall.tsx
│   │   │   │   ├── VoiceCall.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── NotificationPopup.tsx
│   │   │   │
│   │   │   ├── maps/
│   │   │   │   ├── HospitalMap.tsx
│   │   │   │   ├── DonorMap.tsx
│   │   │   │   ├── AmbulanceMap.tsx
│   │   │   │   ├── PharmacyMap.tsx
│   │   │   │   └── EmergencyMap.tsx
│   │   │   │
│   │   │   └── layouts/
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       ├── Footer.tsx
│   │   │       ├── DashboardLayout.tsx
│   │   │       ├── PublicLayout.tsx
│   │   │       ├── AuthLayout.tsx
│   │   │       └── EmergencyLayout.tsx
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── doctors/
│   │   │   ├── hospitals/
│   │   │   ├── blood/
│   │   │   ├── pharmacy/
│   │   │   ├── ambulance/
│   │   │   ├── oxygen/
│   │   │   ├── appointments/
│   │   │   ├── women-care/
│   │   │   ├── ai-health/
│   │   │   ├── analytics/
│   │   │   ├── notifications/
│   │   │   ├── emergency/
│   │   │   ├── communication/
│   │   │   ├── insurance/
│   │   │   ├── payments/
│   │   │   ├── reports/
│   │   │   ├── iot/
│   │   │   ├── accessibility/
│   │   │   ├── search/
│   │   │   ├── qr-system/
│   │   │   ├── blogs/
│   │   │   ├── forums/
│   │   │   ├── health-tips/
│   │   │   ├── fitness/
│   │   │   ├── diet/
│   │   │   └── voice-assistant/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSocket.ts
│   │   │   ├── useLocation.ts
│   │   │   ├── useNotification.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useRoleCheck.ts
│   │   │   ├── useVideoCall.ts
│   │   │   ├── useVoiceAssistant.ts
│   │   │   └── useDarkMode.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api/
│   │   │   ├── websocket/
│   │   │   ├── maps/
│   │   │   ├── firebase/
│   │   │   ├── ai/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   ├── sms/
│   │   │   ├── email/
│   │   │   ├── rtc/
│   │   │   └── storage/
│   │   │
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   │   ├── patient/
│   │   │   │   ├── doctor/
│   │   │   │   ├── hospital/
│   │   │   │   ├── pharmacy/
│   │   │   │   ├── donor/
│   │   │   │   ├── emergency/
│   │   │   │   └── admin/
│   │   │   │
│   │   │   ├── emergency/
│   │   │   ├── communication/
│   │   │   ├── analytics/
│   │   │   ├── reports/
│   │   │   ├── ai/
│   │   │   └── errors/
│   │   │
│   │   ├── layouts/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── styles/
│   │   ├── i18n/
│   │   ├── accessibility/
│   │   ├── pwa/
│   │   ├── storage/
│   │   ├── security/
│   │   ├── tests/
│   │   ├── docs/
│   │   ├── environments/
│   │   └── main.tsx
│   │
│   ├── .env
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── README.md
│
│
├── backend/
│   │
│   ├── app/
│   │   │
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── routes/
│   │   │       │   ├── auth.py
│   │   │       │   ├── users.py
│   │   │       │   ├── doctors.py
│   │   │       │   ├── hospitals.py
│   │   │       │   ├── blood.py
│   │   │       │   ├── pharmacy.py
│   │   │       │   ├── ambulance.py
│   │   │       │   ├── emergency.py
│   │   │       │   ├── oxygen.py
│   │   │       │   ├── appointments.py
│   │   │       │   ├── analytics.py
│   │   │       │   ├── payments.py
│   │   │       │   ├── notifications.py
│   │   │       │   ├── ai.py
│   │   │       │   └── women_care.py
│   │   │       │
│   │   │       └── api.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   ├── jwt.py
│   │   │   ├── websocket.py
│   │   │   ├── permissions.py
│   │   │   ├── logging.py
│   │   │   └── cache.py
│   │   │
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── websocket/
│   │   ├── utils/
│   │   ├── ai/
│   │   ├── events/
│   │   ├── queue/
│   │   ├── authorization/
│   │   ├── compliance/
│   │   ├── recommendation-engine/
│   │   ├── knowledge-base/
│   │   ├── search/
│   │   ├── notifications/
│   │   ├── storage/
│   │   ├── monitoring/
│   │   ├── backup/
│   │   ├── tests/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env
│   ├── alembic/
│   └── README.md
│
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   ├── backups/
│   ├── procedures/
│   ├── triggers/
│   ├── views/
│   └── schemas/
│
├── deployment/
│   ├── nginx/
│   ├── docker/
│   ├── kubernetes/
│   ├── github-actions/
│   ├── monitoring/
│   └── ssl/
│
├── monitoring/
│   ├── prometheus/
│   ├── grafana/
│   ├── sentry/
│   ├── logs/
│   └── uptime-monitor/
│
├── microservices/
│   ├── auth-service/
│   ├── emergency-service/
│   ├── ai-service/
│   ├── pharmacy-service/
│   ├── notification-service/
│   ├── payment-service/
│   └── analytics-service/
│
├── mobile/
│   ├── android/
│   ├── ios/
│   └── react-native/
│
├── ml/
│   ├── models/
│   ├── datasets/
│   ├── notebooks/
│   ├── training/
│   ├── inference/
│   └── predictions/
│
├── communication/
│   ├── chat/
│   ├── video/
│   ├── voice/
│   ├── rtc/
│   └── messaging/
│
├── iot/
│   ├── smartwatch/
│   ├── heartbeat/
│   ├── blood-pressure/
│   ├── glucose-monitor/
│   └── emergency-band/
│
├── accessibility/
│   ├── screen-reader/
│   ├── keyboard-navigation/
│   ├── high-contrast/
│   └── voice-navigation/
│
├── docs/
│   ├── architecture/
│   ├── api-docs/
│   ├── swagger/
│   ├── postman/
│   ├── database-design/
│   └── deployment-guide/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── security/
│   └── performance/
│
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   ├── backup.sh
│   └── seed_database.sh
│
├── .github/
│   └── workflows/
│       ├── frontend.yml
│       ├── backend.yml
│       ├── testing.yml
│       └── deploy.yml
│
├── environments/
│   ├── development/
│   ├── staging/
│   └── production/
│
├── LICENSE
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
└── .gitignore

src/store/
├── store.ts              (Main store)
├── index.ts              (Export all)
└── slices/
    ├── authSlice.ts      (Authentication)
    ├── clientSlice.ts    (Client/Patient)
    ├── doctorSlice.ts    (Doctor)
    ├── hospitalSlice.ts  (Hospital)
    ├── pharmacySlice.ts  (Pharmacy)
    ├── adminSlice.ts     (Admin)
    └── uiSlice.ts        (UI State - Dark mode, sidebar, etc.)

    src/
├── components/
│   └── ai/
│       ├── AIAssistant.tsx           (Main Chat Interface)
│       ├── AIChatBox.tsx             (Chat Messages)
│       ├── AIInputBox.tsx            (Message Input)
│       ├── AIVoiceButton.tsx         (Voice Input)
│       ├── AIResponseCard.tsx        (AI Response Display)
│       ├── AIUserContext.tsx         (User Info Display)
│       ├── AISuggestionChips.tsx     (Quick Suggestions)
│       ├── AIMemoryPanel.tsx         (Memory View)
│       └── AIDataCard.tsx            (SQL Data Display)
├── services/
│   └── aiService.ts                  (AI API Calls)
├── hooks/
│   └── useAIAssistant.ts            (AI Hook)
└── types/
    └── aiAssistant.ts               (AI Types)


```



























































































































































































Greek mythology:
upper air → Aether → “life / air / purity”

→ ion (suffix) → science common

===  Aetherion ===


This repository serves as the central development workspace for our Database Management System (DBMS) project. It is designed to enable structured collaboration among team members, ensuring efficient contribution, version control, and continuous integration throughout the development lifecycle.

The primary goal of this project is to build a scalable, efficient, and production-ready database system by following industry best practices in schema design, query optimization, and data integrity management. This repository will be actively used to design, implement, test, and refine all components of the system in a professional and collaborative environment.

---

##  Overview

This project focuses on developing a robust Database Management System using MySQL. It emphasizes clean architecture, efficient data handling, and real-world database implementation techniques.

---

##  Key Features

* Well-structured relational database design
* Optimized data storage and retrieval
* Support for complex SQL queries
* Implementation of constraints and relationships
* Advanced database functionalities (Triggers, Stored Procedures)
* Clean, modular, and maintainable project structure

---


##  Technology Stack for Frontend


```

Aetherion-ecosystem/
│
├── frontend/                     # React TSX Frontend - Complete healthcare dashboard UI
├── backend/                      # FastAPI Backend - Scalable healthcare API services
├── ai-services/                  # AI Microservices - ML models for healthcare predictions
├── mobile-app/                   # Future React Native App (Phase 4)
├── docs/                         # Complete documentation
├── deployment/                   # Docker/Nginx/K8s production configs
├── scripts/                      # Automation & deployment scripts
├── .github/                      # GitHub Actions CI/CD workflows
├── README.md                     # Project overview & setup guide
└── docker-compose.yml            # Multi-container orchestration






##  Advanced Concepts Implemented

* JOIN operations
* Subqueries
* GROUP BY and HAVING clauses
* Stored Procedures
* Triggers
* Indexing
* Transactions (ACID properties)



Backend API (FastAPI)

Features:
JWT Authentication & Authorization
Doctor Management
Hospital Management
Appointment Booking System
Emergency Services
Pharmacy Management
Medical Records
Blood Donor System
Pregnancy Tracking
AI Health Assistant
Notifications (Email/SMS)
Payment Integration
Dashboard Analytics
Rate Limiting & Middleware Support
Docker Support
Unit Testing with Pytest
Alembic Database Migration

```




```

Tech Stack
Backend Framework: FastAPI
Database: PostgreSQL / MySQL
ORM: SQLAlchemy
Authentication: JWT
Migration: Alembic
Containerization: Docker
Testing: Pytest
AI Integration: OpenAI / Gemini API
Notifications: Email & SMS APIs
Installation
1. Clone Repository
git clone https://github.com/your-username/healthcare-backend.git
cd healthcare-backend
2. Create Virtual Environment
python -m venv venv
Activate Environment
Windows
venv\Scripts\activate
Linux/Mac
source venv/bin/activate
3. Install Dependencies
pip install -r requirements.txt
4. Configure Environment Variables

Create a .env file:

DATABASE_URL=postgresql://user:password@localhost/db_name

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password

SMS_API_KEY=your_sms_api_key

OPENAI_API_KEY=your_openai_key
Database Migration
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
Run Development Server
uvicorn app.main:app --reload

Or

python run.py
Run with Docker
docker-compose up --build
API Documentation

After running the server:

Swagger UI

http://localhost:8000/docs

ReDoc

http://localhost:8000/redoc
Authentication

This project uses JWT Token Authentication.

Login Flow
User Login
Receive Access Token
Use Bearer Token in Headers

Example:

Authorization: Bearer your_access_token
Running Tests
pytest
Core Modules
Module	Description
Auth	Login/Register/JWT
Users	User Profile Management
Doctors	Doctor Profiles & Availability
Hospitals	Hospital Information
Appointments	Appointment Booking
Emergency	Emergency Services
Pharmacy	Medicine & Pharmacy
Medical Records	Patient Medical History
Blood Donors	Blood Donation System
Pregnancy	Pregnancy Monitoring
AI Assistant	AI Healthcare Support
Notifications	Email/SMS Alerts
Dashboard	Analytics & Reports
Security Features
Password Hashing
JWT Authentication
Rate Limiting
Input Validation
CORS Protection
Secure Environment Variables
Future Improvements
Video Consultation
Real-time Chat
Mobile App API
Prescription OCR
AI Disease Prediction
Multi-language Support
Admin Panel
Contributing

Contributions are welcome.






fork → create branch → commit → push → pull request
License

This project is licensed under the MIT License.

Author

Developed using FastAPI and Python.










```


aetherion/
│
├── 📄 README.md
├── 📄 .gitignore
├── 📄 docker-compose.yml
├── 📄 .env.example
├── 📄 Makefile
├── 📄 LICENSE
│
├── 📂 frontend/                          # React + TypeScript Frontend
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 vite.config.ts
│   ├── 📄 tailwind.config.js
│   ├── 📄 index.html
│   ├── 📄 .env.example
│   │
│   ├── 📂 public/
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🖼️ logo.svg
│   │   ├── 🖼️ og-image.png
│   │   ├── 📄 manifest.json
│   │   └── 📂 icons/
│   │       ├── icon-72x72.png
│   │       ├── icon-96x96.png
│   │       └── icon-512x512.png
│   │
│   └── 📂 src/
│       ├── 📄 App.tsx
│       ├── 📄 main.tsx
│       ├── 📄 vite-env.d.ts
│       │
│       ├── 📂 assets/
│       │   ├── 📂 images/
│       │   └── 📂 fonts/
│       │
│       ├── 📂 config/
│       │   ├── 📄 constants.ts
│       │   ├── 📄 routes.ts
│       │   ├── 📄 navigation.ts
│       │   └── 📄 api.config.ts
│       │
│       ├── 📂 types/
│       │   ├── 📄 index.ts
│       │   ├── 📄 user.ts
│       │   ├── 📄 doctor.ts
│       │   ├── 📄 patient.ts
│       │   ├── 📄 hospital.ts
│       │   ├── 📄 appointment.ts
│       │   ├── 📄 pharmacy.ts
│       │   ├── 📄 emergency.ts
│       │   ├── 📄 bloodDonor.ts
│       │   └── 📄 oxygen.ts
│       │
│       ├── 📂 components/
│       │   ├── 📂 ui/
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── Table.tsx
│       │   │   ├── Tabs.tsx
│       │   │   ├── Avatar.tsx
│       │   │   ├── Dropdown.tsx
│       │   │   ├── Loader.tsx
│       │   │   ├── Skeleton.tsx
│       │   │   ├── Toast.tsx
│       │   │   ├── Tooltip.tsx
│       │   │   └── ScrollArea.tsx
│       │   │
│       │   ├── 📂 layout/
│       │   │   ├── Navbar.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── DashboardLayout.tsx
│       │   │   ├── MobileNav.tsx
│       │   │   └── TopBar.tsx
│       │   │
│       │   ├── 📂 common/
│       │   │   ├── SearchBar.tsx
│       │   │   ├── NotificationBell.tsx
│       │   │   ├── UserAvatar.tsx
│       │   │   ├── BreadCrumb.tsx
│       │   │   ├── EmptyState.tsx
│       │   │   ├── ErrorBoundary.tsx
│       │   │   ├── LoadingScreen.tsx
│       │   │   ├── Pagination.tsx
│       │   │   └── FileUpload.tsx
│       │   │
│       │   ├── 📂 auth/
│       │   │   ├── LoginForm.tsx
│       │   │   ├── RegisterForm.tsx
│       │   │   ├── RoleSelector.tsx
│       │   │   ├── OTPVerification.tsx
│       │   │   ├── ForgotPassword.tsx
│       │   │   └── TwoFactorAuth.tsx
│       │   │
│       │   ├── 📂 dashboard/
│       │   │   ├── StatCard.tsx
│       │   │   ├── ActivityChart.tsx
│       │   │   ├── RecentAppointments.tsx
│       │   │   ├── ResourceStatus.tsx
│       │   │   ├── RevenueChart.tsx
│       │   │   ├── PatientFlowChart.tsx
│       │   │   └── LiveFeed.tsx
│       │   │
│       │   ├── 📂 doctor/
│       │   │   ├── DoctorCard.tsx
│       │   │   ├── DoctorProfile.tsx
│       │   │   ├── DoctorSchedule.tsx
│       │   │   ├── DoctorRanking.tsx
│       │   │   ├── DoctorComparison.tsx
│       │   │   ├── DoctorAvailability.tsx
│       │   │   └── DoctorReviews.tsx
│       │   │
│       │   ├── 📂 patient/
│       │   │   ├── PatientProfile.tsx
│       │   │   ├── MedicalHistory.tsx
│       │   │   ├── MedicineTracker.tsx
│       │   │   ├── VaccinationTracker.tsx
│       │   │   ├── HealthTimeline.tsx
│       │   │   └── ReportViewer.tsx
│       │   │
│       │   ├── 📂 hospital/
│       │   │   ├── HospitalCard.tsx
│       │   │   ├── BedAvailability.tsx
│       │   │   ├── ICUTracker.tsx
│       │   │   ├── EmergencyServices.tsx
│       │   │   ├── HospitalRating.tsx
│       │   │   └── DepartmentList.tsx
│       │   │
│       │   ├── 📂 emergency/
│       │   │   ├── BloodDonorCard.tsx
│       │   │   ├── AmbulanceTracker.tsx
│       │   │   ├── OxygenLocator.tsx
│       │   │   ├── EmergencyRequest.tsx
│       │   │   ├── SOSButton.tsx
│       │   │   └── NearbyHelp.tsx
│       │   │
│       │   ├── 📂 appointment/
│       │   │   ├── BookingForm.tsx
│       │   │   ├── AppointmentCalendar.tsx
│       │   │   ├── AppointmentList.tsx
│       │   │   ├── VideoConsultation.tsx
│       │   │   └── AppointmentStatus.tsx
│       │   │
│       │   ├── 📂 pharmacy/
│       │   │   ├── MedicineSearch.tsx
│       │   │   ├── PharmacyCard.tsx
│       │   │   ├── StockIndicator.tsx
│       │   │   ├── MedicineCompare.tsx
│       │   │   ├── PrescriptionUpload.tsx
│       │   │   └── OrderTracker.tsx
│       │   │
│       │   ├── 📂 women/
│       │   │   ├── PregnancyTracker.tsx
│       │   │   ├── GynecologistCard.tsx
│       │   │   ├── VaccineSchedule.tsx
│       │   │   ├── SpecialCare.tsx
│       │   │   ├── MenstrualTracker.tsx
│       │   │   └── BabyGrowthChart.tsx
│       │   │
│       │   └── 📂 ai-assistant/
│       │       ├── ChatBot.tsx
│       │       ├── SymptomChecker.tsx
│       │       ├── HealthRecommendation.tsx
│       │       └── MedicineReminder.tsx
│       │
│       ├── 📂 pages/
│       │   ├── 📄 Home.tsx
│       │   ├── 📄 Login.tsx
│       │   ├── 📄 Register.tsx
│       │   ├── 📂 dashboard/
│       │   │   ├── PatientDashboard.tsx
│       │   │   ├── DoctorDashboard.tsx
│       │   │   ├── HospitalDashboard.tsx
│       │   │   ├── PharmacyDashboard.tsx
│       │   │   └── AdminDashboard.tsx
│       │   ├── 📄 Doctors.tsx
│       │   ├── 📄 DoctorProfile.tsx
│       │   ├── 📄 Hospitals.tsx
│       │   ├── 📄 Appointments.tsx
│       │   ├── 📄 Emergency.tsx
│       │   ├── 📄 Pharmacy.tsx
│       │   ├── 📄 MedicalRecords.tsx
│       │   ├── 📄 AIAssistant.tsx
│       │   ├── 📄 WomenHealth.tsx
│       │   ├── 📄 BloodDonors.tsx
│       │   ├── 📄 OxygenNetwork.tsx
│       │   ├── 📄 AdminPanel.tsx
│       │   ├── 📄 Profile.tsx
│       │   ├── 📄 Settings.tsx
│       │   └── 📄 NotFound.tsx
│       │
│       ├── 📂 hooks/
│       │   ├── 📄 useAuth.ts
│       │   ├── 📄 useDoctor.ts
│       │   ├── 📄 useHospital.ts
│       │   ├── 📄 useAppointment.ts
│       │   ├── 📄 useEmergency.ts
│       │   ├── 📄 usePharmacy.ts
│       │   ├── 📄 useGeolocation.ts
│       │   ├── 📄 useWebSocket.ts
│       │   ├── 📄 useDebounce.ts
│       │   └── 📄 useMediaQuery.ts
│       │
│       ├── 📂 services/
│       │   ├── 📄 api.ts
│       │   ├── 📄 authService.ts
│       │   ├── 📄 doctorService.ts
│       │   ├── 📄 hospitalService.ts
│       │   ├── 📄 emergencyService.ts
│       │   ├── 📄 pharmacyService.ts
│       │   ├── 📄 appointmentService.ts
│       │   ├── 📄 womenHealthService.ts
│       │   └── 📄 aiService.ts
│       │
│       ├── 📂 store/
│       │   ├── 📄 index.ts
│       │   └── 📂 slices/
│       │       ├── authSlice.ts
│       │       ├── doctorSlice.ts
│       │       ├── hospitalSlice.ts
│       │       ├── appointmentSlice.ts
│       │       ├── emergencySlice.ts
│       │       ├── pharmacySlice.ts
│       │       └── uiSlice.ts
│       │
│       ├── 📂 utils/
│       │   ├── 📄 constants.ts
│       │   ├── 📄 helpers.ts
│       │   ├── 📄 validators.ts
│       │   ├── 📄 formatters.ts
│       │   ├── 📄 dateUtils.ts
│       │   └── 📄 geolocation.ts
│       │
│       ├── 📂 styles/
│       │   ├── 📄 globals.css
│       │   ├── 📄 themes.ts
│       │   └── 📄 animations.ts
│       │
│       └── 📂 lib/
│           ├── 📄 axios.ts
│           └── 📄 firebase.ts
│                   



=======================================================================================================================================
                                                         # Python FastAPI Backend
=======================================================================================================================================


backend/
├── 📄 requirements.txt
├── 📄 Dockerfile
├── 📄 docker-compose.yml
├── 📄 alembic.ini
├── 📄 pyproject.toml
├── 📄 .env.example
├── 📄 .env.test
├── 📄 Makefile
├── 📄 README.md
├── 📄 pytest.ini
├── 📄 .pre-commit-config.yaml
│
├── 📂 alembic/
│   ├── 📄 env.py
│   ├── 📄 script.py.mako
│   └── 📂 versions/
│       └── 📄 .gitkeep
│
├── 📂 app/
│   ├── 📄 __init__.py
│   ├── 📄 main.py
│   └── 📂 core/
│       ├── 📄 __init__.py
│       ├── 📄 config.py
│       ├── 📄 security.py
│       ├── 📄 database.py
│       ├── 📄 cache.py
│       ├── 📄 celery_app.py
│       ├── 📄 exceptions.py
│       ├── 📄 middleware.py
│       ├── 📄 logging.py
│       └── 📄 events.py
│   │
│   ├── 📂 api/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 deps.py
│   │   ├── 📄 errors.py
│   │   └── 📂 v1/
│   │       ├── 📄 __init__.py
│   │       ├── 📄 router.py
│   │       ├── 📂 auth/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 users/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 doctors/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 patients/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 hospitals/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 appointments/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 pharmacy/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 emergency/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 blood_donors/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 oxygen/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 women_health/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 ai_assistant/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       ├── 📂 notifications/
│   │       │   ├── 📄 __init__.py
│   │       │   ├── 📄 endpoints.py
│   │       │   ├── 📄 schemas.py
│   │       │   └── 📄 service.py
│   │       └── 📂 admin/
│   │           ├── 📄 __init__.py
│   │           ├── 📄 endpoints.py
│   │           ├── 📄 schemas.py
│   │           └── 📄 service.py
│   │
│   ├── 📂 models/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 base.py
│   │   ├── 📄 user.py
│   │   ├── 📄 doctor.py
│   │   ├── 📄 patient.py
│   │   ├── 📄 hospital.py
│   │   ├── 📄 appointment.py
│   │   ├── 📄 pharmacy.py
│   │   ├── 📄 emergency.py
│   │   ├── 📄 blood_donor.py
│   │   ├── 📄 oxygen.py
│   │   ├── 📄 women_health.py
│   │   ├── 📄 notification.py
│   │   ├── 📄 review.py
│   │   └── 📄 payment.py
│   │
│   ├── 📂 repositories/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 base.py
│   │   ├── 📄 user_repository.py
│   │   ├── 📄 doctor_repository.py
│   │   ├── 📄 patient_repository.py
│   │   ├── 📄 hospital_repository.py
│   │   ├── 📄 appointment_repository.py
│   │   ├── 📄 pharmacy_repository.py
│   │   └── 📄 blood_donor_repository.py
│   │
│   ├── 📂 services/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 auth_service.py
│   │   ├── 📄 user_service.py
│   │   ├── 📄 doctor_service.py
│   │   ├── 📄 patient_service.py
│   │   ├── 📄 hospital_service.py
│   │   ├── 📄 appointment_service.py
│   │   ├── 📄 pharmacy_service.py
│   │   ├── 📄 emergency_service.py
│   │   ├── 📄 notification_service.py
│   │   ├── 📄 payment_service.py
│   │   ├── 📄 ai_service.py
│   │   └── 📄 realtime_service.py
│   │
│   ├── 📂 integrations/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 firebase.py
│   │   ├── 📄 google_maps.py
│   │   ├── 📄 twilio.py
│   │   ├── 📄 sendgrid.py
│   │   ├── 📄 cloudinary.py
│   │   └── 📄 redis.py
│   │
│   ├── 📂 utils/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 security.py
│   │   ├── 📄 validators.py
│   │   ├── 📄 pagination.py
│   │   ├── 📄 geolocation.py
│   │   ├── 📄 date_utils.py
│   │   └── 📄 file_utils.py
│   │
│   ├── 📂 tasks/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 email_tasks.py
│   │   ├── 📄 notification_tasks.py
│   │   ├── 📄 reminder_tasks.py
│   │   └── 📄 report_tasks.py
│   │
│   └── 📂 middleware/
│       ├── 📄 __init__.py
│       ├── 📄 auth.py
│       ├── 📄 rate_limiter.py
│       ├── 📄 cors.py
│       └── 📄 logging.py
│
├── 📂 tests/
│   ├── 📄 __init__.py
│   ├── 📄 conftest.py
│   ├── 📂 unit/
│   │   ├── 📄 test_auth_service.py
│   │   ├── 📄 test_user_service.py
│   │   └── 📄 test_validators.py
│   ├── 📂 integration/
│   │   ├── 📄 test_auth_endpoints.py
│   │   ├── 📄 test_user_endpoints.py
│   │   └── 📄 test_database.py
│   └── 📂 fixtures/
│       ├── 📄 user_fixtures.py
│       └── 📄 data_fixtures.py
│
├── 📂 scripts/
│   ├── 📄 seed_data.py
│   ├── 📄 backup.sh
│   └── 📄 init_db.py
│
└── 📂 docs/
    ├── 📄 API_GUIDE.md
    ├── 📄 SETUP.md
    └── 📄 DEPLOYMENT.md
```



===============================================================================================================================================
                                                                  # MySQL Database (99 Tables)
===============================================================================================================================================

```


├── 📂 database/                           
│   ├── 📄 README.md
│   ├── 📄 master_schema.sql               # ALL 99 tables in ONE file
│   │
│   ├── 📂 schema/                         # Individual table files (99 files)
│   │   ├── 📄 001_core_users.sql
│   │   ├── 📄 002_core_roles.sql
│   │   ├── 📄 003_core_user_roles.sql
│   │   ├── 📄 004_core_sessions.sql
│   │   ├── 📄 005_core_otp_codes.sql
│   │   ├── 📄 006_core_refresh_tokens.sql
│   │   ├── 📄 007_core_password_resets.sql
│   │   ├── 📄 008_core_activity_logs.sql
│   │   ├── 📄 009_patient_profiles.sql
│   │   ├── 📄 010_patient_vitals.sql
│   │   ├── 📄 011_patient_allergies.sql
│   │   ├── 📄 012_patient_chronic_diseases.sql
│   │   ├── 📄 013_patient_medications.sql
│   │   ├── 📄 014_patient_family_history.sql
│   │   ├── 📄 015_patient_lifestyle.sql
│   │   ├── 📄 016_patient_immunizations.sql
│   │   ├── 📄 017_patient_health_metrics.sql
│   │   ├── 📄 018_doctor_profiles.sql
│   │   ├── 📄 019_doctor_specializations.sql
│   │   ├── 📄 020_doctor_qualifications.sql
│   │   ├── 📄 021_doctor_experience.sql
│   │   ├── 📄 022_doctor_schedules.sql
│   │   ├── 📄 023_doctor_availability_exceptions.sql
│   │   ├── 📄 024_doctor_consultation_fees.sql
│   │   ├── 📄 025_doctor_languages.sql
│   │   ├── 📄 026_doctor_awards.sql
│   │   ├── 📄 027_doctor_publications.sql
│   │   ├── 📄 028_hospital_profiles.sql
│   │   ├── 📄 029_hospital_departments.sql
│   │   ├── 📄 030_hospital_beds.sql
│   │   ├── 📄 031_hospital_icu_beds.sql
│   │   ├── 📄 032_hospital_emergency_services.sql
│   │   ├── 📄 033_hospital_ambulances.sql
│   │   ├── 📄 034_hospital_facilities.sql
│   │   ├── 📄 035_hospital_accreditations.sql
│   │   ├── 📄 036_hospital_insurance_partners.sql
│   │   ├── 📄 037_hospital_visiting_hours.sql
│   │   ├── 📄 038_hospital_admins.sql
│   │   ├── 📄 039_hospital_doctor_affiliations.sql
│   │   ├── 📄 040_appointments.sql
│   │   ├── 📄 041_appointment_vitals.sql
│   │   ├── 📄 042_appointment_notes.sql
│   │   ├── 📄 043_prescriptions.sql
│   │   ├── 📄 044_prescription_medicines.sql
│   │   ├── 📄 045_prescription_tests.sql
│   │   ├── 📄 046_medical_records.sql
│   │   ├── 📄 047_lab_reports.sql
│   │   ├── 📄 048_imaging_reports.sql
│   │   ├── 📄 049_surgery_records.sql
│   │   ├── 📄 050_discharge_summaries.sql
│   │   ├── 📄 051_blood_donors.sql
│   │   ├── 📄 052_blood_donations.sql
│   │   ├── 📄 053_blood_requests.sql
│   │   ├── 📄 054_blood_stock.sql
│   │   ├── 📄 055_blood_camps.sql
│   │   ├── 📄 056_blood_donor_rewards.sql
│   │   ├── 📄 057_oxygen_stock.sql
│   │   ├── 📄 058_oxygen_requests.sql
│   │   ├── 📄 059_oxygen_suppliers.sql
│   │   ├── 📄 060_oxygen_cylinder_tracking.sql
│   │   ├── 📄 061_pharmacies.sql
│   │   ├── 📄 062_pharmacy_staff.sql
│   │   ├── 📄 063_medicines.sql
│   │   ├── 📄 064_medicine_categories.sql
│   │   ├── 📄 065_medicine_manufacturers.sql
│   │   ├── 📄 066_pharmacy_inventory.sql
│   │   ├── 📄 067_medicine_orders.sql
│   │   ├── 📄 068_medicine_order_items.sql
│   │   ├── 📄 069_medicine_deliveries.sql
│   │   ├── 📄 070_medicine_price_comparison.sql
│   │   ├── 📄 071_emergency_requests.sql
│   │   ├── 📄 072_emergency_contacts.sql
│   │   ├── 📄 073_emergency_volunteers.sql
│   │   ├── 📄 074_emergency_ambulance_requests.sql
│   │   ├── 📄 075_emergency_sos_alerts.sql
│   │   ├── 📄 076_women_health_profiles.sql
│   │   ├── 📄 077_pregnancy_tracking.sql
│   │   ├── 📄 078_pregnancy_appointments.sql
│   │   ├── 📄 079_baby_vaccine_schedule.sql
│   │   ├── 📄 080_menstrual_cycle_tracking.sql
│   │   ├── 📄 081_gynecologist_consultations.sql
│   │   ├── 📄 082_child_growth_records.sql
│   │   ├── 📄 083_notifications.sql
│   │   ├── 📄 084_notification_templates.sql
│   │   ├── 📄 085_push_notification_tokens.sql
│   │   ├── 📄 086_reviews_ratings.sql
│   │   ├── 📄 087_doctor_reviews.sql
│   │   ├── 📄 088_hospital_reviews.sql
│   │   ├── 📄 089_medicine_reviews.sql
│   │   ├── 📄 090_payment_transactions.sql
│   │   ├── 📄 091_payment_methods.sql
│   │   ├── 📄 092_insurance_claims.sql
│   │   ├── 📄 093_health_blogs.sql
│   │   ├── 📄 094_health_tips.sql
│   │   ├── 📄 095_ai_chat_history.sql
│   │   ├── 📄 096_ai_symptom_checks.sql
│   │   ├── 📄 097_system_settings.sql
│   │   ├── 📄 098_feedback_support.sql
│   │   └── 📄 099_audit_trails.sql
│   │
│   ├── 📂 procedures/
│   │   ├── 📄 sp_calculate_donor_eligibility.sql
│   │   ├── 📄 sp_book_appointment.sql
│   │   ├── 📄 sp_update_blood_stock.sql
│   │   ├── 📄 sp_send_emergency_alert.sql
│   │   ├── 📄 sp_generate_report.sql
│   │   ├── 📄 sp_process_payment.sql
│   │   ├── 📄 sp_check_medicine_expiry.sql
│   │   └── 📄 sp_calculate_hospital_rating.sql
│   │
│   ├── 📂 triggers/
│   │   ├── 📄 trg_after_blood_donation.sql
│   │   ├── 📄 trg_after_appointment.sql
│   │   ├── 📄 trg_medicine_expiry_alert.sql
│   │   ├── 📄 trg_oxygen_stock_alert.sql
│   │   ├── 📄 trg_after_prescription.sql
│   │   └── 📄 trg_after_user_registration.sql
│   │
│   ├── 📂 views/
│   │   ├── 📄 vw_doctor_availability.sql
│   │   ├── 📄 vw_blood_stock_summary.sql
│   │   ├── 📄 vw_hospital_bed_status.sql
│   │   ├── 📄 vw_patient_appointment_history.sql
│   │   └── 📄 vw_revenue_analytics.sql
│   │
│   ├── 📂 seeds/
│   │   ├── 📄 seed_roles.sql
│   │   ├── 📄 seed_admin.sql
│   │   ├── 📄 seed_blood_groups.sql
│   │   ├── 📄 seed_departments.sql
│   │   ├── 📄 seed_specializations.sql
│   │   └── 📄 seed_medicine_categories.sql
│   │
│   └── 📂 docs/
│       ├── 📄 ER_DIAGRAM.md
│       ├── 📄 SCHEMA_DOCUMENTATION.md
│       └── 📄 API_MAPPING.md
│
├── 📂 docs/                               # Project Documentation
│   ├── 📄 PROJECT_OVERVIEW.md
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 API_DOCUMENTATION.md
│   ├── 📄 SETUP_GUIDE.md
│   ├── 📄 CONTRIBUTING.md
│   ├── 📄 DEPLOYMENT.md
│   └── 📄 CHANGELOG.md
│
└── 📂 deployment/
    ├── 📄 nginx.conf
    ├── 📄 docker-compose.prod.yml
    └── 📂 scripts/
        ├── 📄 deploy.sh
        └── 📄 backup.sh




```






## API Endpoints Reference

### 1. Authentication (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/verify-email` | Verify email with OTP | No |
| POST | `/auth/verify-phone` | Verify phone with OTP | No |
| POST | `/auth/refresh-token` | Refresh access token | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |
| POST | `/auth/change-password` | Change password | Yes |
| POST | `/auth/setup-2fa` | Enable 2FA | Yes |
| POST | `/auth/verify-2fa` | Verify 2FA code | No |
| POST | `/auth/disable-2fa` | Disable 2FA | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/logout` | Logout user | Yes |

### 2. Users (`/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update profile | Yes |
| PUT | `/users/location` | Update location | Yes |
| POST | `/users/roles` | Add role | Yes |
| DELETE | `/users/roles/{role}` | Remove role | Yes |
| GET | `/users/emergency-contacts` | Get emergency contacts | Yes |
| POST | `/users/emergency-contacts` | Add emergency contact | Yes |
| PUT | `/users/emergency-contacts/{id}` | Update contact | Yes |
| DELETE | `/users/emergency-contacts/{id}` | Delete contact | Yes |
| POST | `/users/upload-avatar` | Upload avatar | Yes |
| GET | `/users/search` | Search users | No |
| GET | `/users/dashboard` | User dashboard | Yes |
| DELETE | `/users/account` | Delete account | Yes |

### 3. Doctors (`/doctors`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/doctors/profile` | Create doctor profile | Yes |
| GET | `/doctors/profile/{id}` | Get doctor profile | No |
| PUT | `/doctors/profile` | Update profile | Yes (Doctor) |
| GET | `/doctors/search` | Search doctors | No |
| POST | `/doctors/schedule` | Add schedule | Yes (Doctor) |
| GET | `/doctors/schedule/{id}` | Get schedule | No |
| PUT | `/doctors/schedule/{id}` | Update schedule | Yes (Doctor) |
| DELETE | `/doctors/schedule/{id}` | Delete schedule | Yes (Doctor) |
| POST | `/doctors/hospital-affiliations` | Add affiliation | Yes (Doctor) |
| GET | `/doctors/{id}/patients` | Get patients | Yes (Doctor) |
| GET | `/doctors/{id}/reviews` | Get reviews | No |
| GET | `/doctors/dashboard` | Doctor dashboard | Yes (Doctor) |
| PUT | `/doctors/toggle-online-status` | Toggle online | Yes (Doctor) |
| GET | `/doctors/ranking` | Get rankings | No |
| POST | `/doctors/compare` | Compare doctors | No |

### 4. Patients (`/patients`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/patients/profile` | Create profile | Yes |
| GET | `/patients/profile` | Get profile | Yes |
| PUT | `/patients/profile` | Update profile | Yes |
| POST | `/patients/vitals` | Record vitals | Yes |
| GET | `/patients/vitals` | Get vitals history | Yes |
| POST | `/patients/vaccinations` | Add vaccination | Yes |
| GET | `/patients/vaccinations` | Get vaccinations | Yes |
| POST | `/patients/medical-records` | Add record | Yes |
| GET | `/patients/medical-records` | Get records | Yes |
| POST | `/patients/medical-records/upload` | Upload file | Yes |
| GET | `/patients/health-timeline` | Health timeline | Yes |
| GET | `/patients/dashboard` | Patient dashboard | Yes |
| GET | `/patients/blood-donation-history` | Donation history | Yes |
| GET | `/patients/medicine-history` | Medicine history | Yes |
| GET | `/patients/connected-doctors` | Connected doctors | Yes |
| GET | `/patients/connected-hospitals` | Connected hospitals | Yes |

### 5. Hospitals (`/hospitals`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/hospitals/profile` | Create profile | Yes |
| GET | `/hospitals/profile/{id}` | Get profile | No |
| PUT | `/hospitals/profile` | Update profile | Yes (Hospital) |
| GET | `/hospitals/search` | Search hospitals | No |
| GET | `/hospitals/icu-network` | Get ICU network | No |
| POST | `/hospitals/departments` | Add department | Yes (Hospital) |
| GET | `/hospitals/departments/{id}` | Get departments | No |
| PUT | `/hospitals/beds` | Update bed status | Yes (Hospital) |
| PUT | `/hospitals/blood-stock` | Update blood stock | Yes (Hospital) |
| GET | `/hospitals/blood-stock/{id}` | Get blood stock | No |
| PUT | `/hospitals/oxygen-stock` | Update oxygen stock | Yes (Hospital) |
| GET | `/hospitals/oxygen-stock/{id}` | Get oxygen stock | No |
| POST | `/hospitals/emergency-announcement` | Create announcement | Yes (Hospital) |
| GET | `/hospitals/dashboard` | Hospital dashboard | Yes (Hospital) |
| GET | `/hospitals/{id}/doctors` | Get doctors | No |
| GET | `/hospitals/{id}/reviews` | Get reviews | No |
| GET | `/hospitals/analytics` | Hospital analytics | Yes (Hospital) |

### 6. Appointments (`/appointments`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/appointments/book` | Book appointment | Yes |
| GET | `/appointments/{id}` | Get appointment | Yes |
| GET | `/appointments/upcoming` | Upcoming appointments | Yes |
| GET | `/appointments/history` | Appointment history | Yes |
| PUT | `/appointments/{id}/reschedule` | Reschedule | Yes |
| PUT | `/appointments/{id}/cancel` | Cancel | Yes |
| POST | `/appointments/{id}/prescription` | Create prescription | Yes (Doctor) |
| POST | `/appointments/{id}/prescription/medicines` | Add medicine | Yes (Doctor) |
| POST | `/appointments/{id}/prescription/tests` | Add test | Yes (Doctor) |
| POST | `/appointments/{id}/notes` | Add note | Yes (Doctor) |
| POST | `/appointments/{id}/video-setup` | Setup video | Yes (Doctor) |
| GET | `/appointments/{id}/prescription` | View prescription | Yes |
| GET | `/appointments/doctor/{id}/available-slots` | Available slots | No |
| GET | `/appointments/doctor/dashboard` | Doctor dashboard | Yes (Doctor) |

### 7. Pharmacy (`/pharmacy`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/pharmacy/profile` | Create profile | Yes |
| GET | `/pharmacy/profile/{id}` | Get profile | No |
| GET | `/pharmacy/search` | Search pharmacies | No |
| POST | `/pharmacy/medicines` | Add medicine | Yes (Pharmacy) |
| GET | `/pharmacy/medicines/search` | Search medicines | No |
| GET | `/pharmacy/medicines/{id}` | Get medicine | No |
| GET | `/pharmacy/medicines/compare` | Compare medicines | No |
| POST | `/pharmacy/inventory` | Add inventory | Yes (Pharmacy) |
| PUT | `/pharmacy/inventory/{id}` | Update inventory | Yes (Pharmacy) |
| GET | `/pharmacy/inventory` | Get inventory | Yes (Pharmacy) |
| POST | `/pharmacy/orders` | Create order | Yes |
| GET | `/pharmacy/orders/{id}` | Get order | Yes |
| PUT | `/pharmacy/orders/{id}/status` | Update status | Yes (Pharmacy) |
| GET | `/pharmacy/orders` | Get orders | Yes |
| POST | `/pharmacy/prescriptions/upload` | Upload prescription | Yes |
| GET | `/pharmacy/dashboard` | Pharmacy dashboard | Yes (Pharmacy) |
| GET | `/pharmacy/client-dashboard` | Client dashboard | Yes |
| GET | `/pharmacy/medicines/prices` | Compare prices | No |

### 8. Emergency (`/emergency`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/emergency/request` | Create emergency | Yes |
| POST | `/emergency/sos` | Trigger SOS | Yes |
| GET | `/emergency/ambulances/nearby` | Nearby ambulances | No |
| GET | `/emergency/hospitals/nearby` | Nearby hospitals | No |
| POST | `/emergency/volunteers/register` | Register volunteer | Yes |
| GET | `/emergency/volunteers/nearby` | Nearby volunteers | No |

### 9. Blood Donors (`/blood-donors`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/blood-donors/register` | Register donor | Yes |
| GET | `/blood-donors/search` | Search donors | No |
| POST | `/blood-donors/request` | Request blood | Yes |
| POST | `/blood-donors/donate` | Record donation | Yes |
| GET | `/blood-donors/eligibility` | Check eligibility | Yes |
| GET | `/blood-donors/history` | Donation history | Yes |
| GET | `/blood-donors/stock` | Blood stock | No |
| GET | `/blood-donors/rewards/{id}` | Donor rewards | Yes |
| POST | `/blood-donors/emergency-alert` | Emergency alert | Yes |
| GET | `/blood-donors/statistics` | Statistics | No |

### 10. Oxygen (`/oxygen`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/oxygen/stock` | Add stock record | Yes (Hospital) |
| PUT | `/oxygen/stock` | Update stock | Yes (Hospital) |
| GET | `/oxygen/stock/{id}` | Get stock | No |
| GET | `/oxygen/availability` | Check availability | No |
| POST | `/oxygen/request` | Request oxygen | Yes |
| GET | `/oxygen/request/{id}` | Get request | Yes |
| GET | `/oxygen/requests` | Get requests | Yes |
| PUT | `/oxygen/request/{id}/fulfill` | Fulfill request | Yes (Hospital) |
| POST | `/oxygen/suppliers` | Add supplier | Yes (Hospital) |
| GET | `/oxygen/suppliers` | Get suppliers | No |
| GET | `/oxygen/alerts` | Get alerts | No |
| GET | `/oxygen/dashboard` | Dashboard | Yes (Hospital) |
| POST | `/oxygen/cylinder-tracking` | Track cylinder | No |
| GET | `/oxygen/cylinder-tracking/{id}` | Cylinder location | No |

### 11. Women Health (`/women-health`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/women-health/profile` | Create profile | Yes |
| GET | `/women-health/profile` | Get profile | Yes |
| PUT | `/women-health/profile` | Update profile | Yes |
| POST | `/women-health/pregnancy` | Start tracking | Yes |
| GET | `/women-health/pregnancy/current` | Current pregnancy | Yes |
| PUT | `/women-health/pregnancy/{id}` | Update pregnancy | Yes |
| GET | `/women-health/pregnancy/history` | Pregnancy history | Yes |
| POST | `/women-health/menstrual/log` | Log cycle | Yes |
| GET | `/women-health/menstrual/logs` | Get logs | Yes |
| GET | `/women-health/menstrual/prediction` | Predict period | Yes |
| GET | `/women-health/menstrual/fertility-window` | Fertility window | Yes |
| POST | `/women-health/gynecologist-visits` | Log visit | Yes |
| GET | `/women-health/gynecologist-visits` | Get visits | Yes |
| POST | `/women-health/baby` | Add baby | Yes |
| GET | `/women-health/babies` | Get babies | Yes |
| POST | `/women-health/baby/{id}/growth` | Add growth | Yes |
| GET | `/women-health/baby/{id}/growth` | Get growth | Yes |
| POST | `/women-health/baby/{id}/vaccines` | Add vaccine | Yes |
| GET | `/women-health/baby/{id}/vaccines` | Get vaccines | Yes |
| GET | `/women-health/dashboard` | Dashboard | Yes |
| GET | `/women-health/emergency-pregnancy-support` | Emergency support | No |

### 12. AI Assistant (`/ai-assistant`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai-assistant/symptom-checker` | Check symptoms | Optional |
| POST | `/ai-assistant/health-recommendations` | Get recommendations | Optional |
| POST | `/ai-assistant/medicine-recommendation` | Recommend medicine | Optional |
| POST | `/ai-assistant/drug-interaction-check` | Check interactions | No |
| POST | `/ai-assistant/chatbot` | AI chatbot | Optional |
| GET | `/ai-assistant/recovery-prediction/{condition}` | Predict recovery | No |
| POST | `/ai-assistant/dosage-reminder` | Set reminder | Yes |
| GET | `/ai-assistant/health-tips` | Health tips | No |
| POST | `/ai-assistant/emergency-chatbot` | Emergency chatbot | No |

### 13. Notifications (`/notifications`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/notifications/` | Get notifications | Yes |
| GET | `/notifications/unread-count` | Unread count | Yes |
| PUT | `/notifications/{id}/read` | Mark as read | Yes |
| PUT | `/notifications/read-all` | Mark all read | Yes |
| DELETE | `/notifications/{id}` | Delete notification | Yes |
| POST | `/notifications/push-token` | Register token | Yes |
| PUT | `/notifications/preferences` | Update preferences | Yes |
| GET | `/notifications/preferences` | Get preferences | Yes |
| POST | `/notifications/test` | Test notification | Yes |

### 14. Admin (`/admin`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/dashboard` | Dashboard | Admin |
| GET | `/admin/users` | Get all users | Admin |
| GET | `/admin/users/{id}` | User details | Admin |
| PUT | `/admin/users/{id}/status` | Update status | Admin |
| POST | `/admin/users/block` | Block user | Admin |
| DELETE | `/admin/users/{id}` | Delete user | Admin |
| POST | `/admin/verify/doctor` | Verify doctor | Admin |
| POST | `/admin/verify/hospital` | Verify hospital | Admin |
| POST | `/admin/verify/pharmacy` | Verify pharmacy | Admin |
| GET | `/admin/analytics/users` | User analytics | Admin |
| GET | `/admin/analytics/blood` | Blood analytics | Admin |
| GET | `/admin/analytics/revenue` | Revenue analytics | Admin |
| GET | `/admin/analytics/emergency` | Emergency analytics | Admin |
| GET | `/admin/reports` | Generate reports | Admin |
| GET | `/admin/feedback` | Get feedback | Admin |
| GET | `/admin/audit-logs` | Audit logs | Admin |

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success",
  "status": 200
}

