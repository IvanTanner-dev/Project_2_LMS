# LMS PRO - Professional Learning Management System

A professional-grade, full-stack educational platform built to handle course enrollment, progress tracking, and interactive video learning. This project demonstrates a transition from complex mathematical logic to robust software architecture.

---

## Live Demo & Access

- **Link:** [Insert your Link here]
- **Guest Access (Student Role):**
  - **Email:** `guest@example.com`
  - **Password:** `LmsGuest123!`

---

## Tech Stack

### **Frontend**

- **React.js:** Single Page Application (SPA) architecture.
- **Tailwind CSS:** Responsive UI based on high-fidelity designs.
- **Vitest & RTL:** Comprehensive unit and integration testing.
- **Axios:** Asynchronous API handling with JWT interceptors.

### **Backend**

- **Django & DRF:** Robust RESTful API with ViewSet architecture.
- **PostgreSQL:** Production-grade relational database management.
- **SimpleJWT:** Secure, token-based authentication.
- **Relational Logic:** Custom `LessonProgress` tracking for 100% data integrity.

---

## Quality Assurance & Performance

### **Automated Testing (22/22 Passing)**

- **Backend (Django Test Runner):** Validated RBAC, data consistency, and API handshakes.
- **Frontend (Vitest & RTL):** 100% coverage on core UI elements and analytics.

### **Google Lighthouse Audit**

- **Best Practices:** 100/100
- **Accessibility:** 93/100
- **SEO:** 91/100

---

## Key Features

- **Admin Control Center:** Manage users, teachers, and students in one place.
- **Teacher Portal:** Create courses, manage lessons, and track engagement.
- **Real-time Analytics:** Visualized progress data using Recharts (Pie & Bar charts).
- **Smart Lesson Selector:** Resumes students at their last incomplete lesson.
- **Fully Responsive:** Optimized for mobile, tablet, and desktop viewing.

---

## Local Setup & Installation

Follow these steps to get the project running on your local machine.

### **Prerequisites**

- **Python 3.10+**
- **Node.js (v18+)** and **npm**

### **1. Backend Setup (Django)**

1. **Navigate & Environment:**
   ```bash
   cd backend
   python -m venv venv
   # Activate: .\venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)
   ```
2. **Install & Migrate:**
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   ```
3. **Data & Admin:**
   ```bash
   python manage.py loaddata courses.json
   python manage.py createsuperuser
   ```
4. **Run Server:**
   ```bash
   python manage.py runserver
   ```

### **2. Frontend Setup (React)**

1. **Install & Run:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## About the Developer

After a decade-long career in mathematics, I transitioned into software engineering to apply my expertise in logic and system architecture to building high-performance web applications. I specialize in the React/Django ecosystem with a focus on Test-Driven Development (TDD).
