"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  const [keyInput, setKeyInput] = useState("");

  const handleSearch = () => {
    // TODO: decode key, fetch from IPFS, decrypt, and download
    alert("Fungsi search belum dibuat: " + keyInput);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-black">VanishBox</h1>
        <Link href="/profile">
          <Button className="bg-black text-white hover:bg-gray-800">Profile</Button>
        </Link>
      </nav>

      <main className="flex flex-col items-center justify-center flex-grow px-4 py-10 bg-gray-50">
        <Card className="w-full max-w-xl p-8 space-y-6 shadow-lg border rounded-2xl bg-white">
          <h2 className="text-2xl font-semibold text-center">Retrieve Your Vanish File</h2>
          <Input
            placeholder="Paste your vanishbox key here..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="text-sm"
          />
          <Button onClick={handleSearch} className="w-full bg-black text-white hover:bg-gray-800">
            Retrieve & Decrypt
          </Button>
        </Card>
      </main>
    </div>
  );
}
