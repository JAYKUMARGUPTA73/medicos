import os
import cv2
import numpy as np
from pathlib import Path

# Define input and output directories
dataset_dir = Path("data")
advanced_output_dir = Path("advanced_preprocessed_data")
advanced_output_dir.mkdir(exist_ok=True)

# Check if the dataset directory exists
if not dataset_dir.exists():
    print(f"⚠️ Dataset directory '{dataset_dir.resolve()}' does not exist. Please check the path.")
    exit()
else:
    print(f"✅ Dataset directory resolved to: {dataset_dir.resolve()}")

# Get all image file names in the dataset directory
image_files = [f for f in os.listdir(dataset_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

def compute_skew(image):
    edges = cv2.Canny(image, 150, 200, 3, 5)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=100, maxLineGap=5)
    if lines is None:
        return 0
    angles = []
    for line in lines:
        x1, y1, x2, y2 = line[0]
        angles.append(np.arctan2(y2 - y1, x2 - x1))
    return np.median(angles) * 180 / np.pi

def advanced_preprocess_image(image, apply_deskew=True):
    try:
        # Apply adaptive thresholding
        binary = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(binary, None, 10, 7, 21)
        
        if apply_deskew:
            # Compute skew angle
            angle = compute_skew(denoised)
            
            # Only rotate if the angle is significant
            if abs(angle) > 1:
                (h, w) = denoised.shape[:2]
                center = (w // 2, h // 2)
                M = cv2.getRotationMatrix2D(center, angle, 1.0)
                rotated = cv2.warpAffine(denoised, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
            else:
                rotated = denoised
        else:
            rotated = denoised
        
        return rotated
    except Exception as e:
        print(f"⚠️ Error in advanced preprocessing: {e}")
        return None

# Apply advanced preprocessing to all images
for i, img_file in enumerate(image_files):
    img_path = dataset_dir / img_file
    print(f"Processing image: {img_path}")
    
    image = cv2.imread(str(img_path), cv2.IMREAD_GRAYSCALE)
    if image is None:
        print(f"⚠️ Failed to load image: {img_path}")
        continue
    
    advanced_preprocessed_img = advanced_preprocess_image(image, apply_deskew=True)

    if advanced_preprocessed_img is not None:
        output_filename = f"advanced_preprocessed_{i+1}.png"
        output_path = advanced_output_dir / output_filename
        cv2.imwrite(str(output_path), advanced_preprocessed_img)
        print(f"Saved advanced preprocessed image to {output_path}")
    else:
        print(f"⚠️ Failed to preprocess image: {img_path}")

print(f"✅ Advanced preprocessing completed and saved in {advanced_output_dir}")
