const twilio = require('twilio');

// Send a message using the content template
async function sendInteractiveMessage(accountSid, authToken, toWhatsAppNumber, subject, lessonDetails, dueDate) {
    const client = new twilio(accountSid, authToken);
    const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Twilio sandbox number
    
    try {
        const message = await client.messages.create({
            from: fromWhatsAppNumber,
            to: toWhatsAppNumber,
            contentSid: 'HX726f836f470b19b2521af8cdd430e411',  // Your content template SID
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

module.exports = { sendInteractiveMessage };
