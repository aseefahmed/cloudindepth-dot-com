#!/bin/bash

# Read arguments
course_id=$1
user_id=$2

# Config
s3_bucket="s3://cloudindepth-database"
profile="cloudindepth"

# Validate input
if [ -z "$course_id" ] || [ -z "$user_id" ]; then
  echo "Usage: $0 '<course_id>' '<user_id>'"
  exit 1
fi

# Run the AWS S3 command
aws s3 cp automation_script/data/${course_id}_purchase_detail.json $s3_bucket/orders/$user_id/details.json --profile $profile
