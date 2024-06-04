const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

exports.createTopic = async (req, res) => {
    const { topic } = req.body;

    const newTopic = await prisma.topic.create({
        data: {
            topic: topic
        }
    });

    res.status(201).json(newTopic);
}
