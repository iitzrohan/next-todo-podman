import { Schema, model, models } from "mongoose";
import { Todo } from "./types";

const todoSchema = new Schema<Todo>(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

const TodoModel = models.todo || model<Todo>("todo", todoSchema);
export default TodoModel;
