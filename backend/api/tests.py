from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Course, Lesson, LessonProgress

class CourseTests(APITestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(username='teacher', password='pw', is_staff=True)
        self.student = User.objects.create_user(username='student', password='pw', is_staff=False)

    #1: Security Test: Only teachers can create courses
    def test_create_course_as_teacher(self):
        self.client.force_authenticate(user=self.teacher) 
        response = self.client.post('/api/courses/', {'title': 'Math', 'description': 'Logic'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    #2: Restiction Test: Students should NOT be able to create courses
    def test_student_cannot_create_course(self):
        self.client.force_authenticate(user=self.student) 
        response = self.client.post('/api/courses/', {'title': 'Hack', 'description': 'No'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    #3: Functionality Test: Enrolling in a course should work correctly
    def test_student_progress_updates(self):
        """Verify that completing a lesson calculates progress correctly."""
        # Create course and 2 lessons
        course = Course.objects.create(title="Stats", description="Math", teacher=self.teacher)
        l1 = Lesson.objects.create(course=course, title="L1", content="Text", order=1)
        l2 = Lesson.objects.create(course=course, title="L2", content="Text", order=2)
        
        # ii. Enroll student in course
        course.students.add(self.student)
        
        # iii. Mark 1 lesson as completed in LessonProgress
        LessonProgress.objects.create(user=self.student, lesson=l1, is_completed=True)
        
        # iv. Calculate Math: 
        total_lessons = course.lessons.count()
        completed_lessons = LessonProgress.objects.filter(
            user=self.student, 
            lesson__course=course, 
            is_completed=True
        ).count()
        
        progress = (completed_lessons / total_lessons) * 100
        
        self.assertEqual(progress, 50.0)

    #4: The Enrollment API Handshake
    def test_student_enrollment_api(self):
        """Verify that a student can successfully enroll via the API endpoint."""
        # i. Setup a course
        course = Course.objects.create(title="Logic 101", description="Intro", teacher=self.teacher)
        url = f'/api/courses/{course.id}/enroll/'
        
        # ii. Authenticate as student
        self.client.force_authenticate(user=self.student)
        
        # iii. Hit the enroll endpoint
        response = self.client.post(url)
        
        # iv. Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'enrolled')
        
        # v. Verify the database was actually updated
        course.refresh_from_db()
        self.assertIn(self.student, course.students.all())
