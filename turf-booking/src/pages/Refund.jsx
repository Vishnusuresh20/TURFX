import React from 'react';

const Refund = () => {
  return (
    <div className="container min-h-screen py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Cancellation & Refund Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Cancellation by User</h2>
          <p className="text-gray-300">You may cancel your turf booking up to 24 hours before your scheduled slot. Cancellations made prior to 24 hours are eligible for a full refund. Cancellations made within 24 hours of the slot time are strictly non-refundable.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Cancellation by TURF-X</h2>
          <p className="text-gray-300">In the rare event of extreme weather conditions, maintenance issues, or unforeseen circumstances, TURF-X reserves the right to cancel your booking. In such scenarios, a 100% full refund will be initiated immediately to your original payment source.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Refund Processing Time</h2>
          <p className="text-gray-300">Approved refunds are processed back to the original method of payment. Please allow 5-7 business days for the amount to reflect in your bank account or credit card statement as per standard Indian banking cycles.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. No-Show Policy</h2>
          <p className="text-gray-300">If you fail to arrive at the facility for your scheduled slot without prior cancellation, you will be considered a "No-Show". No-shows are entirely non-refundable and the slot will be forfeited.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Contact for Refunds</h2>
          <p className="text-gray-300">If you believe you are entitled to a refund or have a dispute regarding a cancellation, please email your official booking receipt and details to vishnusuresh034@gmail.com.</p>
        </section>
      </div>
    </div>
  );
};

export default Refund;
