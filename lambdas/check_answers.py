import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime, timezone


s3 = boto3.client("s3")
BUCKET_NAME = "cloudindepth-database"


def lambda_handler(event, context):
    print("Received event:", event)

    # === Validate Required Fields ===
    user_id = event.get("user_id")
    practice_test_id = event.get("practice_test_id")

    if not user_id or not practice_test_id:
        raise ValueError("Both 'user_id' and 'practice_test_id' are required in the event.")

    # === Calculate Test Results ===
    questions = event.get("questions", [])
    right_answers = wrong_answers = unanswered = 0

    for q in questions:
        correct = set(q.get("correctAnswer", []))
        chosen = set(q.get("choosen_options", []))

        if not chosen:
            unanswered += 1
        elif correct == chosen:
            right_answers += 1
        else:
            wrong_answers += 1

    result_summary = {
        "right_answers": right_answers,
        "wrong_answers": wrong_answers,
        "unanswered": unanswered,
    }
    print("Result summary:", result_summary)

    # === Save Completed Test Data ===
    time = int(datetime.now(timezone.utc).timestamp())
    mock_test_key = f"users/{user_id}/mock_test/{practice_test_id}/completed/"+str(time)+".json"
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=mock_test_key,
        Body=json.dumps(event),
        ContentType="application/json",
    )
    print(f"✅ Stored test data at s3://{BUCKET_NAME}/{mock_test_key}")

    # === Update details.json (ONLY INCREMENT if test exists) ===
    details_key = f"orders/{user_id}/order_details.json"

    try:
        details_obj = s3.get_object(Bucket=BUCKET_NAME, Key=details_key)
        details_content = details_obj["Body"].read().decode("utf-8")
        details_data = json.loads(details_content)
    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            print(f"❌ details.json not found for user {user_id}, skipping update.")
            return {
                "status": "skipped",
                "reason": "details.json not found",
                "test_summary": result_summary,
            }
        else:
            raise

    # Ensure it's a list
    if not isinstance(details_data, list):
        print("⚠️ details.json is not a list — cannot process.")
        return {
            "status": "error",
            "reason": "details.json format invalid (not a list)",
        }

    # === Increment no_of_attempt for existing test_id ===
    updated = False
    for item in details_data:
        if item.get("practice_test_id") == practice_test_id:
            item["no_of_attempt"] = item.get("no_of_attempt", 0) + 1
            # get current UTC time
            utc_now = datetime.now(timezone.utc)
            formatted_utc = utc_now.strftime("%Y-%m-%d %H:%M:%S")
            
            item["last_attempted"] = formatted_utc
            updated = True
            print(f"✅ Incremented no_of_attempt for test_id: {practice_test_id}")
            break

    if not updated:
        print(f"⚠️ Test ID {practice_test_id} not found in details.json — no update made.")
        return {
            "status": "skipped",
            "reason": f"test_id {practice_test_id} not found in details.json",
            "test_summary": result_summary,
        }

    # === Save Updated File Back to S3 ===
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=details_key,
        Body=json.dumps(details_data, indent=2),
        ContentType="application/json",
    )
    print(f"✅ Updated details.json at s3://{BUCKET_NAME}/{details_key}")

    # === Return Final Result ===
    return {
        "status": "success",
        "user_id": user_id,
        "practice_test_id": practice_test_id,
        "test_summary": details_data,
        "details_updated": True,
    }
