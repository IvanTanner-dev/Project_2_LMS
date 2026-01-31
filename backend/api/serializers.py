from rest_framework import serializers
from .models import Course, Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order']

class CourseSerializer(serializers.ModelSerializer):
    # This nested serializer allows us to see lessons inside the course data
    lessons = LessonSerializer(many=True, read_only=True)
    teacher_name = serializers.ReadOnlyField(source='teacher.username')
    is_enrolled = serializers.SerializerMethodField()

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
