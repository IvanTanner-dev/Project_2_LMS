import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
# This creates a NEW user so we don't clash with the old one
if not User.objects.filter(username='render_admin').exists():
    User.objects.create_superuser('render_admin', 'admin@example.com', 'FinalPassword123!')
    print("CLOUD ACCOUNT CREATED: render_admin")
else:
    print("Account already exists.")