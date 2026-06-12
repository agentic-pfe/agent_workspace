import re
from typing import Tuple, Union

try:
    from email_validator import validate_email as validate_email_lib, EmailNotValidError
    HAS_EMAIL_VALIDATOR = True
except ImportError:
    HAS_EMAIL_VALIDATOR = False

# A robust regex for basic email validation if the library is not installed.
# This regex follows a general pattern but isn't 100% RFC 5322 compliant (which is nearly impossible with regex).
EMAIL_REGEX = re.compile(
    r"(^[-!#$%&'*+/=?^_`{}|~0-9a-zA-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9a-zA-Z]+)*"  # dot-atom
    r'@'                                                                       # @ symbol
    r"([-0-9a-zA-Z])"                                                          # domain name start
    r"(([0-9a-zA-Z][-0-9a-zA-Z]*[0-9a-zA-Z])?\.)*"                               # domain name parts
    r"([a-zA-Z]{2,})$"                                                         # TLD
)

def validate_email(email: str) -> Tuple[bool, Union[str, None]]:
    """
    Validates an email address.
    
    If the `email-validator` library is installed, it uses it for comprehensive 
    validation (including DNS checks if configured). Otherwise, it falls back 
    to a regular expression.

    Args:
        email (str): The email address to validate.

    Returns:
        Tuple[bool, Union[str, None]]: A tuple containing:
            - bool: True if the email is valid, False otherwise.
            - str or None: An error message if invalid, otherwise None.
    """
    if not email or not isinstance(email, str):
        return False, "Email must be a non-empty string."

    email = email.strip()

    if HAS_EMAIL_VALIDATOR:
        try:
            # check_deliverability=False avoids making a network request to check MX records
            # Set to True if you want to ensure the domain actually exists.
            validate_email_lib(email, check_deliverability=False)
            return True, None
        except EmailNotValidError as e:
            return False, str(e)
    else:
        if EMAIL_REGEX.match(email):
            return True, None
        else:
            return False, "Invalid email format."

if __name__ == "__main__":
    # Quick manual tests
    test_emails = [
        "test@example.com",          # Valid
        "user.name+tag@domain.co.uk", # Valid
        "invalid-email",             # Invalid
        "test@domain",               # Invalid (missing TLD)
        "@example.com",              # Invalid (missing local part)
        "test@.com",                 # Invalid (missing domain name)
        "test @example.com",         # Invalid (contains space)
        None,                        # Invalid (not a string)
    ]

    print(f"Using email-validator library: {HAS_EMAIL_VALIDATOR}")
    for email in test_emails:
        is_valid, error = validate_email(email)
        print(f"Email: {email} -> Valid: {is_valid}, Error: {error}")
