from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Course, Enrollment

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request, course_id):
    """Enroll current user in a course"""
    try:
        user = request.user
        course = Course.objects.get(id=course_id)
        
        # Check if already enrolled
        if Enrollment.objects.filter(user=user, course=course).exists():
            return Response(
                {"error": "Already enrolled in this course"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create enrollment
        enrollment = Enrollment.objects.create(user=user, course=course)
        
        return Response({
            "message": "Successfully enrolled in course",
            "enrollment_id": enrollment.id
        }, status=status.HTTP_201_CREATED)
        
    except Course.DoesNotExist:
        return Response(
            {"error": "Course not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_course(request):
    """Create a new course (teacher only)"""
    try:
        user = request.user
        
        # Check if user is a teacher or staff
        if not (user.is_staff or hasattr(user, 'profile') and user.profile.role == 'teacher'):
            return Response(
                {"error": "Only teachers can create courses"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        data = request.data
        course = Course.objects.create(
            title=data.get('title'),
            description=data.get('description'),
            teacher=user
        )
        
        return Response({
            "message": "Course created successfully",
            "course": {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "teacher": course.teacher.username,
                "created_at": course.created_at.isoformat()
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
