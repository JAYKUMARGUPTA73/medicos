"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Heart,
  Clock,
  ShoppingCart,
  Pill,
  ArrowRight,
  Award,
  Star,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
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
    images: ["/p.jpeg"],
    likes: 120,
  },
  {
    _id: 2,
    name: "Aspirin",
    description: "Used to reduce pain, fever, or inflammation.",
    price: 7.49,
    category: "Pain Relief",
    dosage: "325mg",
    images: ["/as.jpeg"],
    likes: 95,
  },
  {
    _id: 3,
    name: "Amoxicillin",
    description: "Antibiotic used to treat bacterial infections.",
    price: 12.99,
    category: "Antibiotic",
    dosage: "250mg",
    images: ["/amoxilin.jpeg"],
    likes: 110,
  },
];

const MedicalStoreLandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [medicines, setMedicines] = useState<Medicine[]>(dummyMedicines);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("popularity");

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/medicines");
        if (!response.ok) throw new Error("Failed to fetch medicines");
        const data = await response.json();
        setMedicines(data.length > 0 ? data : dummyMedicines);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const filterMedicines = (medicines: Medicine[]) => {
    return medicines.filter((med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const featuredMedicines = filterMedicines(medicines);

  return (
    <div className="font-sans">
     

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-blue-800 mb-8">
            Your Health, Our Priority
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Find the medicines you need, delivered right to your doorstep.
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search for medicines..."
              className="w-full md:w-1/2 px-4 py-3 rounded-l-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700">
              <Search className="inline-block mr-2" size={20} />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Medicines Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Featured Medicines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMedicines.map((med) => (
              <div key={med._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src={med.images[0]}
                    alt={med.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full">
                    <Heart className="h-5 w-5 text-red-500" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{med.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{med.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold text-xl">${med.price}</span>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Pill className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Wide Range of Medicines
              </h3>
              <p className="text-gray-600">
                We stock a comprehensive selection of prescription and over-the-counter medicines.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Clock className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                24/7 Online Support
              </h3>
              <p className="text-gray-600">
                Our online support team is available around the clock to assist you with your needs.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <ShoppingCart className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Fast & Reliable Delivery
              </h3>
              <p className="text-gray-600">
                We offer fast and reliable delivery services to ensure you get your medicines on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <p className="text-gray-700 mt-4">
                "Great service and fast delivery! I highly recommend this online medical store."
              </p>
              <p className="text-gray-600 mt-2">- John Doe</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              <p className="text-gray-700 mt-4">
                "Excellent customer support and a wide range of products. I'm very satisfied!"
              </p>
              <p className="text-gray-600 mt-2">- Jane Smith</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalStoreLandingPage;
