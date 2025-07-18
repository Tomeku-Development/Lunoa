"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, MapPin, Trophy, Users, Wallet } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

const platformFeatures = [
  {
    id: "discover",
    icon: MapPin,
    title: "Discover & Explore",
    description:
      "Find hidden gems and cultural hotspots through our personalized discovery map. Every location tells a story.",
    longDescription:
      "Navigate through a curated world of cultural experiences with our AI-powered discovery engine. From underground art galleries to local food scenes, every location is verified by the community and enriched with cultural context.",
    features: [
      "Personalized discovery map with AI recommendations",
      "Real-time location-based cultural events",
      "Community-verified hotspots and hidden gems",
      "Interactive cultural storytelling",
      "Augmented reality location experiences",
    ],
    cta: "Start Exploring",
    href: "/platform/discover",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "mint",
    icon: Camera,
    title: "Mint Vibe NFTs",
    description:
      "Transform your real-world experiences into unique Vibe NFTs. Capture moments, create culture, own your memories.",
    longDescription:
      "Turn every cultural moment into a permanent, ownable digital asset. Vibe NFTs contain rich metadata including location, timestamp, media, and cultural context, creating verifiable proof of your real-world experiences.",
    features: [
      "One-tap NFT minting from real locations",
      "Rich metadata with GPS coordinates and timestamps",
      "Decentralized storage on Arweave",
      "Cultural artifact verification",
      "Fractionalized NFT trading capabilities",
    ],
    cta: "Mint Your Vibe",
    href: "/platform/mint",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "quests",
    icon: Trophy,
    title: "Complete Quests",
    description: "Embark on daily adventures and branded challenges. Earn $Lunoa tokens and exclusive rewards.",
    longDescription:
      "Gamify your cultural exploration with dynamic quests that guide you to new experiences. From daily challenges to brand partnerships, every quest rewards you with tokens, NFT badges, and social reputation.",
    features: [
      "Daily, weekly, and seasonal quest challenges",
      "Brand-sponsored cultural experiences",
      "$Lunoa token rewards and NFT badges",
      "Social reputation and leaderboards",
      "Community-created quest campaigns",
    ],
    cta: "View Quests",
    href: "/platform/quests",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: "communities",
    icon: Users,
    title: "Join Communities",
    description:
      "Connect with like-minded explorers in Adventurer's Groups. Share discoveries and create cultural movements.",
    longDescription:
      "Form and join themed communities that curate cultural experiences together. From food enthusiasts to art collectors, find your tribe and explore the world through shared interests and collective discovery.",
    features: [
      "Themed Adventurer's Groups and communities",
      "Collaborative quest creation and curation",
      "Exclusive community Vibe sharing",
      "Group challenges and competitions",
      "Cultural DAO governance participation",
    ],
    cta: "Find Groups",
    href: "/platform/communities",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "marketplace",
    icon: Wallet,
    title: "Earn & Trade",
    description:
      "Build cultural capital through micro-transactions, boost valuable content, and participate in the creator economy.",
    longDescription:
      "Participate in the cultural economy by trading Vibe NFTs, boosting valuable content, and earning from your cultural contributions. Access micro-loans and premium features through your on-chain reputation.",
    features: [
      "Vibe NFT marketplace and trading",
      "Content boosting with $Lunoa tokens",
      "Creator economy participation",
      "Micro-loans based on cultural reputation",
      "Premium analytics and business tools",
    ],
    cta: "Start Trading",
    href: "/platform/marketplace",
    gradient: "from-indigo-500 to-purple-500",
  },
]

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 ml-8">
            <Image src="/lunoa-logo.svg" alt="Lunoa" width={120} height={120} className="w-30 h-30" />
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
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            Platform Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Experience Culture Like Never Before</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Lunoa transforms how you discover, experience, and own cultural moments through blockchain technology and
            gamified social interaction.
          </p>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="space-y-24">
            {platformFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-16`}
              >
                <div className="flex-1 space-y-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} p-0.5`}>
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <feature.icon className="w-8 h-8" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{feature.longDescription}</p>

                    <ul className="space-y-2 mb-8">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Button asChild className="group">
                      <Link href={feature.href}>
                        {feature.cta}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <div className={`aspect-video rounded-xl bg-gradient-to-br ${feature.gradient} p-1`}>
                    <div className="w-full h-full rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center">
                      <feature.icon className="w-24 h-24 text-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Your Cultural Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of cultural explorers who are already building their on-chain cultural capital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Launch Testnet App
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}
