import React from 'react';

const Privacy = () => {
  return (
    <div className="container min-h-screen py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="text-gray-300">We securely collect information you provide directly to us when creating an account or making a booking. This includes your Full Name, Email Address, and WhatsApp/Phone Number. We do NOT permanently store your credit card or sensitive payment details; all transactions are routed through our secure PCI-compliant payment gateways.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p className="text-gray-300">We use the information we collect to securely manage your account, process your sporting slot payments, and send urgent booking confirmations and updates directly to your WhatsApp or Email.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Information Sharing</h2>
          <p className="text-gray-300">We do not sell, trade, or rent your personal identification information to third parties. We may share generic aggregated demographic information not linked to any personal identification information with closely trusted affiliates for analytics.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p className="text-gray-300">We implement advanced data collection, storage and processing practices, and security measures including JWT tokens and HTTPS encryption to protect against unauthorized access or destruction of your personal information, username, password, and transaction data stored on our Database.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
          <p className="text-gray-300">If you have any questions about this Privacy Policy, please contact us at vishnusuresh034@gmail.com.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
