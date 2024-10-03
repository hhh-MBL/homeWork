require('dotenv').config({ path: './.env' });
const express = require('express');
const twilio = require('twilio');
const { sendInteractiveMessage } = require('./whatsappBot');

const app = express();
const port = 3000;

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;    // Your Twilio Auth Token
const client = twilio(accountSid, authToken);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Handle JSON data

// Serve the HTML form
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for submitting homework and sending a WhatsApp notification
app.post('/submit-lesson', async (req, res) => {
    const { subject, lessonDetails, dueDate } = req.body;

    try {
        // Send the interactive WhatsApp message
        await sendInteractiveMessage(subject, lessonDetails, dueDate); // Implement this in whatsappBot.js
        res.status(200).send("Homework submission notification sent via WhatsApp.");
    } catch (error) {
        console.error("Error submitting homework:", error);
        res.status(500).send("Failed to send homework submission.");
    }
});

// Status callback route to check if the message has been delivered
app.post('/status-callback', (req, res) => {
    const messageStatus = req.body.MessageStatus;
    const messageSid = req.body.MessageSid;

    console.log(`Message SID ${messageSid} has status: ${messageStatus}`);

    if (messageStatus === 'delivered') {
        console.log(`Message with SID ${messageSid} is delivered and can be deleted.`);
    }

    res.status(200).send();  // Respond with 200 OK
});

// Poll for message status and delete once it's not "receiving"
async function waitForDeliveryAndDelete(messageSid) {
    try {
        const maxRetries = 10;  // Max number of times to check
        let attempts = 0;

        while (attempts < maxRetries) {
            const message = await client.messages(messageSid).fetch();
            console.log(`Current status of message SID ${messageSid}: ${message.status}`);

            // If the message is no longer "receiving", try to delete it
            if (message.status !== 'receiving') {
                try {
                    await client.messages(messageSid).remove();
                    console.log(`Message with SID ${messageSid} has been deleted.`);
                    break;  // Exit the loop once deleted
                } catch (error) {
                    console.error(`Error deleting message with SID ${messageSid}:`, error);
                }
            } else {
                console.log(`Message SID ${messageSid} is still receiving. Retrying...`);
            }

            // Wait for 5 seconds before checking again
            await new Promise(resolve => setTimeout(resolve, 5000));
            attempts++;
        }

        if (attempts === maxRetries) {
            console.log(`Failed to delete message SID ${messageSid} after ${maxRetries} attempts.`);
        }
    } catch (error) {
        console.error(`Error fetching message status for SID ${messageSid}:`, error);
    }
}

// Webhook to handle incoming WhatsApp responses (button clicks)
app.post('/incoming-message', (req, res) => {
    const messageSid = req.body.MessageSid;
    const userResponse = req.body.Body;

    console.log("Webhook hit with body:", req.body);

    if (userResponse && userResponse.trim() === 'סיימתי') {
        console.log("Button סיימתי pressed.");
        // Start polling for the message status and delete it when possible
        waitForDeliveryAndDelete(messageSid);
    }

    res.status(200).send();  // Always respond with 200 OK
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
