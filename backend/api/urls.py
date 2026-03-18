from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, 
    LessonViewSet, 
    MyTokenObtainPairView, 
    AdminUserViewSet, 
    RegisterView      
)
from rest_framework_simplejwt.views import TokenRefreshView

# 1. Setup the Router for ViewSets
router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'admin/users', AdminUserViewSet, basename='admin-user-management')

# 2. Define URL Patterns
urlpatterns = [
    # Router URLs (courses, lessons, admin/users)
    path('', include(router.urls)), 
    
    # Authentication & Registration
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
]