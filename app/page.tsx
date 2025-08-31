/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Zap,
  Download,
  Sparkles,
  Upload,
  Wand2,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, user, isLoaded } = useUser();

  // {user.firstName}

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(".hero-badge", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
    })
      .from(
        ".hero-title",
        { opacity: 0, y: 50, duration: 1, ease: "power2.out" },
        "-=0.4"
      )
      .from(
        ".hero-description",
        { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      )
      .from(
        ".hero-buttons",
        { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
      .from(
        ".hero-features",
        { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );

    gsap.fromTo(
      ".process-step",
      { opacity: 0, y: 60, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      }
    );

    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 50, rotationX: 15 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".pricing-card",
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: pricingRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
        },
      }
    );

    gsap.to(".floating-icon", {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // if (!isSignedIn) {
  //   return <div>Sign in to view this page</div>;
  // }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">ThumbnailHero</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                PRICING
              </a>
            </nav>
            <ModeToggle />

            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/create" className="flex items-center">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="container mx-auto px-4 py-16 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="hero-badge mb-6 bg-accent/10 text-accent border-accent/20"
          >
            <Star className="w-3 h-3 mr-1" />
            Trusted by 10,000+ YouTube Creators
          </Badge>
          <h2 className="hero-title text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Create <span className="text-primary">Click-Worthy</span> YouTube
            Thumbnails in Seconds
          </h2>
          <p className="hero-description text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Transform your ideas into professional thumbnails with AI. Just
            upload a photo, add your prompt, and get stunning results in both
            horizontal and vertical formats.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/create" className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          <div className="hero-features flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-accent" />
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-accent" />
              20 free thumbnails
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-accent" />
              Ready in 30 seconds
            </div>
          </div>
        </div>
      </section>

      <section
        ref={processRef}
        className="container mx-auto px-4 py-16 bg-card/50"
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Simple 3-Step Process
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From idea to thumbnail in under 2 minutes. No design skills
            required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="process-step text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 floating-icon">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-2">
              1. Upload & Describe
            </h4>
            <p className="text-muted-foreground">
              Upload your photo (optional) and describe your video with a simple
              prompt
            </p>
          </div>

          <div className="process-step text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 floating-icon">
              <Wand2 className="w-8 h-8 text-accent" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-2">
              2. AI Enhancement
            </h4>
            <p className="text-muted-foreground">
              Our AI enhances your prompt with trending keywords and optimal
              composition
            </p>
          </div>

          <div className="process-step text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 floating-icon">
              <Download className="w-8 h-8 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-2">
              3. Download & Upload
            </h4>
            <p className="text-muted-foreground">
              Get multiple variations in YouTube and Shorts formats, ready to
              use
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Why Creators Choose ThumbnailHero
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built specifically for YouTube creators who want professional
            results without the design complexity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="feature-card bg-card border-border">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 floating-icon">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Lightning Fast</CardTitle>
              <CardDescription className="text-card-foreground">
                Generate professional thumbnails in under 30 seconds with our
                advanced AI models
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="feature-card bg-card border-border">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 floating-icon">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-foreground">
                AI-Powered Enhancement
              </CardTitle>
              <CardDescription className="text-card-foreground">
                Our AI enhances your prompts with trending keywords and optimal
                composition
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="feature-card bg-card border-border">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 floating-icon">
                <Download className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-foreground">
                Multi-Format Export
              </CardTitle>
              <CardDescription className="text-card-foreground">
                Get both YouTube (16:9) and Shorts (9:16) formats instantly,
                ready to upload
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        ref={pricingRef}
        className="container mx-auto px-4 py-16 bg-card/50"
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Simple, Creator-Friendly Pricing
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. No hidden fees, no
            surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="pricing-card bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Free</CardTitle>
              <div className="text-3xl font-bold text-foreground">$0</div>
              <CardDescription className="text-card-foreground">
                Perfect for getting started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    20 thumbnails/month
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    Both formats (16:9 & 9:16)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    Basic AI enhancement
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="pricing-card bg-card border-primary relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Pro</CardTitle>
              <div className="text-3xl font-bold text-foreground">$9.99</div>
              <CardDescription className="text-card-foreground">
                For serious creators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    200 thumbnails/month
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">No watermarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    Priority generation
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    Advanced AI models
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="pricing-card bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Business</CardTitle>
              <div className="text-3xl font-bold text-foreground">$29.99</div>
              <CardDescription className="text-card-foreground">
                For agencies & teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    1000 thumbnails/month
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    Brand kit & templates
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    Analytics & insights
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-card-foreground">
                    Team collaboration
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card
          ref={ctaRef}
          className="bg-gradient-to-r from-primary/10 to-accent/10 border-border"
        >
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Boost Your Click-Through Rate?
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of creators who&apos;ve increased their views with
              AI-generated thumbnails
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              20 free thumbnails • No credit card required
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">
                ThumbnailHero
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 ThumbnailHero. Built for creators, by creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
