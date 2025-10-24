import json
import boto3
import os
from datetime import datetime
from dateutil.relativedelta import relativedelta
from botocore.exceptions import ClientError
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

s3 = boto3.client("s3")
BUCKET_NAME = "cloudindepth-database"

now = datetime.now()
# Add 1 year
one_year_later = now + relativedelta(years=1)
time_format = "%b %d, %Y"
expiry_date = one_year_later.strftime(time_format)

# Environment variables
SENDGRID_API_KEY = "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"
FROM_EMAIL = "info@cloudindepth.com"  # Must be a verified sender in SendGrid
BRAND_NAME = "CloudInDepth"
DASHBOARD_URL = "https://cloudindepth.com/dashboard"


def send_email(to_email, user_name, test_title, price):
    print(price)
    """Send a branded HTML email using SendGrid SDK."""
    subject = f"Your {BRAND_NAME} Practice Test Confirmation"

    html_content = f"""
    <html>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="text-align: center;">
            <img src="https://cloudindepth.com/images/logo.png" alt="{BRAND_NAME} Logo" style="margin-bottom: 20px;">
            <h2 style="color: #2d3748;">Thank You for Your Purchase!</h2>
          </div>

          <p style="font-size: 16px; color: #4a5568;">Hi {user_name},</p>
          <p style="font-size: 16px; color: #4a5568;">
            Your practice test <strong>{test_title}</strong> has been successfully added to your account.
          </p>

          <div style="background: #edf2f7; border-radius: 8px; padding: 15px; margin: 25px 0;">
            <p><strong>Test Title:</strong> {test_title}</p>
            <p><strong>Price:</strong> ${price}</p>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Order Date:</strong> {datetime.utcnow().strftime("%B %d, %Y")}</p>
          </div>

          <p style="font-size: 15px; color: #4a5568;">
            You can now start your test anytime from your dashboard. We really appriciate your feedback.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="{DASHBOARD_URL}"
               style="background-color: #007bff; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
               Go to Dashboard
            </a>
          </div>

          <hr style="margin: 40px 0; border: 0; border-top: 1px solid #e2e8f0;">

          <p style="font-size: 13px; color: #a0aec0; text-align: center;">
            © {datetime.utcnow().year} {BRAND_NAME}. All rights reserved.
          </p>
        </div>
      </body>
    </html>
    """

    message = Mail(
        from_email=Email(FROM_EMAIL, BRAND_NAME),
        to_emails=To(to_email),
        subject=subject,
        html_content=Content("text/html", html_content)
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email sent to {to_email}. Status: {response.status_code}")
    except Exception as e:
        print(f"SendGrid error: {str(e)}")
        raise


def lambda_handler(event, context):
    print("Received event:", event)

    user_id = event.get("user_id")
    practice_test_id = event.get("practice_test_id")
    user_email = event.get("email")
    user_name = event.get("user_name", "there")

    

    key = f"orders/{user_id}/details.json"
    print(key)

    try:
        # Try fetching existing details
        try:
            response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
            existing_data = json.loads(response["Body"].read().decode("utf-8"))
        except ClientError as e:
            if e.response['Error']['Code'] == "NoSuchKey":
                existing_data = []
            else:
                raise

        # Ensure list format
        if not isinstance(existing_data, list):
            existing_data = [existing_data]

        # Create new entry
        new_entry = {
            "practice_test_id": practice_test_id,
            "test_title": event.get("test_title"),
            "price": event.get("price"),
            "questions": event.get("questions"),
            "flashcards": event.get("flashcards"),
            "no_of_attempt": 0,
            "status": "1", # 1=active, 0=inactive, 2=expired
            "expiry": expiry_date,
            "last_attempted": "Not Yet",
            "order_date": datetime.utcnow().isoformat()
        }

        existing_data.append(new_entry)

        # Save updated file to S3
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=key,
            Body=json.dumps(existing_data),
            ContentType="application/json"
        )

        # Send branded confirmation email
        send_email(
            to_email=user_email,
            user_name=user_name,
            test_title=event.get("test_title"),
            price=event.get("price")
        )

        # print(
        #   to_email=user_email,
        #     user_name=user_name,
        #     test_title=event.get("test_title"),
        #     price=event.get("price")
        # )

        print('email sent')

        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"Order saved and confirmation email sent to {user_email}."})
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

# import json
# import boto3
# from botocore.exceptions import ClientError
# from datetime import datetime

# s3 = boto3.client("s3")
# BUCKET_NAME = "cloudindepth-database"

# def lambda_handler(event, context):
#     print(event)
#     user_id = event.get("user_id")
#     practice_test_id = event.get("practice_test_id")

#     if not user_id or not practice_test_id:
#         return {
#             "statusCode": 400,
#             "body": json.dumps({"error": "user_id and practice_test_id are required"})
#         }

#     key = f"orders/{user_id}/details.json"

#     try:
#         # Try to fetch existing details.json
#         try:
#             response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
#             existing_data = json.loads(response["Body"].read().decode("utf-8"))
#         except ClientError as e:
#             if e.response['Error']['Code'] == "NoSuchKey":
#                 existing_data = []  # No file yet
#             else:
#                 raise

#         # Ensure existing data is a list
#         if not isinstance(existing_data, list):
#             existing_data = [existing_data]

#         # Append new record with date and status
#         new_entry = {
#             "practice_test_id": practice_test_id,
#             "test_title": event.get("test_title"),
#             "price": event.get("price"),
#             "questions": event.get("questions"),
#             "flashcards": event.get("flashcards"),
#             "no_of_attempt":0,
#             "last_attempted": "Not Yet",
#             "order_date": datetime.utcnow().isoformat(),  # UTC timestamp
#             "status": "active"
#         }
#         existing_data.append(new_entry)

#         # Save back to S3
#         s3.put_object(
#             Bucket=BUCKET_NAME,
#             Key=key,
#             Body=json.dumps(existing_data),
#             ContentType="application/json"
#         )

#         return {
#             "statusCode": 200,
#             "body": json.dumps({"message": f"Order updated at {key}"})
#         }

#     except Exception as e:
#         return {
#             "statusCode": 500,
#             "body": json.dumps({"error": str(e)})
#         }
