const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getRatings = async (req, res) => {
    const ratings = await prisma.rating.findMany();

    return res.status(200).json(ratings);
}

exports.getRating = async (req, res) => {
    const id = req.params.id;

    const rating = await prisma.rating.findUnique({
        where: {
            id
        }
    });

    return res.status(200).json(rating);
}

exports.createRating = async (req, res) => {
    const { user_id, rating } = req.body;

    const newRating = await prisma.rating.create({
        data: {
            user_id,
            rating
        }
    });

    return res.status(201).json(newRating);
}

exports.createRating = async (user_id, user_rating) => {
    const newRating = await prisma.rating.create({
        data: {
            user_id,
            rating: Number(user_rating)
        }
    });

    return newRating;
}