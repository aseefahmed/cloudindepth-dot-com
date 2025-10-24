import json
import boto3
import os
import random

s3 = boto3.client("s3") 

def lambda_handler(event, context):
    print(event)
    # Define S3 bucket and key
    practice_test_id = event["practice_test_id"]
    bucket_name = "cloudindepth-database"
    key = "questions/"+practice_test_id+"/flashcards/aws_saa_flashcards.json"
    print(key)
    
    try:
        # Fetch the file from S3
        response = s3.get_object(Bucket=bucket_name, Key=key)
        content = response["Body"].read().decode("utf-8")
        data = json.loads(content)
        random.shuffle(data['response']['flashcards'])
        #return random_response
        # Return the JSON data as response
        print(data)
        return data
    
    except Exception as e:
        # Handle any errors
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
