import json
import boto3
import datetime

s3 = boto3.client('s3')

BUCKET_NAME = "cloudindepth-database"
PURCHASE_KEY = "analytics/purchase_records.json"
USERS_KEY = "analytics/users.json"

def lambda_handler(event, context):
    try:
        records = event.get("Records", [])
        new_purchase_records = []
        new_users = []

        # 🟢 Extract and validate incoming records
        for record in records:
            try:
                body = json.loads(record["body"])
            except (KeyError, json.JSONDecodeError) as e:
                print(f"Skipping invalid record: {e}")
                continue

            required_fields = [
                "user_id", "practice_test_id", "test_title",
                "price", "questions", "flashcards", "email"
            ]
            if not all(field in body for field in required_fields):
                print(f"Skipping incomplete record: {body}")
                continue

            # Add timestamp
            body["timestamp"] = datetime.datetime.utcnow().isoformat() + "Z"
            new_purchase_records.append(body)

            # Prepare new user entry
            new_users.append({
                "email": body["email"],
                "newsletter_subscription": 1
            })

        if not new_purchase_records:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No valid records found"})
            }

        # 🟢 Read existing purchase records
        try:
            response = s3.get_object(Bucket=BUCKET_NAME, Key=PURCHASE_KEY)
            existing_purchases = json.loads(response["Body"].read())
        except s3.exceptions.NoSuchKey:
            existing_purchases = []

        # Append new purchases
        existing_purchases.extend(new_purchase_records)

        # 🟢 Write updated purchase records
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=PURCHASE_KEY,
            Body=json.dumps(existing_purchases, indent=2),
            ContentType="application/json"
        )

        # 🟢 Handle users.json
        try:
            response = s3.get_object(Bucket=BUCKET_NAME, Key=USERS_KEY)
            existing_users = json.loads(response["Body"].read())
        except s3.exceptions.NoSuchKey:
            existing_users = []

        # Convert to dict for quick lookup
        existing_emails = {u["email"] for u in existing_users}

        # Add only new unique users
        for user in new_users:
            if user["email"] not in existing_emails:
                existing_users.append(user)
                existing_emails.add(user["email"])

        # 🟢 Write updated users.json
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=USERS_KEY,
            Body=json.dumps(existing_users, indent=2),
            ContentType="application/json"
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": f"Appended {len(new_purchase_records)} purchase record(s) successfully",
                "new_unique_users_added": len(new_users),
                "purchases": new_purchase_records
            })
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
