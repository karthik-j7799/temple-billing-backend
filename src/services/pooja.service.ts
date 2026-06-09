import prisma from "../config/prisma.js";

export const getPoojas = async () => {
  return prisma.pooja.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createPooja = async (name: string, price: number) => {
  return prisma.pooja.create({
    data: {
      name,
      price,
    },
  });
};

export const updatePooja = async (id: string, name: string, price: number) => {
  return prisma.pooja.update({
    where: {
      id,
    },
    data: {
      name,
      price,
    },
  });
};

export const updatePoojaStatus = async (id: string, isActive: boolean) => {
  return prisma.pooja.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });
};