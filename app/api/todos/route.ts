import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongo.lib";
import TodoModel from "@/models/todo.model";

export async function GET() {
  try {
    await connectToMongo();
    const todos = await TodoModel.find().exec();
    return NextResponse.json({ todos });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch todos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { text, dueDate } = await request.json();
    await connectToMongo();
    const newTodo = new TodoModel({ text, dueDate, completed: false });
    await newTodo.save();
    return NextResponse.json({ todo: newTodo }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to add todo" },
      { status: 400 },
    );
  }
}
