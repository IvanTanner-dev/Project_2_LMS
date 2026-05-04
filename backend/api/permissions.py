from rest_framework import permissions

class IsTeacherRole(permissions.BasePermission):
    """
    Allows access only to users with the 'teacher' role in their profile.
    """
    def has_permission(self, request, view):
        
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return hasattr(request.user, 'profile') and request.user.profile.role == 'teacher'

class IsTeacherOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Grant read-only access to all users to facilitate curriculum discovery.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Verify resource ownership to prevent unauthorized modifications.
        is_the_teacher = obj.teacher == request.user

        # Audit: Log permission evaluations to assist in troubleshooting access control issues.
        print(f">>> Permission Check: User={request.user} | Teacher={obj.teacher} | Result={is_the_teacher}")

        # Enforce strict ownership: only the designated subject matter expert can modify course metadata.
        return is_the_teacher
        