"use client";
import React, { useState, useEffect } from "react";
import { Search, Heart, Clock, ShoppingCart, Pill, ArrowRight, Award, Star, PhoneCall } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Medicine {
  _id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  dosage: string;
  images: string[];
  likes: number;
}

const dummyMedicines: Medicine[] = [
  {
    _id: 1,
    name: "Paracetamol",
    description: "Pain reliever and fever reducer.",
    price: 5.99,
    category: "Pain Relief",
    dosage: "500mg",
    images: ["p.jpeg"],
    likes: 120,
  },
  {
    _id: 2,
    name: "Aspirin",
    description: "Used to reduce pain, fever, or inflammation.",
    price: 7.49,
    category: "Pain Relief",
    dosage: "325mg",
    images: ["as.jpeg"],
    likes: 95,
  },
  {
    _id: 3,
    name: "Amoxicillin",
    description: "Antibiotic used to treat bacterial infections.",
    price: 12.99,
    category: "Antibiotic",
    dosage: "250mg",
    images: ["amoxilin.jpeg"],
    likes: 110,
  },
];

const MedicalStore = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [medicines, setMedicines] = useState<Medicine[]>(dummyMedicines);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("popularity");

  // Fetch medicines from API (disabled for now)
  // useEffect(() => {
  //   const fetchMedicines = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("/api/medicines");
  //       if (!response.ok) throw new Error("Failed to fetch medicines");
  //       const data = await response.json();
  //       setMedicines(data.length > 0 ? data : dummyMedicines);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "An error occurred");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchMedicines();
  // }, []);

  const filterMedicines = (medicines: Medicine[]) => {
    return medicines.filter((med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const featuredMedicines = filterMedicines(medicines).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Featured Medicines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredMedicines.map((med) => (
          <div key={med._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <img src={med.images[0]} alt={med.name} className="w-full h-48 object-cover" />
              <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full">
                <Heart className="h-5 w-5 text-red-500" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{med.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{med.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold text-xl">${med.price.toFixed(2)}</span>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalStore;
