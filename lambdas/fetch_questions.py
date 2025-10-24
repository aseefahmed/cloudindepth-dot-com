import json
import boto3
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
BUCKET_NAME = "cloudindepth-database"

def lambda_handler(event, context):
    print("++++")
    print(event) 
    try:
        # Parse request body (assumes JSON payload)
        # body = json.loads(event.get("body", "{}"))
        user_id = event.get("user_id")
        test_id = event.get("test_id") 

        if not user_id or not test_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing user_id or test_id in request body"})
            }

        # S3 key for the JSON file
        key = f"users/{user_id}/mock_test/{test_id}/current/data.json"

        # Fetch JSON from S3
        response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
        content = response["Body"].read().decode("utf-8")
        json_data = json.loads(content)
        return json_data

        

    except ClientError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON in request body"})
        }
