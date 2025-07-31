"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const parsed = JSON.parse(keyInput);
      const { cid, aesKey, iv, fileName } = parsed;

      const res = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
      const encryptedData = await res.arrayBuffer();

      const ivBuffer = new Uint8Array(iv);
      const keyBytes = new TextEncoder().encode(aesKey);
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        cryptoKey,
        encryptedData.slice(iv.length)
      );

      const blob = new Blob([decrypted]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "vanishbox-file";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to retrieve or decrypt file. Pastikan key-nya valid!");
      console.error(err);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setKeyInput(text);
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
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
          />

          <textarea
            className="w-full h-40 border rounded p-3 text-sm"
            placeholder="Paste your vanishbox key JSON here..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />

          <Button
            onClick={handleSearch}
            disabled={loading || !keyInput}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Decrypting..." : "Retrieve & Decrypt"}
          </Button>
        </Card>
      </main>
    </div>
  );
}
