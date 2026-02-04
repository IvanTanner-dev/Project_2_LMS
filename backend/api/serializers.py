from rest_framework import serializers
from .models import Course, Lesson, LessonProgress

class LessonSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'video_url', 'order', 'is_completed']
    
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
    # This nested serializer allows us to see lessons inside the course data
    lessons = LessonSerializer(many=True, read_only=True)
    teacher_name = serializers.ReadOnlyField(source='teacher.username')
    is_enrolled = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 
            'title', 
            'description', 
            'teacher_name', 
            'lessons', 
            'students',
            'is_enrolled',
            'progress_percentage',
            'created_at'
            ]
    
    def get_is_enrolled(self, obj):
        # We grab the user from the 'request' which is passed by the View
        request = self.context.get('request')
        if request and hasattr(request, "user") and request.user.is_authenticated:
            # Check if the user is in the 'students' ManyToMany relationship for this course
            # Note: This assumes your Course model has a relationship with User or Student
            try:

                return obj.students.filter(id=request.user.id).exists()
            
            except Exception as e:
                
                print(f"DEBUG ERROR: {e}") # This will show the real error in your terminal
                return False
        return False
    
    def get_progress_percentage(self, obj):
        request = self.context.get('request')
        if not request or not hasattr(request, "user") or not request.user.is_authenticated:
            return 0
        
        total_lessons = obj.lessons.count()
        if total_lessons == 0:
            return 0
            
        completed_lessons = LessonProgress.objects.filter(
            user=request.user, 
            lesson__course=obj, 
            is_completed=True
        ).count()
        
        # Calculate percentage: (Part / Whole) * 100
        return int((completed_lessons / total_lessons) * 100)
