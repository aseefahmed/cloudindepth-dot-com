#!/bin/bash

# Read arguments
course_id=$1
user_id=$2

# Config
s3_bucket="s3://cloudindepth-database"
profile="cloudindepth"
user_id1="google-oauth2|116644237388889020308" #aseefahmed@gmail.com
user_id2="google-oauth2|105769774752867859066" # aseefahmed.aws@gmail.com
user_id3="google-oauth2|109968855311476535740" # cheesecakenz@gmail.com
user_id4="google-oauth2|111540300909557556686" # cloudindepthnz@gmail.com
user_id5="google-oauth2|114305836685661902121" # mashrekha.anwar@gmail.com
# Run the AWS S3 command
aws s3 rm  "$s3_bucket/orders/$user_id5" --recursive --profile $profile