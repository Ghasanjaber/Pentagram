"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate image");
      }

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }

      console.log(data);
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* 1) Gradient top bar */}
      <header className="bg-gradient-to-r from-pink-500 to-orange-500 py-4 px-8 flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-white">AI Image Generator</h1>
      </header>

      {/* 2) Main container: dark card with form and result */}
      <main className="flex-1 max-w-3xl w-full mx-auto mt-8 px-6 py-6 bg-[#2a2a2a] rounded-md text-white">
        {/* Form title or instructions (optional) */}

        {/* 3) The input form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="
              flex-1 px-4 py-2 rounded-md 
              bg-[#3a3a3a] 
              border border-transparent 
              focus:outline-none focus:border-pink-500
              placeholder-gray-400
            "
            placeholder="Describe the image you want:"

            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="
              px-6 py-2 rounded-md 
              bg-gradient-to-r from-pink-500 to-purple-500
              hover:from-pink-400 hover:to-purple-400
              transition-colors
              disabled:opacity-50
            "
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </form>

        {/* 4) Show the image if available */}
        <div className="flex items-center justify-center">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Generated"
              className="max-w-full h-auto rounded-md shadow-lg"
            />
          )}
        </div>
      </main>
    </div>
  );
}
