export enum TaskStatus {
  low = 'low',
  medium = 'medium',
  hihg = 'high',
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  status?: TaskStatus;
}
