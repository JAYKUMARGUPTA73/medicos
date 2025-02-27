"use client"
import React, { useState } from 'react';
import { Plus, Minus, Upload, Pill, DollarSign, Clock, Image as ImageIcon, BadgeCheck, FlaskConical } from 'lucide-react';
import Image from 'next/image';

const AdminMedicineForm = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    dosage: '',
    manufacturer: '',
    ingredients: [''],
    price: '',
    currency: 'USD',
    stock: '',
    prescriptionRequired: false,
    availability: {
      startDate: '',
      endDate: ''
    },
    images: []
  });

  const handleIngredientChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => i === index ? value : item)
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imagePromises);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...base64Images]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/addmedicine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add medicine');
      }

      setSuccess('Medicine added successfully!');
      // Reset form or redirect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Pill },
    { id: 'details', label: 'Medicine Details', icon: FlaskConical },
    { id: 'media', label: 'Media', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medicine Management</h1>
          <p className="text-gray-600 mt-2">Add and manage medicines in your inventory</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Basic Info Fields */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                  <input
                    placeholder="Medicine Name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    required
                  />
                  
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={formData.category}
                      onChange={e => setFormData(prev => ({...prev, category: e.target.value}))}
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Painkillers">Painkillers</option>
                      <option value="Antibiotics">Antibiotics</option>
                      <option value="Vitamins">Vitamins</option>
                      <option value="Antiviral">Antiviral</option>
                      <option value="Antifungal">Antifungal</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Respiratory">Respiratory</option>
                      <option value="Gastrointestinal">Gastrointestinal</option>
                      <option value="Neurological">Neurological</option>
                      <option value="Other">Other</option>
                    </select>
                    
                    <input
                      placeholder="Dosage (e.g., 500mg, Twice a day)"
                      value={formData.dosage}
                      onChange={e => setFormData(prev => ({...prev, dosage: e.target.value}))}
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={e => setFormData(prev => ({...prev, price: e.target.value}))}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        required
                      />
                    </div>
                    
                    <select
                      value={formData.currency}
                      onChange={e => setFormData(prev => ({...prev, currency: e.target.value}))}
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={formData.stock}
                      onChange={e => setFormData(prev => ({...prev, stock: e.target.value}))}
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="prescriptionRequired"
                      checked={formData.prescriptionRequired}
                      onChange={e => setFormData(prev => ({...prev, prescriptionRequired: e.target.checked}))}
                      className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="prescriptionRequired" className="text-sm font-medium text-gray-700">
                      Prescription Required
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border">
                  <h2 className="text-xl font-semibold mb-2">Manufacturer Information</h2>
                  <input
                    placeholder="Manufacturer Name"
                    value={formData.manufacturer}
                    onChange={e => setFormData(prev => ({...prev, manufacturer: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Ingredients</h2>
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Ingredient
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          placeholder="Ingredient name"
                          value={ingredient}
                          onChange={e => handleIngredientChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border">
                  <h2 className="text-xl font-semibold mb-2">Availability</h2>
                  <p className="text-gray-500 mb-4">Set the date range for this medicine</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.availability.startDate}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          availability: {...prev.availability, startDate: e.target.value}
                        }))}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.availability.endDate}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          availability: {...prev.availability, endDate: e.target.value}
                        }))}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="bg-white rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-2">Medicine Images</h2>
                <p className="text-gray-500 mb-4">Upload images of the medicine, packaging, etc.</p>
                
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-32 relative">
                        <Image
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="object-cover rounded-lg"
                          fill
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-teal-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Upload Images</span>
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
                onClick={() => setActiveTab(
                  activeTab === 'basic' ? 'basic' :
                  activeTab === 'details' ? 'basic' : 'details'
                )}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
              
              {activeTab === 'media' ? (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Adding Medicine...' : 'Add Medicine'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab(
                    activeTab === 'basic' ? 'details' : 'media'
                  )}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
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

export default AdminMedicineForm;