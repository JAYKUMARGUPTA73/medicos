import os
import re
import pytesseract
from PIL import Image
from pathlib import Path
import spacy

# Define the directories using relative paths
normal_output_dir = Path("normal_preprocessed_data")
advanced_output_dir = Path("advanced_preprocessed_data")

def perform_ocr(image_path):
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image, config='--oem 1 --psm 6')
        return text
    except Exception as e:
        print(f"⚠️ Error in OCR {image_path}: {e}")
        return ""

normal_ocr_results = []
advanced_ocr_results = []

# Check if directories exist and perform OCR
if not normal_output_dir.exists():
    print(f"⚠️ Directory not found: {normal_output_dir}")
else:
    for img_file in os.listdir(normal_output_dir):
        img_path = normal_output_dir / img_file
        normal_ocr_results.append(perform_ocr(img_path))

if not advanced_output_dir.exists():
    print(f"⚠️ Directory not found: {advanced_output_dir}")
else:
    for img_file in os.listdir(advanced_output_dir):
        img_path = advanced_output_dir / img_file
        advanced_ocr_results.append(perform_ocr(img_path))

print(f"Normal OCR results: {len(normal_ocr_results)}")
print(f"Advanced OCR results: {len(advanced_ocr_results)}")

def compare_outputs(normal_results, advanced_results):
    final_results = []
    for normal, advanced in zip(normal_results, advanced_results):
        if len(advanced.split()) > len(normal.split()):
            final_results.append(advanced)
        else:
            final_results.append(normal)
    return final_results

final_ocr_results = compare_outputs(normal_ocr_results, advanced_ocr_results)

# Save results to file
with open("ocr_results.txt", "w") as f:
    for i, result in enumerate(final_ocr_results, 1):
        f.write(f"Image {i}:\n{result}\n{'='*50}\n")

print("OCR results saved to ocr_results.txt")

def post_process(text):
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = text.lower()
    text = ' '.join(text.split())
    return text

post_processed_results = [post_process(result) for result in final_ocr_results]

# Load spaCy model for entity classification
nlp = spacy.load("en_core_sci_sm")

def classify_entities(text):
    doc = nlp(text)
    chemicals = [ent.text for ent in doc.ents if ent.label_ == "CHEMICAL"]
    diseases = [ent.text for ent in doc.ents if ent.label_ == "DISEASE"]
    return chemicals, diseases

print("\nEntity Classification Results:")
for i, result in enumerate(post_processed_results, 1):
    chemicals, diseases = classify_entities(result)
    print(f"Image {i}:")
    print("Chemicals:", chemicals)
    print("Diseases:", diseases)
    print("-" * 50)

# Save classified entities to file
with open("classified_entities.txt", "w") as f:
    for i, result in enumerate(post_processed_results, 1):
        chemicals, diseases = classify_entities(result)
        f.write(f"Image {i}:\n")
        f.write(f"Chemicals: {', '.join(chemicals)}\n")
        f.write(f"Diseases: {', '.join(diseases)}\n")
        f.write("="*50 + "\n")

print("Classified entities saved to classified_entities.txt")
