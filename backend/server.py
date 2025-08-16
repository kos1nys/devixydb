from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from datetime import datetime, timedelta
from typing import List, Optional
import os
import logging
from pathlib import Path

from models import (
    Scammer, ScammerCreate, ScammerUpdate, ScammerResponse,
    User, UserCreate, UserLogin, UserResponse, Token, Statistics,
    ScammerStatus
)
from auth import (
    authenticate_user, create_access_token, get_current_user, 
    get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Scammer Database API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Dependency to get database
async def get_database() -> AsyncIOMotorDatabase:
    return db

# Dependency to get current user with database
async def get_current_user_with_db(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    return await get_current_user(credentials, database)

# Auth routes
@api_router.post("/auth/login", response_model=Token)
async def login_for_access_token(
    user_data: UserLogin,
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    user = await authenticate_user(database, user_data.username, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/register", response_model=UserResponse)
async def register_user(
    user_data: UserCreate,
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if user already exists
    existing_user = await database.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        password_hash=hashed_password
    )
    
    await database.users.insert_one(new_user.dict())
    
    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        role=new_user.role,
        created_at=new_user.created_at,
        is_active=new_user.is_active
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user_with_db)):
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        role=current_user.role,
        created_at=current_user.created_at,
        is_active=current_user.is_active
    )

# Public routes (no auth required)
@api_router.get("/scammers/public", response_model=List[ScammerResponse])
async def get_scammers_public(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    query = {}
    if search:
        query = {
            "$or": [
                {"discord_id": {"$regex": search, "$options": "i"}},
                {"discord_name": {"$regex": search, "$options": "i"}}
            ]
        }
    
    scammers = await database.scammers.find(query).skip(skip).limit(limit).to_list(limit)
    return [ScammerResponse(**scammer) for scammer in scammers]

@api_router.get("/statistics", response_model=Statistics)
async def get_statistics(database: AsyncIOMotorDatabase = Depends(get_database)):
    total_records = await database.scammers.count_documents({})
    active_threats = await database.scammers.count_documents({"status": "active"})
    verified = total_records  # All records are considered verified
    
    return Statistics(
        total_records=total_records,
        active_threats=active_threats,
        verified=verified
    )

# Protected routes (auth required)
@api_router.get("/scammers", response_model=List[ScammerResponse])
async def get_scammers(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user_with_db),
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    query = {}
    if search:
        query = {
            "$or": [
                {"discord_id": {"$regex": search, "$options": "i"}},
                {"discord_name": {"$regex": search, "$options": "i"}}
            ]
        }
    
    scammers = await database.scammers.find(query).skip(skip).limit(limit).to_list(limit)
    return [ScammerResponse(**scammer) for scammer in scammers]

@api_router.post("/scammers", response_model=ScammerResponse)
async def create_scammer(
    scammer_data: ScammerCreate,
    current_user: User = Depends(get_current_user_with_db),
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    # Validate Discord ID format (18 digits)
    if not scammer_data.discord_id.isdigit() or len(scammer_data.discord_id) != 18:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Discord ID должен состоять из 18 цифр"
        )
    
    # Check if scammer already exists
    existing_scammer = await database.scammers.find_one({"discord_id": scammer_data.discord_id})
    if existing_scammer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Мошенник с таким Discord ID уже существует"
        )
    
    new_scammer = Scammer(**scammer_data.dict())
    await database.scammers.insert_one(new_scammer.dict())
    
    return ScammerResponse(**new_scammer.dict())

@api_router.get("/scammers/{scammer_id}", response_model=ScammerResponse)
async def get_scammer(
    scammer_id: str,
    current_user: User = Depends(get_current_user_with_db),
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    scammer = await database.scammers.find_one({"id": scammer_id})
    if not scammer:
        raise HTTPException(status_code=404, detail="Мошенник не найден")
    
    return ScammerResponse(**scammer)

@api_router.put("/scammers/{scammer_id}", response_model=ScammerResponse)
async def update_scammer(
    scammer_id: str,
    scammer_update: ScammerUpdate,
    current_user: User = Depends(get_current_user_with_db),
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    scammer = await database.scammers.find_one({"id": scammer_id})
    if not scammer:
        raise HTTPException(status_code=404, detail="Мошенник не найден")
    
    # Validate Discord ID format if provided
    if scammer_update.discord_id and (not scammer_update.discord_id.isdigit() or len(scammer_update.discord_id) != 18):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Discord ID должен состоять из 18 цифр"
        )
    
    update_data = scammer_update.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await database.scammers.update_one(
            {"id": scammer_id}, 
            {"$set": update_data}
        )
    
    updated_scammer = await database.scammers.find_one({"id": scammer_id})
    return ScammerResponse(**updated_scammer)

@api_router.delete("/scammers/{scammer_id}")
async def delete_scammer(
    scammer_id: str,
    current_user: User = Depends(get_current_user_with_db),
    database: AsyncIOMotorDatabase = Depends(get_database)
):
    result = await database.scammers.delete_one({"id": scammer_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Мошенник не найден")
    
    return {"message": "Мошенник успешно удален"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    # Create default admin user if not exists
    existing_admin = await db.users.find_one({"username": "admin"})
    if not existing_admin:
        admin_user = User(
            username="admin",
            password_hash=get_password_hash("admin123")  # Default password
        )
        await db.users.insert_one(admin_user.dict())
        logger.info("Default admin user created with username: admin, password: admin123")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()