from django.urls import path
from .views import EnrollCourseView, CourseListCreateView, CourseDetailView

urlpatterns = [
    path('courses/', CourseListCreateView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/<int:pk>/enroll/', EnrollCourseView.as_view(), name='course-enroll'),
]
