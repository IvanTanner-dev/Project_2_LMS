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
Django & Django REST Framework (DRF): Robust RESTful API with ViewSet architecture.
PostgreSQL: Relational database management.
SimpleJWT: Secure, token-based authentication.

Quality Assurance & Performance

Automated Testing (18/18 Passing)
I have implemented a rigorous testing suite to ensure system reliability and prevent regressions.
TDD Workflow: 100% test coverage on core frontend components.
Key Tests:
Math-Logic Verification: Validated progress calculation and analytics mapping.
Security Mocks: Simulated authenticated API handshakes and lesson completion triggers.
Regex Utilities: Verified YouTube URL parsing logic across multiple formats.

Google Lighthouse Audit
Optimized for performance and accessibility to meet industry standards:
Best Practices: 100/100
Accessibility: 93/100
SEO: 91/100

Key Features

Smart Lesson Selector: Automatically resumes students at their last incomplete lesson.
Real-time Analytics: Visualized progress data using Recharts.
Interactive Video Player: Seamless YouTube integration with custom re-rendering logic to prevent stale content.
Role-Based Access Control (RBAC): Distinct permissions for Students and Teachers using custom DRF permission classes.

Future Roadmap

[ ] Teacher Dashboard: UI for course creation and student management.
[ ] Cloud Media Storage: Integration with AWS S3 for course thumbnails.
[ ] Password Reset Flow: Automated email handling for account recovery.

About the Developer

After a decade-long career in mathematics, I transitioned into software engineering to apply my expertise in logic and system architecture to building high-performance web applications. I specialize in the React/Django ecosystem with a focus on Test-Driven Development (TDD).
