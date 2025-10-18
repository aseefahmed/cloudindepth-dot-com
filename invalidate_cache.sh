export NODE_ENV=production

sudo npm run build
aws s3 sync dist/public s3://cloud-in-depth.com --profile cloudindepth
aws cloudfront create-invalidation \
    --distribution-id "E2BUFULQFK8VAN" \
    --paths "/index.html" \
    --profile cloudindepth

echo "____"
echo $STRIPE_SECRET_KEY