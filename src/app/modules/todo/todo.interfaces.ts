export enum TaskStatus {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum TaskStates {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  status?: TaskStatus;
}
