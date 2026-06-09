import prisma from "../config/prisma.js";

export const getInventoryItems = async () => {
  return prisma.inventory.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createInventoryItem = async (
  itemName: string,
  price: number,
  quantity: number,
  lowStockQuantity: number,
) => {
  return prisma.inventory.create({
    data: {
      itemName,
      price,
      quantity,
      lowStockQuantity,
    },
  });
};

export const updateInventoryItem = async (
  id: string,
  itemName: string,
  price: number,
  quantity: number,
  lowStockQuantity: number,
) => {
  return prisma.inventory.update({
    where: {
      id,
    },
    data: {
      itemName,
      price,
      quantity,
      lowStockQuantity,
    },
  });
};

export const updateInventoryStatus = async (id: string, isActive: boolean) => {
  return prisma.inventory.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });
};
