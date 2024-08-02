import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongo.lib";
import TodoModel from "@/models/todo.model";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { completed, text } = await request.json();
    await connectToMongo();
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      params.id,
      { completed, text },
      { new: true },
    );
    return NextResponse.json({ todo: updatedTodo });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to update todo" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToMongo();
    await TodoModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to delete todo" },
      { status: 400 },
    );
  }
}
