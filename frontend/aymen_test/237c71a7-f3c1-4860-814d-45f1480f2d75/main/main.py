from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field
import uvicorn
import os

# Create the FastAPI app
app = FastAPI(title="Backend Developer Portfolio API", version="1.0.0")

# Define the contact model
class ContactForm(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(...)
    message: str = Field(..., min_length=1, max_length=1000)

# Serve static files (index.html)
# Check if index.html exists in the current directory
if os.path.exists("index.html"):
    app.mount("/", StaticFiles(directory=".", html=True), name="static")

# Define the contact endpoint
@app.post("/contact")
async def contact(contact_form: ContactForm):
    """
    Handle contact form submissions.
    
    Args:
        contact_form (ContactForm): The contact form data containing name, email, and message.
        
    Returns:
        dict: A confirmation message.
    """
    # In a real application, you would send an email or save to a database here
    return {
        "message": "Thank you for your message. We'll get back to you soon.",
        "received_data": {
            "name": contact_form.name,
            "email": contact_form.email,
            "message": contact_form.message
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)