import json
import os
import stripe
from decimal import Decimal

# Initialize Stripe with your secret key
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

def lambda_handler(event, context):
    """
    Lambda function to create a Stripe payment intent
    
    Expected input:
    {
        "testId": "saa-c03",
        "amount": 5000,  # Amount in cents
        "currency": "usd"
    }
    
    Expected output:
    {
        "clientSecret": "pi_xxx_secret_xxx",
        "paymentIntentId": "pi_xxx"
    }
    """
    
    try:
        # Parse the request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        # Extract parameters
        test_id = body.get('testId')
        amount = body.get('amount')  # Amount in cents
        currency = body.get('currency', 'usd')
        
        # Validate required parameters
        if not test_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'error': 'Missing testId parameter'
                })
            }
        
        if not amount or amount <= 0:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'error': 'Invalid amount. Amount must be greater than 0'
                })
            }
        
        # Create payment intent with Stripe
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            metadata={
                'test_id': test_id,
                'source': 'aws-lambda'
            },
            automatic_payment_methods={
                'enabled': True,
            },
        )
        
        # Return the client secret
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'clientSecret': payment_intent.client_secret,
                'paymentIntentId': payment_intent.id,
                'amount': payment_intent.amount,
                'currency': payment_intent.currency,
                'status': payment_intent.status
            })
        }
        
    except stripe.error.StripeError as e:
        # Handle Stripe-specific errors
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'error': f'Stripe error: {str(e)}'
            })
        }
        
    except Exception as e:
        # Handle any other errors
        print(f"Unexpected error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'error': 'Internal server error'
            })
        }

def handle_cors(event, context):
    """
    Handle CORS preflight requests
    """
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        'body': json.dumps({'message': 'CORS preflight'})
    }
