const twilio = require('twilio');

// Initialize Twilio client with your credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Replace with your actual Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Replace with your actual Auth Token
const client = new twilio(accountSid, authToken);

// Use the Twilio sandbox number for WhatsApp messaging
const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Twilio sandbox number
const toWhatsAppNumber = 'whatsapp:+972506969345';  // Recipient's WhatsApp number

// Send a message using the content template
async function sendInteractiveMessage(subject, lessonDetails, dueDate) {
    try {
        const message = await client.messages.create({
            from: fromWhatsAppNumber,
            to: toWhatsAppNumber,
            contentSid: 'HX726f836f470b19b2521af8cdd430e411',  // Your content template SID
            statusCallback: 'https://6fd0-87-71-184-20.ngrok-free.app/incoming-message',
            contentVariables: JSON.stringify({
                '1': subject,         // Corresponds to {{1}} in your template
                '2': lessonDetails,   // Corresponds to {{2}} in your template
                '3': dueDate          // Corresponds to {{3}} in your template
            })
        });

        console.log(`Message sent with SID: ${message.sid}`);
    } catch (error) {
        console.error("Error sending interactive message:", error);
    }
}

// Export the function to be used in index.js
module.exports = { sendInteractiveMessage };
