/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  Plus,
  Download,
  Share2,
  Copy,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  Calendar,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  // Mock data - in real app this would come from API/database
  const users = {
    name: "Alex Creator",
    email: "alex@example.com",
    avatar: "/diverse-user-avatars.png",
    creditsRemaining: 15,
    totalCredits: 20,
    plan: "Free",
  };

  //   const recentThumbnails = [
  //     {
  //       id: 1,
  //       title: "Top 10 Tech Gadgets 2025",
  //       createdAt: "2 hours ago",
  //       formats: {
  //         horizontal: "/tech-gadgets-thumbnail.png",
  //         vertical: "/tech-gadgets-vertical.png",
  //       },
  //       status: "completed",
  //     },
  //     {
  //       id: 2,
  //       title: "How to Build a Gaming PC",
  //       createdAt: "1 day ago",
  //       formats: {
  //         horizontal: "/gaming-pc-build-thumbnail.png",
  //         vertical: "/gaming-pc-vertical.png",
  //       },
  //       status: "completed",
  //     },
  //     {
  //       id: 3,
  //       title: "Best Productivity Apps",
  //       createdAt: "3 days ago",
  //       formats: {
  //         horizontal: "/productivity-apps-thumbnail.png",
  //         vertical: "/productivity-apps-vertical.png",
  //       },
  //       status: "completed",
  //     },
  //     {
  //       id: 4,
  //       title: "Crypto Trading Tips",
  //       createdAt: "1 week ago",
  //       formats: {
  //         horizontal: "/crypto-trading-thumbnail.png",
  //         vertical: "/crypto-trading-vertical.png",
  //       },
  //       status: "completed",
  //     },
  //   ];

  return (
    <div className="min-h-screen bg-background">
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

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.fullName}
            </h2>
            <p className="text-muted-foreground">
              Ready to create some amazing thumbnails?
            </p>
          </div>
          <Link href="/create">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Thumbnail
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* <Link href="/credits"> */}
          <Card className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Credits Remaining
              </CardTitle>
              <Zap className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {users.creditsRemaining}
              </div>
              <p className="text-xs text-muted-foreground">
                of {users.totalCredits} this month
              </p>
            </CardContent>
          </Card>
          {/* </Link> */}

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Thumbnails Created
              </CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24</div>
              <p className="text-xs text-muted-foreground">
                +4 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Avg. Generation Time
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">28s</div>
              <p className="text-xs text-muted-foreground">
                2s faster than average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Thumbnails */}
        {/* <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">
              Recent Thumbnails
            </h3>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentThumbnails.map((thumbnail) => (
              <Card
                key={thumbnail.id}
                className="bg-card border-border group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                    <img
                      src={thumbnail.formats.horizontal || "/placeholder.svg"}
                      alt={thumbnail.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                    {thumbnail.title}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {thumbnail.createdAt}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {thumbnail.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs bg-transparent"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-2 bg-transparent"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download ZIP
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-border">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to create your next viral thumbnail?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use your remaining {users.creditsRemaining} credits to generate
              professional thumbnails that boost your click-through rate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Thumbnail
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                Browse Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
