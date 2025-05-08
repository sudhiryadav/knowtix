from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from urllib.parse import quote

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_verification_token,
    create_reset_token,
    verify_token
)
from app.core.config import settings
from app.database import get_db
from app.models import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
    Token,
    PasswordResetRequest,
    PasswordReset,
    UserResponse
)
from app.services.email_service import (
    send_verification_email,
    send_password_reset_email,
    send_password_changed_email
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def calculate_subscription_end_date(start_date: datetime, subscription_type: str) -> datetime:
    if subscription_type == "monthly":
        return start_date + timedelta(days=30)
    elif subscription_type == "quarterly":
        return start_date + timedelta(days=90)
    else:  # yearly
        return start_date + timedelta(days=365)

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    start_date = datetime.utcnow()
    end_date = calculate_subscription_end_date(start_date, user_data.subscription_type)
    
    user = User(
        name=user_data.name,
        company_name=user_data.company_name,
        email=user_data.email,
        password=get_password_hash(user_data.password),
        contact_info=user_data.contact_info,
        plan=user_data.plan,
        subscription_type=user_data.subscription_type,
        subscription_start_date=start_date,
        subscription_end_date=end_date,
        is_verified=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    verification_token = create_verification_token({"sub": user.email})
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={quote(verification_token)}"
    
    if not send_verification_email(user.email, user.name, verification_url):
        print(f"Failed to send verification email to {user.email}")
    
    return user

@router.get("/verify-email")
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify email address."""
    payload = verify_token(token)
    if not payload or payload.get("type") != "verification":
        raise HTTPException(status_code=400, detail="Invalid verification token")
    
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_verified:
        return {"message": "Email already verified"}
    
    user.is_verified = True
    db.commit()
    return {"message": "Email verified successfully"}

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user."""
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if user and user.locked_until and user.locked_until > datetime.utcnow():
        remaining_time = (user.locked_until - datetime.utcnow()).total_seconds() / 60
        raise HTTPException(
            status_code=403,
            detail=f"Account is locked. Please try again in {int(remaining_time)} minutes."
        )
    
    if not user or not verify_password(user_data.password, user.password):
        if user:
            user.login_attempts += 1
            if user.login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                user.locked_until = datetime.utcnow() + timedelta(minutes=settings.LOCKOUT_DURATION_MINUTES)
            db.commit()
        
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    user.login_attempts = 0
    user.locked_until = None
    db.commit()
    
    if not user.is_active or datetime.utcnow() > user.subscription_end_date:
        raise HTTPException(
            status_code=403,
            detail="Subscription has expired. Please renew your subscription."
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/request-password-reset")
async def request_password_reset(reset_request: PasswordResetRequest, db: Session = Depends(get_db)):
    """Request password reset."""
    user = db.query(User).filter(User.email == reset_request.email).first()
    if not user:
        return {"message": "If your email is registered, you will receive a password reset link."}
    
    reset_token = create_reset_token({"sub": user.email})
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={quote(reset_token)}"
    
    if send_password_reset_email(user.email, user.name, reset_url):
        return {"message": "Password reset link has been sent to your email."}
    else:
        raise HTTPException(status_code=500, detail="Failed to send password reset email")

@router.post("/reset-password")
async def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    """Reset password."""
    payload = verify_token(reset_data.token)
    if not payload or payload.get("type") != "reset":
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.password = get_password_hash(reset_data.new_password)
    user.login_attempts = 0
    user.locked_until = None
    db.commit()
    
    send_password_changed_email(user.email, user.name)
    return {"message": "Password has been reset successfully"} 