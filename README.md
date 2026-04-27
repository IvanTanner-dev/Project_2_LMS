# LMS PRO - Professional Learning Management System

[![Status](https://img.shields.io/badge/Status-Deployment--Ready-success)](#)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Django%20%7C%20PostgreSQL-blue)](#)

A sophisticated, full-stack educational platform demonstrating advanced software engineering skills. This Learning Management System showcases expertise in React/Django development, JWT authentication, role-based access control, and modern UI/UX design principles.

## **Demo Credentials**

| Role        | Username       | Password          | Key Features                                   |
| :---------- | :------------- | :---------------- | :--------------------------------------------- |
| **Admin**   | `superadmin`   | `Admin123!`       | Full system control, User management           |
| **Teacher** | `teacher_ivan` | `LmsPassword123!` | Course creation, Analytics, Content management |
| **Student** | `student_one`  | `LmsGuest123!`    | Enrollment, Progress tracking, Flashcards      |

---

## **User Interface Preview**

### **Secure Authentication**

![Login Screen](docs\screenshots\recruiter_demo_login.jpg)
_Secure JWT-based authentication with role detection_

### **Student Dashboard**

![Student Dashboard](docs\screenshots\recruiter_demo_page1.jpg)
_Personalized learning path and course discovery._

### **Progress & Analytics**

![Student Progress](docs\screenshots\joe_bloggs_lesson_view2.jpg)
_Real-time tracking of lesson completion and educational milestones._

### **Teacher Portal**

![Teacher Portal](docs\screenshots\recruiter_demo_page_Create_Course.jpg)
_Teacher interface for dynamic course and lesson architecture._

### **Admin Panel**

![Admin Panel](docs\screenshots\recruiter_demo_admin_panel.jpg)
_User management and system administration_

---

## **Technical Architecture**

### **Frontend: React.js**

- **Vite & React 18:** Modern functional components and optimized build pipeline.
- **Tailwind CSS:** Responsive, mobile-first professional UI.
- **Axios & JWT Interceptors:** Secure, automated token management for API requests.
- **RBAC Rendering:** Conditional UI components based on user role-permissions.

### **Backend: Django REST Framework**

- **API Design:** RESTful ViewSet architecture for scalable endpoints.
- **PostgreSQL/SQLite:** Optimized data models utilizing `select_related` and `prefetch_related`.
- **Security:** Secure password hashing and SimpleJWT token rotation.
- **CORS Management:** Hardened cross-origin configuration for frontend-backend integration.

### **Key Features Implemented**

- **Multi-role authentication system** with secure JWT tokens
- **Dynamic sidebar navigation** based on user roles
- **Course management** with enrollment tracking
- **Progress tracking** and completion analytics
- **Admin panel** for user and system management
- **Responsive design** optimized for all devices

---

## ** Performance & Quality**

- **Lighthouse Scores:** - **Best Practices:** 100/100
  - **Accessibility:** 93/100
  - **SEO:** 91/100
- **Automated Testing:** 22/22 Passing (Validated RBAC, API handshakes, and data consistency).
- **Optimizations:** Implemented lazy loading for code splitting and response caching for high-traffic endpoints.

## **Project Structure**

```
Project_2_LMS/
├── backend/                 # Django REST API
│   ├── api/                # API endpoints and serializers
│   ├── core/               # Django settings and URLs
│   └── manage.py           # Django management commands
├── frontend/               # React.js SPA
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route-based page components
│   │   └── api.js         # Axios configuration
│   └── public/            # Static assets
└── docs/                  # Documentation
    └── screenshots/       # UI screenshots
```

---

## **Core Functionality**

### **For Students**

- Browse and enroll in available courses
- Track learning progress and completion status
- Generate completion certificates
- Personalized dashboard with enrolled courses

### **For Teachers**

- Create and manage course content
- Monitor student enrollment and progress
- Access course analytics and insights
- Manage lesson materials and resources

### **For Administrators**

- User account management and role assignment
- System-wide analytics and reporting
- Course and content oversight
- Platform configuration and maintenance

---

## **Getting Started**

### **Prerequisites**

- Python 3.8+ and Node.js 16+
- Git for version control

### **Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

### **Access the Application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

---

## **Future Enhancements**

- **Real-time Notifications** with WebSocket integration
- **Video Streaming** capabilities for course content
- **Payment Processing** integration for premium courses
- **Advanced Analytics** with data visualization
- **Mobile Application** development (React Native)

---

## **Technical Challenges Solved**

1. **JWT Token Management** - Implemented secure token refresh mechanism
2. **Role-based UI Rendering** - Dynamic component display based on user permissions
3. **State Management** - Efficient React state handling for complex user interactions
4. **API Design** - RESTful API architecture with proper error handling
5. **Database Schema** - Optimized relational model for educational data

---

## **Contact & Portfolio**

This project demonstrates full-stack development capabilities with modern web technologies. For more projects or collaboration opportunities, please connect through professional platforms.

**Technologies Highlighted:** React.js, Django, REST APIs, JWT Authentication, Role-based Systems, Responsive Design, Database Design, API Integration

## About the Developer

After a decade-long career in mathematics, I transitioned into software engineering to apply my expertise in logic and system architecture to building high-performance web applications. I specialize in the React/Django ecosystem with a focus on Test-Driven Development (TDD).
