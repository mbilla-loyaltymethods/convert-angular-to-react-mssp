export interface StreakPolicy {
  name: string;
  status: string;
  desc: string;
  goals: Array<{
    name: string;
    value: number;
    target: number;
    instantBonus?: string;
  }>;
  goalCompleted: string;
  streakGoalMessage?: string;
  startedAt?: string;
  timeLimit?: number;
  displayProgress?: boolean;
  streakId?: string;
  rewards?: any[];
} 