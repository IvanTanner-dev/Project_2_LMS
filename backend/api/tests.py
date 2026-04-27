from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Course, Lesson, LessonProgress

User = get_user_model()

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
        Lesson.objects.create(course=course, title="L2", content="Text", order=2)

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
        self.client.force_authenticate(user=self.student)
        course = Course.objects.create(title="API Test", description="DRF", teacher=self.teacher)
        response = self.client.post(f'/api/courses/{course.id}/enroll/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(course.students.filter(id=self.student.id).exists())

class AdminTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(username='admin_user', password='pw', email='admin@test.com')
        self.teacher = User.objects.create_user(username='teacher_user', password='pw', is_staff=True)
        self.student = User.objects.create_user(username='student_user', password='pw')

    def test_admin_can_list_users(self):
        """Verify that an admin can list all users in the system."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/admin/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see at least 3 users (admin, teacher, student created in setUp)
        self.assertGreaterEqual(len(response.data), 3)

    def test_admin_can_update_user_role(self):
        """Verify that an admin can change a user's role."""
        self.client.force_authenticate(user=self.admin)
        # Update student to be a teacher via the profile
        response = self.client.patch(f'/api/admin/users/{self.student.id}/', {
            'profile': {'role': 'teacher'}
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.profile.role, 'teacher')

    def test_admin_can_remove_user(self):
        """Verify that an admin can delete a user."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f'/api/admin/users/{self.student.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.student.id).exists())

    def test_non_admin_cannot_access_user_management(self):
        """Security check: Students and Teachers cannot access admin endpoints."""
        # Test as Student
        self.client.force_authenticate(user=self.student)
        response = self.client.get('/api/admin/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        
