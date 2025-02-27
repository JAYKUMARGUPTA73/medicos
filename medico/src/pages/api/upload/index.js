import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Increase request body size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { images } = req.body; // Extract images from request body

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    console.log("Received images for upload:", images.length);

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        try {
          const result = await cloudinary.uploader.upload(image, {
            folder: "prescriptions",
          });
          return result.secure_url;
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          throw new Error("Image upload failed");
        }
      })
    );

    console.log("Upload successful:", uploadedImages);

    return res.status(201).json({
      message: "Prescription uploaded successfully",
      urls: uploadedImages,
    });
  } catch (error) {
    console.error("Error uploading prescription:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
