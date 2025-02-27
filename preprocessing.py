import os
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image, ImageFilter
from pathlib import Path

# Construct a relative path to the "data" folder using pathlib
dataset_dir = Path("data")  # Relative path to the "data" folder

# Resolve the absolute path of the dataset directory (optional)
absolute_path = dataset_dir.resolve()

# Check if the dataset directory exists
if not dataset_dir.exists():
    print(f"⚠️ Dataset directory '{absolute_path}' does not exist. Please check the path.")
    exit()
else:
    print(f"✅ Dataset directory resolved to: {absolute_path}")

# Get all image file names in the dataset directory
image_files = [f for f in os.listdir(dataset_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]

# Function to preprocess images with additional steps
def preprocess_image(image_path):
    try:
        # Load the image
        image = Image.open(image_path).convert('L')  # Convert to grayscale
        
        # Apply noise reduction (optional)
        image = image.filter(ImageFilter.MedianFilter(size=3))
        
        # Normalize pixel values (0 to 1)
        image_array = np.array(image)  # Convert to NumPy array
        normalized_image = image_array / 255.0
        
        # Binarize the image (thresholding)
        threshold = 0.5  # You can adjust this value based on your dataset
        binary_image = (normalized_image > threshold).astype(np.float32)
        
        return binary_image
    except Exception as e:
        print(f"⚠️ Error loading {image_path}: {e}")
        return None

# Apply preprocessing to all images
preprocessed_images = [
    preprocess_image(os.path.join(dataset_dir, img)) for img in image_files
]

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
