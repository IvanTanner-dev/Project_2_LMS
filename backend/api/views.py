from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Course
from .serializers import CourseSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .permissions import IsTeacherOrReadOnly, IsTeacherRole

# This view handles "GET" (list all) and "POST" (create new)
class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsTeacherRole] # Updated permissions

# This view handles "GET" (one specific), "PUT" (update), and "DELETE"
class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsTeacherOrReadOnly] # Updated permissions

class EnrollCourseView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Must be logged in to enroll

    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        
        # Check if student is already enrolled
        if request.user in course.students.all():
            return Response({"message": "Already enrolled"}, status=status.HTTP_400_BAD_REQUEST)
            
        course.students.add(request.user)
        return Response({"message": "Successfully enrolled"}, status=status.HTTP_200_OK)


    