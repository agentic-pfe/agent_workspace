import pytest
from email_validator import validate_email

@pytest.mark.parametrize("email, expected_valid", [
    ("test@example.com", True),
    ("user.name+tag@domain.co.uk", True),
    ("first.last@sub.domain.com", True),
    ("invalid-email", False),
    ("test@domain", False),
    ("@example.com", False),
    ("test@.com", False),
    ("test @example.com", False),
    ("test@example..com", False),
    ("", False),
    (None, False),
    (123, False),
])
def test_validate_email(email, expected_valid):
    is_valid, error = validate_email(email)
    assert is_valid == expected_valid
    if not expected_valid:
        assert error is not None
    else:
        assert error is None
