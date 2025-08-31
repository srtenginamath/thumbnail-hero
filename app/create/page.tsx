/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useState } from "react";
// import type React from "react";

// import {
//   Upload,
//   Sparkles,
//   Download,
//   ImageIcon,
//   Zap,
//   Brain,
//   ArrowLeft,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
// import { ModeToggle } from "@/components/theme-toggle";

// export default function Page() {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [prompt, setPrompt] = useState("");
//   const [thumbs, setThumbs] = useState<string[]>([]);
//   const [desc, setDesc] = useState<string>("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [dragActive, setDragActive] = useState(false);

//   const { isSignedIn, user, isLoaded } = useUser();

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   if (!isSignedIn) {
//     return <div>Sign in to view this page</div>;
//   }

//   console.log("User:", user);

//   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (f) {
//       setFile(f);
//       setPreview(URL.createObjectURL(f));
//     }
//   };

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     const files = e.dataTransfer.files;
//     if (files && files[0]) {
//       setFile(files[0]);
//       setPreview(URL.createObjectURL(files[0]));
//     }
//   };

//   const handleGenerate = async () => {
//     if (!file || !prompt) return;

//     setIsGenerating(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       const uploadRes = await fetch("/api/upload", {
//         method: "POST",
//         body: fd,
//       });
//       const { url } = await uploadRes.json();
//       if (!url) throw new Error("Upload failed");

//       const res = await fetch("/api/thumbnail", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ imageUrl: url, prompt }),
//       });

//       const data = await res.json();
//       if (data.images) {
//         setThumbs(data.images.map((img: any) => img.url));
//         setDesc(data.description || "");
//       } else {
//         throw new Error("Generation failed: " + JSON.stringify(data));
//       }
//     } catch (error) {
//       alert(error instanceof Error ? error.message : "Generation failed");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleDownload = async (imageUrl: string, index: number) => {
//     try {
//       const response = await fetch(imageUrl);
//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `thumbnail-${index + 1}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert("Failed to download image. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
//       <header className="border-b border-border bg-card">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link
//                 href="/dashboard"
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back to Dashboard
//               </Link>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-xl font-bold text-foreground">
//                   Create Thumbnail
//                 </h1>
//                 <Badge
//                   variant="secondary"
//                   className="bg-primary/10 text-primary border-primary/20"
//                 >
//                   <Brain className="w-3 h-3 mr-1" />
//                   AI-Powered
//                 </Badge>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Zap className="w-4 h-4 text-accent" />
//                 <span className="text-sm font-medium text-foreground">
//                   15/20 credits
//                 </span>
//               </div>
//               {/* <Avatar className="h-8 w-8">
//                 <AvatarImage
//                   src={user.imageUrl}
//                   alt={user.fullName ?? undefined}
//                 />
//                 <AvatarFallback>AC</AvatarFallback>
//               </Avatar> */}

//               <ModeToggle />
//               <SignedIn>
//                 <UserButton />
//               </SignedIn>
//             </div>
//           </div>
//         </div>
//       </header>
//       <div className="container mx-auto px-4 py-12">
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-4">
//             AI Thumbnail Generator
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Transform your images into stunning thumbnails with the power of AI
//           </p>
//         </div>

//         <div className="max-w-4xl mx-auto space-y-8">
//           <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
//             <CardContent className="p-8">
//               <div
//                 className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
//                   dragActive
//                     ? "border-primary bg-primary/5 scale-105"
//                     : "border-muted-foreground/25 hover:border-primary/50"
//                 } ${preview ? "p-4" : "p-12"}`}
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//               >
//                 {preview ? (
//                   <div className="relative group">
//                     <img
//                       src={preview || "/placeholder.svg"}
//                       alt="Uploaded preview"
//                       className="w-full h-64 object-cover rounded-lg"
//                     />
//                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
//                       <Button
//                         variant="secondary"
//                         onClick={() => {
//                           setFile(null);
//                           setPreview(null);
//                         }}
//                       >
//                         Remove Image
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center">
//                     <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">
//                       Upload your image
//                     </h3>
//                     <p className="text-muted-foreground mb-6">
//                       Drag and drop your image here, or click to browse
//                     </p>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFile}
//                       className="hidden"
//                       id="file-upload"
//                     />
//                     <Button asChild variant="outline">
//                       <label htmlFor="file-upload" className="cursor-pointer">
//                         <ImageIcon className="mr-2 h-4 w-4" />
//                         Choose Image
//                       </label>
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 <label className="text-lg font-semibold flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-primary" />
//                   Describe your thumbnail
//                 </label>
//                 <textarea
//                   placeholder="e.g., make this thumbnail for food cooking with vibrant colors and appetizing text overlay"
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   className="w-full h-24 px-4 py-3 border border-input rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <div className="text-center">
//             <Button
//               onClick={handleGenerate}
//               disabled={!file || !prompt || isGenerating}
//               size="lg"
//               className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-200"
//             >
//               {isGenerating ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="mr-2 h-5 w-5" />
//                   Generate Thumbnails
//                 </>
//               )}
//             </Button>
//           </div>

//           {desc && (
//             <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
//               <CardContent className="p-6">
//                 <p className="text-center text-lg font-medium">{desc}</p>
//               </CardContent>
//             </Card>
//           )}

//           {thumbs.length > 0 && (
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-center">
//                 Generated Thumbnails
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {thumbs.map((url, i) => (
//                   <Card
//                     key={i}
//                     className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
//                   >
//                     <CardContent className="p-0 relative">
//                       <img
//                         src={url || "/placeholder.svg"}
//                         alt={`Generated thumbnail ${i + 1}`}
//                         className="w-full h-64 object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//                         <div className="absolute bottom-4 right-4">
//                           <Button
//                             size="sm"
//                             variant="secondary"
//                             onClick={() => handleDownload(url, i)}
//                           >
//                             <Download className="h-4 w-4 mr-2" />
//                             Download
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

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
  Zap,
} from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

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

  const users = {
    name: "Alex Creator",
    email: "alex@example.com",
    avatar: "/diverse-user-avatars.png",
    creditsRemaining: 15,
    totalCredits: 20,
    plan: "Free",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  ThumbnailHero
                </h1>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Button variant="ghost" className="text-foreground">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Templates
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Analytics
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/credits"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  {users.creditsRemaining}/{users.totalCredits} credits
                </span>
              </Link>
              <ModeToggle />

              <SignedIn>
                <UserButton />
              </SignedIn>

              {/* Theme Toggle Button */}
            </div>
          </div>
        </div>
      </header>
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
