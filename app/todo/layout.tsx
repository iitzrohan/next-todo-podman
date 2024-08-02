import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Make your life easier with Todo App",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex justify-center items-center">
      {children}
    </section>
  );
}
