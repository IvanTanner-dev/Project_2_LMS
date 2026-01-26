from rest_framework import permissions

class IsTeacherRole(permissions.BasePermission):
    """
    Allows access only to users with the 'teacher' role in their profile.
    """
    def has_permission(self, request, view):
        # We only care about blocking "Write" operations (POST)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if the user has a profile and if that role is 'teacher'
        return hasattr(request.user, 'profile') and request.user.profile.role == 'teacher'

class IsTeacherOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Safe methods (GET, HEAD, OPTIONS) are allowed for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # 2. Check if the logged-in user is the teacher
        is_the_teacher = obj.teacher == request.user

        # DEBUG: This will show up in your terminal
        print(f">>> Permission Check: User={request.user} | Teacher={obj.teacher} | Result={is_the_teacher}")

        # Write permissions are only allowed to the teacher of the course
        return is_the_teacher
        