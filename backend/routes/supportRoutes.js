const express = require('express');
const router = express.Router();
const { 
    submitContactForm, 
    createMessage, 
    getAllMessages, 
    getClientMessages, 
    replyToMessage 
} = require('../controllers/supportController');
const { verifyToken, isAdmin, isClient } = require('../middleware/auth');

// Legacy Contact Form (Public)
router.post('/contact', submitContactForm);

// Client creating a new support message
router.post('/', verifyToken, isClient, createMessage);

// Admin fetching all support messages
router.get('/', verifyToken, isAdmin, getAllMessages);

// Client fetching their own support messages
router.get('/client', verifyToken, isClient, getClientMessages);

// Admin replying / updating status of a message
router.post('/:id/reply', verifyToken, isAdmin, replyToMessage);

module.exports = router;
