/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function AdvancedPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [videoType, setVideoType] = useState("");
  const [style, setStyle] = useState("");
  const [placement, setPlacement] = useState("center");
  const [results, setResults] = useState<any>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    // Upload to /api/upload
    const fd = new FormData();
    fd.append("file", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await uploadRes.json();

    // Call advanced API
    const res = await fetch("/api/advanced", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url, videoType, style, placement }),
    });

    const data = await res.json();
    setResults(data);
  };

  const downloadAll = async () => {
    if (!results) return;
    const zip = new JSZip();

    [...results.horizontal, ...results.vertical].forEach(
      (img: any, idx: number) => {
        const name =
          idx < results.horizontal.length
            ? `horizontal_${idx + 1}.jpg`
            : `vertical_${idx + 1}.jpg`;
        zip.file(
          name,
          fetch(img.url).then((res) => res.blob())
        );
      }
    );

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "thumbnails.zip");
  };

  const copyToClipboard = async (url: string) => {
    const blob = await fetch(url).then((r) => r.blob());
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    alert("Thumbnail copied!");
  };

  return (
    <div className="p-10 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold">Advanced Thumbnail Generator</h1>

      <input type="file" accept="image/*" onChange={handleFile} />
      <input
        type="text"
        placeholder="Video Type"
        value={videoType}
        onChange={(e) => setVideoType(e.target.value)}
        className="border p-2 rounded w-full max-w-md"
      />
      <input
        type="text"
        placeholder="Style / Mood"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="border p-2 rounded w-full max-w-md"
      />
      <select
        value={placement}
        onChange={(e) => setPlacement(e.target.value)}
        className="border p-2 rounded w-full max-w-md"
      >
        <option value="left">Photo Left</option>
        <option value="center">Photo Center</option>
        <option value="right">Photo Right</option>
      </select>

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Generate Thumbnails
      </button>

      {preview && (
        <img
          src={preview}
          alt="Uploaded"
          className="mt-4 w-[400px] border rounded"
        />
      )}

      {results && (
        <div className="mt-8 w-full">
          <h2 className="text-xl font-semibold">Rewritten Prompt</h2>
          <p className="text-gray-700">{results.rewrittenPrompt}</p>

          <div className="mt-6">
            <h3 className="text-lg font-bold">Horizontal (YouTube)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.horizontal.map((img: any, i: number) => (
                <div key={i} className="relative">
                  <img
                    src={img.url}
                    alt={`Horizontal ${i}`}
                    className="w-[400px] h-[225px] object-cover border rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(img.url)}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Copy
                    </button>
                    <a
                      href={img.url}
                      download={`thumb_h_${i + 1}.jpg`}
                      className="px-2 py-1 bg-gray-700 text-white rounded"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold">Vertical (Shorts/Reels)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.vertical.map((img: any, i: number) => (
                <div key={i} className="relative">
                  <img
                    src={img.url}
                    alt={`Vertical ${i}`}
                    className="w-[225px] h-[400px] object-cover border rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(img.url)}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Copy
                    </button>
                    <a
                      href={img.url}
                      download={`thumb_v_${i + 1}.jpg`}
                      className="px-2 py-1 bg-gray-700 text-white rounded"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={downloadAll}
            className="mt-6 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Download All as ZIP
          </button>
        </div>
      )}
    </div>
  );
}
