import json
import boto3 

def lambda_handler(event, context):
    # S3 details
    print(event)
    bucket_name = "cloudindepth-database"
    object_key = "products/practice-tests/data.json"
    
    s3 = boto3.client('s3')
    
    try:
        # Get file from S3
        response = s3.get_object(Bucket=bucket_name, Key=object_key)
        data = response['Body'].read().decode('utf-8')
        
        # Parse JSON
        items = json.loads(data)
        
        # Find the item with id = 'saa-c03'
        target_id = event['id']
        matching_item = next((item for item in items if item.get("id") == target_id), None)
        
        if matching_item:
            return matching_item
        else:
            return "item not found"
    
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
