import prisma from "../config/prisma.js";
import { ItemType, BillStatus } from "@prisma/client";
import { CreateBillInput } from "../types/bill.types.js";

const generateReceiptNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const latestBill = await prisma.bill.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      receiptNumber: true,
    },
  });

  let nextNumber = 1;

  if (latestBill) {
    const parts = latestBill.receiptNumber.split("-");
    const currentNumber = Number(parts[2]);

    if (!isNaN(currentNumber)) {
      nextNumber = currentNumber + 1;
    }
  }

  return `TB-${year}-${String(nextNumber).padStart(6, "0")}`;
};

export const createBill = async (data: CreateBillInput, userId: string) => {

  if (data.poojas.length === 0 && data.inventoryItems.length === 0) {
    throw new Error("Bill must contain at least one item");
  }
  const receiptNumber = await generateReceiptNumber();

  let totalAmount = 0;

  const billItems: {
    itemType: ItemType;
    referenceId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[] = [];

  // Process Poojas
  for (const poojaItem of data.poojas) {
    if (poojaItem.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    const pooja = await prisma.pooja.findUnique({
      where: {
        id: poojaItem.poojaId,
      },
    });

    if (!pooja) {
      throw new Error("Pooja not found");
    }

    if (!pooja.isActive) {
      throw new Error(`${pooja.name} is inactive`);
    }

    const unitPrice = Number(pooja.price);

    const lineTotal = unitPrice * poojaItem.quantity;

    totalAmount += lineTotal;

    billItems.push({
      itemType: ItemType.POOJA,
      referenceId: pooja.id,
      itemName: pooja.name,
      quantity: poojaItem.quantity,
      unitPrice,
      totalPrice: lineTotal,
    });
  }

  // Process Inventory Items
  for (const inventoryItem of data.inventoryItems) {
    if (inventoryItem.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    const inventory = await prisma.inventory.findUnique({
      where: {
        id: inventoryItem.inventoryId,
      },
    });

    if (!inventory) {
      throw new Error("Inventory item not found");
    }

    if (!inventory.isActive) {
      throw new Error(`${inventory.itemName} is inactive`);
    }

    if (inventory.quantity < inventoryItem.quantity) {
      throw new Error(`${inventory.itemName} does not have enough stock`);
    }

    const unitPrice = Number(inventory.price);

    const lineTotal = unitPrice * inventoryItem.quantity;

    totalAmount += lineTotal;

    billItems.push({
      itemType: ItemType.INVENTORY,
      referenceId: inventory.id,
      itemName: inventory.itemName,
      quantity: inventoryItem.quantity,
      unitPrice,
      totalPrice: lineTotal,
    });
  }

  return prisma.$transaction(async (tx) => {
    const bill = await tx.bill.create({
      data: {
        receiptNumber,
        devoteeName: data.devoteeName,
        phoneNumber: data.phoneNumber,
        nakshatraId: data.nakshatraId,
        poojaDate: new Date(data.poojaDate),
        status: BillStatus.BOOKED,
        totalAmount,
        createdById: userId,
      },
    });

    await tx.billItem.createMany({
      data: billItems.map((item) => ({
        billId: bill.id,
        itemType: item.itemType,
        referenceId: item.referenceId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    });

    // Deduct inventory stock
    for (const inventoryItem of data.inventoryItems) {
      await tx.inventory.update({
        where: {
          id: inventoryItem.inventoryId,
        },
        data: {
          quantity: {
            decrement: inventoryItem.quantity,
          },
        },
      });
    }

    const createdBill = await tx.bill.findUnique({
      where: {
        id: bill.id,
      },
      include: {
        nakshatra: true,
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        items: true,
      },
    });

    return createdBill;
  });
};

export const getBills = async () => {
  return prisma.bill.findMany({
    include: {
      nakshatra: true,
      createdBy: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBillById = async (id: string) => {
  return prisma.bill.findUnique({
    where: {
      id,
    },
    include: {
      nakshatra: true,
      items: true,
      createdBy: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export const updateBillStatus = async (id: string, status: BillStatus) => {
  if (!Object.values(BillStatus).includes(status)) {
    throw new Error("Invalid status");
  }

  return prisma.bill.update({
    where: { id },
    data: { status },
  });
};

export const editBill = async (billId: string, data: CreateBillInput) => {
    if (data.poojas.length === 0 && data.inventoryItems.length === 0) {
      throw new Error("Bill must contain at least one item");
    }
  const existingBill = await prisma.bill.findUnique({
    where: {
      id: billId,
    },
    include: {
      items: true,
    },
  });

  if (!existingBill) {
    throw new Error("Bill not found");
  }

  if (existingBill.status !== BillStatus.BOOKED) {
    throw new Error("Only booked bills can be edited");
  }

  return prisma.$transaction(async (tx) => {
    // Restore old inventory
    for (const item of existingBill.items) {
      if (item.itemType === ItemType.INVENTORY && item.referenceId) {
        await tx.inventory.update({
          where: {
            id: item.referenceId,
          },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    // Delete old bill items
    await tx.billItem.deleteMany({
      where: {
        billId,
      },
    });

    let totalAmount = 0;

    const billItems: {
      itemType: ItemType;
      referenceId: string;
      itemName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    // Process poojas
    for (const poojaItem of data.poojas) {
    if (poojaItem.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
      const pooja = await tx.pooja.findUnique({
        where: {
          id: poojaItem.poojaId,
        },
      });

      if (!pooja) {
        throw new Error("Pooja not found");
      }

      if (!pooja.isActive) {
        throw new Error(`${pooja.name} is inactive`);
      }

      const unitPrice = Number(pooja.price);

      const lineTotal = unitPrice * poojaItem.quantity;

      totalAmount += lineTotal;

      billItems.push({
        itemType: ItemType.POOJA,
        referenceId: pooja.id,
        itemName: pooja.name,
        quantity: poojaItem.quantity,
        unitPrice,
        totalPrice: lineTotal,
      });
    }

    // Process inventory
    for (const inventoryItem of data.inventoryItems) {
        if (inventoryItem.quantity <= 0) {
          throw new Error("Quantity must be greater than 0");
        }
      const inventory = await tx.inventory.findUnique({
        where: {
          id: inventoryItem.inventoryId,
        },
      });

      if (!inventory) {
        throw new Error("Inventory item not found");
      }

      if (!inventory.isActive) {
        throw new Error(`${inventory.itemName} is inactive`);
      }

      if (inventory.quantity < inventoryItem.quantity) {
        throw new Error(`${inventory.itemName} does not have enough stock`);
      }

      const unitPrice = Number(inventory.price);

      const lineTotal = unitPrice * inventoryItem.quantity;

      totalAmount += lineTotal;

      billItems.push({
        itemType: ItemType.INVENTORY,
        referenceId: inventory.id,
        itemName: inventory.itemName,
        quantity: inventoryItem.quantity,
        unitPrice,
        totalPrice: lineTotal,
      });
    }

    // Update bill
    await tx.bill.update({
      where: {
        id: billId,
      },
      data: {
        devoteeName: data.devoteeName,
        phoneNumber: data.phoneNumber,
        nakshatraId: data.nakshatraId,
        poojaDate: new Date(data.poojaDate),
        totalAmount,
        isEdited: true,
        editedAt: new Date(),
      },
    });

    // Create new bill items
    await tx.billItem.createMany({
      data: billItems.map((item) => ({
        billId,
        itemType: item.itemType,
        referenceId: item.referenceId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    });

    // Deduct inventory again
    for (const inventoryItem of data.inventoryItems) {
      await tx.inventory.update({
        where: {
          id: inventoryItem.inventoryId,
        },
        data: {
          quantity: {
            decrement: inventoryItem.quantity,
          },
        },
      });
    }

    return tx.bill.findUnique({
      where: {
        id: billId,
      },
      include: {
        nakshatra: true,
        items: true,
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  });
};