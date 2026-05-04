from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()

class Profile(models.Model):
    # Extend the default User model with role-specific metadata via a one-to-one relationship.
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Define platform personas to drive role-based access control (RBAC).
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

# Root entity for educational content, acting as a container for lessons and student enrollments.
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    # Designate the subject matter expert responsible for managing course content.
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    # Facilitate multi-student enrollment tracking without duplicating course data.
    students = models.ManyToManyField(User, related_name='enrolled_courses', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    # Associate modular content units with their parent curriculum.
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField()  
    video_url = models.URLField(
        blank=True,
        null=True,
        help_text="https://www.youtube.com/watch?v=UVkpH6KWFnk&t=4s"
    )
    # Maintain pedagogical sequence to ensure students follow the intended learning path.
    order = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.course.title} - {self.title}"

    class Meta:
        ordering = ['order']

# Track individual student achievements and curriculum progression.
class LessonProgress(models.Model):
    user = models.ForeignKey(User, related_name='lesson_progress', on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')  

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} - Completed: {self.is_completed}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
    
