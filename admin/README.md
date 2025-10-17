# CloudInDepth Blog Admin Dashboard

A Streamlit-based admin dashboard for managing blog posts with AI-powered image generation using DALL-E 3.

## Features

- 📝 Create and manage blog posts
- 🎨 Automatic image generation with OpenAI DALL-E 3
- 📦 S3 integration for data storage
- ✏️ Edit existing blog posts
- 🗑️ Delete blog posts
- 👁️ View blog posts with generated images

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure OpenAI API Key

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY="your_openai_api_key_here"
```

Or create a `.env` file in the project root:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Configure AWS Credentials

Make sure your AWS credentials are configured for S3 access:

```bash
aws configure
```

### 4. Run the Application

```bash
streamlit run app.py
```

## Usage

1. **Create Blog Post**: The default page where you can create new blog posts with AI-generated images
2. **View Blog Posts**: Manage existing blog posts, view content, and regenerate images
3. **S3 Folder Browser**: Browse your S3 bucket structure
4. **About**: Information about the application

## Image Generation

- Images are automatically generated using DALL-E 3 when creating new blog posts
- Generated images are stored in your S3 bucket under `blogs/images/`
- You can regenerate images when editing existing blog posts
- Image prompts are automatically generated based on the blog title, but can be customized

## Data Storage

- Blog posts are stored in S3 as JSON files
- Images are stored in S3 under the `blogs/images/` prefix
- All data is automatically synced with your S3 bucket
