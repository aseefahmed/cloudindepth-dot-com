#!/bin/bash
# Copy a local file to every subdirectory under s3://cloudindepth-database/orders/

# === Config ===
export AWS_PROFILE="cloudindepth"  # Set your AWS profile
BUCKET="cloudindepth-database"
BASE_PREFIX="orders"
FILE_TO_COPY="/home/aseefahmed/order_details.json"   # Local file to copy
DEST_FILENAME="order_details.json"  # Destination name (can change if needed)

# === Script ===
echo "Starting copy of '$FILE_TO_COPY' to all subdirectories in s3://$BUCKET/$BASE_PREFIX/"

# List all directories (prefixes) under orders/
aws s3 ls "s3://$BUCKET/$BASE_PREFIX/" --recursive | awk '{print $4}' | grep '/' | cut -d'/' -f1-2 | sort -u | while read -r dir; do
    if [[ -n "$dir" ]]; then
        echo "📂 Copying $FILE_TO_COPY to s3://$BUCKET/$dir/$DEST_FILENAME ..."
        aws s3 cp "$FILE_TO_COPY" "s3://$BUCKET/$dir/$DEST_FILENAME" --only-show-errors
    fi
done

echo "✅ Done!"