require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cron = require('node-cron');
const { sendInteractiveMessage } = require('./whatsappBot');  // Import the message sending function

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Handle JSON data

// Route for submitting homework and sending a WhatsApp notification
app.post('/submit-lesson', async (req, res) => {
    const { accountSid, authToken, contentSid, phoneNumber, subject, lessonDetails, dueDate } = req.body;

    // Dynamically set up Twilio client with user-provided credentials
    const client = twilio(accountSid, authToken);

    try {
        // Send the interactive WhatsApp message using Twilio API
        await sendInteractiveMessage(client, contentSid, phoneNumber, subject, lessonDetails, dueDate);
        res.status(200).send("Homework submission notification sent via WhatsApp.");
    } catch (error) {
        console.error("Error submitting homework:", error);
        res.status(500).send("Failed to send homework submission.");
    }
});

// Route for setting up exams and scheduling reminders
app.post('/set-exam', (req, res) => {
    const { accountSidExam, authTokenExam, phoneNumberExam, examSubject, examDate } = req.body;

    // Schedule reminders for 3, 2, and 1 day(s) before the exam
    scheduleReminders(accountSidExam, authTokenExam, phoneNumberExam, examSubject, examDate);
    res.status(200).send("Exam set and reminders will be sent.");
});

// Function to schedule reminders 3, 2, and 1 day before the exam
function scheduleReminders(accountSid, authToken, phoneNumber, subject, examDate) {
    const examDateObj = new Date(examDate);

    // Reminder intervals: 3 days, 2 days, and 1 day before
    const reminderDays = [3, 2, 1];
    
    reminderDays.forEach(daysBefore => {
        const reminderDate = new Date(examDateObj);
        reminderDate.setDate(reminderDate.getDate() - daysBefore);

        // Schedule cron job to send reminder
        const cronSchedule = `${reminderDate.getUTCMinutes()} ${reminderDate.getUTCHours()} ${reminderDate.getUTCDate()} ${reminderDate.getUTCMonth() + 1} *`;

        cron.schedule(cronSchedule, () => {
            sendExamReminder(accountSid, authToken, phoneNumber, subject, examDate, daysBefore);
        });
    });
}

// Function to send WhatsApp reminder for exams
function sendExamReminder(accountSid, authToken, phoneNumber, subject, examDate, daysBefore) {
    const client = twilio(accountSid, authToken);

    let messageBody = `תזכורת למבחן בנושא ${subject}. תאריך המבחן: ${examDate}. `;
    if (daysBefore === 1) {
        messageBody += "המבחן מתקיים מחר!";
    } else {
        messageBody += `נותרו ${daysBefore} ימים עד למבחן.`;
    }

    client.messages.create({
        from: 'whatsapp:+14155238886',  // Twilio Sandbox number
        to: phoneNumber,
        body: messageBody,
    }).then(message => {
        console.log(`Reminder sent with SID: ${message.sid}`);
    }).catch(error => {
        console.error('Error sending reminder:', error);
    });
}

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
