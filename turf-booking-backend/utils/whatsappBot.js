const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
});

let isClientReady = false;

client.on('qr', (qr) => {
  console.log('\n======================================================');
  console.log('📱 WHATSAPP BOT LOGIN REQUIRED!');
  console.log('Please open WhatsApp on your phone -> Linked Devices -> Scan QR Code');
  console.log('======================================================\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WHATSAPP BOT IS READY AND CONNECTED!');
  isClientReady = true;
});

client.on('disconnected', (reason) => {
  console.log('❌ WHATSAPP BOT DISCONNECTED:', reason);
  isClientReady = false;
});

// Initialize the bot connection safely so Render doesn't crash if Chromium is missing
try {
  console.log('Attempting to initialize WhatsApp Puppeteer engine...');
  client.initialize().catch(err => {
    console.error('❌ WhatsApp Bot failed to initialize natively in this cloud environment.');
    console.error('Render Free Tier requires Docker for Chromium dependencies. The rest of the server will continue normally.');
  });
} catch (error) {
  console.error('❌ WhatsApp Bot failed to start:', error);
}

/**
 * Send a WhatsApp Message
 * @param {string} phoneNumber - Indian phone number (e.g. "9876543210")
 * @param {string} message - Text message to send
 */
const sendWhatsAppMessage = async (phoneNumber, message) => {
  if (!isClientReady) {
    console.error('Cannot send message: WhatsApp client is not ready yet! Ensure you scanned the QR code in the terminal.');
    return { success: false, message: 'Bot not ready' };
  }

  try {
    // Format the number strictly for WhatsApp API (Country Code 91 for India)
    // Ensures the number starts with 91 and ends with @c.us
    let formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    // Auto-append Indian country code if missing (Length 10 means missing 91)
    if (formattedNumber.length === 10) {
      formattedNumber = `91${formattedNumber}`;
    }

    const chatId = `${formattedNumber}@c.us`;
    
    await client.sendMessage(chatId, message);
    console.log(`✅ WhatsApp message successfully sent to ${phoneNumber}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp message to ${phoneNumber}:`, error.message);
    return { success: false, message: error.message };
  }
};

module.exports = { sendWhatsAppMessage };
