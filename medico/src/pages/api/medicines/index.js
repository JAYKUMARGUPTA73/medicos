import { connectToDatabase } from "../dbConnect"; // Helper for MongoDB connection

export default async function handler(req, res) {
  try {
    // Establish DB connection
    const { db } = await connectToDatabase();

    // Fetch all medicines from the database
    const medicines = await db.collection("Medicines").find({}).toArray();
    console.log(medicines);

    // Return the medicines as a response
    res.status(200).json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
}
