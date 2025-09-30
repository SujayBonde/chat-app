import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from '../lib/cloudinary.js';
import { io, userSocketMap } from '../server.js';

// Get all users except the logged-in user, with unseen message counts
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch users excluding the logged-in user
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    // Count unseen messages for each user
    const unseenMessages = {};
    const messages = await Message.aggregate([
      { $match: { receiverId: userId, seen: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } }
    ]);

    messages.forEach(msg => {
      unseenMessages[msg._id] = msg.count;
    });

    res.json({ success: true, users, unseenMessages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages between logged-in user and selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Fetch all messages between users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ]
    }).sort({ createdAt: 1 }); // sort by time

    // Mark messages as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark a single message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ success: false, message: "Message or image required" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    // Emit the new message to the receiver via socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
