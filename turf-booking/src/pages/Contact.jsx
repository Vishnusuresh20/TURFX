import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="container min-h-screen py-10 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient">Contact Us</h1>
        <p className="text-center text-gray-300 mb-10">Have questions about your booking? Experiencing issues with the turf? Reach out to our dedicated support team directly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="card p-6 border border-[rgba(255,255,255,0.05)] bg-[#1a1f2c] rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Our Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="text-[#00df82] mr-4 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-medium text-gray-200">Address</h3>
                  <p className="text-gray-400 mt-1">Near Logan's Road,<br />Thalassery, Kerala<br />670101, India</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="text-[#00df82] mr-4 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-medium text-gray-200">Phone & WhatsApp</h3>
                  <p className="text-gray-400 mt-1">+91 81379 41259</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-[#00df82] mr-4 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-medium text-gray-200">Email</h3>
                  <p className="text-gray-400 mt-1">vishnusuresh034@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="card p-6 border border-[rgba(255,255,255,0.05)] bg-[#1a1f2c] rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Business Hours</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-300">Monday - Friday</span>
                <span className="text-[#00df82] font-medium">6:00 AM - 2:00 AM</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-300">Saturday</span>
                <span className="text-[#00df82] font-medium">6:00 AM - 2:00 AM</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-300">Sunday</span>
                <span className="text-[#00df82] font-medium">6:00 AM - 2:00 AM</span>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">* Customer support standard response time is within 2-4 hours during typical business hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
