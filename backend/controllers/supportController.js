const SupportMessage = require('../models/SupportMessage');
const User = require('../models/User');
const { getIO } = require('../socket');
const { appendClientHistory } = require('../utils/clientHistory');

// Legacy Contact Form (Unauthenticated)
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const newMessage = new SupportMessage({
      name,
      email,
      phone,
      subject,
      message
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully. We will get back to you soon.' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, message: 'An error occurred while sending your message. Please try again later.' });
  }
};

// Authenticated Client Details Support Message
exports.createMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    // req.user has { id, role, clientId } since it's verified by verifyToken
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newMessage = new SupportMessage({
      user_id: user._id,
      client_id: user.clientId || req.user.clientId,
      client_name: user.name,
      message,
      status: 'Pending'
    });

    await newMessage.save();

    if (newMessage.client_id) {
      await appendClientHistory(
        newMessage.client_id,
        'support_message',
        'Support message created',
        {
          messageId: String(newMessage._id),
          status: newMessage.status,
        }
      );
    }

    try {
      const io = getIO();
      // Emit to admin room
      io.to('admin').emit('newSupportMessage', newMessage);
      
      // Also, send an admin notification for consistency with other parts of the app
      io.to('admin').emit('adminNotification', {
        type: 'support',
        title: 'New Support Message',
        message: `${user.name} sent a new support message.`,
        createdAt: new Date().toISOString(),
        payload: {
          messageId: newMessage._id,
          clientName: user.name
        }
      });
    } catch (socketErr) {
      console.error('Socket.io error emitting new support message:', socketErr);
    }

    res.status(201).json({ success: true, message: 'Support message sent successfully.', data: newMessage });
  } catch (error) {
    console.error('Error creating support message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fetch all messages (Admin Only)
exports.getAllMessages = async (req, res) => {
  try {
    // Exclude the unauthenticated contact form messages if we only want client ones, 
    // or just fetch everything. We'll fetch everything for now.
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    console.error('Error fetching all messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fetch messages specific to logged in client
exports.getClientMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    console.error('Error fetching client messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin applying reply and status update
exports.replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status } = req.body;

    if (!message && !status) {
      return res.status(400).json({ success: false, message: 'Please provide a reply message or status update.' });
    }

    const supportMsg = await SupportMessage.findById(id);
    if (!supportMsg) {
      return res.status(404).json({ success: false, message: 'Support message not found.' });
    }

    const admin = await User.findOne({ email: 'aadhithyaa120@gmail.com' }); // Admin uses a specific email or we get it from req.user
    // actually admin is hardcoded in auth.js with id "admin_hardcoded", lets just use req.user info
    const adminName = req.user.name || 'Admin';

    if (message) {
      supportMsg.replies.push({
        admin_id: req.user.id === 'admin_hardcoded' ? null : req.user.id,
        admin_name: adminName,
        message,
        timestamp: new Date()
      });
    }

    if (status && ['Pending', 'In Progress', 'Resolved'].includes(status)) {
      supportMsg.status = status;
    }

    await supportMsg.save();

    try {
      const io = getIO();
      // Emit update back to client
      if (supportMsg.user_id) {
        io.to(supportMsg.user_id.toString()).emit('supportMessageReply', supportMsg);
      }
    } catch (socketErr) {
      console.error('Socket.io error emitting reply:', socketErr);
    }

    res.status(200).json({ success: true, message: 'Replied successfully.', data: supportMsg });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
