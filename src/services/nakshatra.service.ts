import prisma from "../config/prisma.js";

export const getNakshatras = async () => {
  return prisma.nakshatra.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
