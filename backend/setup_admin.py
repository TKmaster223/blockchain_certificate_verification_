# setup_admin.py
# Script to create the initial admin user

import os
import sys
from auth import create_user, AuthError

def setup_initial_admin():
    """Create the initial admin user"""
    
    admin_username = os.getenv("ADMIN_USERNAME", "tkmaster")
    admin_email = os.getenv("ADMIN_EMAIL", "Tkmaster@system.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123456")  # Change this! during production I guess
    
    try:
        user = create_user(
            username=admin_username,
            email=admin_email,
            password=admin_password,
            role="admin"
        )
        
        print(f"✅ Admin user created successfully:")
        print(f"   Username: {user['username']}")
        print(f"   Email: {user['email']}")
        print(f"   Role: {user['role']}")
        print(f"⚠️  Please change the default password after first login!")
        
    except AuthError as e:
        if "already exists" in e.message:
            print(f"ℹ️  Admin user '{admin_username}' already exists")
        else:
            print(f"❌ Error creating admin user: {e.message}")
            sys.exit(1)

def create_sample_issuer():
    """Create a sample issuer user"""
    
    try:
        user = create_user(
            username="university",
            email= university@gmail.com",
            password="issuer123456",
            role="issuer"
        )
        
        print(f"✅ Sample issuer created successfully:")
        print(f"   Username: {user['username']}")
        print(f"   Email: {user['email']}")
        print(f"   Role: {user['role']}")
        
    except AuthError as e:
        if "already exists" in e.message:
            print(f"ℹ️  Sample issuer already exists")
        else:
            print(f"❌ Error creating issuer: {e.message}")

if __name__ == "__main__":
    print("🚀 Setting up initial users...")
    setup_initial_admin()
    create_sample_issuer()
    print("✅ Setup complete!")
    print("\n📖 Default credentials:")
    print("   Admin: admin / admin123456")
    print("   Issuer: university_issuer / issuer123456")
    print("\n🔒 Remember to change these passwords!")