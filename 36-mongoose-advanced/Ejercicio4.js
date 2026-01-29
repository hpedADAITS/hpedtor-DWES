const mongoose = require('mongoose');

const options = { discriminatorKey: 'type' };

const notificationSchema = new mongoose.Schema({
  message: String,
  recipient: String,
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}, options);

const Notification = mongoose.model('Notification', notificationSchema);

const smsNotificationSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    match: /^\+?[0-9]{10,}$/
  },
  carrier: String
}, options);

const SmsNotification = Notification.discriminator('sms', smsNotificationSchema);

const emailNotificationSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  subject: String,
  attachments: [String]
}, options);

const EmailNotification = Notification.discriminator('email', emailNotificationSchema);

const pushNotificationSchema = new mongoose.Schema({
  deviceToken: String,
  platform: {
    type: String,
    enum: ['ios', 'android']
  },
  badgeCount: Number
}, options);

const PushNotification = Notification.discriminator('push', pushNotificationSchema);

module.exports = { Notification, SmsNotification, EmailNotification, PushNotification };
