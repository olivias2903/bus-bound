# Bus Bound Progress Tracking

**Agents must:**
- Read `progress.json` at session start to understand current project state
- Update `progress.json` before ending a session with a summary of work completed

Updates are session-based summaries of work completed during that session.

---

# **Bus Bound MVP Specification: Core Features, Security, and Compliance**

## **I. Executive Summary**

Bus Bound is an active-verification transit solution for K-12 districts. It ensures "Total Accountability" by linking students to their specific vehicles in real-time, providing peace of mind for parents and operational efficiency for schools.

 For the MVP, the system is designed to be cost-effective, reliable, and scalable, using barcode-based student identification, GPS-enabled tablets, and real-time guardian notifications. The focus is on accurate boarding verification, wrong-bus prevention, and real-time visibility rather than advanced features.

## **II. Role-Based Interfaces (One App, Four Views)**

The system uses **Role-Based Access Control (RBAC)** to serve specific interfaces based on the user’s login credentials.

### **1\. Student View (Mobile/Web)**

* **Use Case**: Students traveling to stops or waiting in extreme weather.  
* **Live Bus Map**: A real-time view of their assigned bus only (powered by tablet GPS).  
* **Arrival Countdown**: A "Time to Arrival" clock (e.g., "Bus is 4 minutes away").  
* **Safety Notifications**: Alerts if the bus is delayed or if a substitute bus is being used.

### **2\. Parent/Guardian View (Mobile/Web)**

* **Bus Location Status**: whether the bus is on time or late, along with ETA  
* **Student Status**: Real-time "Checked-in: Yes/No" status.   
* **Multi-Student Support**: View all children in the household on one dashboard.  
* **Boarding/Exit Logs**: Instant notifications when the child scans their ID upon entering or leaving the bus.  
* **Access Control**: Guardians are linked via a student-specific access code, and accounts must be verified through a secure email connection. Guardians can only see location information for the assigned bus of their student 


### **3\. Driver View (Tablet Optimized)**

* **Hardware Setup**: Cost-effective tablet mounted on bus with GPS tracking and cellular data for real time transmission. External Code 128 barcode scanner connected to tablet.  
* **Visual ID Verification**: Displays the student’s photo upon scanning to prevent ID fraud.  
* **Student Scanning**: Each scan identifies the student and assigned route. Scan logs timestamp and location (if available)  
* **Wrong-Bus Alerts**: Instant audio/visual warning if a student boards an unassigned route. Alert must be persistent and require action. The driver must choose:Accept student (override) or deny boarding. Alert remains until a decision is made. All actions are logged in the system  
* **Manual Override**: Ability to check in students who forget their physical ID.  
* **Substitute Navigation**: Digital route directions for unfamiliar or substitute drivers.  
* **Offline Function**: If cellular data is not working. Scan events and GPS data stored locally. Data syncs automatically when connection is restored

### **4\. Admin View (Desktop/Web)**

* **District Dashboard**: High-level overview of all active routes and student logs.  
* **ID Management**: Generation of secure, personalized student barcodes.  
* **Accountability Reporting**: Searchable logs for incident resolution and district compliance.  
* **Student Assignment**: assign students to routes and busses 

## 

## **III. Security & Compliance**

* **Multi-Factor Authentication (MFA)**: Required for all Parent and Admin accounts to protect student location data.  
* **Data Siloing**: Students and Parents can only access data related to their specific assigned routes and IDs.  
* **FERPA Alignment**: All student data is handled as confidential and restricted to authorized personnel and legal guardians.  
* **Infrastructure**: Built as an **Expo (React Native)** app for native iOS and Android performance with over-the-air updates via EAS Update.  
* **Secure Guardian Linking**: Access requires student-specific code \+ verified email

## **IV. Primary Problem Solved**

* **Safety**: Eliminates "Wrong Bus" incidents through active scan verification.  
* **Health/Comfort**: Reduces student exposure to extreme weather by providing accurate, live ETAs.  
* **Reliability**: Provides drivers (including substitutes) with the digital tools needed to ensure 100% student accountability. 

## **V. Data Integrations (Clever & SIS)**

To ensure seamless onboarding for school districts, Bus Bound prioritizes compatibility with existing **Student Information Systems (SIS)**.

* **Clever Integration**: Bus Bound utilizes the Clever API to automatically sync student rosters, schedules, and guardian contact information, reducing manual entry for district staff.  
* **Data Minimization**: The system only syncs essential "Directory Information" (Name, ID, Route, Guardian Email) to maintain a lean, secure data footprint.

## **VI. Data Privacy & Security Pledge**

*Bus Bound commits to the following for all pilot districts:*

1. **Ownership**: The School District retains full ownership of all student data.  
2. **No Advertising**: Student data is never used for advertising, tracking, or marketing.  
3. **Security**: All data is encrypted at-rest and in-transit using industry-standard protocols.  
4. **Purpose**: Data is collected solely to provide real-time transportation verification and safety alerts.
