import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app, Base, get_db

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in test database
Base.metadata.create_all(bind=engine)

# Override the get_db dependency to use the test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Test cases
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Demo API"}

def test_create_item():
    response = client.post(
        "/items",
        json={"name": "Test Item", "description": "A test item"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Item"
    assert data["description"] == "A test item"
    assert "id" in data
    assert "created_at" in data

def test_read_items():
    # Create an item first
    client.post(
        "/items",
        json={"name": "Item 1", "description": "First item"}
    )
    
    response = client.get("/items")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Item 1"

def test_read_item():
    # Create an item first
    response = client.post(
        "/items",
        json={"name": "Specific Item", "description": "A specific item"}
    )
    assert response.status_code == 201
    item_id = response.json()["id"]
    
    # Retrieve the item
    response = client.get(f"/items/{item_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Specific Item"
    assert data["description"] == "A specific item"

def test_read_item_not_found():
    response = client.get("/items/99999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}

def test_update_item():
    # Create an item first
    response = client.post(
        "/items",
        json={"name": "Original Item", "description": "Original description"}
    )
    assert response.status_code == 201
    item_id = response.json()["id"]
    
    # Update the item
    response = client.put(
        f"/items/{item_id}",
        json={"name": "Updated Item", "description": "Updated description"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Item"
    assert data["description"] == "Updated description"

def test_update_item_not_found():
    response = client.put(
        "/items/99999",
        json={"name": "Updated Item", "description": "Updated description"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}

def test_delete_item():
    # Create an item first
    response = client.post(
        "/items",
        json={"name": "Item to delete", "description": "This item will be deleted"}
    )
    assert response.status_code == 201
    item_id = response.json()["id"]
    
    # Delete the item
    response = client.delete(f"/items/{item_id}")
    assert response.status_code == 204
    
    # Verify item is deleted
    response = client.get(f"/items/{item_id}")
    assert response.status_code == 404

def test_delete_item_not_found():
    response = client.delete("/items/99999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}