"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("0x1234...abcd"); // dummy
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    // TODO: encrypt file, upload to IPFS, generate vanish key
    alert("Upload & encrypt belum diimplementasi.");
    setUploading(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-10 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Card className="w-full max-w-xl p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Connected Wallet:</p>
          <p className="font-mono text-md">{walletAddress}</p>
        </div>

        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {uploading ? "Uploading..." : "Upload & Encrypt"}
        </Button>
      </Card>
    </div>
  );
}
