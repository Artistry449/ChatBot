const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.checkID = async (req, res, next, val) => {

    if (typeof (val * 1) !== Number) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid id"
        });
    }

    // const choice = await prisma.choice.findUnique({
    //     where: {
    //         id: Number(val)
    //     }
    // });

    // if (!choice) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid id"
    //     });
    // }
    next();
}

exports.getChoices = async (req, res) => {
    const choices = await prisma.choice.findMany();

    return res.status(200).json({
        status: "success",
        data: {
            choices: choices
        }
    });
}

exports.createChoice = async (req, res) => {
    const { choice_content, parent_id } = req.body;

    const choice = await prisma.choice.create({
        data: {
            choice_content,
            parent_id
        }
    });

    return res.status(200).json({
        status: "success",
        data: {
            choice: choice
        }
    });
}

// exports.getChoice = async (req, res) => {
//     const id = req.params.id;
//     const choice = await prisma.choice.findUnique({
//         where: {
//             id: Number(id)
//         }
//     })
//     return res.status(200).json({
//         status: "success",
//         data: {
//             choice: choice
//         }
//     });
// }

exports.getChoice = async (id) => {
    // const id = req.params.id;
    const choice = await prisma.choice.findMany({
        where: {
            parent_id: Number(id)
        }
    });
    return choice;
}

exports.updateChoice = async (req, res) => {
    const id = req.params.id;
    const { new_choice_content } = req.body;

    if (!new_choice_content) {
        return res.status(400).json({
            status: "fail",
            message: "new choice content is not provided bro"
        });
    }
    else {
        const updatedChoice = await prisma.choice.update({
            where: {
                id: Number(id)
            },
            data: {
                choice_content: new_choice_content
            }
        });

        return res.status(200).json({
            status: "success",
            data: {
                choice: updatedChoice
            }
        });
    }
}

exports.deleteChoice = async (req, res) => {
    const id = req.params.id;

    const deletedChoice = await prisma.choice.delete({
        where: {
            id: Number(id)
        }
    });

    return res.status(200).json({
        status: "success",
        data: deletedChoice
    });
}

// Серверээс тухайн child-ийн parent элементийн контентийг авах
exports.getParentChoice = async (id) => {
    const choice = await prisma.choice.findUnique({
        where: {
            id: Number(id)
        }
    });
    return choice;
}