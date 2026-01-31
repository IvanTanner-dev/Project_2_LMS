from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from .models import Course
from .serializers import CourseSerializer
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
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        # Add the user to the students list
        course.students.add(request.user)
        return Response({"status": "enrolled"}, status=status.HTTP_200_OK)


    