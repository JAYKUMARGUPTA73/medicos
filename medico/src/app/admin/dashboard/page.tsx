"use client";
import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Upload,
  Stethoscope,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Hospital
} from 'lucide-react';
import Image from 'next/image';

interface Activity {
  name: string;
  time: string;
  additionalDetails: string;
}

interface Day {
  day: number;
  title: string;
  description: string;
  facility: string;
  activities: Activity[];
}

interface FormData {
  name: string;
  description: string;
  price: string;
  currency: string;
  duration: string;
  itinerary: Day[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  availability: {
    startDate: string;
    endDate: string;
  };
  images: string[];
}

const AdminMedicoPackage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'media'>('basic');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    duration: '',
    itinerary: [
      {
        day: 1,
        title: '',
        description: '',
        facility: '',
        activities: [
          {
            name: '',
            time: '',
            additionalDetails: ''
          }
        ]
      }
    ],
    highlights: [''],
    inclusions: [''],
    exclusions: [''],
    availability: {
      startDate: '',
      endDate: ''
    },
    images: []
  });

  const handleDayChange = (dayIndex: number, field: keyof Day, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  const handleActivityChange = (dayIndex: number, activityIndex: number, field: keyof Activity, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: day.activities.map((activity, actIdx) =>
                actIdx === activityIndex ? { ...activity, [field]: value } : activity
              )
            }
          : day
      )
    }));
  };

  const addDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: '',
          description: '',
          facility: '',
          activities: [
            {
              name: '',
              time: '',
              additionalDetails: ''
            }
          ]
        }
      ]
    }));
  };

  const addActivity = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: [
                ...day.activities,
                {
                  name: '',
                  time: '',
                  additionalDetails: ''
                }
              ]
            }
          : day
      )
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: day.activities.filter((_, actIdx) => actIdx !== activityIndex)
            }
          : day
      )
    }));
  };

  const removeDay = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, idx) => idx !== dayIndex)
        .map((day, idx) => ({ ...day, day: idx + 1 }))
    }));
  };

  const handleArrayChange = (field: 'highlights' | 'inclusions' | 'exclusions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imagePromises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imagePromises);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...base64Images]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/addmedicopackage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add medico package');
      }

      setSuccess('Medico package added successfully!');
      // Optionally, reset the form after a successful submission.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Stethoscope },
    { id: 'details', label: 'Package Details', icon: Clock },
    { id: 'media', label: 'Media', icon: ImageIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medico Package Management</h1>
          <p className="text-gray-600 mt-2">Create and manage medico packages for your patients</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'basic' | 'details' | 'media')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
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
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                  <input
                    placeholder="Package Name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={e =>
                          setFormData(prev => ({ ...prev, price: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                    <select
                      value={formData.currency}
                      onChange={e => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input
                      placeholder="Duration (e.g., 7 days)"
                      value={formData.duration}
                      onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Treatment Plan</h2>
                    <button
                      type="button"
                      onClick={addDay}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Day
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.itinerary.map((day, dayIndex) => (
                      <div key={dayIndex} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Day {day.day}</h3>
                          <button
                            type="button"
                            onClick={() => removeDay(dayIndex)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            placeholder="Day Title"
                            value={day.title}
                            onChange={e => handleDayChange(dayIndex, 'title', e.target.value)}
                            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                          />
                          <div className="relative">
                            <Hospital className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              placeholder="Medical Facility"
                              value={day.facility}
                              onChange={e => handleDayChange(dayIndex, 'facility', e.target.value)}
                              className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                        <textarea
                          placeholder="Day Description"
                          value={day.description}
                          onChange={e => handleDayChange(dayIndex, 'description', e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Procedures/Treatments</h4>
                            <button
                              type="button"
                              onClick={() => addActivity(dayIndex)}
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Procedure
                            </button>
                          </div>
                          {day.activities.map((activity, activityIndex) => (
                            <div
                              key={activityIndex}
                              className="grid grid-cols-2 gap-4 border-l-2 border-blue-500 pl-4"
                            >
                              <div className="space-y-2">
                                <input
                                  placeholder="Procedure Name"
                                  value={activity.name}
                                  onChange={e =>
                                    handleActivityChange(dayIndex, activityIndex, 'name', e.target.value)
                                  }
                                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                  required
                                />
                                <input
                                  placeholder="Time (e.g., 10:00 AM)"
                                  value={activity.time}
                                  onChange={e =>
                                    handleActivityChange(dayIndex, activityIndex, 'time', e.target.value)
                                  }
                                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <input
                                  placeholder="Notes/Additional Details"
                                  value={activity.additionalDetails}
                                  onChange={e =>
                                    handleActivityChange(dayIndex, activityIndex, 'additionalDetails', e.target.value)
                                  }
                                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => removeActivity(dayIndex, activityIndex)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Package Details</h2>
                <div className="space-y-4">
                  <input
                    placeholder="Highlight (e.g., 24/7 Support)"
                    value={formData.highlights[0]}
                    onChange={e => handleArrayChange('highlights', 0, e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('highlights')}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Highlight
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    placeholder="Inclusion (e.g., Consultation Fee)"
                    value={formData.inclusions[0]}
                    onChange={e => handleArrayChange('inclusions', 0, e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('inclusions')}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Inclusion
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    placeholder="Exclusion (e.g., Lab Charges)"
                    value={formData.exclusions[0]}
                    onChange={e => handleArrayChange('exclusions', 0, e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('exclusions')}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Exclusion
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={formData.availability.startDate}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        availability: { ...prev.availability, startDate: e.target.value }
                      }))
                    }
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="date"
                    value={formData.availability.endDate}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        availability: { ...prev.availability, endDate: e.target.value }
                      }))
                    }
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Upload Media</h2>
                <div>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative h-32 w-full">
                      <Image src={img} alt={`Uploaded ${idx}`} layout="fill" objectFit="cover" className="rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Package'}
              </button>
              {error && <p className="mt-2 text-red-500">{error}</p>}
              {success && <p className="mt-2 text-green-500">{success}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicoPackage;
