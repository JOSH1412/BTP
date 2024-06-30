const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const User = require('./users');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  PORT: 587,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

async function SendToHOD(DeadLine) {
  const today = new Date();
  const DaysLeft = DeadLine.getDate() - today.getDate();
  // if(DaysLeft == 1){
  //     SendReminder(dabba);
  // }

  const hods = await User.find({ email: /HOD/i });

  hods.forEach(async (hod) => {
    const html = fs.readFileSync(
      path.join(__dirname, 'views', 'NotifyHods.html'),
      'utf8'
    );

    const message = {
      from: process.env.USER_EMAIL,
      to: hod.email,
      subject: 'Notification for entering the course details',
      html: html,
    };

    const info = await transporter.sendMail(message);
    console.log(`Deadline reminder sent to ${hod.name} (${hod.email})`, info);
  });
}

module.exports = {
  SendToHOD
};
