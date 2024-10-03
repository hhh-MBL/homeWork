const twilio = require('twilio');

// Function to send interactive WhatsApp message using Twilio API
async function sendInteractiveMessage(client, contentSid, phoneNumber, subject, lessonDetails, dueDate) {
    try {
        const message = await client.messages.create({
            from: 'whatsapp:+14155238886',  // Twilio Sandbox number
            to: phoneNumber,
            contentSid: contentSid,  // Content template SID from Twilio
            contentVariables: JSON.stringify({
                '1': subject,         // Corresponds to {{1}} in the content template
                '2': lessonDetails,   // Corresponds to {{2}} in the content template
                '3': dueDate          // Corresponds to {{3}} in the content template
            })
        });

        console.log(`Message sent with SID: ${message.sid}`);
    } catch (error) {
        console.error("Error sending interactive message:", error);
    }
}

module.exports = { sendInteractiveMessage };
