import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from app.core.config import settings

template_env = Environment(loader=FileSystemLoader("app/templates/email"))

def send_email(to_email: str, subject: str, template_name: str, template_data: dict) -> bool:
    """Send email using SMTP with Jinja2 template."""
    try:
        template = template_env.get_template(f"{template_name}.html")
        html_content = template.render(**template_data)
        
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_USERNAME
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

def send_verification_email(email: str, name: str, verification_url: str) -> bool:
    """Send verification email."""
    template_data = {
        "name": name,
        "verification_url": verification_url,
        "expiry_minutes": settings.VERIFICATION_TOKEN_EXPIRE_MINUTES
    }
    return send_email(email, "Verify Your Email Address", "verification", template_data)

def send_password_reset_email(email: str, name: str, reset_url: str) -> bool:
    """Send password reset email."""
    template_data = {
        "name": name,
        "reset_url": reset_url,
        "expiry_minutes": settings.RESET_TOKEN_EXPIRE_MINUTES
    }
    return send_email(email, "Password Reset Request", "reset_password", template_data)

def send_password_changed_email(email: str, name: str) -> bool:
    """Send password changed confirmation email."""
    template_data = {
        "name": name
    }
    return send_email(email, "Password Changed", "password_changed", template_data) 