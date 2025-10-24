import json
import boto3
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
BUCKET_NAME = "cloudindepth-database"

def lambda_handler(event, context):
    """
    Expects event payload like:
    {
        "user_id": "12345"
    }
    """

    user_id = event.get("user_id")
    if not user_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing user_id in request"})
        }

    key = f"orders/{user_id}/order_details.json"

    try:
        response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
        content = response["Body"].read().decode("utf-8")
        # data = json.loads(content)

        return json.loads(content)

    except ClientError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
