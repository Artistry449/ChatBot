const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

exports.createTitle = async (req, res) => {
    const { title } = req.body;

    const newTitle = await prisma.title.create({
        data: {
            title: title
        }
    });

    res.status(201).json(newTitle);
}