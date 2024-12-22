import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";
const setUpSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [process.env.ORIGIN],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();
  const disconnect = (socket) => {
    console.log(`Client disconnected : ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const receiverSocketId = userSocketMap.get(message.receiver);

    const createMessage = await Message.create(message);
    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image")
      .populate("receiver", "id email firstName lastName image");

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receivedMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receivedMessage", messageData);
    }
  };
  const sendChannelMessage = async (message) => {
    const { sender, channelId, content, messageType, fileUrl } = message;

    const createdMessage = await Message.create({
      sender,
      receiver: null,
      content,
      messageType,
      timeStamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstname lastname image ")
      .exec();
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());

        if (memberSocketId) {
          io.to(memberSocketId).emit("recieve-channel-message", finalData);
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }
    }

  };
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected : ${userId} with socket ID : ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-Message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setUpSocket;
