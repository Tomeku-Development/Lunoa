"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Coins, CreditCard, TrendingUp, Wallet, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

export default function MarketplacePage() {
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
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Wallet className="w-4 h-4 mr-2" />
              Earn & Trade
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Build Your Cultural Capital</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Participate in the cultural economy by trading Vibe NFTs, boosting valuable content, and earning from your
              cultural contributions. Access micro-loans and premium features through your on-chain reputation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Explore Marketplace
                <Wallet className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cultural Economy Features</h2>
            <p className="text-lg text-muted-foreground">
              Multiple ways to earn, trade, and build value in the cultural ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
              <CardHeader>
                <Coins className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Vibe NFT Trading</CardTitle>
                <CardDescription>
                  Buy, sell, and trade cultural moment NFTs in the decentralized marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Peer-to-peer NFT trading</li>
                  <li>• Price discovery mechanisms</li>
                  <li>• Creator royalty system</li>
                  <li>• Collection bundling</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Content Boosting</CardTitle>
                <CardDescription>
                  Use $Lunoa tokens to boost valuable cultural content and earn from curation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Micro-transaction boosting</li>
                  <li>• Curator reward sharing</li>
                  <li>• Visibility algorithms</li>
                  <li>• Community validation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
              <CardHeader>
                <CreditCard className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Micro-Loans</CardTitle>
                <CardDescription>
                  Access decentralized credit based on your cultural reputation and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Reputation-based lending</li>
                  <li>• Community-funded pools</li>
                  <li>• Flexible repayment terms</li>
                  <li>• Cultural collateral</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle>Creator Economy</CardTitle>
                <CardDescription>
                  Monetize your cultural contributions and build sustainable income streams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Revenue from Vibe NFTs</li>
                  <li>• Quest creation rewards</li>
                  <li>• Community leadership</li>
                  <li>• Brand partnerships</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 dark:hover:border-red-800 transition-colors">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Premium Analytics</CardTitle>
                <CardDescription>Access advanced analytics and insights for businesses and power users</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cultural trend analysis</li>
                  <li>• Location performance metrics</li>
                  <li>• Community insights</li>
                  <li>• ROI tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <CardHeader>
                <Wallet className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>Streaming Payments</CardTitle>
                <CardDescription>
                  Enable continuous payments for featured locations and premium services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time payment streams</li>
                  <li>• Featured map placement</li>
                  <li>• Subscription services</li>
                  <li>• Automated settlements</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Trading Works */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Cultural Trading Works</h2>
            <p className="text-lg text-muted-foreground">
              Simple steps to start earning from your cultural contributions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Value</h3>
              <p className="text-sm text-muted-foreground">
                Mint Vibe NFTs, complete quests, and contribute to communities to build cultural capital.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">List Assets</h3>
              <p className="text-sm text-muted-foreground">
                List your Vibe NFTs and cultural assets on the marketplace with your desired pricing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Trade & Earn</h3>
              <p className="text-sm text-muted-foreground">
                Execute trades, earn from sales, and receive ongoing royalties from your cultural contributions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Reinvest</h3>
              <p className="text-sm text-muted-foreground">
                Use earnings to boost content, fund new quests, or invest in other cultural assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Revenue Opportunities</h2>
            <p className="text-lg text-muted-foreground">
              Multiple ways to generate income from your cultural activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4">For Creators</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>NFT sales and royalties from Vibe NFTs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Quest creation and curation rewards</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Community leadership and governance tokens</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Brand partnership opportunities</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Content boosting and curation earnings</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Sponsored quest campaigns and partnerships</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Premium analytics and insights subscriptions</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Featured placement and streaming payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Community engagement and marketing tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Cultural reputation and credit scoring</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join the cultural economy and start building sustainable income from your cultural contributions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Explore Marketplace
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-white text-white hover:bg-white hover:text-indigo-600 bg-transparent"
            >
              View Analytics
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}
