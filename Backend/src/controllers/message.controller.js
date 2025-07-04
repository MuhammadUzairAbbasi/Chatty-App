import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUserforSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filterdUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json(filterdUsers);
  } catch (error) {
    console.log("Error in getUserforSidebar :", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: usertoChatId } = req.params;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        {
          senderId: myId,
          recieverId: usertoChatId,
        },
        {
          senderId: usertoChatId,
          recieverId: myId,
        },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("Errot in getMessage : ", error.message);
    res.status(500).json({
      message: "Internal Sercer error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: recieverId } = req.params;
    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // real time implemenation

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage ", error.message);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};
