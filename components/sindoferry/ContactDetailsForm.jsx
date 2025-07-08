import React, { useState, useEffect } from 'react';
import { Mail, User, ArrowLeft } from 'lucide-react';

const ContactDetailForm = ({ initialData, onSubmit, onBack, updateFormData }) => {
  const [contact, setContact] = useState({
    fullName: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  // Pre-fill the form with initial data if it exists
  useEffect(() => {
    if (initialData) {
      setContact(initialData);
    }
  }, [initialData]);

  // General change handler for all input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newContact = { ...contact, [name]: value };
    setContact(newContact);
    
    // Also update the master form data in the parent component
    updateFormData(newContact);
  };

  // Simple email validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Form submission handler with validation
  const handleSubmit = () => {
    const newErrors = {};

    if (!contact.fullName.trim()) {
      newErrors.fullName = "Nama lengkap wajib diisi";
    }
    if (!contact.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!validateEmail(contact.email)) {
      newErrors.email = "Format email tidak valid";
    }

    setErrors(newErrors);

    // If there are no errors, call the parent's submit function
    if (Object.keys(newErrors).length === 0) {
      onSubmit(contact);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center py-2 gap-2 text-gray-700">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Detail Kontak</h1>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-4 space-y-6">
        <p className="text-sm text-gray-600">
          Pastikan nama dan email yang Anda masukkan sudah benar. E-tiket akan dikirimkan ke email ini.
        </p>

        {/* Full Name Field */}
        <div>
          <label htmlFor="fullName" className="text-sm font-semibold text-gray-800">Nama Lengkap</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Masukkan nama lengkap Anda"
              value={contact.fullName}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-gray-800">Email</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="contoh@email.com"
              value={contact.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-colors shadow-md"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
};

export default ContactDetailForm;
