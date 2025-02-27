"use client";
import React, { useState } from "react";
import { Upload, CheckCircle, AlertTriangle, Image as ImageIcon, Loader, FileText, ClipboardList, ShoppingCart, Activity } from "lucide-react";
import Image from "next/image";

const UploadPrescription = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>("Uploading...");
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Analyzing prescription", "Extracting medication details", "Generating patient report", "Adding medicines to cart"];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imagePromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imagePromises);
    setSelectedImages((prev) => [...prev, ...base64Images]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedImages.length === 0) {
      setError("Please upload at least one prescription image");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(false);
    setCurrentStep(0);
    setUploadMessage(steps[0]);

    try {
      // Simulate Step 1: Analyzing prescription
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(1);
      setUploadMessage(steps[1]);
      
      // Simulate Step 2: Extracting medication details
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(2);
      setUploadMessage(steps[2]);
      
      // Simulate Step 3: Generating patient report
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(3);
      setUploadMessage(steps[3]);
      
      // Simulate Step 4: Adding medicines to cart
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: selectedImages }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload prescription");

      setUploadSuccess(true);
      setUploadMessage("Your medicines have been added to cart!");
      setSelectedImages([]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  const getStepIcon = (index: number) => {
    const icons = [
      <Activity key="analyze" className="h-6 w-6" />,
      <FileText key="extract" className="h-6 w-6" />,
      <ClipboardList key="report" className="h-6 w-6" />,
      <ShoppingCart key="cart" className="h-6 w-6" />
    ];
    return icons[index];
  };

  return (
    <div className="max-w-7xl mx-auto mt-2 bg-gradient-to-b from-white to-blue-50  shadow-xl border border-blue-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mt-2">Upload Prescription</h1>
        <p className="text-gray-600">
          We'll analyze your prescription, extract medications, and prepare your order
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 border-l-4 border-red-500 rounded-md flex items-center space-x-3 shadow-sm">
          <AlertTriangle className="h-6 w-6" />
          <span className="font-medium">{error}</span>
        </div>
      )}

     

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Image Upload Section */}
        <div className="p-8 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg text-center hover:border-blue-500 transition-all duration-300 transform hover:scale-[1.01]">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="h-10 w-10 text-blue-500" />
          </div>
          <p className="text-gray-600 font-medium">Drag & Drop your prescription images here</p>
          <p className="text-gray-500 text-sm mb-4">We accept JPG, PNG and PDF files</p>
          <label className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full cursor-pointer hover:from-blue-600 hover:to-blue-700 transition shadow-md">
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            Upload Files
          </label>
        </div>

        {/* Image Preview */}
        {selectedImages.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Uploaded Prescriptions ({selectedImages.length})</h3>
            <div className="grid grid-cols-3 gap-4">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg shadow-md border border-gray-200">
                  <div className="w-full h-36 relative">
                    <Image src={img} alt={`Preview ${index + 1}`} className="object-cover" fill />
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    aria-label="Remove image"
                  >
                    ✖
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-1 px-2">
                    <p className="text-xs text-gray-600 truncate">Prescription {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Steps */}
        {uploading && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
              <Loader className="animate-spin h-5 w-5 mr-2 text-blue-500" />
              Processing Your Prescription
            </h3>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className={`flex items-center space-x-3 ${currentStep >= index ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep > index 
                      ? 'bg-blue-100 border-blue-500' 
                      : currentStep === index 
                        ? 'bg-blue-500 border-blue-500 animate-pulse' 
                        : 'bg-gray-100 border-gray-300'
                  }`}>
                    {currentStep > index ? (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    ) : (
                      <span className={currentStep === index ? 'text-white' : 'text-gray-500'}>
                        {getStepIcon(index)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${currentStep >= index ? 'text-gray-800' : 'text-gray-400'}`}>{step}</p>
                    {currentStep === index && (
                      <div className="h-1 w-full mt-1 bg-gray-200 rounded overflow-hidden">
                        <div className="h-full bg-blue-500 rounded animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Additional Information */}
      <div className="mt-10 p-6 bg-white rounded-lg shadow-sm border border-blue-100">
        <h3 className="text-lg font-medium text-gray-800 mb-3">How It Works</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Upload Prescription</p>
          </div>
          <div className="p-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">AI Analysis</p>
          </div>
          <div className="p-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ClipboardList className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Report Generation</p>
          </div>
          <div className="p-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShoppingCart className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Auto-Cart Adding</p>
          </div>
        </div>
      </div>

      {uploadSuccess && (
        <div className="mt-4 p-4 bg-green-50 text-green-600 border-l-4 border-green-500 rounded-md flex items-center space-x-3 shadow-sm">
          <CheckCircle className="h-6 w-6" />
          <div>
            <p className="font-medium">Success! Your prescription has been processed.</p>
            <p className="text-sm text-green-500">Your medications have been added to cart and are ready for checkout.</p>
          </div>
        </div>
      )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg disabled:opacity-60 transform hover:scale-[1.01] active:scale-[0.99]"
          disabled={uploading || selectedImages.length === 0}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin h-5 w-5 mr-2" />
              {uploadMessage}
            </span>
          ) : (
            "Process Prescription & Add to Cart"
          )}
        </button>
      </form>

      

      {/* Help Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Need help? Contact our healthcare support team at{" "}
          <a href="mailto:support@medicos.com" className="text-blue-600 hover:underline font-medium">
            support@medicos.com
          </a>{" "}
          or call{" "}
          <a href="tel:+18001234567" className="text-blue-600 hover:underline font-medium">
            1-800-123-4567
          </a>
        </p>
      </div>
    </div>
  );
};

export default UploadPrescription;