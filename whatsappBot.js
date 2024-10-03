const twilio = require('twilio');

// Send an interactive message with Content SID
async function sendInteractiveMessage(accountSid, authToken, contentSid, phoneNumber, subject, lessonDetails, dueDate) {
    const client = twilio(accountSid, authToken);

    try {
        const message = await client.messages.create({
            from: 'whatsapp:+14155238886',  // Twilio Sandbox number
            to: phoneNumber,                // Recipient's WhatsApp number
            contentSid: contentSid,          // Content template SID provided via form
            contentVariables: JSON.stringify({
                '1': subject,         // Variable 1: Subject of the homework
                '2': lessonDetails,   // Variable 2: Actual homework details
                '3': dueDate          // Variable 3: Homework due date
            })
        });

        console.log(`Message sent with SID: ${message.sid}`);
    } catch (error) {
        console.error("Error sending interactive message:", error);
    }
}

module.exports = { sendInteractiveMessage };
