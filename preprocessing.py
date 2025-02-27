import os
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

# Dataset directory
dataset_dir = r"C:\ongoing_works\hackshetra\data"  # Update with your path

# Get all image file names
image_files = [f for f in os.listdir(dataset_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]

# Function to preprocess without resizing
def preprocess_image(image_path):
    try:
        image = Image.open(image_path).convert('L')  # Convert to grayscale
        image_array = np.array(image)  # Convert to NumPy array
        normalized_image = image_array / 255.0  # Normalize pixels (0 to 1)
        return normalized_image
    except Exception as e:
        print(f"⚠️ Error loading {image_path}: {e}")
        return None

# Apply preprocessing to all images
preprocessed_images = [preprocess_image(os.path.join(dataset_dir, img)) for img in image_files]

# Remove any failed loads (None values)
preprocessed_images = [img for img in preprocessed_images if img is not None]

# Display a few preprocessed images
for i, img in enumerate(preprocessed_images[:5]):  # Show only the first 5 images
    plt.figure(figsize=(4, 4))
    plt.imshow(img, cmap='gray')
    plt.title(f'Preprocessed Image {i+1}')
    plt.axis('off')
    plt.show()

print(f"✅ Successfully processed {len(preprocessed_images)} images.")
