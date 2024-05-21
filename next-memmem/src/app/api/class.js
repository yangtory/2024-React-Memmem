import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { date } = req.query;

  try {
    const classData = await prisma.class.findMany({
      where: {
        c_sdate: {
          lte: date,
        },
        c_edate: {
          gte: date,
        },
      },
      include: {
        teacher: true, // 가정: teacher 관계를 포함하여 데이터를 가져옴
      },
    });

    if (!classData) {
      return res.status(404).json({ error: "Class data not found" });
    }

    res.status(200).json(classData);
  } catch (error) {
    console.error("Error fetching class detail:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
