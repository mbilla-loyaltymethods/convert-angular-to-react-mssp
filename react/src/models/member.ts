export interface Member {
  enrollDate: string | number | Date;
  tiers: any;
  _id: string;
  loyaltyId: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhone?: number;
  purses: Array<{
    name: string;
    availBalance: number;
  }>;
  streaks: Array<{
    _id: string;
    name: string;
    status: string;
  }>;
  ext?: {
    [key: string]: any;
  };
  // Add other member properties as needed
} 