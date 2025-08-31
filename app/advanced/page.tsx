// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useState } from "react";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// export default function AdvancedPage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [videoType, setVideoType] = useState("");
//   const [style, setStyle] = useState("");
//   const [placement, setPlacement] = useState("center");
//   const [results, setResults] = useState<any>(null);

//   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (f) {
//       setFile(f);
//       setPreview(URL.createObjectURL(f));
//     }
//   };

//   const handleGenerate = async () => {
//     if (!file) return;

//     // Upload to /api/upload
//     const fd = new FormData();
//     fd.append("file", file);
//     const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
//     const { url } = await uploadRes.json();

//     // Call advanced API
//     const res = await fetch("/api/advanced", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ imageUrl: url, videoType, style, placement }),
//     });

//     const data = await res.json();
//     setResults(data);
//   };

//   const downloadAll = async () => {
//     if (!results) return;
//     const zip = new JSZip();

//     [...results.horizontal, ...results.vertical].forEach(
//       (img: any, idx: number) => {
//         const name =
//           idx < results.horizontal.length
//             ? `horizontal_${idx + 1}.jpg`
//             : `vertical_${idx + 1}.jpg`;
//         zip.file(
//           name,
//           fetch(img.url).then((res) => res.blob())
//         );
//       }
//     );

//     const blob = await zip.generateAsync({ type: "blob" });
//     saveAs(blob, "thumbnails.zip");
//   };

//   const copyToClipboard = async (url: string) => {
//     const blob = await fetch(url).then((r) => r.blob());
//     await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
//     alert("Thumbnail copied!");
//   };

//   return (
//     <div className="p-10 flex flex-col items-center space-y-6">
//       <h1 className="text-3xl font-bold">Advanced Thumbnail Generator</h1>

//       <input type="file" accept="image/*" onChange={handleFile} />
//       <input
//         type="text"
//         placeholder="Video Type"
//         value={videoType}
//         onChange={(e) => setVideoType(e.target.value)}
//         className="border p-2 rounded w-full max-w-md"
//       />
//       <input
//         type="text"
//         placeholder="Style / Mood"
//         value={style}
//         onChange={(e) => setStyle(e.target.value)}
//         className="border p-2 rounded w-full max-w-md"
//       />
//       <select
//         value={placement}
//         onChange={(e) => setPlacement(e.target.value)}
//         className="border p-2 rounded w-full max-w-md"
//       >
//         <option value="left">Photo Left</option>
//         <option value="center">Photo Center</option>
//         <option value="right">Photo Right</option>
//       </select>

//       <button
//         onClick={handleGenerate}
//         className="px-4 py-2 bg-green-600 text-white rounded"
//       >
//         Generate Thumbnails
//       </button>

//       {preview && (
//         <img
//           src={preview}
//           alt="Uploaded"
//           className="mt-4 w-[400px] border rounded"
//         />
//       )}

//       {results && (
//         <div className="mt-8 w-full">
//           <h2 className="text-xl font-semibold">Rewritten Prompt</h2>
//           <p className="text-gray-700">{results.rewrittenPrompt}</p>

//           <div className="mt-6">
//             <h3 className="text-lg font-bold">Horizontal (YouTube)</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {results.horizontal.map((img: any, i: number) => (
//                 <div key={i} className="relative">
//                   <img
//                     src={img.url}
//                     alt={`Horizontal ${i}`}
//                     className="w-[400px] h-[225px] object-cover border rounded"
//                   />
//                   <div className="flex gap-2 mt-2">
//                     <button
//                       onClick={() => copyToClipboard(img.url)}
//                       className="px-2 py-1 bg-blue-600 text-white rounded"
//                     >
//                       Copy
//                     </button>
//                     <a
//                       href={img.url}
//                       download={`thumb_h_${i + 1}.jpg`}
//                       className="px-2 py-1 bg-gray-700 text-white rounded"
//                     >
//                       Download
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-lg font-bold">Vertical (Shorts/Reels)</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {results.vertical.map((img: any, i: number) => (
//                 <div key={i} className="relative">
//                   <img
//                     src={img.url}
//                     alt={`Vertical ${i}`}
//                     className="w-[225px] h-[400px] object-cover border rounded"
//                   />
//                   <div className="flex gap-2 mt-2">
//                     <button
//                       onClick={() => copyToClipboard(img.url)}
//                       className="px-2 py-1 bg-blue-600 text-white rounded"
//                     >
//                       Copy
//                     </button>
//                     <a
//                       href={img.url}
//                       download={`thumb_v_${i + 1}.jpg`}
//                       className="px-2 py-1 bg-gray-700 text-white rounded"
//                     >
//                       Download
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <button
//             onClick={downloadAll}
//             className="mt-6 px-4 py-2 bg-purple-600 text-white rounded"
//           >
//             Download All as ZIP
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import type React from "react";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Upload,
  Download,
  Copy,
  Sparkles,
  ImageIcon,
  Video,
  Palette,
  MapPin,
} from "lucide-react";

export default function AdvancedPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [videoType, setVideoType] = useState("");
  const [style, setStyle] = useState("");
  const [placement, setPlacement] = useState("center");
  const [results, setResults] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      if (f.type.startsWith("image/")) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
      }
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setIsGenerating(true);

    try {
      // Upload to /api/upload
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const { url } = await uploadRes.json();

      // Call advanced API
      const res = await fetch("/api/advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: url,
          prompt,
          videoType,
          style,
          placement,
        }),
      });

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-4">
            Advanced Thumbnail Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional thumbnails with AI-powered enhancement and
            multiple format options
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-card rounded-2xl border shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Upload className="w-6 h-6 text-primary" />
              Upload Your Image
            </h2>

            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="mx-auto max-w-md max-h-64 object-contain rounded-lg shadow-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click or drag to replace image
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your image here</p>
                    <p className="text-muted-foreground">
                      or click to browse files
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl border shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              Customize Your Thumbnail
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" /> Prompt
                </label>
                <input
                  type="text"
                  placeholder="e.g., Exciting Tech Review of the Latest Smartphone"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  Video Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tech Review, Gaming, Tutorial"
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  Style / Mood
                </label>
                <input
                  type="text"
                  placeholder="e.g., Modern, Energetic, Professional"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Photo Placement
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="left">Photo Left</option>
                  <option value="center">Photo Center</option>
                  <option value="right">Photo Right</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!file || isGenerating}
              className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Thumbnails...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Thumbnails
                </>
              )}
            </button>
          </div>

          {results && (
            <div className="bg-card rounded-2xl border shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Generated Results</h2>

              {/* Enhanced prompt display */}
              {/* <div className="bg-primary/5 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  AI-Enhanced Prompt
                </h3>
                <p className="text-foreground leading-relaxed">
                  {results.rewrittenPrompt}
                </p>
              </div> */}

              {/* Horizontal thumbnails */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-6 h-4 bg-primary rounded-sm" />
                  Horizontal (YouTube)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {results.horizontal.map((img: any, i: number) => (
                    <div key={i} className="group">
                      <div className="relative overflow-hidden rounded-xl shadow-lg">
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={`Horizontal ${i}`}
                          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => copyToClipboard(img.url)}
                          className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                        <a
                          href={img.url}
                          download={`thumb_h_${i + 1}.jpg`}
                          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical thumbnails */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-4 h-6 bg-accent rounded-sm" />
                  Vertical (Shorts/Reels)
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.vertical.map((img: any, i: number) => (
                    <div key={i} className="group">
                      <div className="relative overflow-hidden rounded-xl shadow-lg">
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={`Vertical ${i}`}
                          className="w-full aspect-[9/16] object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => copyToClipboard(img.url)}
                          className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1 text-sm"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                        <a
                          href={img.url}
                          download={`thumb_v_${i + 1}.jpg`}
                          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 text-sm"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulk download button */}
              <button
                onClick={downloadAll}
                className="w-full px-8 py-4 bg-gradient-to-r from-accent to-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download All as ZIP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
