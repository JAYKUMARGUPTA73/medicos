"use client";
import React, { useState } from "react";
import {
  Plus,
  Minus,
  Upload,
  Stethoscope,
  DollarSign,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface FormData {
  medicineName: string;
  description: string;
  price: string;
  currency: string;
  quantity: string;
  batchNumber: string;
  manufacturer: string;
  expirationDate: string;
  images: string[];
}

const AdminMedicalStockUpdate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "media">(
    "basic"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    medicineName: "",
    description: "",
    price: "",
    currency: "USD",
    quantity: "",
    batchNumber: "",
    manufacturer: "",
    expirationDate: "",
    images: [],
  });

  // Handlers for basic information changes
  const handleBasicChange = (
    field: keyof Pick<FormData, "medicineName" | "description">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for stock details changes
  const handleDetailsChange = (
    field: keyof Omit<FormData, "medicineName" | "description" | "images">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image file uploads and conversion to base64
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const imagePromises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        })
    );

    try {
      const base64Images = await Promise.all(imagePromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/updatemedicalstock", {
        method: "POST", // or PUT based on your API implementation
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update medical stock");
      }

      setSuccess("Medical stock updated successfully!");
      // Optionally, reset the form here if needed.
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Stethoscope },
    { id: "details", label: "Stock Details", icon: DollarSign },
    { id: "media", label: "Images", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Medical Stock Update
          </h1>
          <p className="text-gray-600 mt-2">
            Update information of your medical stocks
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "basic" | "details" | "media")
                }
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {activeTab === "basic" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={formData.medicineName}
                  onChange={(e) =>
                    handleBasicChange("medicineName", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    handleBasicChange("description", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]"
                  required
                />
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Stock Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) =>
                        handleDetailsChange("price", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      handleDetailsChange("currency", e.target.value)
                    }
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleDetailsChange("quantity", e.target.value)
                    }
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Batch Number"
                    value={formData.batchNumber}
                    onChange={(e) =>
                      handleDetailsChange("batchNumber", e.target.value)
                    }
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      handleDetailsChange("manufacturer", e.target.value)
                    }
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      placeholder="Expiration Date"
                      value={formData.expirationDate}
                      onChange={(e) =>
                        handleDetailsChange("expirationDate", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Manage Images</h2>
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative h-32 w-full">
                      <Image
                        src={img}
                        alt={`Uploaded ${idx}`}
                        fill
                        objectFit="cover"
                        className="rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 transition-opacity opacity-0 hover:opacity-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">
                      Upload Images
                    </span>
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-500 p-4 rounded-md">
                {success}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    activeTab === "basic"
                      ? "basic"
                      : activeTab === "details"
                      ? "basic"
                      : "details"
                  )
                }
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
              {activeTab === "media" ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Stock"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      activeTab === "basic" ? "details" : "media"
                    )
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicalStockUpdate;
