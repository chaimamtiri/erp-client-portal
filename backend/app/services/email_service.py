from flask import current_app, render_template_string
from flask_mail import Message
from app.extensions import mail

WELCOME_EMAIL_TEMPLATE = """
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
  <h2>Your account has been created</h2>
  <p>Hello {{ nom }},</p>
  <p>An administrator has created an account for you on the platform. You can sign in using the credentials below:</p>
  <ul>
    <li><strong>Email:</strong> {{ email }}</li>
    <li><strong>Password:</strong> {{ password }}</li>
  </ul>
  <p>
    <a href="{{ login_link }}"
       style="display:inline-block;padding:10px 20px;background:#1976d2;color:#fff;
              text-decoration:none;border-radius:4px;">
      Sign in
    </a>
  </p>
  <p style="color:#666;font-size:13px;">
    For security, we recommend changing your password after your first login.
  </p>
</div>
"""

RESET_PASSWORD_TEMPLATE = """
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
  <h2>Reset your password</h2>
  <p>Hello {{ nom }},</p>
  <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
  <p>
    <a href="{{ reset_link }}"
       style="display:inline-block;padding:10px 20px;background:#1976d2;color:#fff;
              text-decoration:none;border-radius:4px;">
      Reset password
    </a>
  </p>
  <p style="color:#666;font-size:13px;">
    If you didn't request this, you can safely ignore this email.
  </p>
</div>
"""


def send_welcome_email(email: str, nom: str, password: str) -> None:
    login_link = f"{current_app.config['FRONTEND_URL']}/login?email={email}"

    html = render_template_string(
        WELCOME_EMAIL_TEMPLATE,
        nom=nom,
        email=email,
        password=password,
        login_link=login_link
    )

    msg = Message(
        subject="Your account has been created",
        recipients=[email],
        html=html
    )
    mail.send(msg)


def send_reset_password_email(email: str, nom: str, token: str) -> None:
    reset_link = f"{current_app.config['FRONTEND_URL']}/reset-password?token={token}"

    html = render_template_string(
        RESET_PASSWORD_TEMPLATE,
        nom=nom,
        reset_link=reset_link
    )

    msg = Message(
        subject="Reset your password",
        recipients=[email],
        html=html
    )
    mail.send(msg)