const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

// --Old version
// exports.getChoice = async (id) => {
//     // const id = req.params.id;
//     const choice = await prisma.choice.findMany({
//         where: {
//             parent_id: Number(id)
//         }
//     });
//     return choice;
// }

const getParentChoices = async (id) => {
    const choices = await prisma.choice.findMany({
        where: {
            parent_id: id
        }
    });

    const choicesWithChildren = await Promise.all(choices.map(async (parentChoice) => {
        const childChoices = await prisma.choice.findMany({
            where: {
                parent_id: parentChoice.id
            }
        });
        return {
            parent: parentChoice.choice_content,
            childChoices: childChoices
        }
    }));

    return choicesWithChildren;
}

const getChildrenChoice = async (id) => {
    const choice = await prisma.choice.findMany({
        where: {
            id: id
        }
    });

    // const children = await prisma.choice.findMany({
    //     where: {
    //         parent_id: id
    //     }
    // });
    const choicesWithChildren = await Promise.all(choice.map(async (parentChoice) => {
        const childChoices = await prisma.choice.findMany({
            where: {
                parent_id: parentChoice.id
            }
        });
        return {
            parent: parentChoice.choice_content,
            childChoices: childChoices
        }
    }));

    return choicesWithChildren;
}

exports.getChoice = async (id) => {

    if (id === 1) {
        try {
            const choicesWithChildren = await getParentChoices(id);

            return choicesWithChildren;

        } catch (error) {
            return error;
        }

    }
    else {
        try {
            const childrenChoice = await getChildrenChoice(id);

            return childrenChoice;
        }
        catch (error) {
            return error;
        }
    }

}

// exports.getChoiceWithContent = async (req, res) => {
//     const id = Number(req.params.id)


// }

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