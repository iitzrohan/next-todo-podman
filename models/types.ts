export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // Optional dueDate
}
