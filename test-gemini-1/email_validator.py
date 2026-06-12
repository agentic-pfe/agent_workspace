import re

def validate_email(email: str) -> bool:
    """
    Validates an email address using a regular expression.

    Args:
        email: The email address string to validate.

    Returns:
        True if the email address is valid, False otherwise.
    """
    # Regular expression for email validation
    # This regex covers most common email formats, but might not be exhaustive for all edge cases
    # It allows alphanumeric characters, periods, underscores, and hyphens in the local part,
    # followed by an '@' symbol, then a domain name with alphanumeric characters, periods, and hyphens,
    # and finally a top-level domain of at least two letters.
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    if re.match(email_regex, email):
        return True
    else:
        return False

if __name__ == "__main__":
    # Example test cases
    print(f"test@example.com: {validate_email('test@example.com')}")          # Valid
    print(f"john.doe123@sub.domain.co.uk: {validate_email('john.doe123@sub.domain.co.uk')}") # Valid
    print(f"invalid-email: {validate_email('invalid-email')}")              # Invalid
    print(f"another@.com: {validate_email('another@.com')}")                # Invalid (domain starts with .)
    print(f"user@domain: {validate_email('user@domain')}")                  # Invalid (no TLD)
    print(f"user@domain.c: {validate_email('user@domain.c')}")              # Invalid (TLD too short)
    print(f"user@domain-with-hyphen.com: {validate_email('user@domain-with-hyphen.com')}") # Valid
    print(f"first.last@example.co: {validate_email('first.last@example.co')}") # Valid
    print(f"email@123.com: {validate_email('email@123.com')}")              # Valid
    print(f"email@domain.c1: {validate_email('email@domain.c1')}")          # Invalid (TLD contains number)
