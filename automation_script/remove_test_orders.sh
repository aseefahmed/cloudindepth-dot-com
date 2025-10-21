#!/bin/bash

# Read arguments
course_id=$1
user_id=$2

# Config
s3_bucket="s3://cloudindepth-database"
profile="cloudindepth"
user_id1="google-oauth2|116644237388889020308" #aseefahmed@gmail.com
user_id2="google-oauth2|105769774752867859066" # aseefahmed.aws@gmail.com

# Run the AWS S3 command
aws s3 rm  "$s3_bucket/orders/$user_id1" --recursive --profile $profile