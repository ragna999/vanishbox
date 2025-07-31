"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAs } from "file-saver";
import lighthouse from "@lighthouse-web3/sdk";

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("0x1234...abcd"); // dummy
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
  
    try {
      // Step 1: generate random AES key (32 bytes)
      const key = crypto.getRandomValues(new Uint8Array(32));
      const aesKey = Buffer.from(key).toString("hex");
  
      // Step 2: read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
  
      // Step 3: encrypt with AES-GCM
      const encoded = new TextEncoder().encode(aesKey);
      const cryptoKey = await crypto.subtle.importKey("raw", encoded, "AES-GCM", false, ["encrypt"]);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, arrayBuffer);
  
      // Combine IV + encrypted content into 1 blob
      const encryptedBlob = new Blob([iv, new Uint8Array(encrypted)], { type: "application/octet-stream" });
  
      // Step 4: upload to Lighthouse
      const output = await lighthouse.upload(
        encryptedBlob,
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!
      );
  
      const cid = output.data.Hash;
  
      // Step 5: build vanishbox key JSON
      const vanishKey = {
        fileName: file.name,
        cid,
        aesKey,
        iv: Array.from(iv)
      };
  
      const keyBlob = new Blob([JSON.stringify(vanishKey, null, 2)], { type: "application/json" });
      saveAs(keyBlob, `vanishbox-key-${file.name}.json`);
  
      alert("File encrypted & uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload or encrypt file.");
    }
  
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
