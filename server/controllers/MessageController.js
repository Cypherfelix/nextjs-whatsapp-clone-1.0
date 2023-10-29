import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;

    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: {
            connect: {
              id: parseInt(from),
            },
          },
          receiver: {
            connect: {
              id: parseInt(to),
            },
          },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
      res.status(201).json({
        message: newMessage,
      });
    } else {
      return res.status(400).send("From, To and Message are required");
    }
  } catch (e) {
    next(e);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;

    if (from && to) {
      const messages = await prisma.messages.findMany({
        where: {
          OR: [
            {
              senderId: parseInt(from),
              receiverId: parseInt(to),
            },
            {
              senderId: parseInt(to),
              receiverId: parseInt(from),
            },
          ],
        },
        include: {
          sender: true,
          receiver: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      const unreadMessages = [];
      messages.forEach((message, index) => {
        if (
          message.messageStatus !== "read" &&
          message.senderId === parseInt(to)
        ) {
          messages[index].messageStatus = "read";
          unreadMessages.push(message.id);
        }
      });

      await prisma.messages.updateMany({
        where: {
          id: {
            in: unreadMessages,
          },
        },
        data: {
          messageStatus: "read",
        },
      });

      return res.status(200).json({
        messages,
      });
    }

    return res.status(400).send("From and To are required");
  } catch (e) {
    next(e);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = new Date();
      const fileName = `uploads/images/${date}-${req.file.originalname}`;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;

      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            type: "image",
            sender: {
              connect: {
                id: parseInt(from),
              },
            },
            receiver: {
              connect: {
                id: parseInt(to),
              },
            },
          },
        });

        return res.status(201).json({
          message,
        });
      } else {
        return res.status(400).send("From and To are required");
      }
    }
    return res.status(400).send("Image is required");
  } catch (e) {
    next(e);
  }
};
export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = new Date();
      const fileName = `uploads/audios/${date}-${req.file.originalname}`;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;

      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            type: "audio",
            sender: {
              connect: {
                id: parseInt(from),
              },
            },
            receiver: {
              connect: {
                id: parseInt(to),
              },
            },
          },
        });

        return res.status(201).json({
          message,
        });
      } else {
        return res.status(400).send("From and To are required");
      }
    }
    return res.status(400).send("Audio is required");
  } catch (e) {
    next(e);
  }
};

export const getInitialChats = async (req, res, next) => {
  try {
    let { userId } = req.params;
    userId = parseInt(userId);

    const prisma = getPrismaInstance();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sentMessages: {
          include: {
            sender: true,
            receiver: true,
          },
          orderBy: {
            id: "desc",
          },
        },
        receivedMessages: {
          include: {
            sender: true,
            receiver: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const messages = [...user.sentMessages, ...user.receivedMessages];
    messages.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    console.log(messages);

    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      const iSender = msg.senderId === userId;
      const calculatedId = iSender ? msg.receiverId : msg.senderId;
      if (msg.messageStatus === "sent" && !iSender) {
        messageStatusChange.push(msg.id);
      }
      const {
        id,
        type,
        message,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
      } = msg;
      if (!users.get(calculatedId)) {
        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        };
        if (iSender) {
          user = {
            ...user,
            ...msg.receiver,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }

        users.set(calculatedId, { ...user });
      } else if (msg.messageStatus !== "read" && !iSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    console.log(users);
    if (messageStatusChange.length > 0) {
      await prisma.messages.updateMany({
        where: {
          id: {
            in: messageStatusChange,
          },
        },
        data: {
          messageStatus: "delivered",
        },
      });
    }

    const usersArray = Array.from(users.values()).filter(
      (user) => user.id !== userId,
    );
    return res.status(200).json({
      users: usersArray,
      onlineUsers: Array.from(onlineUsers.keys()).filter(
        (user) => user !== userId,
      ),
    });
  } catch (e) {
    next(e);
  }
};
