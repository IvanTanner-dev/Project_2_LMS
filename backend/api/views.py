from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .models import Course, Lesson, LessonProgress
from .serializers import CourseSerializer, LessonSerializer
from .permissions import IsTeacherOrReadOnly

# This view handles "GET" (list all) and "POST" (create new)
# class CourseListCreateView(generics.ListCreateAPIView):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer
#     permission_classes = [AllowAny] # Updated permissions

# This view handles "GET" (one specific), "PUT" (update), and "DELETE"
# class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsTeacherOrReadOnly] # Updated permissions

class EnrollCourseView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Must be logged in to enroll

    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        
        # Check if student is already enrolled
        if request.user in course.students.all():
            return Response({"message": "Already enrolled"}, status=status.HTTP_400_BAD_REQUEST)
            
        course.students.add(request.user)
        return Response({"message": "Successfully enrolled"}, status=status.HTTP_200_OK)
    
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
            return [permissions.IsAdminUser()] # Only is_staff=True
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
        progress, created = LessonProgress.objects.get_or_create(
            user=request.user, 
            lesson=lesson
        )
        progress.is_completed = True
        progress.save()
        
        return Response({'status': 'success', 'message': 'Lesson marked as complete'}, status=status.HTTP_200_OK)   
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


    