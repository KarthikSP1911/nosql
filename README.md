# 🎓 Academia - Education Management System

<div align="center">

![Academia Logo](https://img.shields.io/badge/Academia-Education_Management-6366F1?style=for-the-badge)

**A modern, full-stack web application for managing students, faculty, and courses with an intuitive UI and powerful graph database backend.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Neo4j](https://img.shields.io/badge/Neo4j-5.27-008CC1?style=flat-square&logo=neo4j&logoColor=white)](https://neo4j.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#-features) • [Installation](#-installation--setup) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**Academia** is a comprehensive education management system designed to streamline administrative tasks in educational institutions. Built with modern web technologies, it provides an intuitive interface for managing students, faculty members, and courses while leveraging the power of graph databases for complex relationship tracking.

### What Makes Academia Special?

- **Graph Database Architecture**: Uses Neo4j for native relationship handling, making enrollment and assignment queries lightning-fast
- **Modern UI/UX**: Beautiful, responsive interface built with React 19 and TailwindCSS 4
- **Real-time Updates**: Instant feedback with optimistic UI updates and toast notifications
- **Scalable Design**: Service-layer architecture for easy maintenance and feature additions
- **Dual Database Support**: Supports both Neo4j (primary) and MongoDB (legacy) with migration tools

## ✨ Features

### 📊 Dashboard
- **Real-time Statistics**: View total students, faculty, and active courses at a glance
- **Activity Feed**: Track recent enrollments, assignments, and system events
- **Quick Actions**: Shortcuts to create new students, faculty, or courses
- **Visual Analytics**: Enrollment trends and popular courses display
- **Responsive Cards**: Beautiful stat cards with trend indicators

### �*‍🎓 Student Management
- **Complete CRUD Operations**: Create, read, update, and delete student records
- **Course Enrollment**: Enroll students in multiple courses with validation
- **Profile Management**: Track student information including name, email, and phone
- **Enrollment History**: View all courses a student is enrolled in
- **Search & Filter**: Real-time search across student records
- **Bulk Operations**: Export student data for reporting

### 👨‍🏫 Faculty Management
- **Instructor Profiles**: Manage faculty information and department assignments
- **Course Assignment**: Assign faculty members to teach specific courses
- **Workload Tracking**: View number of courses and students per faculty
- **Department Organization**: Group faculty by academic departments
- **Contact Management**: Store and display faculty contact information

### 📚 Course Management
- **Course Catalog**: Maintain comprehensive course listings
- **Credit Tracking**: Manage course credits and requirements
- **Enrollment Monitoring**: Track student enrollment numbers per course
- **Instructor Assignment**: Link courses to faculty instructors
- **Capacity Management**: Visual progress bars for enrollment capacity
- **Course Codes**: Unique identifiers for each course

### 🔗 Advanced Features
- **Graph Relationships**: Native Neo4j relationships for complex queries
- **Real-time Search**: Instant filtering across all entities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Toast Notifications**: User-friendly success/error messages
- **Empty States**: Helpful prompts when no data exists
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Graceful error messages and recovery

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **Vite** | 7.2.4 | Build Tool & Dev Server |
| **TailwindCSS** | 4.1.17 | Utility-First CSS Framework |
| **Framer Motion** | 12.23.24 | Animation Library |
| **React Router DOM** | 7.9.6 | Client-Side Routing |
| **Axios** | 1.13.2 | HTTP Client |
| **Lucide React** | 0.555.0 | Icon Library |
| **React Toastify** | 11.0.5 | Toast Notifications |
| **clsx** | 2.1.1 | Conditional Classnames |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime Environment |
| **Express.js** | 4.21.2 | Web Framework |
| **Neo4j Driver** | 6.0.1 | Graph Database Driver |
| **Mongoose** | 8.10.1 | MongoDB ODM (Legacy) |
| **UUID** | 13.0.0 | Unique ID Generation |
| **dotenv** | 16.4.7 | Environment Variables |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **Nodemon** | 3.1.9 | Development Auto-Reload |

### Database

| Database | Type | Purpose |
|----------|------|---------|
| **Neo4j Aura** | Graph Database | Primary database for relationship-heavy queries |
| **MongoDB Atlas** | Document Database | Legacy support and migration source |

### Development Tools

- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Git** - Version control

## 📂 Project Structure

```
academia/
├── client/                          # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Reusable UI Components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── PageContainer.jsx
│   │   │   │   └── StatsCard.jsx
│   │   │   ├── shared/             # Layout Components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── DataTable.jsx       # Data Grid Component
│   │   │   └── Modal.jsx           # Modal Dialog
│   │   ├── layouts/
│   │   │   └── Layout.jsx          # Main App Layout
│   │   ├── pages/                  # Application Pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Faculty.jsx
│   │   │   └── Courses.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios Configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js          # Design System Config
│   └── package.json
│
└── server/                          # Backend API
    ├── config/
    │   ├── db.js                   # MongoDB Connection
    │   └── neo4j.js                # Neo4j Connection
    ├── controllers/                # Request Handlers
    │   ├── studentController.js
    │   ├── studentController.neo4j.js
    │   ├── facultyController.js
    │   ├── facultyController.neo4j.js
    │   ├── courseController.js
    │   └── courseController.neo4j.js
    ├── services/                   # Business Logic (Neo4j)
    │   ├── studentService.js
    │   ├── facultyService.js
    │   └── courseService.js
    ├── models/                     # Mongoose Schemas (MongoDB)
    │   ├── Student.js
    │   ├── Faculty.js
    │   └── Course.js
    ├── routes/                     # API Routes
    │   ├── studentRoutes.js
    │   ├── facultyRoutes.js
    │   └── courseRoutes.js
    ├── scripts/
    │   └── migrateToNeo4j.js      # MongoDB → Neo4j Migration
    ├── tests/
    │   └── student.test.js         # Service Tests
    ├── middlewares/
    │   └── errorMiddleware.js
    ├── server.js                   # MongoDB Server
    ├── server.neo4j.js            # Neo4j Server
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Neo4j Database** - Choose one:
  - [Neo4j Aura](https://neo4j.com/cloud/aura/) (Cloud - Recommended)
  - [Neo4j Desktop](https://neo4j.com/download/) (Local)
  - [Neo4j Docker](https://hub.docker.com/_/neo4j) (Container)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/academia.git
cd academia
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# The following packages will be installed:
# - express, cors, dotenv
# - neo4j-driver, uuid
# - mongoose (for migration)
# - nodemon (dev dependency)
```

### Step 3: Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

# The following packages will be installed:
# - react, react-dom, react-router-dom
# - tailwindcss, framer-motion
# - axios, lucide-react, react-toastify
# - vite (dev dependency)
```

### Step 4: Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env  # On Windows: type nul > .env
```

Add the following configuration (see [Environment Variables](#-environment-variables) section for details):

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Neo4j Configuration (Primary Database)
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_secure_password

# MongoDB Configuration (Optional - for migration only)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Step 5: Database Setup

#### Option A: Neo4j Aura (Cloud - Recommended)

1. Go to [Neo4j Aura](https://neo4j.com/cloud/aura/)
2. Create a free account
3. Create a new database instance
4. Copy the connection URI, username, and password
5. Update your `.env` file with these credentials

#### Option B: Neo4j Desktop (Local)

1. Download and install [Neo4j Desktop](https://neo4j.com/download/)
2. Create a new project and database
3. Set a password for the database
4. Start the database
5. Use `neo4j://localhost:7687` as your URI

#### Option C: Neo4j Docker

```bash
docker run \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/your_password \
  -v $HOME/neo4j/data:/data \
  neo4j:latest
```

### Step 6: Database Migration (Optional)

If you have existing MongoDB data:

```bash
cd server
node scripts/migrateToNeo4j.js
```

This will automatically:
- Connect to both MongoDB and Neo4j
- Export all students, faculty, and courses
- Create nodes and relationships in Neo4j
- Verify data integrity

### Step 7: Start the Application

#### Start Backend Server

```bash
cd server

# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The server will start on `http://localhost:5000`

#### Start Frontend Application

Open a new terminal:

```bash
cd client

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will open at `http://localhost:5173`

### Step 8: Verify Installation

1. Open your browser to `http://localhost:5173`
2. You should see the Academia dashboard
3. Check the browser console for any errors
4. Test creating a student, faculty, or course

### Quick Start Commands

```bash
# Clone and setup everything
git clone https://github.com/yourusername/academia.git
cd academia

# Install all dependencies
cd server && npm install && cd ../client && npm install && cd ..

# Start both servers (requires two terminals)
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Troubleshooting

**Port Already in Use:**
```bash
# Change PORT in server/.env
PORT=5001
```

**Neo4j Connection Failed:**
- Verify your credentials in `.env`
- Check if Neo4j instance is running
- Ensure firewall allows connection to port 7687

**Module Not Found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS Errors:**
- Ensure backend is running on port 5000
- Check `server/server.neo4j.js` has CORS enabled

## � Envibronment Variables

Create a `.env` file in the `server` directory with the following variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` or `production` |
| `PORT` | Server port number | `5000` |
| `NEO4J_URI` | Neo4j connection URI | `neo4j+s://xxxxx.databases.neo4j.io` |
| `NEO4J_USER` | Neo4j username | `neo4j` |
| `NEO4J_PASSWORD` | Neo4j password | `your_secure_password` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string (for migration) | `mongodb+srv://user:pass@cluster.mongodb.net/db` |

### Example `.env` File

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Neo4j Database (Primary)
NEO4J_URI=neo4j+s://61253a06.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=A5ArCKf2Z982D-4y972hCw2VmZG5GIHIggGyjOlV16A

# MongoDB (Optional - Only for migration)
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/academia?retryWrites=true&w=majority
```

### Security Notes

⚠️ **Important Security Practices:**

- Never commit `.env` files to version control
- Use strong, unique passwords for databases
- Rotate credentials regularly
- Use environment-specific configurations
- Enable SSL/TLS for production databases
- Restrict database access by IP whitelist

### Getting Neo4j Credentials

**Neo4j Aura (Cloud):**
1. Sign up at [neo4j.com/cloud/aura](https://neo4j.com/cloud/aura/)
2. Create a new database instance
3. Copy the connection URI (starts with `neo4j+s://`)
4. Save the generated password securely

**Neo4j Desktop (Local):**
1. Install Neo4j Desktop
2. Create a new database
3. Set a password
4. Use `neo4j://localhost:7687` as URI
5. Username is typically `neo4j`

## 📊 Database Schema

### Neo4j Graph Model

The application uses a graph database structure optimized for relationship queries:

```
┌─────────────┐
│   Student   │
│ ─────────── │
│ id (UUID)   │
│ name        │
│ email       │◄────┐
│ phone       │     │
│ createdAt   │     │
│ updatedAt   │     │
└─────────────┘     │
       │            │
       │ ENROLLED_IN│
       │            │
       ▼            │
┌─────────────┐     │
│   Course    │     │
│ ─────────── │     │
│ id (UUID)   │     │
│ name        │     │
│ code        │     │
│ credits     │     │
│ createdAt   │     │
│ updatedAt   │     │
└─────────────┘     │
       ▲            │
       │ TEACHES    │
       │            │
┌─────────────┐     │
│   Faculty   │     │
│ ─────────── │─────┘
│ id (UUID)   │
│ name        │
│ email       │
│ department  │
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

### Node Properties

#### Student Node
```cypher
(:Student {
  id: String (UUID),
  name: String,
  email: String (UNIQUE),
  phone: String,
  createdAt: DateTime,
  updatedAt: DateTime
})
```

#### Faculty Node
```cypher
(:Faculty {
  id: String (UUID),
  name: String,
  email: String (UNIQUE),
  department: String,
  createdAt: DateTime,
  updatedAt: DateTime
})
```

#### Course Node
```cypher
(:Course {
  id: String (UUID),
  name: String,
  code: String (UNIQUE),
  credits: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
})
```

### Relationships

#### ENROLLED_IN
```cypher
(Student)-[:ENROLLED_IN {enrolledAt: DateTime}]->(Course)
```
Represents a student's enrollment in a course.

#### TEACHES
```cypher
(Faculty)-[:TEACHES {assignedAt: DateTime}]->(Course)
```
Represents a faculty member teaching a course.

### Constraints & Indexes

```cypher
-- Unique Constraints
CREATE CONSTRAINT student_email_unique FOR (s:Student) REQUIRE s.email IS UNIQUE;
CREATE CONSTRAINT faculty_email_unique FOR (f:Faculty) REQUIRE f.email IS UNIQUE;
CREATE CONSTRAINT course_code_unique FOR (c:Course) REQUIRE c.code IS UNIQUE;

-- Performance Indexes
CREATE INDEX student_id_index FOR (s:Student) ON (s.id);
CREATE INDEX faculty_id_index FOR (f:Faculty) ON (f.id);
CREATE INDEX course_id_index FOR (c:Course) ON (c.id);
```

### Sample Queries

**Find all courses a student is enrolled in:**
```cypher
MATCH (s:Student {id: $studentId})-[:ENROLLED_IN]->(c:Course)
RETURN c.name, c.code, c.credits
```

**Find all students in a course:**
```cypher
MATCH (s:Student)-[:ENROLLED_IN]->(c:Course {code: $courseCode})
RETURN s.name, s.email
```

**Find faculty workload:**
```cypher
MATCH (f:Faculty)-[:TEACHES]->(c:Course)
OPTIONAL MATCH (s:Student)-[:ENROLLED_IN]->(c)
RETURN f.name, count(DISTINCT c) as courses, count(DISTINCT s) as students
```

## 🎨 Design System

### Color Palette

```javascript
primary: {
  50: '#EEF2FF',
  500: '#6366F1',  // Main brand color
  600: '#4F46E5',
  900: '#312E81'
}

secondary: {
  500: '#D946EF',  // Accent color
  600: '#C026D3'
}

accent: {
  blue: '#3B82F6',
  green: '#10B981',
  orange: '#F97316',
  purple: '#8B5CF6'
}
```

### Typography

- **Font Family**: Inter (body), Lexend (headings)
- **Font Sizes**: xs (0.75rem) to 4xl (2.25rem)

### Components

All UI components follow atomic design principles:
- Consistent spacing and sizing
- Smooth transitions and animations
- Accessible (ARIA labels, keyboard navigation)
- Responsive design (mobile-first)

## � AAPI Documentation

Base URL: `http://localhost:5000/api`

### Students API

#### Get All Students
```http
GET /api/students
```

**Response:**
```json
[
  {
    "_id": "uuid-here",
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "enrolledCourses": [
      {
        "_id": "course-uuid",
        "name": "Data Structures",
        "code": "CS202"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Single Student
```http
GET /api/students/:id
```

**Parameters:**
- `id` (string, required) - Student UUID

**Response:** Same as single student object above

#### Create Student
```http
POST /api/students
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321"
}
```

**Response:**
```json
{
  "_id": "new-uuid",
  "id": "new-uuid",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321",
  "enrolledCourses": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Student
```http
PUT /api/students/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "1112223333"
}
```

**Response:** Updated student object

#### Delete Student
```http
DELETE /api/students/:id
```

**Response:**
```json
{
  "id": "deleted-uuid"
}
```

#### Enroll Student in Course
```http
POST /api/students/:id/enroll
Content-Type: application/json
```

**Request Body:**
```json
{
  "courseId": "course-uuid"
}
```

**Response:** Updated student object with new course

---

### Faculty API

#### Get All Faculty
```http
GET /api/faculty
```

**Response:**
```json
[
  {
    "_id": "uuid-here",
    "id": "uuid-here",
    "name": "Dr. Smith",
    "email": "smith@university.edu",
    "department": "Computer Science",
    "assignedCourses": [
      {
        "_id": "course-uuid",
        "name": "Algorithms",
        "code": "CS301"
      }
    ],
    "createdAt": "2024-01-01

## 🧪 Testing

```bash
cd server
npm test
```

## 📈 Performance

- **Neo4j Queries**: Native graph traversal (10-100x faster than joins)
- **Frontend**: Code splitting and lazy loading
- **Caching**: Optimized query caching
- **Animations**: Hardware-accelerated with Framer Motion

## 🔐 Security

- Environment variable configuration
- Parameterized queries (prevents injection)
- CORS enabled
- Input validation
- Error handling middleware

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Neo4j for the powerful graph database
- React team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- All open-source contributors

---

**Built with ❤️ using React, Node.js, and Neo4j**
