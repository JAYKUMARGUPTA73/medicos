import os
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image, ImageFilter
from pathlib import Path

def normal_preprocess_image(image_path):
    try:
        image = Image.open(image_path).convert('L')
        image = image.filter(ImageFilter.MedianFilter(size=3))
        image_array = np.array(image)
        normalized_image = image_array / 255.0
        binary_image = (normalized_image > 0.5).astype(np.float32)
        return binary_image
    except Exception as e:
        print(f"⚠️ Error loading {image_path}: {e}")
        return None

dataset_dir = Path("data")
normal_output_dir = Path("normal_preprocessed_data")
normal_output_dir.mkdir(exist_ok=True)

if not dataset_dir.exists():
    print(f"⚠️ Dataset directory '{dataset_dir}' does not exist. Please create the directory and add images.")
else:
    image_files = [f for f in os.listdir(dataset_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
    for i, img_file in enumerate(image_files):
        img_path = dataset_dir / img_file
        preprocessed_img = normal_preprocess_image(img_path)
        if preprocessed_img is not None:
            output_filename = f"normal_preprocessed_{i+1}.png"
            output_path = normal_output_dir / output_filename
            plt.imsave(output_path, preprocessed_img, cmap='gray')
            print(f"Saved normal preprocessed image to {output_path}")
    print(f"✅ Normal preprocessing completed and saved in {normal_output_dir}")
