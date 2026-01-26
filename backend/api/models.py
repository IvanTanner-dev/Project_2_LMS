from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save  
from django.dispatch import receiver             

class Profile(models.Model):
    # This links the Profile to a specific User
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Define the choices for the role field
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

# This represents a single Course in your LMS
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    # This links the course to a User (Teacher)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    # NEW: This links courses to multiple students
    students = models.ManyToManyField(User, related_name='enrolled_courses', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    # This links the Lesson to a specific Course
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField() # This will hold the lesson text
    order = models.PositiveIntegerField() # To keep lessons in 1, 2, 3 order

    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
    
