Development Log: Full-Stack LMS

Session 1: Foundation & Environment (24/01/26)

Workspace Initialization: Created root directory structure with separate backend and frontend folders to ensure modularity.
Git Configuration: Initialized Git and created a .gitignore file to protect the repository from "junk" files and local database data.
Python Environment: Set up a Virtual Environment (venv) to manage dependencies. Installed Django, Django Rest Framework (DRF), and CORS headers.
Django Project Start: Created the core project and verified the server connection (the "Rocket Ship" page).
Admin Access: Ran initial migrations and created a superuser to access the Django built-in admin dashboard.

Session 2: Data Architecture (26/01/26)

Modular App Creation: Created the api app to house the project's custom logic and data models.
App Registration: Added the api app to INSTALLED_APPS in settings.py so Django can recognize the new logic.
Course Blueprinting: Drafted the initial Course model in api/models.py.
Design Note: Chose to use a ForeignKey to link courses to the User model, allowing us to assign a specific "Teacher" to each course.
Database Sync: (Pending confirmation) Ran makemigrations and migrate to turn the Python code into actual database tables.

Fixed Migration Issue: Resolved "No changes detected" by explicitly targeting the app using python manage.py makemigrations api.
Database Verification: Confirmed the creation of the api_course table using SQLite Viewer.
Admin Integration: Registered the Course model in admin.py, allowing for manual data entry and management via the Django Admin dashboard.

Data Entry & Relationships: Successfully linked the Lesson model to the Course model.
Test Data: Created "KS3 Algebra" with ordered lessons ("Expressions", "Simplifying Expressions").
Verification: Confirmed that the ForeignKey correctly displays a dropdown in the Admin panel for relational data selection.

Session 2.1: User Roles & API Serialization

Role-Based Architecture: Implemented a Profile model with a OneToOneField relationship to the User.
Design Decision: Chose the Profile Model approach over Groups to ensure future scalability for custom user metadata (e.g., student progress, teacher bios).
Automation with Signals: Integrated Django post_save signals to automate profile creation.
Logic: Every time a User is created, a corresponding Profile is generated with a default role of 'student'.
Code Standards (PEP 8): Refactored models.py to ensure all imports are at the top of the file, maintaining professional Python formatting and preventing execution errors.
Data Serialization: Created api/serializers.py using Django Rest Framework.
Feature: Implemented Nested Serialization, allowing Course data to automatically include all related Lesson objects in a single JSON response.

Session 2.2: API Connectivity & Enrollment Logic

Decoupled URL Routing: Established a scalable URL structure by using include() in the core project to delegate routing to the api app. This keeps the project organized as more apps are added.
RESTful Endpoints: Implemented Generic API Views (ListCreateAPIView, RetrieveUpdateDestroyAPIView) to handle standard CRUD operations for Courses and Lessons.
CORS Configuration: Integrated django-cors-headers to permit Cross-Origin Resource Sharing.
Purpose: This is a critical security step to allow the upcoming React frontend to communicate with the Django backend.
Complex Relationships: Extended the Course model with a ManyToManyField, creating a robust Enrollment system where multiple students can join multiple courses.
Custom Functional Logic: Built a dedicated EnrollCourseView using APIView to handle the business logic of student enrollment, including validation to prevent duplicate entries.
Enhanced Serialization: Modified serializers to include human-readable fields (teacher_name) and student tracking, providing a richer data packet for the frontend.

Session 2.3: Security, Permissions & Role-Based Access Control (RBAC)

Custom Permission Architecture: Engineered a multi-layered security system by authoring two distinct permission classes in permissions.py:
IsTeacherRole: A Role-Based check using has_permission to restrict course creation (POST) exclusively to users with a "teacher" profile role.
IsTeacherOrReadOnly: An Object-Level check using has_object_permission to ensure only the original creator of a course can modify or delete it.
Security Logic Verification: Implemented terminal-level debug logging within permission classes to track real-time authorization decisions (User vs Owner comparison).
DRF View Integration: Refactored CourseListCreateView and CourseDetailView to apply these specific permission layers, ensuring the API behaves dynamically based on the user's identity and the request type.
UI/UX Logic Synchronization: Observed and verified "Security by Absence," where the Django Rest Framework UI automatically hides restricted action forms (PUT/POST) when unauthorized users (student_one) access the endpoint.
Profile-Based Filtering: Drafted the MyEnrolledCoursesView using get_queryset overrides to provide students with a personalized data feed showing only their active enrollments.

Session 3.1: The Connection Phase (28/01/26)

Status: Handshake Successful

Figma Implementation
Grid Logic: Successfully translated the 12-column Figma layout into Tailwind CSS.
Component Fidelity: Built a responsive "Course Card" with a dynamic progress bar, hover states, and depth (box-shadows) that matches the original design specs.

Frontend Architecture
React Structure: Set up a clean App.jsx with a Sidebar/Header/Main layout.
Dynamic Rendering: Implemented the .map() function to replace static placeholders with a dynamic UI that can handle any number of courses.
The Courier (Axios): Installed and configured Axios to handle asynchronous data fetching.

The "Handshake" (Cross-Origin Connection)
CORS Clearance: Configured django-cors-headers on the Backend to allow the React port (5173) to securely request data from the Django port (8000).
Key Alignment: Verified the JSON payload from Django and re-mapped the React frontend to use the actual database fields (teacher_name, lessons, etc.).
Fallback Logic: Implemented a try/catch safety net to ensure the UI remains functional (using Mock Data) even if the API is offline.

Session 4.1 (29.01.26)

React Routing Integration
Router Implementation: Successfully wrapped the application in BrowserRouter.
Dynamic Routing: Established the path="/course/:id" pattern, allowing the app to handle unique URLs for every course in the database.
Wildcard Resolution: Solved a "No routes matched" error by implementing a path="\*" catch-all, ensuring the Dashboard always loads correctly from the root.

Full-Stack Data Handshake
Backend Refactor: Updated urls.py to use Class-Based Views (.as_view()), aligning the API roadmap with the CourseDetailView logic.
Axios Data Fetching: Verified that real data from Django (e.g., "Key Stage 3: Algebra") is successfully flowing into the React state and logging to the console.
Component Mapping: Updated the Dashboard grid to use Link components, enabling "one-click" navigation from the course list to the detail view.

Session 5 (31.01.26)

Enrollment System & ViewSet Migration
ViewSet Refactor: Migrated the backend from individual Class-Based Views to a viewsets.ModelViewSet architecture. This unified the logic for listing, retrieving, and custom actions (like enrollment) into a single, clean class.
Router Implementation: Replaced manual URL paths in api/urls.py with the Django REST Framework DefaultRouter, simplifying the API endpoint structure and future-proofing the routing.
Custom API Action: Developed a bespoke @action decorator for the enroll endpoint, enabling the Many-To-Many relationship logic that adds a student to a course via a POST request.

Frontend State & User Logic
Dynamic Enrollment Logic: Implemented is_enrolled logic using a SerializerMethodField. This allows the frontend to instantly know if the logged-in user is a student of the course, enabling the "Join Course" vs. "Continue Lesson" UI toggle.
Prop-Driven Interactions: Wired the onEnroll function from App.jsx down through the component tree to CourseCard. Verified that clicking "Join Course" triggers an Axios call, re-fetches data, and updates the UI state in real-time.
ManyToMany Filtering: Resolved a critical NameError and Field Error by refining the get_is_enrolled logic in the Serializer to correctly filter the students list by user.id.

Status Check
Verified Handshake: Confirmed via browser testing that enrolled courses successfully move from the "Browse Catalog" to the "My Learning" section upon clicking.
Performance: Audited via Lighthouse, maintaining a high baseline (96 on Best Practices) while scaling the application's complexity.

Session 6: Video Infrastructure & Auth Synchronization (01/02/26)

Schema Evolution: The Video Layer
Database Migration: Expanded the Lesson model in Django to include a video_url field (URLField).
Data Integrity: Successfully performed a manual data audit via Django Admin, updating existing lessons with valid YouTube educational links (e.g., "Simplifying Expressions").
Serializer Extension: Updated LessonSerializer to include video_url in the fields list, ensuring the data packet is accessible to the React frontend.

Frontend Engineering: The Video Player
Embed Logic Utility: Authored a robust getEmbedUrl utility function using Regular Expressions (Regex).
Purpose: To automatically convert standard YouTube watch links (which are blocked by browsers in iframes) into "Embed" links that function within the app.
Edge Case Handling: Cleaned the logic to handle extra URL parameters like timestamps (e.g., &t=4s) and shortened youtu.be links.
Stateful Lesson Selection: Implemented selectedLesson state in CourseDetail.jsx.
Logic: Refined the useEffect hook to automatically select the first lesson of a course upon loading, ensuring the video player is never empty.
Keyed Re-rendering: Applied a key={selectedLesson.id} attribute to the <iframe> component. This forces React to destroy and re-create the player when a student switches lessons, preventing "stale" video content.

Security & Auth Debugging
JWT Token Forensics: Diagnosed a persistent 401 Unauthorized error ("Given token not valid").
Technical Discovery: Identified a synchronization gap where the frontend was attempting to fetch private course data using an expired token from Local Storage before the new login handshake was complete.
Resolution Strategy: Implemented a "Clean Slate" protocol—clearing local storage and ensuring the useEffect only fires when a valid id and token are present.

UI/UX Refinement
Layout Consolidation: Refactored the Video Player container to remove redundant "placeholder" divs, creating a singular, professional viewing area that toggles between the active video and a "No video available" state.
Progress Tracking Sync: Verified that the "Progress Bar" and "Lesson List" checkmarks correctly reflect the completion data sent from the backend.

Session 7: (04/02/26)

Frontend: Triggered an action based on user intent.
Security: Passed a JWT via Axios.
Backend: Handled a custom @action in a ViewSet.
Database: Used get_or_create to manage LessonProgress records.
UI: Reacted instantly to the success message.
