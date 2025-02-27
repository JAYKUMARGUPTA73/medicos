import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js default body parsing (Required for file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("API called with method:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the incoming form data using formidable
    const form = new formidable.IncomingForm();
    form.keepExtensions = true; // Keep file extensions

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Error processing form data" });
      }

      // Get the uploaded file
      const file = files.prescription?.filepath;

      if (!file) {
        console.log("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("Uploading to Cloudinary...");
      const result = await cloudinary.uploader.upload(file, {
        folder: "prescriptions",
      });

      console.log("Upload successful:", result.secure_url);

      return res.status(201).json({
        message: "Prescription uploaded successfully",
        url: result.secure_url,
      });
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
