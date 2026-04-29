#Project Aetherion





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
├── Framework: React 18 + TypeScript
├── Styling: Tailwind CSS + Shadcn UI
├── State Management: Redux Toolkit + RTK Query
├── Routing: React Router v6
├── Animations: Framer Motion
├── Charts: Recharts
├── Forms: React Hook Form + Zod
├── Icons: Lucide React + Heroicons
├── Notifications: React Hot Toast
├── Calendar: React Big Calendar
└── Build Tool: Vite
```



##  Project Structure

```
smart-hospital-system/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── Loader.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── common/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── UserAvatar.tsx
│   │   │   └── BreadCrumb.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── ActivityChart.tsx
│   │   │   ├── RecentAppointments.tsx
│   │   │   └── ResourceStatus.tsx
│   │   ├── doctor/
│   │   │   ├── DoctorCard.tsx
│   │   │   ├── DoctorProfile.tsx
│   │   │   ├── DoctorSchedule.tsx
│   │   │   └── DoctorRanking.tsx
│   │   ├── patient/
│   │   │   ├── PatientProfile.tsx
│   │   │   ├── MedicalHistory.tsx
│   │   │   ├── MedicineTracker.tsx
│   │   │   └── VaccinationTracker.tsx
│   │   ├── hospital/
│   │   │   ├── HospitalCard.tsx
│   │   │   ├── BedAvailability.tsx
│   │   │   ├── ICUTracker.tsx
│   │   │   └── EmergencyServices.tsx
│   │   ├── emergency/
│   │   │   ├── BloodDonorCard.tsx
│   │   │   ├── AmbulanceTracker.tsx
│   │   │   ├── OxygenLocator.tsx
│   │   │   └── EmergencyRequest.tsx
│   │   ├── appointment/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── AppointmentCalendar.tsx
│   │   │   └── AppointmentList.tsx
│   │   ├── pharmacy/
│   │   │   ├── MedicineSearch.tsx
│   │   │   ├── PharmacyCard.tsx
│   │   │   └── StockIndicator.tsx
│   │   ├── ai-assistant/
│   │   │   ├── ChatBot.tsx
│   │   │   ├── SymptomChecker.tsx
│   │   │   ├── PregnancyGuide.tsx
│   │   │   └── BabyCareAdvice.tsx
│   │   └── women/
│   │       ├── PregnancyTracker.tsx
│   │       ├── GynecologistCard.tsx
│   │       ├── VaccineSchedule.tsx
│   │       └── SpecialCare.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Doctors.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── Hospitals.tsx
│   │   ├── Appointments.tsx
│   │   ├── Emergency.tsx
│   │   ├── Pharmacy.tsx
│   │   ├── MedicalRecords.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── WomenHealth.tsx
│   │   ├── BloodDonors.tsx
│   │   ├── AdminPanel.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDoctor.ts
│   │   ├── useHospital.ts
│   │   ├── useAppointment.ts
│   │   └── useEmergency.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── doctorService.ts
│   │   ├── hospitalService.ts
│   │   ├── emergencyService.ts
│   │   └── aiService.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── doctorSlice.ts
│   │   │   ├── hospitalSlice.ts
│   │   │   ├── appointmentSlice.ts
│   │   │   └── emergencySlice.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── doctor.ts
│   │   ├── hospital.ts
│   │   ├── appointment.ts
│   │   └── emergency.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── themes.ts
│   │   └── animations.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```




---

##  Getting Started

To initialize the project database, run the following SQL commands:

```sql
CREATE DATABASE project_db;
USE project_db;
```

---

##  Advanced Concepts Implemented

* JOIN operations
* Subqueries
* GROUP BY and HAVING clauses
* Stored Procedures
* Triggers
* Indexing
* Transactions (ACID properties)

---

##  Collaboration

This repository is structured to support effective team collaboration. Team members can contribute through version control practices, maintain code consistency, and ensure seamless integration of features. Proper documentation and modular design help in scaling and maintaining the project efficiently.

---

##  Objective

To develop a high-performance, scalable, and maintainable database system that reflects real-world industry standards and demonstrates strong understanding of database design and management principles.

---
