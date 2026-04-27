from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    MyTokenObtainPairSerializer,
    UserUpdateSerializer,
    CourseSerializer,
    LessonSerializer,
    AdminUserEditSerializer
)
from .models import Course, Lesson, LessonProgress

User = get_user_model()
 
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    # This allows guests to see courses but requires login to Enroll
    def get_permissions(self):
        """
        Logic: 
        1. To Create/Update/Delete: Must be a Teacher (Staff).
        2. To Enroll/View Enrolled: Must be logged in (Student).
        3. To List/Retrieve: Anyone can see.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()] 
        if self.action in ['enroll', 'enrolled']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # This maps the 'teacher' field in your Model to the logged-in user
        serializer.save(teacher=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        # Add the user to the students list
        course.students.add(request.user)
        return Response({"status": "enrolled"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def enrolled(self, request):
        # Filter courses where the current user is in the students ManyToMany field
        courses = Course.objects.filter(students=request.user)
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)
    
class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def complete(self, request, pk=None):
        lesson = self.get_object()
        # Create the progress record if it doesn't exist
        progress, _ = LessonProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )
        progress.is_completed = True
        progress.save()

        return Response(
            {'status': 'success', 'message': 'Lesson marked as complete'},
            status=status.HTTP_200_OK
        )
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Endpoints:
    GET /api/admin/users/          -> List all users
    GET /api/admin/users/{id}/     -> Get one user
    PATCH /api/admin/users/{id}/   -> Update user + profile role
    """
    queryset = User.objects.all()
    serializer_class = AdminUserEditSerializer
    permission_classes = [permissions.IsAdminUser] # Strictly only for is_staff=True

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserUpdateSerializer # Ensure this handles 'password' correctly

    def perform_create(self, serializer):
        # Hash the password properly before saving
        user = serializer.save()
        user.set_password(self.request.data.get('password'))
        user.save()


    