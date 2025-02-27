import mongoose from "mongoose";

// Define the medicineSchema for the medicine model
const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Medicine name (e.g., Paracetamol)
    },
    description: {
      type: String,
      required: true, // Description of the medicine (e.g., Pain relief, fever reducer)
    },
    category: {
      type: String, // Medicine category (e.g., Painkillers, Antibiotics, Vitamins)
      required: true,
    },
    dosage: {
      type: String, // Recommended dosage (e.g., "500mg", "Twice a day")
    },
    manufacturer: {
      type: String, // Manufacturer name (e.g., Pfizer, Cipla)
    },
    ingredients: {
      type: [String], // List of active ingredients
    },
    price: {
      type: Number, // Cost of the medicine
      required: true,
    },
    currency: {
      type: String, // Currency for the price, e.g., 'USD', 'INR'
      default: "USD",
    },
    stock: {
      type: Number, // Number of units available
      required: true,
    },
    prescriptionRequired: {
      type: Boolean, // Indicates if a prescription is needed
      default: false,
    },
    likes: {
      type: [String], // Array of user IDs who liked the medicine
      default: [],
    },
    comments: [
      {
        userId: {
          type: String, // ID of the user commenting
          required: true,
        },
        username: {
          type: String, // Display name of the user
          required: true,
        },
        comment: {
          type: String, // Text of the comment
        },
        createdAt: {
          type: Date, // Timestamp for the comment
          default: Date.now,
        },
      },
    ],
    availability: {
      startDate: {
        type: Date, // When the medicine becomes available
      },
      endDate: {
        type: Date, // When the stock expires or is removed
      },
    },
    images: {
      type: [String], // URLs of medicine images
    },
    reviews: [
      {
        userId: {
          type: String, // ID of the user reviewing
          required: true,
        },
        username: {
          type: String, // Display name of the user
          required: true,
        },
        rating: {
          type: Number, // Rating out of 5
          min: 1,
          max: 5,
        },
        review: {
          type: String, // Review text
        },
        createdAt: {
          type: Date, // Timestamp for the review
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Ensure the model is initialized only once
const Medicine =
  mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);

export default Medicine;
