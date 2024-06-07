const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAnswers = async (req, res) => {
    try {
        const answers = await prisma.answer.findMany();
        return res.status(200).json({
            status: "success",
            data: answers
        });
    } catch (error) {
        console.error("Хариултуудыг авахад алдаа гарлаа:", error);
        return res.status(500).json({
            status: "error",
            message: "Хариултуудыг татах үед алдаа гарлаа"
        });
    } finally {
        await prisma.$disconnect();
    }
};

exports.createAnswer = async (req, res) => {
    const { answer_content, choice_id } = req.body;

    try {
        const answer = await prisma.answer.create({
            data: {
                answer_content: answer_content,
                choice_id: choice_id
            }
        });
        return res.status(200).json({
            status: "success",
            data: { answer }
        })
    } catch (error) {
        console.error(`Хариулт үүсгэхэд алдаа гарлаа ${error}`);
        return res.status(500).json({
            status: "error",
            message: "Хариулт үүсгэхэд алдаа гарлаа"
        });
    } finally {
        await prisma.$disconnect();
    }
}

// exports.getAnswer = async (req, res) => {
//     const id = parseInt(req.params.id);

//     try {
//         const answers = await prisma.answer.findFirst({
//             where : {
//                 id: id
//             }
//         });
//         return res.status(200).json({
//             status: "success",
//             data: answers
//         });
//     } catch (error) {
//         console.error("Хариултыг авахад алдаа гарлаа:", error);
//         return res.status(500).json({
//             status: "error",
//             message: "Хариултыг татах үед алдаа гарлаа"
//         });
//     } finally {
//         await prisma.$disconnect();
//     }
// }
exports.getAnswer = async (id) => {
    // console.log("HHS");

    try {
        const answer = await prisma.answer.findFirst({
            where: {
                choice_id: Number(id)
            }
        });

        // console.log("--------")
        // console.log(answer)
        return answer;

    } catch (error) {
        console.error("Хариултыг авахад алдаа гарлаа:", error);
        return error;

    } finally {
        await prisma.$disconnect();
    }

}

exports.updateAnswer = async (req, res) => {
    const id = parseInt(req.params.id)
    const { new_answer_content } = req.body;

    try {
        const answer = await prisma.answer.update({
            where: {
                id: id
            },
            data: { answer_content: new_answer_content }
        });
        return res.status(200).json({
            status: "success",
            data: answer
        });
    } catch (error) {
        console.error("Хариултыг засах алдаа гарлаа:", error);
        return res.status(500).json({
            status: "error",
            message: "Хариултыг засах үед алдаа гарлаа"
        });
    } finally {
        await prisma.$disconnect();
    }
}

exports.deleteAnswer = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const answer = await prisma.answer.delete({
            where: { id: id }
        });

        return res.status(200).json({
            status: "success",
            message: `${id} id тай хариулт устгагдсан`,
            data: answer
        });
    } catch (error) {
        console.error("Хариултыг устгахад алдаа гарлаа:", error);
        return res.status(500).json({
            status: "error",
            message: "Хариултыг устгах үед алдаа гарлаа"
        });
    } finally {
        await prisma.$disconnect();
    }
};