import smtplib,ssl,socket   
from itsdangerous import URLSafeTimedSerializer
from email.mime.text import MIMEText
from config import EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, SECRET_KEY

# Token generator for email verification
serializer = URLSafeTimedSerializer(SECRET_KEY)

def generate_email_token(email: str):
    return serializer.dumps(email, salt="email-confirm")

def confirm_email_token(token: str, expiration=3600):
    from itsdangerous import SignatureExpired, BadSignature
    try:
        email = serializer.loads(token, salt="email-confirm", max_age=expiration)
        return email
    except (SignatureExpired, BadSignature):
        return None

def send_email(to_email: str, subject: str, body: str):
    # Force IPv4
    socket.setdefaulttimeout(10)
    socket.has_ipv6 = False

    msg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    try:
        context = ssl.create_default_context()

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)

        print(f"✅ Verification email sent to {to_email}")

    except Exception as e:
        print("❌ Email sending failed:", e)