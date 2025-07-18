"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Heart, MessageCircle, Star, Users, Vote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

const communityTypes = [
  {
    name: "Tokyo Street Art Explorers",
    members: 1247,
    category: "Art & Culture",
    description: "Discovering and documenting Tokyo's vibrant street art scene",
    recentActivity: "3 new locations added today",
    color: "purple",
  },
  {
    name: "Global Food Adventures",
    members: 2891,
    category: "Food & Dining",
    description: "Authentic culinary experiences from around the world",
    recentActivity: "Weekly food quest completed",
    color: "orange",
  },
  {
    name: "Historic Architecture Hunters",
    members: 856,
    category: "Architecture",
    description: "Preserving architectural heritage through digital documentation",
    recentActivity: "New collection: Victorian London",
    color: "blue",
  },
]

export default function CommunitiesPage() {
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
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Users className="w-4 h-4 mr-2" />
              Join Communities
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect with Cultural Explorers</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Form and join themed communities that curate cultural experiences together. Find your tribe and explore
              the world through shared interests and collective discovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Find Your Community
                <Users className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Create Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Adventurer's Groups</h2>
            <p className="text-lg text-muted-foreground">Join active communities exploring culture around the world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {communityTypes.map((community, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{community.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {community.members.toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{community.name}</CardTitle>
                  <CardDescription>{community.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {community.recentActivity}
                    </div>
                    <Button className="w-full bg-transparent" variant="outline">
                      Join Community
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to build and participate in cultural communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Collaborative Curation</CardTitle>
                <CardDescription>
                  Work together to discover, verify, and curate the best cultural experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Shared location discovery</li>
                  <li>• Community verification</li>
                  <li>• Collective storytelling</li>
                  <li>• Cultural context sharing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle>Exclusive Quests</CardTitle>
                <CardDescription>Create and participate in community-specific quests and challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Community-created quests</li>
                  <li>• Group challenges</li>
                  <li>• Exclusive rewards</li>
                  <li>• Leaderboards</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Vibe Sharing</CardTitle>
                <CardDescription>Share exclusive Vibe NFTs and cultural moments within your community</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Private Vibe galleries</li>
                  <li>• Community collections</li>
                  <li>• Member-only content</li>
                  <li>• Cultural archives</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Vote className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>DAO Governance</CardTitle>
                <CardDescription>
                  Participate in decentralized governance and shape your community's future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Community proposals</li>
                  <li>• Democratic voting</li>
                  <li>• Resource allocation</li>
                  <li>• Rule setting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Member Benefits</CardTitle>
                <CardDescription>
                  Enjoy exclusive perks and recognition for active community participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Member badges</li>
                  <li>• Reputation rewards</li>
                  <li>• Early access</li>
                  <li>• Special events</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>Communication Tools</CardTitle>
                <CardDescription>Stay connected with built-in messaging and coordination features</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Group messaging</li>
                  <li>• Event coordination</li>
                  <li>• Real-time updates</li>
                  <li>• Cultural discussions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Start */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Community Journey</h2>
            <p className="text-lg text-muted-foreground">
              Whether joining or creating, building cultural communities is easy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Joining a Community</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Browse Communities</h4>
                    <p className="text-sm text-muted-foreground">
                      Explore communities by interest, location, or activity level
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Request to Join</h4>
                    <p className="text-sm text-muted-foreground">Submit a join request with your cultural interests</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Start Participating</h4>
                    <p className="text-sm text-muted-foreground">
                      Join quests, share discoveries, and build relationships
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Creating a Community</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Define Your Vision</h4>
                    <p className="text-sm text-muted-foreground">Choose your cultural focus and community goals</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Set Up Governance</h4>
                    <p className="text-sm text-muted-foreground">Configure voting rules and community guidelines</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Invite Members</h4>
                    <p className="text-sm text-muted-foreground">Grow your community and start cultural exploration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Cultural Movement?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Connect with like-minded explorers and start building cultural experiences together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Browse Communities
              <Users className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
            >
              Create Community
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}
