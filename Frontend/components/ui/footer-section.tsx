"use client"

import { TooltipContent } from "@/components/ui/tooltip"

import { TooltipTrigger } from "@/components/ui/tooltip"

import { Tooltip } from "@/components/ui/tooltip"

import { TooltipProvider } from "@/components/ui/tooltip"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram, Linkedin, Send, Twitter } from "lucide-react"
import Link from "next/link"

function Footerdemo() {
  React.useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Connected</h2>
            <p className="mb-6 text-muted-foreground">
              Join our community and be the first to experience the future of cultural discovery.
            </p>
            <form className="relative">
              <Input type="email" placeholder="Enter your email" className="pr-12 backdrop-blur-sm" />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Platform</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/platform/discover" className="block transition-colors hover:text-primary">
                Discover
              </Link>
              <Link href="/platform/mint" className="block transition-colors hover:text-primary">
                Mint Vibes
              </Link>
              <Link href="/platform/quests" className="block transition-colors hover:text-primary">
                Quests
              </Link>
              <Link href="/platform/communities" className="block transition-colors hover:text-primary">
                Communities
              </Link>
              <Link href="/platform/marketplace" className="block transition-colors hover:text-primary">
                Marketplace
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/resources/documentation" className="block transition-colors hover:text-primary">
                Documentation
              </Link>
              <Link href="/resources/api" className="block transition-colors hover:text-primary">
                API Reference
              </Link>
              <Link href="/resources/whitepaper" className="block transition-colors hover:text-primary">
                Whitepaper
              </Link>
              <Link href="/resources/blog" className="block transition-colors hover:text-primary">
                Blog
              </Link>
              <Link href="/resources/support" className="block transition-colors hover:text-primary">
                Support
              </Link>
            </nav>
          </div>

          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">© 2024 Lunoa. All rights reserved. Built on Aptos.</p>
          <nav className="flex gap-4 text-sm">
            <Link href="/legal/privacy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/legal/cookies" className="transition-colors hover:text-primary">
              Cookie Settings
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }
