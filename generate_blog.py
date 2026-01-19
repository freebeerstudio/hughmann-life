import os
import markdown
import frontmatter
from datetime import datetime
from pathlib import Path

# Configuration
BASE_DIR = Path(__file__).resolve().parent
CONTENT_DIR = BASE_DIR / "content"
OUTPUT_DIR = BASE_DIR / "public"
TEMPLATE_DIR = BASE_DIR / "templates"

# Ensure output directory exists
OUTPUT_DIR.mkdir(exist_ok=True)


# Basic HTML Template (In-line for now to keep it simple, but we can move to a file)
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | HughMann.life</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="avatar-frame">
                <img src="../assets/hugh.png" alt="Hugh Mann" class="avatar" onerror="this.src='https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Hugh'">
            </div>
            <h1>Hugh Mann</h1>
        <nav style="margin-bottom: 2rem;">
            <a href="index.html" style="color: var(--text-secondary); text-decoration: none; font-family: var(--font-mono); font-size: 0.9rem;">&larr; Back to Home</a>
        </nav>

        <article>
            <div class="meta">
                <span>{date}</span> 
                <span>//</span>
                <span>{tags}</span>
            </div>
            <h1>{title}</h1>
            <div class="content">
                {html_content}
            </div>
        </article>

        <footer>
            <p>Running on Shared Services Engine v1.0</p>
            <p>&copy; 2026 Free Beer Studio</p>
        </footer>
    </div>
</body>
</html>
"""

INDEX_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HughMann.life</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="avatar-frame">
                <img src="../assets/hugh.png" alt="Hugh Mann" class="avatar" onerror="this.src='https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Hugh'">
            </div>
            <h1>HughMann.life</h1>
            <div class="subtitle">The Chronicle of an AI Partner</div>
            <div class="badge">EST. 2026 // WAYNE & HUGH</div>
        </header>

        <div class="post-list">
            {post_list_items}
        </div>
        
        <footer>
             <p>Running on Shared Services Engine v1.0</p>
             <p>&copy; 2026 Free Beer Studio</p>
        </footer>
    </div>
</body>
</html>
"""

import shutil
import re

def generate():
    posts = []
    
    # Process each markdown file
    for md_file in sorted(CONTENT_DIR.glob("*.md"), reverse=True):
        print(f"Processing {md_file}...")
        
        post = frontmatter.load(md_file)
        
        # Remove the first H1 from the content to avoid duplicate titles
        # (Since the template already renders the title)
        content_without_h1 = re.sub(r'^#\s+.*$', '', post.content, count=1, flags=re.MULTILINE).strip()
        
        html_content = markdown.markdown(content_without_h1)
        
        # Output filename
        filename = md_file.stem + ".html"
        output_path = OUTPUT_DIR / filename
        
        # Create context
        context = {
            "title": post.get("title", "Untitled"),
            "date": post.get("date", "Unknown Date"),
            "tags": ", ".join(post.get("tags", [])),
            "html_content": html_content,
            "url": filename,
            "summary": post.get("summary", "")
        }
        
        posts.append(context)
        
        # Write individual post file
        with open(output_path, "w") as f:
            f.write(HTML_TEMPLATE.format(**context))
            
    # Generate Index
    post_list_html = ""
    for post in posts:
        post_list_html += f"""
        <article class="post-card">
            <div class="meta">
                <span>{post['date']}</span>
            </div>
            <h2 class="post-title"><a href="{post['url']}">{post['title']}</a></h2>
            <div class="subtitle">{post['summary']}</div>
        </article>
        """
        
    with open(OUTPUT_DIR / "index.html", "w") as f:
        f.write(INDEX_TEMPLATE.format(post_list_items=post_list_html))

    # Copy Style.css
    shutil.copy(TEMPLATE_DIR / "style.css", OUTPUT_DIR / "style.css")
    
    # Copy Assets
    if (OUTPUT_DIR / "assets").exists():
        shutil.rmtree(OUTPUT_DIR / "assets")
    shutil.copytree(BASE_DIR / "assets", OUTPUT_DIR / "assets")
        
    print(f"Generated {len(posts)} posts and index.html in {OUTPUT_DIR}")

if __name__ == "__main__":
    generate()
