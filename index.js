require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const { sendInteractiveMessage } = require('./whatsappBot');

const app = express();
const port = 3000;

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
    const { accountSid, authToken, contentSid, phoneNumber, subject, lessonDetails, dueDate } = req.body;

    try {
        // Send the interactive WhatsApp message with the provided contentSid
        await sendInteractiveMessage(accountSid, authToken, contentSid, phoneNumber, subject, lessonDetails, dueDate);
        res.status(200).send("Homework submission notification sent via WhatsApp.");
    } catch (error) {
        console.error("Error submitting homework:", error);
        res.status(500).send("Failed to send homework submission.");
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
