"use client";
import React from "react";
import {
  Stethoscope,
  ClipboardList,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  FileText,
  Clock,
  HeartPulse,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    "Prescription OCR",
    "Medicine Orders",
    "Lab Reports Analysis",
    "Doctor Consultation",
    "Health Insights",
  ];

  const quickLinks = [
    "Upload Prescription",
    "Track Orders",
    "FAQs",
    "Health Blog",
    "Terms & Conditions",
  ];

  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-500 text-white mt-8">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <HeartPulse className="h-6 w-6 text-red-400" />
              <span className="text-2xl font-bold">MediScan</span>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering healthcare with AI-driven prescription processing and
              seamless online medicine orders.
            </p>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ClipboardList className="h-4 w-4" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <p className="flex items-start gap-3 text-gray-300">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+1 (800) 555-6789</span>
              </p>
              <p className="flex items-center gap-3 text-gray-300">
                <Mail className="h-5 w-5" />
                <span>support@mediscan.com</span>
              </p>
              <p className="flex items-center gap-3 text-gray-300">
                <Clock className="h-5 w-5" />
                <span>24/7 Customer Support</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} MediScan. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
