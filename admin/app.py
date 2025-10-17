import streamlit as st
import boto3
import pandas as pd
import json
import time
import os
import requests
import re
from io import BytesIO
from botocore.exceptions import NoCredentialsError, ClientError
from openai import OpenAI

# -------------------------
# Streamlit Page Settings
# -------------------------
st.set_page_config(
    page_title="CloudInDepth Dashboard",
    page_icon="📁",
    layout="wide",
)

# -------------------------
# Sidebar Menu
# -------------------------
st.sidebar.title("📋 Navigation")
menu_option = st.sidebar.radio(
    "Go to",
    ["Home", "S3 Folder Browser", "Create Blog Post", "View Blog Posts", "Blog Detail", "About"],
    index=2
)

# -------------------------
# AWS Configuration
# -------------------------
bucket_name = "cloudindepth-database"
s3 = boto3.client("s3")

# -------------------------
# HelpersR
# -------------------------
@st.cache_data(ttl=300)
def list_s3_folders(bucket: str, prefix: str):
    try:
        paginator = s3.get_paginator("list_objects_v2")
        result = paginator.paginate(Bucket=bucket, Prefix=prefix, Delimiter="/")

        folders = []
        for page in result:
            if "CommonPrefixes" in page:
                for obj in page["CommonPrefixes"]:
                    folder_name = obj["Prefix"].replace(prefix, "").strip("/")
                    folders.append(folder_name)
        return folders

    except NoCredentialsError:
        st.error("❌ AWS credentials not found. Please configure them with AWS CLI or provide a profile.")
        return []
    except ClientError as e:
        st.error(f"❌ Error accessing S3: {e}")
        return []

def read_json_from_s3(bucket: str, key: str):
    try:
        obj = s3.get_object(Bucket=bucket, Key=key)
        # st.info(json.loads(obj['Body'].read()))
        res = json.loads(obj['Body'].read())
        return res
    except s3.exceptions.NoSuchKey:
        return []
    except Exception as e:
        st.error(f"Error reading JSON from S3: {e}")
        return []

def write_json_to_s3(bucket: str, key: str, data):
    try:
        st.info(json.dumps(data, indent=2))
        s3.put_object(Bucket=bucket, Key=key, Body=json.dumps(data, indent=2))
    except Exception as e:
        st.error(f"Error writing JSON to S3: {e}")

def generate_seo_friendly_id(title: str):
    """Generate SEO-friendly ID from blog title"""
    try:
        # Convert to lowercase
        slug = title.lower()
        
        # Remove special characters and replace spaces with hyphens
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        
        # Remove leading/trailing hyphens
        slug = slug.strip('-')
        
        # # Limit length to 50 characters for SEO
        # if len(slug) > 50:
        #     slug = slug[:50].rstrip('-')
        
        # Ensure it's not empty
        if not slug:
            slug = f"blog-post-{int(time.time())}"
        
        return slug
        
    except Exception as e:
        st.error(f"Error generating SEO-friendly ID: {e}")
        return f"blog-post-{int(time.time())}"

def generate_image_prompt_from_title(title: str):
    """Generate an image prompt using OpenAI based on the blog title"""
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key="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")
        
        if not client.api_key:
            st.error("❌ OpenAI API key not found. Please set OPENAI_API_KEY environment variable.")
            return None
        
        # Generate image prompt using GPT
        with st.spinner("🤖 Generating image prompt with title '{title}'..."):
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at creating detailed, visual prompts for AI image generation. Create a compelling, descriptive prompt for DALL-E 3 that would generate a professional blog header image. The prompt should be specific, visually rich, and appropriate for the blog topic. Focus on visual elements, style, composition, and mood. Keep it under 200 words."
                    },
                    {
                        "role": "user",
                        "content": f"Create a detailed image prompt for a blog post titled: '{title}'. The image should be a professional header image that represents the blog content visually."
                    }
                ],
                max_tokens=200,
                temperature=0.7
            )
        
        generated_prompt = response.choices[0].message.content.strip()
        return generated_prompt
        
    except Exception as e:
        st.error(f"❌ Error generating image prompt: {e}")
        return None

def generate_image_with_dalle(prompt: str, title: str):
    """Generate an image using DALL-E 3 and upload to S3"""
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key="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")
        
        if not client.api_key:
            st.error("❌ OpenAI API key not found. Please set OPENAI_API_KEY environment variable.")
            return None
        
        # Generate image with DALL-E 3
        with st.spinner("🎨 Generating image with DALL-E 3..."):
            st.info(f"Generating image with prompt '{prompt}'...")
            
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1792x1024",
                quality="standard",
                n=1,
            )
        
        # Get the image URL
        image_url = response.data[0].url
        
        # Download the image
        img_response = requests.get(image_url)
        img_response.raise_for_status()
        
        # Create a safe filename from the title
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_title = safe_title.replace(' ', '_')
        image_filename = f"{safe_title}_{int(time.time())}.png"
        s3_key = f"blogs/images/{image_filename}"
        
        # Upload to S3
        s3.put_object(
            Bucket="cloud-in-depth.com",
            Key=s3_key,
            Body=img_response.content,
            ContentType='image/png'
        )
        
        # Return the S3 URL
        s3_url = f"https://cloudindepth.com/{s3_key}"
        return s3_url
        
    except Exception as e:
        st.error(f"❌ Error generating image: {e}")
        return None

# -------------------------
# Pages
# -------------------------
if menu_option == "Home":
    st.title("🏠 Welcome to CloudInDepth Dashboard")
    st.write(
        """
        Use the sidebar to navigate between pages:
        - **S3 Folder Browser**: Browse your AWS S3 folders  
        - **Create Blog Post**: Add new blog entries  
        - **View Blog Posts**: View and delete existing blog entries  
        - **About**: Learn more about this app  
        """
    )

elif menu_option == "S3 Folder Browser":
    st.title("📦 S3 Folder Browser")
    prefix = "orders/"
    st.caption(f"Showing folders from `s3://{bucket_name}/{prefix}`")

    with st.spinner("Fetching folders from S3..."):
        folders = list_s3_folders(bucket_name, prefix)

    if folders:
        df = pd.DataFrame({"📂 Folder Name": folders})

        def style_table(df):
            return (
                df.style.set_properties(
                    **{
                        "text-align": "left",
                        "background-color": "#ffffff",
                        "border-color": "#dee2e6",
                        "color": "#212529",
                        "font-size": "16px",
                        "padding": "8px",
                    }
                )
                .set_table_styles(
                    [
                        {"selector": "thead th", "props": [("background-color", "#007bff"), ("color", "white"), ("font-size", "18px"), ("text-align", "left")]},
                        {"selector": "tbody tr:nth-child(even)", "props": [("background-color", "#f1f3f6")]},
                        {"selector": "tbody tr:hover", "props": [("background-color", "#d1e7dd"), ("color", "#000")]},
                        {"selector": "tbody td", "props": [("border", "1px solid #dee2e6")]},
                        {"selector": "table", "props": [("border-collapse", "collapse"), ("width", "100%"), ("border-radius", "12px"), ("overflow", "hidden")]},
                    ]
                )
            )

        st.dataframe(style_table(df), use_container_width=True, height=500)

    else:
        st.warning("⚠️ No folders found under this prefix.")

elif menu_option == "Create Blog Post":
    st.title("📝 Create Blog Post")

    key = "blogs/articles.json"
    articles = read_json_from_s3(bucket_name, key)
    if isinstance(articles, dict):
        articles = list(articles.values())
    elif not isinstance(articles, list):
        articles = []

    # Blog form fields outside of form for auto-prompt generation
    title = st.text_input("Title", value="My New Blog Post", placeholder="Enter blog post title", key="blog_title")
    author = st.text_input("Author", value="Admin", placeholder="Enter author name", key="blog_author")
    content = st.text_area("Content", value="Write your blog content here...\n\nThis is where you can share your thoughts, insights, and knowledge with your readers.", placeholder="Write your blog content here...", height=200, key="blog_content")
    tags = st.text_input("Tags (comma-separated)", value="blog, tutorial, guide", key="blog_tags")
    
    # Store current title in session state for auto-prompt generation
    st.session_state.current_title = title
    
    # Show SEO-friendly ID preview
    if title and title != "My New Blog Post":
        seo_preview = generate_seo_friendly_id(title)
        st.info(f"🔗 SEO-friendly URL: `/blog/{seo_preview}`")
    
    # Image generation section
    st.markdown("### 🎨 Blog Image Generation")
    generate_image = st.checkbox("Generate image with DALL-E 3", value=True, key="generate_image_checkbox")
    
    # Initialize session state for image prompt
    if 'image_prompt' not in st.session_state:
        st.session_state.image_prompt = f"Professional blog header image for '{title}' - modern, clean design with relevant visual elements"
    
    if generate_image:
        # Auto-generate prompt button (outside form)
        col1, col2 = st.columns([3, 1])
        with col1:
            st.markdown("**Image Prompt:**")
        with col2:
            if st.button("🤖 Auto-Generate Prompt", key="auto_prompt_btn"):
                current_title = st.session_state.current_title
                if current_title and current_title != "My New Blog Post":
                    generated_prompt = generate_image_prompt_from_title(current_title)
                    if generated_prompt:
                        st.session_state.image_prompt = generated_prompt
                        st.success("✅ Prompt generated successfully!")
                    else:
                        st.error("Failed to generate prompt. Please try again.")
                else:
                    st.warning("Please enter a meaningful blog title first.")
        
        # Display the prompt text area
        image_prompt = st.text_area(
            "Image Prompt", 
            value=st.session_state.image_prompt,
            placeholder="Describe the image you want to generate...",
            height=100,
            key="image_prompt_area"
        )
        
        # Update session state when user types
        st.session_state.image_prompt = image_prompt
    
    # Submit button
    submit = st.button("Submit Blog Post", key="submit_blog_btn", type="primary")

    if submit:
        if not title or not content:
            st.error("❌ Title and Content are required!")
        else:
            # Generate image if requested
            image_url = None
            if generate_image:
                # Auto-generate prompt if not provided or is default
                final_prompt = title
                # if not final_prompt or final_prompt == f"Professional blog header image for '{title}' - modern, clean design with relevant visual elements":
                #     st.info("🤖 Auto-generating image prompt from blog title...")
                #     final_prompt = generate_image_prompt_from_title(title)
                #     if not final_prompt:
                #         st.warning("⚠️ Could not generate prompt automatically. Using default prompt.")
                #         final_prompt = f"Professional blog header image for '{title}' - modern, clean design with relevant visual elements"
                
                if final_prompt:
                    image_url = generate_image_with_dalle(final_prompt, title)
            
            # Generate SEO-friendly ID from title
            seo_id = generate_seo_friendly_id(title)
            
            # Check if ID already exists and make it unique if needed
            existing_ids = [article.get("id", "") for article in articles]
            original_seo_id = seo_id
            counter = 1
            while seo_id in existing_ids:
                seo_id = f"{original_seo_id}-{counter}"
                counter += 1
            
            new_article = {
                "id": seo_id,
                "title": title,
                "author": author,
                "content": content,
                "tags": [t.strip() for t in tags.split(",") if t.strip()],
                "image_url": image_url,
                "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            articles.append(new_article)
            write_json_to_s3(bucket_name, key, articles)
            
            if image_url:
                st.success(f"✅ Blog post '{title}' created successfully with generated image!")
                st.info(f"🔗 Blog URL: `/blog/{seo_id}`")
                st.image(image_url, caption=f"Generated image for: {title}", use_column_width=True)
            else:
                st.success(f"✅ Blog post '{title}' created successfully!")
                st.info(f"🔗 Blog URL: `/blog/{seo_id}`")
            
            time.sleep(5)
            st.rerun()

elif menu_option == "View Blog Posts":
    st.title("🗂️ Manage Blog Posts")
    key = "blogs/articles.json"

    # Load raw JSON from S3
    raw_articles = read_json_from_s3(bucket_name, key)
    # st.info(raw_articles)

    # --- Normalize structure ---
    articles = []
    def flatten_items(items):
        """Recursively flatten nested lists of articles."""
        for i in items:
            if isinstance(i, list):
                flatten_items(i)
            elif isinstance(i, dict):
                articles.append(i)
            else:
                st.warning(f"⚠️ Skipping invalid item in JSON: {i}")

    if isinstance(raw_articles, list):
        flatten_items(raw_articles)
    elif isinstance(raw_articles, dict):
        articles = list(raw_articles.values())
    else:
        articles = []

    if not articles:
        st.info("No valid blog posts found.")
    else:
        # Ensure all required keys exist
        normalized_articles = []
        for a in articles:
            normalized_articles.append({
                "id": a.get("id", len(normalized_articles) + 1),
                "title": a.get("title", "Untitled"),
                "author": a.get("author", "Unknown"),
                "tags": a.get("tags", []),
                "content": a.get("content", "")
            })

        st.markdown("### 🧾 Blog List")
        st.caption("Click an action button to view, edit, or delete a blog post.")

        # Table styling
        st.write(
            """
            <style>
            table.blog-table {
                width: 100%;
                border-collapse: collapse;
                border-radius: 8px;
                overflow: hidden;
            }
            table.blog-table th {
                background-color: #007bff;
                color: white;
                text-align: left;
                padding: 10px;
            }
            table.blog-table td {
                background-color: #ffffff;
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }
            table.blog-table tr:nth-child(even) td {
                background-color: #f8f9fa;
            }
            </style>
            """,
            unsafe_allow_html=True,
        )

        st.write('<table class="blog-table">', unsafe_allow_html=True)
        st.write("<tr><th>ID</th><th>Title</th><th>Author</th><th>Tags</th><th>Actions</th></tr>", unsafe_allow_html=True)

        for article in normalized_articles:
            st.write(
                f"""
                <tr>
                    <td>{article['id']}</td>
                    <td>{article['title']}</td>
                    <td>{article['author']}</td>
                    <td>{', '.join(article['tags'])}</td>
                    <td>
                """,
                unsafe_allow_html=True,
            )

            # Buttons for each row
            col1, col2, col3 = st.columns([0.3, 0.3, 0.3])
            with col1:
                view_btn = st.button("👁️ View", key=f"view_{article['id']}")
            with col2:
                edit_btn = st.button("✏️ Edit", key=f"edit_{article['id']}")
            with col3:
                del_btn = st.button("🗑️ Delete", key=f"delete_{article['id']}")

            # --- View ---
            if view_btn:
                with st.expander(f"📖 {article['title']} - Full Content", expanded=True):
                    st.markdown(f"**Author:** {article['author']}")
                    st.markdown(f"**Tags:** {', '.join(article['tags'])}")
                    if article.get('created_at'):
                        st.markdown(f"**Created:** {article['created_at']}")
                    
                    # Display generated image if available
                    if article.get('image_url'):
                        st.markdown("**Generated Image:**")
                        st.image(article['image_url'], caption=f"AI Generated Image for: {article['title']}", use_column_width=True)
                    
                    st.markdown("---")
                    st.markdown(article['content'], unsafe_allow_html=True)

            # --- Edit ---
            if edit_btn:
                st.info(f"Editing blog: {article['title']}")
                
                # Show current image if available
                if article.get('image_url'):
                    st.markdown("**Current Image:**")
                    st.image(article['image_url'], caption="Current blog image", use_column_width=True)
                
                # Edit form fields outside of form for auto-prompt generation
                new_title = st.text_input("Title", article['title'], key=f"edit_title_{article['id']}")
                new_author = st.text_input("Author", article['author'], key=f"edit_author_{article['id']}")
                new_content = st.text_area("Content", article['content'], height=200, key=f"edit_content_{article['id']}")
                new_tags = st.text_input("Tags (comma-separated)", ", ".join(article['tags']), key=f"edit_tags_{article['id']}")
                
                # Store current edit title in session state for auto-prompt generation
                edit_title_key = f'edit_current_title_{article["id"]}'
                st.session_state[edit_title_key] = new_title
                
                # Show current and new SEO-friendly ID
                current_seo_id = article.get("id", "unknown")
                new_seo_id = generate_seo_friendly_id(new_title)
                st.info(f"🔗 Current URL: `/blog/{current_seo_id}`")
                if new_title != article['title']:
                    st.info(f"🔗 New URL: `/blog/{new_seo_id}`")
                
                # Image regeneration options
                st.markdown("### 🎨 Image Options")
                regenerate_image = st.checkbox("Regenerate image with DALL-E 3", value=False, key=f"regenerate_image_{article['id']}")
                
                # Initialize session state for edit image prompt
                edit_prompt_key = f'edit_image_prompt_{article["id"]}'
                if edit_prompt_key not in st.session_state:
                    st.session_state[edit_prompt_key] = f"Professional blog header image for '{new_title}' - modern, clean design with relevant visual elements"
                
                if regenerate_image:
                    # Auto-generate prompt button for edit (outside form)
                    col1, col2 = st.columns([3, 1])
                    with col1:
                        st.markdown("**New Image Prompt:**")
                    with col2:
                        if st.button("🤖 Auto-Generate Prompt", key=f"auto_prompt_edit_{article['id']}"):
                            current_edit_title = st.session_state[edit_title_key]
                            if current_edit_title and current_edit_title != article['title']:
                                generated_prompt = generate_image_prompt_from_title(current_edit_title)
                                if generated_prompt:
                                    st.session_state[edit_prompt_key] = generated_prompt
                                    st.success("✅ Prompt generated successfully!")
                                else:
                                    st.error("Failed to generate prompt. Please try again.")
                            else:
                                st.warning("Please enter a new title first.")
                    
                    # Display the prompt text area for edit
                    new_image_prompt = st.text_area(
                        "New Image Prompt", 
                        value=st.session_state[edit_prompt_key],
                        placeholder="Describe the new image you want to generate...",
                        height=100,
                        key=f"edit_image_prompt_area_{article['id']}"
                    )
                    
                    # Update session state when user types
                    st.session_state[edit_prompt_key] = new_image_prompt
                
                # Save button
                save_btn = st.button("💾 Save Changes", key=f"save_edit_{article['id']}", type="primary")

                if save_btn:
                    for a in articles:
                        if a.get("id") == article["id"]:
                            old_id = a["id"]
                            
                            # Update basic fields
                            a["title"] = new_title
                            a["author"] = new_author
                            a["content"] = new_content
                            a["tags"] = [t.strip() for t in new_tags.split(",") if t.strip()]
                            
                            # Update ID if title changed
                            if new_title != article['title']:
                                new_seo_id = generate_seo_friendly_id(new_title)
                                # Check if new ID already exists and make it unique if needed
                                existing_ids = [art.get("id", "") for art in articles if art.get("id") != old_id]
                                original_new_seo_id = new_seo_id
                                counter = 1
                                while new_seo_id in existing_ids:
                                    new_seo_id = f"{original_new_seo_id}-{counter}"
                                    counter += 1
                                a["id"] = new_seo_id
                            
                            # Generate new image if requested
                            if regenerate_image:
                                # Auto-generate prompt if not provided or is default
                                final_edit_prompt = st.session_state[edit_prompt_key]
                                if not final_edit_prompt or final_edit_prompt == f"Professional blog header image for '{new_title}' - modern, clean design with relevant visual elements":
                                    st.info("🤖 Auto-generating image prompt from updated blog title...")
                                    final_edit_prompt = generate_image_prompt_from_title(new_title)
                                    if not final_edit_prompt:
                                        st.warning("⚠️ Could not generate prompt automatically. Using default prompt.")
                                        final_edit_prompt = f"Professional blog header image for '{new_title}' - modern, clean design with relevant visual elements"
                                
                                if final_edit_prompt:
                                    new_image_url = generate_image_with_dalle(final_edit_prompt, new_title)
                                    if new_image_url:
                                        a["image_url"] = new_image_url
                            
                            break
                    write_json_to_s3(bucket_name, key, articles)
                    st.success(f"✅ Blog '{new_title}' updated successfully!")
                    if new_title != article['title']:
                        st.info(f"🔗 New Blog URL: `/blog/{new_seo_id}`")
                    st.rerun()

            # --- Delete ---
            if del_btn:
                updated_articles = [a for a in articles if a.get("id") != article["id"]]
                write_json_to_s3(bucket_name, key, updated_articles)
                st.success(f"✅ Deleted blog: {article['title']}")
                st.rerun()

            st.write("</td></tr>", unsafe_allow_html=True)

        st.write("</table>", unsafe_allow_html=True)

elif menu_option == "Blog Detail":
    st.title("📖 Blog Detail Page")
    
    # Load blog articles
    key = "blogs/articles.json"
    articles = read_json_from_s3(bucket_name, key)
    if isinstance(articles, dict):
        articles = list(articles.values())
    elif not isinstance(articles, list):
        articles = []
    
    if not articles:
        st.warning("No blog posts found.")
    else:
        # Blog selection dropdown
        article_titles = [f"{article.get('title', 'Untitled')} (ID: {article.get('id', 'unknown')})" for article in articles]
        selected_article_idx = st.selectbox("Select a blog post to view:", range(len(article_titles)), format_func=lambda x: article_titles[x])
        
        if selected_article_idx is not None:
            selected_article = articles[selected_article_idx]
            
            # Create two columns layout - main content and sidebar
            col1, col2 = st.columns([2, 1])
            
            with col1:
                # Main blog content
                st.markdown(f"# {selected_article.get('title', 'Untitled')}")
                
                # Blog metadata
                st.markdown(f"**Author:** {selected_article.get('author', 'Unknown')} | **Published:** {selected_article.get('created_at', 'Unknown date')}")
                
                # Tags
                if selected_article.get('tags'):
                    tags_html = " ".join([f"<span style='background-color: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-right: 8px;'>{tag}</span>" for tag in selected_article['tags']])
                    st.markdown(f"**Tags:** {tags_html}", unsafe_allow_html=True)
                
                st.markdown("---")
                
                # Blog image
                if selected_article.get('image_url'):
                    st.image(selected_article['image_url'], caption=f"Featured image for: {selected_article.get('title', 'Untitled')}", use_column_width=True)
                
                # Blog content
                st.markdown(selected_article.get('content', 'No content available.'), unsafe_allow_html=True)
            
            with col2:
                # Right sidebar
                st.markdown("### 📚 Related Articles")
                
                # Show related articles (other blog posts)
                related_articles = [article for i, article in enumerate(articles) if i != selected_article_idx][:3]
                
                if related_articles:
                    for related_article in related_articles:
                        with st.container():
                            st.markdown(f"**{related_article.get('title', 'Untitled')}**")
                            st.caption(f"By {related_article.get('author', 'Unknown')}")
                            if related_article.get('tags'):
                                related_tags = ", ".join(related_article['tags'][:2])
                                st.caption(f"Tags: {related_tags}")
                            st.markdown("---")
                else:
                    st.info("No related articles found.")
                
                # Practice Tests Banner
                st.markdown("### 🎯 Practice Tests")
                
                # Create a visible banner using st.info
                st.info("""
                **🚀 AWS Solutions Architect Practice Tests**
                
                Test your knowledge with our comprehensive practice tests featuring:
                - ✨ 500+ Questions
                - 📊 Detailed Analytics
                - 🎯 Real exam scenarios
                """)
                
                # Practice tests button
                if st.button("🎯 Start Practice Tests", key="practice_tests_btn", type="primary", use_container_width=True):
                    st.success("🚀 Redirecting to AWS Solutions Architect practice tests!")
                    st.markdown("**Click here to go to practice tests:** [Practice Tests - SAA](/practice-tests/saa)")
                
                # Alternative banner with custom styling
                st.markdown("""
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    color: white;
                    margin: 10px 0;
                    border: 2px solid #5a67d8;
                ">
                    <h4 style="margin: 0 0 10px 0; color: white;">🚀 AWS Solutions Architect</h4>
                    <p style="margin: 0 0 10px 0; color: #e2e8f0; font-size: 14px;">Comprehensive Practice Tests</p>
                    <div style="background: rgba(255, 255, 255, 0.2); padding: 8px; border-radius: 6px; margin: 5px 0;">
                        <strong style="color: #fef5e7;">✨ 500+ Questions</strong>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.2); padding: 8px; border-radius: 6px; margin: 5px 0;">
                        <strong style="color: #fef5e7;">📊 Detailed Analytics</strong>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                # Additional sidebar content
                st.markdown("### 📖 Quick Links")
                st.markdown("""
                - [AWS Documentation](https://docs.aws.amazon.com/)
                - [AWS Training](https://aws.amazon.com/training/)
                - [AWS Certification](https://aws.amazon.com/certification/)
                - [AWS Blog](https://aws.amazon.com/blogs/)
                """)

elif menu_option == "About":
    st.title("ℹ️ About This App")
    st.markdown(
        """
        **CloudInDepth Dashboard** helps you manage your AWS S3 and blog data.  
        - Browse S3 folders  
        - Create and manage blog posts stored in S3  
        - Securely uses **boto3** and **Streamlit** for simple management  
        """
    )
