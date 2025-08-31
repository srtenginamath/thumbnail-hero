/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import type React from "react";

import {
  Upload,
  Sparkles,
  Download,
  ImageIcon,
  Zap,
  Brain,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "@/components/theme-toggle";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [desc, setDesc] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  console.log("User:", user);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

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

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleGenerate = async () => {
    if (!file || !prompt) return;

    setIsGenerating(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const { url } = await uploadRes.json();
      if (!url) throw new Error("Upload failed");

      const res = await fetch("/api/thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url, prompt }),
      });

      const data = await res.json();
      if (data.images) {
        setThumbs(data.images.map((img: any) => img.url));
        setDesc(data.description || "");
      } else {
        throw new Error("Generation failed: " + JSON.stringify(data));
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `thumbnail-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  Create Thumbnail
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  15/20 credits
                </span>
              </div>
              {/* <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.fullName ?? undefined}
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar> */}

              <ModeToggle />
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-4">
            AI Thumbnail Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your images into stunning thumbnails with the power of AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <CardContent className="p-8">
              <div
                className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
                  dragActive
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-muted-foreground/25 hover:border-primary/50"
                } ${preview ? "p-4" : "p-12"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative group">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Uploaded preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Upload your image
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Drag and drop your image here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Choose Image
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <label className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Describe your thumbnail
                </label>
                <textarea
                  placeholder="e.g., make this thumbnail for food cooking with vibrant colors and appetizing text overlay"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-24 px-4 py-3 border border-input rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleGenerate}
              disabled={!file || !prompt || isGenerating}
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Thumbnails
                </>
              )}
            </Button>
          </div>

          {desc && (
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <p className="text-center text-lg font-medium">{desc}</p>
              </CardContent>
            </Card>
          )}

          {thumbs.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">
                Generated Thumbnails
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {thumbs.map((url, i) => (
                  <Card
                    key={i}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <CardContent className="p-0 relative">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Generated thumbnail ${i + 1}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 right-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownload(url, i)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
