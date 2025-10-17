#!/bin/bash

# Read arguments
course_id=$1
user_id=$2

# Config
s3_bucket="s3://cloudindepth-database"
profile="cloudindepth"
user_id="google-oauth2|116644237388889020308"

# Run the AWS S3 command
aws s3 rm  "$s3_bucket/orders/$user_id" --recursive --profile $profile