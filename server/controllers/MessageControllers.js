import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addMessage = async (req, res) => {
  try {
    if (
      req.userId &&
      req.body.recipientId &&
      req.params.orderId &&
      req.body.message
    ) {
      const message = await prisma.message.create({
        data: {
          sender: {
            connect: {
              id: req.userId,
            },
          },
          recipient: {
            connect: {
              id: req.body.recipientId,
            },
          },
          order: {
            connect: {
              id: req.params.orderId,
            },
          },
          text: req.body.message,
        },
      });
      return res.status(201).json({ message });
    }
    return res.status(400).send("userId, recipientId, orderId, and message are required.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getMessages = async (req, res) => {
  try {
    if (req.params.orderId && req.userId) {
      const messages = await prisma.message.findMany({
        where: {
          order: {
            id: req.params.orderId,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      await prisma.message.updateMany({
        where: {
          orderId: req.params.orderId,
          recipientId: req.userId,
        },
        data: {
          isRead: true,
        },
      });

      const order = await prisma.orders.findUnique({
        where: { id: req.params.orderId },
        include: { gig: true },
      });

      let recipientId;
      if (order?.buyerId === req.userId) {
        recipientId = order.gig.createdById; 
      } else if (order?.gig.createdById === req.userId) {
        recipientId = order.buyerId;
      }
      return res.status(200).json({ messages, recipientId });
    }
    return res.status(400).send("Order id is required.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUnreadMessages = async (req, res) => {
  try {
    if (req.userId) {
      const messages = await prisma.message.findMany({
        where: {
          recipientId: req.userId,
          isRead: false,
        },
        include: {
          sender: true,
        },
      });
      return res.status(200).json({ messages });
    }
    return res.status(400).send("User id is required.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const markAsRead = async (req, res) => {
  try {
    if (req.userId && req.params.messageId) {
      await prisma.message.update({
        where: { id: req.params.messageId },
        data: { isRead: true },
      });
      return res.status(200).send("Message marked as read.");
    }
    return res.status(400).send("User id and message Id are required.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
