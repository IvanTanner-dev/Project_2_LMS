from rest_framework import serializers
from .models import Course, Lesson, LessonProgress
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class LessonSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'content', 'video_url', 'order', 'is_completed']
    
    def get_is_completed(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return LessonProgress.objects.filter(
                user=user, 
                lesson=obj, 
                is_completed=True
            ).exists()
        return False

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    # Using full name for the teacher if available
    teacher_name = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 
            'title', 
            'description', 
            'teacher',
            'teacher_name', 
            'lessons', 
            'students',
            'is_enrolled',
            'progress_percentage',
            'created_at'
            ]
        read_only_fields = ['teacher', 'students']
    
    def get_teacher_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}".strip() or obj.teacher.username

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, "user") and request.user.is_authenticated:
            return obj.students.filter(id=request.user.id).exists()
        return False
    
    def get_progress_percentage(self, obj):
        request = self.context.get('request')
        if not request or not hasattr(request, "user") or not request.user.is_authenticated:
            return 0
        
        total_lessons = obj.lessons.count()
        if total_lessons == 0: return 0
            
        completed_lessons = LessonProgress.objects.filter(
            user=request.user, 
            lesson__course=obj, 
            is_completed=True
        ).count()
        
        return int((completed_lessons / total_lessons) * 100)
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # We grab the role from the Profile model we created
        # user.profile exists because of your @receiver signal!
        data['user'] = {
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'username': self.user.username,
            'role': self.user.profile.role, # 👈 CRITICAL: Tells React if user is a teacher
        }
        return data
