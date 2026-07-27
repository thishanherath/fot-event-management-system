# Faculty of Technology (FOT) - University Event Management System (Role-Based Access Control)

A complete, modern, full-stack Role-Based Event Management System built for the **Faculty of Technology (FOT) University**.

---

## 🌟 Architectural & Role-Based Design

This system implements strict **Role-Based Access Control (RBAC)** tailored to university workflows:
1. **University Administrator (`ADMIN`)**:
   - **Student Account Provisioning**: In accordance with university policy, **all student accounts are registered and managed by the Admin**. Students do not self-register freely.
   - **Student Directory**: Admin can register new students (`Name`, `University Email`, `Password`) and remove accounts when students graduate or leave.
   - **Event Governance**: Admin can approve or reject pending campus events, create university-wide events, and monitor real-time registration statistics.
   - **Dashboard Analytics**: Overview of total enrolled students, total campus events, approved events, and student registrations.
2. **University Student (`STUDENT`)**:
   - **Role-Based Login**: Log in securely using credentials provisioned by the University Admin.
   - **Available Events Catalog**: Browse approved university events (symposia, workshops, hackathons, sports meets) with capacity progress bars.
   - **Instant Event Registration**: Click **"Register for Event"** to reserve a ticket in real-time.
   - **My Registrations**: Track registered events and cancel registrations if schedules change.
3. **Organizer (`ORGANIZER`)**:
   - Can create and manage individual events requiring Admin approval.

---

## 🔑 Default Seed Credentials (Auto-Initialized on Startup)

When the Spring Boot backend starts up, a `DataInitializer` automatically seeds default university accounts and sample events if they do not exist:

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fot.edu` | `admin123` | FOT University Administrator |
| **Student** | `john@fot.edu` | `student123` | John Doe (Student) |
| **Student** | `emily@fot.edu` | `student123` | Emily Watson (Student) |

> **Tip:** The frontend login page (`/login`) includes quick "fill demo credentials" buttons so you can test Admin and Student roles with a single click!

---

## 🛠️ Technology Stack

- **Backend**: Java 17+, Spring Boot 3 (Spring Security + JWT Authentication, Spring Data JPA, Hibernate, MySQL).
- **Frontend**: Vite + React 19, Tailwind CSS (Glassmorphism & dark-mode aesthetic), React Router DOM (Role-Based Protected Routing), Axios with JWT Interceptor.

---

## 🚀 How to Run Locally

### 1. Start the Spring Boot Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

### 2. Start the Vite React Frontend
```powershell
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📁 Key Files Implemented / Updated
- [AdminController.java](file:///h:/Dev%20peojects/Fot%20Event%20system/fot-event-management-system/backend/src/main/java/com/ictec/eventmanagementsytem/controller/AdminController.java) & [AdminService.java](file:///h:/Dev%20peojects/Fot%20Event%20system/fot-event-management-system/backend/src/main/java/com/ictec/eventmanagementsytem/service/AdminService.java) - Admin APIs for registering and managing students.
- [DataInitializer.java](file:///h:/Dev%20peojects/Fot%20Event%20system/fot-event-management-system/backend/src/main/java/com/ictec/eventmanagementsytem/config/DataInitializer.java) - Automatic startup seeding of Admin account, Student accounts, and sample events.
- [Login.jsx](file:///h:/Dev%20peojects/Fot%20Event%20system/fot-event-management-system/frontend/src/pages/auth/Login.jsx) - Role-based authentication and redirection page.
- [AdminDashboard.jsx](file:///h:/Dev%20peojects/Fot%20Event%20system/fot-event-management-system/frontend/src/pages/admin/AdminDashboard.jsx) - Admin Portal for student registration, directory management, and event approvals.
- [StudentDashboard.jsx](file:///h:/Dev%20peojects/Fot%20Event%20system/fot-event-management-system/frontend/src/pages/student/StudentDashboard.jsx) - Student Portal for browsing approved events and managing reservations.
- [AppRoutes.jsx](file:///h:/Dev%20peojects/Fot%20Event%20system/fot-event-management-system/frontend/src/routes/AppRoutes.jsx) - RBAC route guard and automatic role redirects.
