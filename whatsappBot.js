const twilio = require('twilio');

// Initialize Twilio client with your credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Use the Twilio sandbox number for WhatsApp messaging
const fromWhatsAppNumber = 'whatsapp:+14155238886'; 
const toWhatsAppNumber = 'whatsapp:+972506969345';  

// Send a message using the content template
async function sendInteractiveMessage(subject, lessonDetails, dueDate) {
    try {
        const message = await client.messages.create({
            from: fromWhatsAppNumber,
            to: toWhatsAppNumber,
            contentSid: 'HX726f836f470b19b2521af8cdd430e411',  
            contentVariables: JSON.stringify({
                '1': subject,
                '2': lessonDetails,
                '3': dueDate
            })
        });

        console.log(`Message sent with SID: ${message.sid}`);
    } catch (error) {
        console.error("Error sending interactive message:", error);
    }
}

// Export the function to be used in index.js
module.exports = { sendInteractiveMessage };
