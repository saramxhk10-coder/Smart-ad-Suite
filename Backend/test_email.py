import smtplib, ssl
from email.mime.text import MIMEText

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USER = "saramprince10@gmail.com"
EMAIL_PASSWORD = "kmzwkexhlivumkay"  # Gmail App Password

msg = MIMEText("This is a test email from FastAPI")
msg["Subject"] = "Test Email"
msg["From"] = EMAIL_USER
msg["To"] = EMAIL_USER   # send to yourself first

context = ssl.create_default_context()

try:
    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls(context=context)
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.send_message(msg)
    print("✅ Email sent successfully!")
except Exception as e:
    print("❌ Error:", e)
