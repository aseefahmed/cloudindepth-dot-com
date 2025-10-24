import json
import boto3
import os

s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Define S3 bucket and key
    bucket_name = "cloudindepth-database"
    key = "blogs/articles.json"

    try:
        # Fetch the JSON file from S3
        response = s3.get_object(Bucket=bucket_name, Key=key)
        content = response['Body'].read().decode('utf-8')

        return json.loads(content)
        # Return the parsed JSON
        

    except Exception as e:
        print(f"Error fetching JSON from S3: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
