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
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <nav className="w-full py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">VanishBox</h1>
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
      </nav>

      <main className="w-full flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-xl p-6 space-y-4">
          <Input
            placeholder="Paste your vanishbox key here..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <Button onClick={handleSearch} className="w-full">
            Retrieve & Decrypt
          </Button>
        </Card>
      </main>
    </div>
  );
}
