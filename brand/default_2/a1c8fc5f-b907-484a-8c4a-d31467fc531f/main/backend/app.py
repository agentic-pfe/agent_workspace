from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import hashlib
import jwt
from datetime import datetime, timedelta
import os

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

def get_db():
    conn = sqlite3.connect(DATABASE_URL.split("///")[1])
    try:
        yield conn
    finally:
        conn.close()

# JWT settings
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Item(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    owner_id: int

class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None

# App initialization
app = FastAPI(title="Full Stack Demo App", version="1.0.0")

# Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions
def verify_password(plain_password, hashed_password):
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: sqlite3.Connection, username: str):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    user_row = cursor.fetchone()
    if user_row:
        return User(id=user_row[0], username=user_row[1], email=user_row[2], hashed_password=user_row[3])
    return None

def authenticate_user(db: sqlite3.Connection, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

# Database initialization
@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    cursor = db.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            hashed_password TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            owner_id INTEGER NOT NULL,
            FOREIGN KEY (owner_id) REFERENCES users (id)
        )
    """)
    db.commit()

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: sqlite3.Connection = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
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

# User endpoints
@app.post("/users/", response_model=User)
async def create_user(user: UserCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)",
            (user.username, user.email, get_password_hash(user.password))
        )
        db.commit()
        user_id = cursor.lastrowid
        return User(id=user_id, username=user.username, email=user.email, hashed_password=get_password_hash(user.password))
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already registered")

# Item endpoints
@app.post("/items/", response_model=Item)
async def create_item(item: ItemCreate, db: sqlite3.Connection = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # In a real app, we would decode the token to get the user ID
    # For simplicity, we'll just use a placeholder user ID
    owner_id = 1
    
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO items (name, description, owner_id) VALUES (?, ?, ?)",
        (item.name, item.description, owner_id)
    )
    db.commit()
    item_id = cursor.lastrowid
    return Item(id=item_id, name=item.name, description=item.description, owner_id=owner_id)

@app.get("/items/", response_model=List[Item])
async def read_items(skip: int = 0, limit: int = 100, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM items LIMIT ? OFFSET ?", (limit, skip))
    items_rows = cursor.fetchall()
    items = []
    for row in items_rows:
        items.append(Item(id=row[0], name=row[1], description=row[2], owner_id=row[3]))
    return items

@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM items WHERE id=?", (item_id,))
    item_row = cursor.fetchone()
    if item_row:
        return Item(id=item_row[0], name=item_row[1], description=item_row[2], owner_id=item_row[3])
    raise HTTPException(status_code=404, detail="Item not found")

@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: ItemCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute(
        "UPDATE items SET name=?, description=? WHERE id=?",
        (item.name, item.description, item_id)
    )
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return Item(id=item_id, name=item.name, description=item.description, owner_id=1)

@app.delete("/items/{item_id}")
async def delete_item(item_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM items WHERE id=?", (item_id,))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"detail": "Item deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)