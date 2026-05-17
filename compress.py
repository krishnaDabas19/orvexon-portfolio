import os
from PIL import Image

assets_dir = r"c:\Users\krish\OneDrive\Documents\Orvexon Studio\assets"

def compress_images():
    for root, dirs, files in os.walk(assets_dir):
        for file in files:
            path = os.path.join(root, file)
            ext = file.lower().split('.')[-1]
            if ext in ['png', 'jpg', 'jpeg']:
                size_mb = os.path.getsize(path) / (1024 * 1024)
                if size_mb > 1.0: # If larger than 1 MB
                    print(f"Compressing {file} ({size_mb:.2f} MB)...")
                    try:
                        with Image.open(path) as img:
                            # Resize if huge
                            max_dim = 1600
                            if max(img.width, img.height) > max_dim:
                                ratio = max_dim / max(img.width, img.height)
                                new_size = (int(img.width * ratio), int(img.height * ratio))
                                img = img.resize(new_size, Image.Resampling.LANCZOS)
                            
                            if ext == 'png':
                                img.save(path, optimize=True)
                            else:
                                img.save(path, optimize=True, quality=80)
                        
                        new_size_mb = os.path.getsize(path) / (1024 * 1024)
                        print(f" -> Done: {new_size_mb:.2f} MB")
                    except Exception as e:
                        print(f"Failed to compress {file}: {e}")

if __name__ == "__main__":
    compress_images()
