import getPrismaInstance from "../utils/PrismaClient.js";


export const addMessage = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance();
        const {message, from, to} = req.body;

        const getUser = onlineUsers.get(to);

        if (message && from && to) {
            const newMessage = await prisma.messages.create({
                data: {
                    message,
                    sender: {
                        connect: {id: parseInt(from)}
                    },
                    receiver: {
                        connect: {id: parseInt(to)}
                    },
                    messageStatus: getUser ? 'delivered' : 'sent'
                },
                include: {
                    sender: true,
                    receiver: true
                }
            });
            res.status(201).json({
                message: newMessage
            });
        } else {
            return res.status(400).send("From, To and Message are required");
        }
    } catch (e) {
        next(e)
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance();
        const {from, to} = req.params;

        if (from && to) {
            const messages = await prisma.messages.findMany({
                where: {
                    OR: [
                        {
                            senderId: parseInt(from),
                            receiverId: parseInt(to)
                        },
                        {
                            senderId: parseInt(to),
                            receiverId: parseInt(from)
                        }
                    ]
                },
                include: {
                    sender: true,
                    receiver: true
                },
                orderBy: {
                    id: 'asc'
                }
            });

            const unreadMessages = [];
            messages.forEach((message, index) => {
                if (message.messageStatus !== 'read' && message.senderId === parseInt(to)) {
                    messages[index].messageStatus = 'read';
                    unreadMessages.push(message.id)
                }
            });

            await prisma.messages.updateMany({
                where: {
                    id: {
                        in: unreadMessages
                    },
                },
                data: {
                    messageStatus: 'read'
                }
            });

            res.status(200).json({
                messages
            });
        }

        res.status(400).send("From and To are required");

    } catch (e) {
        next(e)
    }
};