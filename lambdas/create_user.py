import json
import boto3
import os

s3 = boto3.client('s3')

def lambda_handler(event, context):
    print(event) 
    # Get data from event
    user_id = event.get("user_id")
    email = event.get("email")

    if not user_id or not email:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "user_id and email are required"})
        }

    # Bucket and object path
    bucket_name = "cloudindepth-database"
    key = f"users/{user_id}/user.json"

    # JSON content
    user_data = {
        "user_id": user_id,
        "email": email
    }

    try:
        # Upload JSON to S3
        s3.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=json.dumps(user_data),
            ContentType="application/json"
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"User file created at {key}"})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
