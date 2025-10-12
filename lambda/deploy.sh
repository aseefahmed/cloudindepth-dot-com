#!/bin/bash

# Lambda deployment script for create-payment-intent function

# Configuration
FUNCTION_NAME="create-payment-intent"
RUNTIME="python3.9"
HANDLER="create-payment-intent.lambda_handler"
ROLE_ARN="arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role"  # Update this with your actual role ARN
REGION="ap-southeast-6"  # Update with your region

# Create deployment package
echo "Creating deployment package..."
mkdir -p package
pip install -r requirements.txt -t package/
cp create-payment-intent.py package/
cd package
zip -r ../deployment-package.zip .
cd ..

# Check if function exists
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION >/dev/null 2>&1; then
    echo "Updating existing Lambda function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://deployment-package.zip \
        --region $REGION
else
    echo "Creating new Lambda function..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler $HANDLER \
        --zip-file fileb://deployment-package.zip \
        --region $REGION \
        --timeout 30 \
        --memory-size 256
fi

# Set environment variables
echo "Setting environment variables..."
aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --environment Variables="{STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY}" \
    --region $REGION

# Create API Gateway integration (optional)
echo "Creating API Gateway integration..."
aws apigateway create-rest-api \
    --name "payment-api" \
    --region $REGION \
    --description "API for payment processing" || echo "API Gateway may already exist"

# Clean up
rm -rf package
rm deployment-package.zip

echo "Deployment complete!"
echo "Don't forget to:"
echo "1. Update the ROLE_ARN in this script with your actual IAM role"
echo "2. Set your STRIPE_SECRET_KEY environment variable"
echo "3. Configure API Gateway to proxy requests to this Lambda function"
echo "4. Update the endpoint URL in your frontend code"
