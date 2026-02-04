# from django.urls import path
# from .views import EnrollCourseView, CourseListCreateView, CourseDetailView

# urlpatterns = [
#     path('courses/', CourseListCreateView.as_view(), name='course-list'),
#     path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
#     path('courses/<int:pk>/enroll/', EnrollCourseView.as_view(), name='course-enroll'),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, LessonViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

