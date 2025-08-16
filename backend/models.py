from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
from enum import Enum

class ScamMethod(str, Enum):
    PHISHING = "Фишинг"
    EXTORTION = "Вымогательство" 
    CRYPTO_SCAM = "Мошенничество с криптой"
    FAKE_GIVEAWAY = "Поддельные раздачи"
    FAKE_SERVICES = "Продажа несуществующих услуг"
    OTHER = "Другое"

class ScammerStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

# User Models
class UserRole(str, Enum):
    ADMIN = "admin"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    role: UserRole = UserRole.ADMIN
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    role: UserRole
    created_at: datetime
    is_active: bool

# Scammer Models  
class Scammer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    discord_id: str
    discord_name: str
    scam_method: ScamMethod
    description: str
    status: ScammerStatus = ScammerStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ScammerCreate(BaseModel):
    discord_id: str
    discord_name: str
    scam_method: ScamMethod
    description: str

class ScammerUpdate(BaseModel):
    discord_id: Optional[str] = None
    discord_name: Optional[str] = None
    scam_method: Optional[ScamMethod] = None
    description: Optional[str] = None
    status: Optional[ScammerStatus] = None

class ScammerResponse(BaseModel):
    id: str
    discord_id: str
    discord_name: str
    scam_method: ScamMethod
    description: str
    status: ScammerStatus
    created_at: datetime
    updated_at: datetime

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Statistics Models
class Statistics(BaseModel):
    total_records: int
    active_threats: int
    verified: int