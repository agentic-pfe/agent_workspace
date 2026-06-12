import re

def validate_email(email: str) -> bool:
    """
    Validates an email address using a regular expression.
    
    Args:
        email (str): The email address to validate.
        
    Returns:
        bool: True if the email is valid, False otherwise.
    """
    # Regular expression for basic email validation
    # ^[a-zA-Z0-9._%+-]+ : Local part allows alphanumeric, dots, underscores, percent, plus, and hyphens
    # @                  : Must contain the @ symbol
    # [a-zA-Z0-9.-]+     : Domain name allows alphanumeric, dots, and hyphens
    # \.[a-zA-Z]{2,}$    : Must end with a dot followed by at least 2 alphabetic characters for the TLD
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not email:
        return False
        
    return re.match(regex, email) is not None

# --- Test Suite ---
if __name__ == "__main__":
    test_cases = {
        "user@example.com": True,
        "first.last@domain.co.uk": True,
        "user+mailbox@gmail.com": True,
        "123456@provider.net": True,
        "invalid-email": False,            # Missing @ and domain
        "user@": False,                   # Missing domain
        "@domain.com": False,             # Missing local part
        "user@domain": False,             # Missing TLD
        "user@domain.c": False,           # TLD too short
        "user @domain.com": False,        # Contains space
        "user#domain.com": False,         # Missing @
        "": False                         # Empty string
    }

    print(f"{'Email':<30} | {'Expected':<10} | {'Result':<10}")
    print("-" * 55)
    for email, expected in test_cases.items():
        result = validate_email(email)
        status = "✅" if result == expected else "❌"
        print(f"{repr(email):<30} | {str(expected):<10} | {str(result):<10} {status}")
