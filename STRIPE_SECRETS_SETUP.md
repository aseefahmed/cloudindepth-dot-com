# Stripe Secrets Setup with AWS Secrets Manager

This document explains how to set up Stripe secrets in AWS Secrets Manager for environment-based configuration.

## Current Status

⚠️ **Temporary Implementation**: The application is currently using environment variables as a fallback until the AWS SDK package is installed. The AWS Secrets Manager integration is ready but requires the `@aws-sdk/client-secrets-manager` package to be installed.

## Overview

The application is designed to fetch Stripe keys from AWS Secrets Manager based on the `NODE_ENV` environment variable:

- **Development**: Fetches from `stripe/dev` secret
- **Production**: Fetches from `stripe/prod` secret

**Currently**: Uses environment variables as fallback until AWS SDK is installed.

## Current Setup (Temporary)

Since the AWS SDK package cannot be installed due to permissions issues, the application is currently using environment variables. To get the application running immediately:

### Set Environment Variables

Create a `.env` file in the project root with:

```bash
# Development
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_your_stripe_test_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_stripe_test_public_key_here
```

Or for production:

```bash
# Production
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_your_stripe_live_secret_key_here
STRIPE_PUBLIC_KEY=pk_live_your_stripe_live_public_key_here
```

## AWS Secrets Manager Setup (Future)

### 1. Create Development Secret

Create a secret named `stripe/dev` in AWS Secrets Manager with the following JSON structure:

```json
{
  "STRIPE_SECRET_KEY": "sk_test_your_stripe_test_secret_key_here",
  "STRIPE_PUBLIC_KEY": "pk_test_your_stripe_test_public_key_here"
}
```

### 2. Create Production Secret

Create a secret named `stripe/prod` in AWS Secrets Manager with the following JSON structure:

```json
{
  "STRIPE_SECRET_KEY": "sk_live_your_stripe_live_secret_key_here",
  "STRIPE_PUBLIC_KEY": "pk_live_your_stripe_live_public_key_here"
}
```

### 3. AWS Region

Ensure the secrets are created in the `ap-southeast-6` region (same as used in the admin app).

## Implementation Details

### Server-Side (Node.js)

- **File**: `server/secrets.ts`
- **Function**: `getStripeSecrets()`
- **Caching**: 5-minute cache to avoid repeated API calls
- **Fallback**: Falls back to environment variables if AWS Secrets Manager fails

### Client-Side (React)

- **File**: `client/src/utils/stripe-config.ts`
- **Function**: `initializeStripe()`
- **API Endpoint**: `/api/stripe-public-key`
- **Caching**: 5-minute cache for the public key

### Security Features

1. **Environment-based**: Automatically selects the correct secret based on `NODE_ENV`
2. **Caching**: Reduces AWS API calls and improves performance
3. **Fallback**: Graceful degradation to environment variables
4. **Error Handling**: Comprehensive error handling and logging
5. **No Hardcoded Keys**: Removes hardcoded Stripe keys from the codebase

## Environment Variables (Fallback)

If AWS Secrets Manager is unavailable, the system will fall back to these environment variables:

```bash
# Development
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_your_stripe_test_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_stripe_test_public_key_here

# Production
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_your_stripe_live_secret_key_here
STRIPE_PUBLIC_KEY=pk_live_your_stripe_live_public_key_here
```

## AWS IAM Permissions

Ensure your AWS credentials have the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:ap-southeast-6:*:secret:stripe/dev*",
        "arn:aws:secretsmanager:ap-southeast-6:*:secret:stripe/prod*"
      ]
    }
  ]
}
```

## Testing

### Development Testing

1. Set `NODE_ENV=development`
2. Ensure `stripe/dev` secret exists in AWS Secrets Manager
3. Start the development server: `npm run dev`
4. Check console logs for successful secret fetching

### Production Testing

1. Set `NODE_ENV=production`
2. Ensure `stripe/prod` secret exists in AWS Secrets Manager
3. Deploy to production
4. Monitor logs for successful secret fetching

## Troubleshooting

### Common Issues

1. **"Payment processing is currently unavailable"**
   - Check AWS credentials and permissions
   - Verify secret exists in correct region
   - Check secret JSON format

2. **"Stripe public key not available"**
   - Verify `STRIPE_PUBLIC_KEY` in secret
   - Check API endpoint `/api/stripe-public-key`

3. **Fallback to environment variables**
   - Check AWS Secrets Manager access
   - Verify secret names match exactly

### Debug Logging

The system logs detailed information about secret fetching:

```
Fetching Stripe secrets from: stripe/dev
Successfully fetched Stripe secrets from stripe/dev
Stripe initialized successfully with secrets from AWS Secrets Manager
```

## Enabling AWS Secrets Manager Integration

To enable the full AWS Secrets Manager integration:

1. **Install AWS SDK**:
   ```bash
   npm install @aws-sdk/client-secrets-manager
   ```

2. **Replace the temporary implementation**:
   ```bash
   # Backup current implementation
   mv server/secrets.ts server/secrets-temp.ts
   
   # Use AWS implementation
   mv server/secrets-aws.ts server/secrets.ts
   ```

3. **Set up AWS Secrets Manager** (see sections below)

4. **Test the integration**:
   - Set `NODE_ENV=development` or `NODE_ENV=production`
   - Start the server and check logs for successful secret fetching

## Migration from Hardcoded Keys

The previous hardcoded Stripe key in `server/routes.ts` has been removed. The system now:

1. **Currently**: Uses environment variables (temporary)
2. **Future**: Will fetch secrets from AWS Secrets Manager on startup
3. Caches secrets for 5 minutes
4. Falls back to environment variables if needed
5. Provides detailed error messages for troubleshooting

## Security Benefits

1. **No Hardcoded Secrets**: Keys are no longer stored in code
2. **Environment Separation**: Different keys for dev/prod
3. **Centralized Management**: All secrets managed in AWS
4. **Audit Trail**: AWS CloudTrail logs secret access
5. **Rotation Support**: Easy to rotate keys in AWS Secrets Manager
