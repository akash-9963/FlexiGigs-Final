import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const { orderId } = req.params;
    const userId = req.userId;

    // Validate required fields
    if (!userId || !recipientId || !orderId || !message) {
      return res.status(400).json({ error: "userId, recipientId, orderId, and message are required." });
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        sender: { connect: { id: userId } },
        recipient: { connect: { id: recipientId } },
        order: { connect: { id: orderId } },
        text: message,
      },
    });

    return res.status(201).json({ message: newMessage });
  } catch (err) {
    console.error("Error adding message:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    // Validate required fields
    if (!orderId || !userId) {
      return res.status(400).json({ error: "Order id and userId are required." });
    }

    // Retrieve messages
    const messages = await prisma.message.findMany({
      where: { order: { id: orderId } },
      orderBy: { createdAt: "asc" },
    });

    // Update messages as read
    await prisma.message.updateMany({
      where: { orderId, recipientId: userId },
      data: { isRead: true },
    });

    // Fetch order details to determine recipient
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: { gig: true },
    });

    let recipientId;
    if (order?.buyerId === userId) {
      recipientId = order.gig.createdById; 
    } else if (order?.gig.createdById === userId) {
      recipientId = order.buyerId;
    }

    return res.status(200).json({ messages, recipientId });
  } catch (err) {
    console.error("Error retrieving messages:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUnreadMessages = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: "User id is required." });
    }

    // Retrieve unread messages
    const messages = await prisma.message.findMany({
      where: {
        recipientId: userId,
        isRead: false,
      },
      include: { sender: true },
    });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error("Error retrieving unread messages:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { messageId } = req.params;

    // Validate required fields
    if (!userId || !messageId) {
      return res.status(400).json({ error: "User id and message Id are required." });
    }

    // Update message as read
    await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    return res.status(200).json({ message: "Message marked as read." });
  } catch (err) {
    console.error("Error marking message as read:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
