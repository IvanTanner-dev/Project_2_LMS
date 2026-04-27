#!/usr/bin/env python
import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection

def create_enrollment_table():
    cursor = connection.cursor()
    
    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='api_enrollment';")
    result = cursor.fetchone()
    
    if not result:
        print("Creating api_enrollment table...")
        cursor.execute('''
            CREATE TABLE api_enrollment (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                enrolled_at DATETIME NOT NULL,
                progress INTEGER NOT NULL DEFAULT 0,
                course_id INTEGER NOT NULL REFERENCES api_course(id),
                user_id INTEGER NOT NULL REFERENCES auth_user(id),
                UNIQUE(user_id, course_id)
            );
        ''')
        print("Table created successfully!")
    else:
        print("Table already exists!")

if __name__ == '__main__':
    create_enrollment_table()
