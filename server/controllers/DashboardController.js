import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Moved PrismaClient instantiation outside the function

export const getSellerData = async (req, res) => {
  try {
    if (req.userId) {
      // Count the number of gigs created by the user
      const gigs = await prisma.gigs.count({ where: { createdById: req.userId } });

      // Aggregate to count completed orders associated with the user's gigs
      const {
        _count: { id: orders },
      } = await prisma.orders.aggregate({
        where: {
          isCompleted: true,
          gig: {
            createdById: req.userId,
          },
        },
        _count: {
          id: true,
        },
      });

      // Count unread messages for the user
      const unreadMessages = await prisma.message.count({
        where: {
          recipientId: req.userId,
          isRead: false,
        },
      });

      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const thisYear = new Date(today.getFullYear(), 0, 1);

      // Calculate total revenue for the year
      const {
        _sum: { price: revenue },
      } = await prisma.orders.aggregate({
        where: {
          gig: {
            createdById: req.userId,
          },
          isCompleted: true,
          createdAt: {
            gte: thisYear,
          },
        },
        _sum: {
          price: true,
        },
      });

      // Calculate daily revenue
      const {
        _sum: { price: dailyRevenue },
      } = await prisma.orders.aggregate({
        where: {
          gig: {
            createdById: req.userId,
          },
          isCompleted: true,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        _sum: {
          price: true,
        },
      });

      // Calculate monthly revenue
      const {
        _sum: { price: monthlyRevenue },
      } = await prisma.orders.aggregate({
        where: {
          gig: {
            createdById: req.userId,
          },
          isCompleted: true,
          createdAt: {
            gte: thisMonth,
          },
        },
        _sum: {
          price: true,
        },
      });

      return res.status(200).json({
        dashboardData: {
          orders,
          gigs,
          unreadMessages,
          dailyRevenue,
          monthlyRevenue,
          revenue,
        },
      });
    }
    return res.status(400).send("User id is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};
