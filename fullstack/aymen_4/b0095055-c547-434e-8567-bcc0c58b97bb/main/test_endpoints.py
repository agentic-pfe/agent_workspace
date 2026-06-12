import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel
from typing import List
from main import app, PricingPlan

client = TestClient(app)

class TestPricingEndpoints:
    """Test cases for pricing endpoints"""

    def test_get_pricing_returns_200(self):
        """Test that GET /api/pricing returns status 200"""
        response = client.get("/api/pricing")
        assert response.status_code == 200

    def test_get_pricing_returns_list(self):
        """Test that GET /api/pricing returns a list"""
        response = client.get("/api/pricing")
        assert isinstance(response.json(), list)

    def test_get_pricing_items_match_schema(self):
        """Test that each item in GET /api/pricing matches PricingPlan schema"""
        response = client.get("/api/pricing")
        data = response.json()
        
        # Validate each item against the PricingPlan schema
        for item in data:
            plan = PricingPlan(**item)
            assert isinstance(plan.id, int)
            assert isinstance(plan.name, str)
            assert isinstance(plan.price, str)
            assert isinstance(plan.period, str)
            assert isinstance(plan.features, list)

    def test_get_pricing_returns_expected_plans(self):
        """Test that GET /api/pricing returns expected pricing plans"""
        response = client.get("/api/pricing")
        data = response.json()
        
        assert len(data) == 3
        
        # Check that we have the expected plans
        plan_names = [plan["name"] for plan in data]
        assert "Starter" in plan_names
        assert "Professional" in plan_names
        assert "Enterprise" in plan_names

class TestLeadsEndpoints:
    """Test cases for leads endpoints"""

    def test_create_lead_with_valid_email_returns_201(self):
        """Test that POST /api/leads with valid email returns 201"""
        response = client.post("/api/leads", json={"email": "test@example.com"})
        assert response.status_code == 201
        assert "message" in response.json()
        assert "email" in response.json()
        assert response.json()["email"] == "test@example.com"

    def test_create_lead_with_invalid_email_returns_422(self):
        """Test that POST /api/leads with invalid email returns 422"""
        response = client.post("/api/leads", json={"email": "invalid-email"})
        assert response.status_code == 422

    def test_create_lead_with_missing_email_returns_422(self):
        """Test that POST /api/leads with missing email returns 422"""
        response = client.post("/api/leads", json={})
        assert response.status_code == 422

    def test_create_lead_with_empty_email_returns_422(self):
        """Test that POST /api/leads with empty email returns 422"""
        response = client.post("/api/leads", json={"email": ""})
        assert response.status_code == 422

    def test_create_lead_with_very_long_email(self):
        """Test that POST /api/leads handles very long email"""
        long_email = "a" * 200 + "@example.com"
        response = client.post("/api/leads", json={"email": long_email})
        # Email validator should reject this as too long
        assert response.status_code == 422

    def test_create_lead_with_special_characters_email(self):
        """Test that POST /api/leads handles email with special characters"""
        special_emails = [
            "user+tag@example.com",
            "user.name@example.com",
            "user_name@example.com",
            "user-name@example.com"
        ]
        
        for email in special_emails:
            response = client.post("/api/leads", json={"email": email})
            assert response.status_code == 201
            assert response.json()["email"] == email

    def test_create_lead_with_edge_case_emails(self):
        """Test edge cases for email validation"""
        # Test with minimum valid email
        response = client.post("/api/leads", json={"email": "a@b.co"})
        assert response.status_code == 201
        
        # Test with email that has multiple subdomains
        response = client.post("/api/leads", json={"email": "user@mail.example.com"})
        assert response.status_code == 201

if __name__ == "__main__":
    pytest.main([__file__])