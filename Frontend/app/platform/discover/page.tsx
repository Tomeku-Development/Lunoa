"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, MapPin, Navigation, Search, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

export default function DiscoverPage() {
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
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              Discover & Explore
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Hidden Gems and Cultural Hotspots</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Navigate through a curated world of cultural experiences with our AI-powered discovery engine. Every
              location tells a story, every moment becomes memorable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Start Exploring
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by AI and Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our discovery engine combines artificial intelligence with community curation to surface the most
              authentic cultural experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
              <CardHeader>
                <Search className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>AI-Powered Recommendations</CardTitle>
                <CardDescription>
                  Personalized discovery based on your interests, location, and cultural preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Machine learning algorithms</li>
                  <li>• Behavioral pattern analysis</li>
                  <li>• Real-time preference updates</li>
                  <li>• Cultural context awareness</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <CardHeader>
                <Navigation className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>
                  Explore cultural hotspots with our immersive, real-time discovery map interface.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time location updates</li>
                  <li>• Augmented reality integration</li>
                  <li>• Community-verified locations</li>
                  <li>• Historical cultural data</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
              <CardHeader>
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Community Curation</CardTitle>
                <CardDescription>
                  Discover places recommended and verified by fellow cultural explorers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Peer-reviewed locations</li>
                  <li>• Community ratings & reviews</li>
                  <li>• Local expert insights</li>
                  <li>• Cultural authenticity scores</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Discovery Works</h2>
            <p className="text-lg text-muted-foreground">From exploration to experience in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Open the Map</h3>
              <p className="text-muted-foreground">
                Launch the Lunoa app and explore the personalized discovery map tailored to your cultural interests.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Discover Locations</h3>
              <p className="text-muted-foreground">
                Browse AI-recommended hotspots, community favorites, and hidden gems near you or anywhere in the world.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Experience & Share</h3>
              <p className="text-muted-foreground">
                Visit locations, mint Vibe NFTs, complete quests, and share your discoveries with the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Cultural Journey Today</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of explorers who are discovering authentic cultural experiences through Lunoa.
          </p>
          <Button size="lg" className="px-8">
            Launch Discovery Map
            <MapPin className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}
