import os
import json
import argparse

def get_args():
    parser = argparse.ArgumentParser(description="Sync gallery images to app.js")
    parser.add_argument("--gallery-dir", default="./images/gallery", help="Directory containing gallery images (default: ./images/gallery)")
    parser.add_argument("--app-js", default="./app.js", help="Path to app.js file (default: ./app.js)")
    parser.add_argument("--metadata", default="video_data.json", help="Path to metadata JSON file within the gallery directory")
    return parser.parse_args()

def get_metadata(metadata_path):
    if os.path.exists(metadata_path):
        try:
            with open(metadata_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load metadata from {metadata_path}: {e}")
            return {}
    return {}

def get_thumbnails(gallery_dir, metadata):
    thumbnails = []
    # Extensions to look for
    valid_extensions = ('.png', '.jpg', '.jpeg', '.webp')
    
    if not os.path.exists(gallery_dir):
        print(f"Directory '{gallery_dir}' not found. Please create it and add images.")
        return []
    
    files = sorted([f for f in os.listdir(gallery_dir) if f.lower().endswith(valid_extensions)], reverse=True)
    
    for i, filename in enumerate(files):
        title = filename.split('.')[0].replace('_', ' ').title()
        # Look for specific metadata for this file
        file_meta = metadata.get(filename, {})
        
        # Use relative path for the web (assuming images is served from root)
        # We strip the './' if present for cleaner URLs
        web_path = os.path.join(gallery_dir, filename)
        if web_path.startswith("./"):
            web_path = web_path[2:]
            
        thumbnails.append({
            "id": i + 1,
            "title": file_meta.get("title", title),
            "image": web_path,
            "alt": f"{title} Thumbnail",
            "link": file_meta.get("link", "https://youtube.com"),
            "views": file_meta.get("views", "N/A")
        })
    return thumbnails

def update_app_js(app_js_path, thumbnails):
    if not os.path.exists(app_js_path):
        print(f"File '{app_js_path}' not found.")
        return
    
    try:
        with open(app_js_path, 'r') as f:
            content = f.read()
        
        # Look for the Array definition
        # We assume it looks like: const projects = [ ... ];
        start_marker = "const projects = ["
        end_marker = "];"
        
        start_index = content.find(start_marker)
        if start_index == -1:
             print("Could not find 'const projects = [' in app.js")
             return

        # Find the closing bracket/semicolon after the start
        # We search from the start_index to avoid false positives earlier
        end_index = content.find(end_marker, start_index)
        
        if end_index != -1:
            new_projects_json = json.dumps(thumbnails, indent=4)
            # Reconstruct the file: 
            # Part before the list + "const projects = " + new JSON + ";\n" + Part after the list terminator
            
            # The start_marker is "const projects = ["
            # We want to replace everything from the '[' to the ']' inclusive
            
            # Find exact position of '[' within the marker
            list_start_pos = start_index + start_marker.find('[')
            
            # Use '];' as the end marker, so we replace up to the ']'
            # But the content.find(end_marker) returns the index of the first char of "];" which is ']'
            # So list_end_pos should be end_index + 1 (to include ']')
            list_end_pos = end_index + 1
            
            # Check if there is really a list there
            new_content = content[:list_start_pos] + new_projects_json + content[list_end_pos:]
            
            with open(app_js_path, 'w') as f:
                f.write(new_content)
            print(f"Successfully updated {app_js_path} with {len(thumbnails)} thumbnails.")
        else:
            print("Could not find closing '];' for projects array in app.js")
            
    except Exception as e:
        print(f"Error updating app.js: {e}")

if __name__ == "__main__":
    args = get_args()
    
    # We keep the raw args for web paths, but use absolute paths for file operations if needed
    # (Actually standard python file ops work fine with relative paths too)
    
    print(f"Scanning directory: {args.gallery_dir}")
    print(f"Target JS file: {args.app_js}")
    
    meta_path = os.path.join(args.gallery_dir, args.metadata)
    metadata = get_metadata(meta_path)
    
    thumbs = get_thumbnails(args.gallery_dir, metadata)
    
    if thumbs or len(thumbs) == 0:
        # Update even if empty to clear old data if directory is empty
        update_app_js(args.app_js, thumbs)
