export interface Coupon {
  name: string;
  count?: number;
  ext: {
    rewardCost: number;
    // Add other extended properties as needed
  };
  // Add other coupon properties as needed
} 