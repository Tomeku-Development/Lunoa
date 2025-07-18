"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Clock, MapPin, Shield, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

export default function MintPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 ml-8">
            <Image src="/lunoa-logo.svg" alt="Lunoa" width={120} height={120} className="w-30 h-30 dark:invert" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/platform" className="text-sm font-medium text-primary">
              Platform
            </Link>
            <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors">
              Resources
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/community" className="text-sm font-medium hover:text-primary transition-colors">
              Community
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Camera className="w-4 h-4 mr-2" />
              Mint Vibe NFTs
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Transform Moments into Digital Assets</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Turn every cultural experience into a permanent, ownable digital asset. Vibe NFTs capture the essence of
              real-world moments with rich metadata and verifiable authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Mint Your First Vibe
                <Sparkles className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What are Vibe NFTs */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What are Vibe NFTs?</h2>
            <p className="text-lg text-muted-foreground">
              Vibe NFTs are tokenized Real-World Assets (RWAs) that contain rich metadata, media, timestamps, and
              coordinates, serving as digital collectibles and verifiable cultural artifacts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Rich Cultural Metadata</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Location Data:</strong> GPS coordinates, venue information, and cultural context
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Timestamp:</strong> Exact moment of creation with blockchain verification
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Media Assets:</strong> Photos, videos, and audio stored on decentralized networks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Authenticity:</strong> Cryptographic proof of real-world experience
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
              <div className="text-center">
                <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Sample Vibe NFT</h4>
                <p className="text-sm text-muted-foreground mb-4">"Sunset at Tokyo Street Art Gallery"</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>📍 Shibuya, Tokyo, Japan</p>
                  <p>🕐 2024-12-18 18:30 JST</p>
                  <p>🎨 Street Art & Culture</p>
                  <p>✨ Verified by Community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minting Process */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Mint Vibe NFTs</h2>
            <p className="text-lg text-muted-foreground">
              Simple, one-tap minting process that captures the full essence of your cultural experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visit Location</h3>
              <p className="text-sm text-muted-foreground">
                Arrive at a cultural hotspot or discover a new place through exploration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Capture Moment</h3>
              <p className="text-sm text-muted-foreground">
                Take photos, record videos, or add notes about your cultural experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">One-Tap Mint</h3>
              <p className="text-sm text-muted-foreground">
                Mint your Vibe NFT instantly with all metadata automatically captured.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Own Forever</h3>
              <p className="text-sm text-muted-foreground">
                Your cultural moment is now permanently stored on-chain and owned by you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Endless Possibilities</h2>
            <p className="text-lg text-muted-foreground">
              Vibe NFTs can be traded, fractionalized, and bundled into cultural collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Collections</CardTitle>
                <CardDescription>
                  Bundle related Vibe NFTs into thematic collections like "Tokyo Street Art" or "Paris Café Culture"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Curated cultural experiences</li>
                  <li>• Increased collection value</li>
                  <li>• Community recognition</li>
                  <li>• Cultural storytelling</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fractional Ownership</CardTitle>
                <CardDescription>
                  Share ownership of valuable cultural moments with other community members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Democratized access</li>
                  <li>• Shared cultural value</li>
                  <li>• Community investment</li>
                  <li>• Collective ownership</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading & Commerce</CardTitle>
                <CardDescription>Buy, sell, and trade Vibe NFTs in the cultural marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cultural asset trading</li>
                  <li>• Price discovery</li>
                  <li>• Creator royalties</li>
                  <li>• Market liquidity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Mint Your First Vibe?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start capturing and owning your cultural experiences today. Every moment has value.
          </p>
          <Button size="lg" variant="secondary" className="px-8">
            Start Minting Now
            <Camera className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}
