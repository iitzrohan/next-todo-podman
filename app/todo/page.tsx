"use client";
import React, { useState, useEffect } from "react";
import { Todo } from "@/models/types";

const TodoComponent = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data.todos);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTodo, dueDate }),
    });
    const data = await res.json();
    setTodos((prev) => [...prev, data.todo]);
    setNewTodo("");
    setDueDate("");
  };

  const handleEditTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTodo) return;
    const res = await fetch(`/api/todos/${editTodo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: editText, completed: editTodo.completed }),
    });
    const data = await res.json();
    setTodos((prev) =>
      prev.map((todo) => (todo._id === data.todo._id ? data.todo : todo)),
    );
    setEditTodo(null);
    setEditText("");
  };

  const handleDeleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !completed }),
    });
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, completed: !completed } : todo,
      ),
    );
  };

  return (
    <div>
      <h1 className="text-4xl mb-8 font-bold">To-Do List</h1>
      <form onSubmit={handleAddTodo} className="mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="border rounded py-2 px-2"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border rounded py-2 px-2 mt-1"
        />
        <button
          type="submit"
          className="ml-2 py-2 px-4 bg-sky-800 rounded text-white font-semibold"
        >
          Add
        </button>
      </form>
      {editTodo && (
        <form onSubmit={handleEditTodo} className="mb-6">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Edit todo"
            className="border rounded py-2 px-2"
            required
          />
          <button
            type="submit"
            className="ml-2 py-2 px-4 bg-sky-800 rounded text-white font-semibold"
          >
            Save
          </button>
          <button
            onClick={() => setEditTodo(null)}
            className="ml-2 py-2 px-4 bg-gray-500 rounded text-white font-semibold"
          >
            Cancel
          </button>
        </form>
      )}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="flex justify-between items-center mb-2">
            <span className={todo.completed ? "line-through" : ""}>
              {todo.text}{" "}
              {todo.dueDate &&
                `- Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
            </span>
            <div>
              <button
                onClick={() => handleToggleComplete(todo._id, todo.completed)}
                className={`text-${todo.completed ? "green" : "blue"}-600 mr-2`}
              >
                {todo.completed ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => {
                  setEditTodo(todo);
                  setEditText(todo.text);
                }}
                className="text-yellow-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(todo._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoComponent;
