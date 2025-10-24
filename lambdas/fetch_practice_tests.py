import json
import boto3

def lambda_handler(event, context):
    # Initialize S3 client
    s3 = boto3.client('s3')
    
    # Define bucket and object key
    bucket_name = "cloudindepth-database"
    object_key = "products/practice-tests/data.json"
    
    try:
        # Fetch object from S3
        response = s3.get_object(Bucket=bucket_name, Key=object_key)
        
        # Read file content
        data = response['Body'].read().decode('utf-8')
        
        # Parse JSON
        # json_data = json.loads(data)
        
        # Return response
        return json.loads(data) 
    
    except Exception as e:
        return {
            "statusCode": 500,
            "error": str(e)
        }
