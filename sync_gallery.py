import os
import json

# Define paths
MINIAS_DIR = "/Users/augustin/Desktop/minias"
APP_JS_PATH = "/Users/augustin/.gemini/antigravity/scratch/RodeLive/app.js"
METADATA_FILE = os.path.join(MINIAS_DIR, "video_data.json")

def get_metadata():
    if os.path.exists(METADATA_FILE):
        try:
            with open(METADATA_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def get_thumbnails(metadata):
    thumbnails = []
    # Extensions to look for
    valid_extensions = ('.png', '.jpg', '.jpeg', '.webp')
    
    if not os.path.exists(MINIAS_DIR):
        print(f"Directory {MINIAS_DIR} not found.")
        return []
    
    files = sorted([f for f in os.listdir(MINIAS_DIR) if f.lower().endswith(valid_extensions)], reverse=True)
    
    for i, filename in enumerate(files):
        title = filename.split('.')[0].replace('_', ' ').title()
        # Look for specific metadata for this file
        file_meta = metadata.get(filename, {})
        
        thumbnails.append({
            "id": i + 1,
            "title": file_meta.get("title", title),
            "image": os.path.join(MINIAS_DIR, filename),
            "alt": f"{title} Thumbnail",
            "link": file_meta.get("link", "https://youtube.com"),
            "views": file_meta.get("views", "N/A")
        })
    return thumbnails

def update_app_js(thumbnails):
    if not os.path.exists(APP_JS_PATH):
        print(f"File {APP_JS_PATH} not found.")
        return
    
    with open(APP_JS_PATH, 'r') as f:
        content = f.read()
    
    start_marker = "const projects = ["
    end_marker = "];"
    
    start_index = content.find(start_marker)
    end_index = content.find(end_marker, start_index)
    
    if start_index != -1 and end_index != -1:
        new_projects_json = json.dumps(thumbnails, indent=4)
        new_content = content[:start_index + len(start_marker) - 1] + " = " + new_projects_json + content[end_index + 1:]
        
        with open(APP_JS_PATH, 'w') as f:
            f.write(new_content)
        print(f"Successfully updated {APP_JS_PATH} with {len(thumbnails)} thumbnails.")
    else:
        print("Could not find projects array in app.js")

if __name__ == "__main__":
    metadata = get_metadata()
    thumbnails = get_thumbnails(metadata)
    if thumbnails:
        update_app_js(thumbnails)
