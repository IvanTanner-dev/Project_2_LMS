from django.urls import path
from .views import CourseListCreateView, CourseDetailView, EnrollCourseView

urlpatterns = [
    # This matches: http://127.0.0.1:8000/api/courses/
    path('courses/', CourseListCreateView.as_view(), name='course-list'),
    
    # This matches: http://127.0.0.1:8000/api/courses/1/enroll/
    path('courses/<int:pk>/enroll/', EnrollCourseView.as_view(), name='course-enroll'),
    # This matches: http://127.0.0.1:8000/api/courses/1/
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
]