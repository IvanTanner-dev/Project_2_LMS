from django.contrib import admin
from .models import Course, Lesson, Profile

admin.site.register(Course, filter_horizontal = ('students',))
admin.site.register(Lesson)
admin.site.register(Profile)