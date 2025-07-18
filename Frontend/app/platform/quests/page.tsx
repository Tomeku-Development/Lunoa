"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Coins, Crown, Gift, Trophy, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

const questTypes = [
  {
    icon: Calendar,
    title: "Daily Quests",
    description: "Quick cultural challenges that refresh every day",
    examples: ["Visit 2 local cafés", "Discover a street art piece", "Try a new cuisine"],
    reward: "50-100 $LUNOA",
    color: "blue",
  },
  {
    icon: Trophy,
    title: "Weekly Challenges",
    description: "More complex adventures spanning multiple days",
    examples: ["Complete a neighborhood food tour", "Attend 3 cultural events", "Create a themed collection"],
    reward: "200-500 $LUNOA",
    color: "purple",
  },
  {
    icon: Crown,
    title: "Branded Quests",
    description: "Sponsored experiences from cultural partners",
    examples: ["Museum exhibition tours", "Restaurant partnerships", "Festival experiences"],
    reward: "Premium NFTs + Tokens",
    color: "orange",
  },
]

export default function QuestsPage() {
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
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Trophy className="w-4 h-4 mr-2" />
              Complete Quests
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Gamify Your Cultural Journey</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Embark on daily adventures and branded challenges. Earn $Lunoa tokens, exclusive NFT badges, and build
              your cultural reputation through guided exploration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                View Active Quests
                <Trophy className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Create Quest
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quest Types */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Types of Quests</h2>
            <p className="text-lg text-muted-foreground">From quick daily challenges to epic cultural adventures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {questTypes.map((quest, idx) => (
              <Card
                key={idx}
                className={`border-2 hover:border-${quest.color}-200 dark:hover:border-${quest.color}-800 transition-colors`}
              >
                <CardHeader>
                  <quest.icon className={`w-8 h-8 text-${quest.color}-600 mb-2`} />
                  <CardTitle>{quest.title}</CardTitle>
                  <CardDescription>{quest.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Example Quests:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {quest.examples.map((example, i) => (
                          <li key={i}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={`bg-${quest.color}-50 dark:bg-${quest.color}-950/20 rounded-lg p-3`}>
                      <p className="text-sm font-semibold">Typical Reward:</p>
                      <p className={`text-sm text-${quest.color}-600`}>{quest.reward}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Quests Work */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Quests Work</h2>
            <p className="text-lg text-muted-foreground">
              Simple steps to start earning rewards through cultural exploration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse Quests</h3>
              <p className="text-sm text-muted-foreground">
                Explore available daily, weekly, and branded quests in your area or globally.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Accept Challenge</h3>
              <p className="text-sm text-muted-foreground">
                Choose quests that match your interests and start your cultural adventure.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Visit locations, mint Vibe NFTs, and complete quest objectives.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Receive $Lunoa tokens, NFT badges, and boost your cultural reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards System */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quest Rewards</h2>
            <p className="text-lg text-muted-foreground">Multiple ways to earn and build your cultural capital</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <CardTitle className="text-lg">$LUNOA Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Earn platform tokens for quest completion and use them for boosting, governance, and premium features.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">NFT Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Collect unique achievement badges that showcase your cultural exploration milestones.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Social Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build your on-chain reputation and unlock access to exclusive quests and communities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Gift className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Exclusive Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gain early access to events, premium features, and special cultural experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Quest?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join the adventure and start earning rewards for your cultural exploration today.
          </p>
          <Button size="lg" variant="secondary" className="px-8">
            View Active Quests
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}
