# Calorie Tracker Application

## Overview
The **Calorie Tracker Application** is a full-stack web application designed to help users monitor their daily caloric intake and track progress over time. It provides role-based functionality for both users and administrators, enabling easy food entry tracking, reporting, and management.

---

## Features
### User Features:
- User registration and login with role-based authentication.
- Dashboard for daily caloric tracking.
- History and progress views (daily, monthly).
- Ability to add, edit, and delete food entries.
- Notifications for exceeding calorie limits.

### Admin Features:
- View system-wide statistics for users.
- Manage user profiles and food entries.

---

## Technologies Used
### Backend:
- **Language**: Java
- **Framework**: Spring Boot
- **Dependency Management**: Maven
- **Key Features**:
  - RESTful APIs
  - JWT-based authentication
  - Role-based access control
  - Services and repositories for business logic and database interaction

### Frontend:
- **Language**: JavaScript (Node.js, React.js)
- **Libraries**:
  - React Router for routing
  - Axios for API communication
- **Styling**: CSS, Animations

### Database:
- **Type**: Relational Database
- **Technology**: MySQL
- **Database Structure**:
  - User Management
  - Food Entries with calorie tracking

---

## Directory Structure
```plaintext
andri-10-calorie-tracker/
├── backend/
│   └── calorie-tracker/
│       ├── pom.xml
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/grupi2/calorie_tracker/
│       │   │   │       ├── controllers/
│       │   │   │       ├── dto/
│       │   │   │       ├── entities/
│       │   │   │       ├── repositories/
│       │   │   │       ├── security/
│       │   │   │       └── services/
│       │   └── test/
│       │       └── java/com/grupi2/calorie_tracker/
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Admin/
│       │   ├── Dashboard/
│       │   ├── Login/
│       │   ├── Register/
│       │   └── Routes/
│       └── utils/
├── database/
│   └── caloriesdb.sql
└── requirements/
    ├── sprint_backlog.md
    └── user_stories.md
```

---

## Installation and Setup

### Prerequisites:
- **Backend**:
  - JDK 17 or higher
  - Maven
- **Frontend**:
  - Node.js and npm
- **Database**:
  - MySQL Server

### Steps:
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/andri-10/calorie-tracker.git
   ```

2. **Set Up the Backend:**
   - Navigate to the `backend/calorie-tracker` directory.
   - Configure database settings in `src/main/resources/application.properties`.
   - Build and run the application:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

3. **Set Up the Frontend:**
   - Navigate to the `frontend/` directory.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

4. **Set Up the Database:**
   - Import the `caloriesdb.sql` file into your MySQL server:
     ```bash
     mysql -u <username> -p < database_name < database/caloriesdb.sql
     ```
   - Use XAMPP/Docker to host the MySQL server.


Thank You
