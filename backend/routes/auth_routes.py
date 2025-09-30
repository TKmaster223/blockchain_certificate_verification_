# routes/auth_routes.py
# Authentication and user management routes

from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from models.user import UserRegistration, UserLogin, Token, UserResponse, UserRole
from auth import (
    authenticate_user, create_user, create_access_token, 
    get_current_active_user, admin_required, AuthError,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserRegistration):
    """
    Register a new user
    """
    try:
        user = create_user(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password,
            role=user_data.role
        )
        
        return UserResponse(
            username=user["username"],
            email=user["email"],
            role=user["role"],
            created_at=user["created_at"],
            is_active=user["is_active"]
        )
    except AuthError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    """
    Authenticate user and return JWT token
    """
    user = authenticate_user(user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
        user=UserResponse(
            username=user["username"],
            email=user["email"],
            role=user["role"],
            created_at=user["created_at"],
            is_active=user["is_active"]
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_active_user)):
    """
    Get current user information
    """
    return UserResponse(
        username=current_user["username"],
        email=current_user["email"],
        role=current_user["role"],
        created_at=current_user["created_at"],
        is_active=current_user["is_active"]
    )

@router.get("/users", response_model=list[UserResponse])
async def list_users(current_user: dict = Depends(admin_required)):
    """
    List all users (Admin only)
    """
    from auth import users_collection
    
    users = list(users_collection.find({}, {"hashed_password": 0}))
    return [
        UserResponse(
            username=user["username"],
            email=user["email"],
            role=user["role"],
            created_at=user["created_at"],
            is_active=user["is_active"]
        )
        for user in users
    ]

@router.patch("/users/{username}/role")
async def update_user_role(
    username: str,
    new_role: UserRole,
    current_user: dict = Depends(admin_required)
):
    """
    Update user role (Admin only)
    """
    from auth import users_collection
    
    result = users_collection.update_one(
        {"username": username},
        {"$set": {"role": new_role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": f"User {username} role updated to {new_role}"}

@router.patch("/users/{username}/activate")
async def toggle_user_status(
    username: str,
    is_active: bool,
    current_user: dict = Depends(admin_required)
):
    """
    Activate/deactivate user (Admin only)
    """
    from auth import users_collection
    
    result = users_collection.update_one(
        {"username": username},
        {"$set": {"is_active": is_active}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    status_text = "activated" if is_active else "deactivated"
    return {"message": f"User {username} has been {status_text}"}