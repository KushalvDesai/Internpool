# Internpool - Internship Management System

A comprehensive full-stack web application for managing internship programs, designed to streamline the coordination between students, faculty advisors, and administrators.

## 🌟 Features

### For Students
- **Internship Registration**: Add and track internship details including company information, stipend, and documents
- **Weekly Reports**: Submit weekly internship reports with working hours and progress updates
- **Profile Management**: Manage personal information and view internship history
- **Company Directory**: Browse and search verified companies

### For Faculty
- **Student Monitoring**: View and manage assigned students' internship progress
- **Report Evaluation**: Grade weekly reports and provide feedback
- **Batch Management**: Filter and view students by internship type
- **Company Oversight**: Access company information for student placements

### For Administrators
- **User Management**: Manage students, faculty, and admin accounts
- **Faculty Assignment**: Assign faculty members to student batches
- **Company Verification**: Verify and manage company registrations
- **System Overview**: Monitor all internships and reports across the system

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router v7** - Client-side routing
- **Vite** - Build tool and dev server
- **TailwindCSS v4** - Utility-first CSS framework
- **Motion** - Animation library
- **Tabler Icons** - Icon set

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/KushalvDesai/Internpool.git
cd Internpool
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd be

# Install dependencies
npm install

# Create .env file
# Add the following variables:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Start the backend server
npm start

# Or use nodemon for development
npm run server
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd fe

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login

### Student Routes
- `GET /student/profile` - Get student profile
- `GET /student/internships` - Get student's internships
- `POST /student/internship` - Create internship record
- `GET /student/reports` - Get student's reports
- `POST /student/report` - Create new report
- `POST /student/report/:reportId/weekly` - Submit weekly report

### Faculty Routes
- `GET /faculty/students` - Get assigned students
- `GET /faculty/students/internshipType/:type` - Filter students by type
- `GET /faculty/students/:studentId` - Get specific student details
- `GET /faculty/reports/:studentId` - Get student's reports
- `PUT /faculty/report/grade/:reportId` - Grade a report

### Admin Routes
- `GET /admin/students` - Get all students
- `GET /admin/faculty` - Get all faculty
- `GET /admin/companies` - Get all companies
- `PUT /admin/faculty/:facultyId/assign` - Assign faculty to batch

### Company Routes
- `GET /api/company` - Get all companies
- `GET /api/company/:id` - Get company by ID
- `POST /api/company` - Create new company
- `PUT /api/company/:id` - Update company
- `DELETE /api/company/:id` - Delete company

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License



## 👥 Authors

- **Kushal Desai** - [KushalvDesai](https://github.com/KushalvDesai)
- **Aaleya Boxwala** - [aaleya5](https://github.com/aaleya5)
