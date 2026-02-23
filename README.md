Full-Stack LMS (Learning Management System)

A professional-grade, full-stack educational platform built to handle course enrollment, progress tracking, and interactive video learning. This project demonstrates a transition from complex mathematical logic to robust software architecture.
Live Demo
Link: [Insert your Link here]
Guest Access (Student Role):
Email: guest@example.com
Password: LmsGuest123!

Tech Stack

Frontend
React.js: Single Page Application (SPA) architecture.
Tailwind CSS: Responsive UI based on high-fidelity Figma designs.
Vitest & React Testing Library: Comprehensive unit and integration testing.
Axios: Asynchronous API handling with JWT interceptors.

Backend
Django & Django REST Framework (DRF): Robust RESTful API with ViewSet architecture and custom @action decorators.
Relational Logic: Implemented a LessonProgress through-model to track unique student-lesson completions, ensuring 100% data integrity.
PostgreSQL: Production-grade relational database management.
SimpleJWT: Secure, token-based authentication with cross-origin cookie handling.

Quality Assurance & Performance

Automated Testing (22/22 Passing): I have implemented a rigorous, full-stack testing suite to ensure system reliability and prevent regressions.
Backend API Testing (Django Test Runner):
RBAC Verification: Validated that Teachers have POST/PUT permissions while Students are strictly restricted to READ and ENROLL actions.
Data Consistency: Verified the mathematical accuracy of progress calculations across Course, Lesson, and LessonProgress models.
API Handshakes: Tested the programmatic enrollment flow to ensure Many-to-Many database updates trigger correctly.
Frontend Testing (Vitest & RTL):
Component Integrity: 100% coverage on core UI elements and analytics rendering.
Regex Utilities: Verified YouTube URL parsing logic across multiple formats to ensure video player stability.

Google Lighthouse Audit
Optimized for performance and accessibility to meet industry standards:
Best Practices: 100/100
Accessibility: 93/100
SEO: 91/100

Key Features

Smart Lesson Selector: Automatically resumes students at their last incomplete lesson.
Real-time Analytics: Visualized progress data using Recharts.
Interactive Video Player: Seamless YouTube integration with custom re-rendering logic to prevent stale content.
Role-Based Access Control (RBAC): Leveraged Django’s is_staff flags and DRF’s get_permissions() overrides to create a secure environment where students cannot access teacher-level endpoints.
Relational Progress Tracking: Instead of simple counters, the system uses a relational map between Users and Lessons. This allows for persistent "Resume" functionality even if a course's lesson order is rearranged by a teacher.

The Challenge: Silent Authentication & Asynchronous State
The most significant hurdle was managing the JWT (JSON Web Token) Lifecycle within a Single Page Application (SPA). Because tokens expire for security, the application initially suffered from "stale sessions," where API requests would fail mid-interaction, leading to a broken user experience.
The Solution: The Axios Interceptor Pattern - I implemented a custom Axios interceptor that acts as a "logic gate" for every outgoing request. If a request returns a 401 Unauthorized, the interceptor:
Pauses all outgoing requests.
Calls the /api/token/refresh/ endpoint to secure a new Access Token.
Retries the original failed request with the new credentials.
Resumes the queue once the handshake is successful.
The Challenge: React Lifecycle & Video Synchronization
Another hurdle involved the Interactive Video Player. React’s reconciliation algorithm was overly efficient, failing to re-mount the YouTube iframe when the lesson ID changed, causing the video to remain "stale" while the lesson text updated.
The Solution: Key-Based Re-rendering By applying a unique key prop tied to the lesson.id to the video container, I forced React to treat each lesson as a brand-new component instance. This ensured that the video player, progress bar, and "Mark as Complete" triggers were always mathematically synchronized with the current lesson state.

Future Roadmap

[ ] Cloud Media Storage: Integration with AWS S3 for course thumbnails.
[ ] Password Reset Flow: Automated email handling for account recovery.

About the Developer

After a decade-long career in mathematics, I transitioned into software engineering to apply my expertise in logic and system architecture to building high-performance web applications. I specialize in the React/Django ecosystem with a focus on Test-Driven Development (TDD).
