import React from 'react';

const Terms = () => {
  return (
    <div className="container min-h-screen py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Terms and Conditions</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
          <p className="text-gray-300">Welcome to TURF-X. By booking a turf slot through our application, you agree to these Terms and Conditions. These terms apply to all visitors, users, and others who access or use our Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Booking and Payments</h2>
          <p className="text-gray-300">All bookings are subject to availability. Payments are processed securely via our trusted payment gateways. By booking, you confirm that you are authorized to use the respective payment method.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. User Conduct</h2>
          <p className="text-gray-300">Customers are expected to maintain sportsmanship and respect facility property while using the booked turf. Any physical damage to the turf or equipment may result in additional charges.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Changes to Service</h2>
          <p className="text-gray-300">We reserve the right to modify, suspend, or discontinue the Service (or any part or content thereof) at any time with or without notice to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Contact Information</h2>
          <p className="text-gray-300">Questions about the Terms of Service should be sent to us at vishnusuresh034@gmail.com.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
