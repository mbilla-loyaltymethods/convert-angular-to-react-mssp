export interface CartItem {
  sku: string;
  name: string;
  cost: number;
  quantity: number;
  ext?: {
    hideInMSSP?: boolean;
  };
} 