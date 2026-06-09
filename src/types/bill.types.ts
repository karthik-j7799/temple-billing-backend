export interface PoojaItemInput {
  poojaId: string;
  quantity: number;
}

export interface InventoryItemInput {
  inventoryId: string;
  quantity: number;
}

export interface CreateBillInput {
  devoteeName: string;
  phoneNumber?: string;
  nakshatraId?: string;
  poojaDate: string;

  poojas: PoojaItemInput[];
  inventoryItems: InventoryItemInput[];
}
