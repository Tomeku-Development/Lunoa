"use client"

import type React from "react"

import { Scene } from "@/components/ui/hero-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Footerdemo } from "@/components/ui/footer-section"
import {
  Coins,
  Globe,
  Smartphone,
  Users,
  Zap,
  Shield,
  Layers,
  MapPin,
  Camera,
  Trophy,
  Wallet,
  Network,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const features = [
  {
    Icon: MapPin,
    name: "Discover & Explore",
    description:
      "Find hidden gems and cultural hotspots through our personalized discovery map. Every location tells a story.",
    href: "#",
    cta: "Start Exploring",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20" />
    ),
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Camera,
    name: "Mint Vibe NFTs",
    description:
      "Transform your real-world experiences into unique Vibe NFTs. Capture moments, create culture, own your memories.",
    href: "#",
    cta: "Mint Your Vibe",
    background: <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Trophy,
    name: "Complete Quests",
    description: "Embark on daily adventures and branded challenges. Earn $Lunoa tokens and exclusive rewards.",
    href: "#",
    cta: "View Quests",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Users,
    name: "Join Communities",
    description:
      "Connect with like-minded explorers in Adventurer's Groups. Share discoveries and create cultural movements.",
    href: "#",
    cta: "Find Groups",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-cyan-500/20" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Wallet,
    name: "Earn & Trade",
    description:
      "Build cultural capital through micro-transactions, boost valuable content, and participate in the creator economy.",
    href: "#",
    cta: "Learn More",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
]

const pillars = [
  {
    icon: Globe,
    title: "Web3 Consumer",
    description: "SocialFi meets GameFi in real-world discovery experiences.",
  },
  {
    icon: Coins,
    title: "Payments & Finance",
    description: "Micro-transactions, streaming payments, and tokenized cultural assets.",
  },
  {
    icon: Network,
    title: "Decentralized Infrastructure",
    description: "Built on Aptos with decentralized storage and AI-powered recommendations.",
  },
]

export default function Home() {
  const typewriterWords = [
    {
      text: "The",
    },
    {
      text: "Operating",
    },
    {
      text: "System",
    },
    {
      text: "for",
    },
    {
      text: "Culture",
      className: "text-purple-500 dark:text-purple-400",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 ml-8">
            <Image src="/lunoa-logo.svg" alt="Lunoa" width={120} height={120} className="w-30 h-30" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/platform" className="text-sm font-medium hover:text-primary transition-colors">
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
      <section className="relative min-h-screen w-screen bg-gradient-to-br from-[#000] to-[#1A2428] text-white flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="w-full max-w-6xl space-y-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge
              variant="secondary"
              className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 px-4 py-2 rounded-full"
            >
              ✨ Built on Aptos Blockchain
            </Badge>

            <div className="space-y-6 flex items-center justify-center flex-col">
              <div className="flex items-center justify-center mb-4">
                <Image src="/lunoa-logo.svg" alt="Lunoa" width={128} height={128} className="w-32 h-32" />
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight max-w-4xl text-balance">
                Bridging Digital and Physical Worlds with Web3
              </h2>
              <p className="text-lg text-neutral-300 max-w-3xl text-balance">
                Discover, mint, and earn through user-curated real-world experiences. Transform everyday life into an
                immersive, quest-driven adventure where culture is co-created and every action is rewarded.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button className="text-sm px-8 py-3 rounded-xl bg-white text-black border border-white/10 shadow-none hover:bg-white/90 transition-none">
                  Launch App
                </Button>
                <Button className="text-sm px-8 py-3 rounded-xl bg-transparent text-white border border-white/20 shadow-none hover:bg-white/10 transition-none">
                  Read Whitepaper
                </Button>
              </div>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 h-48 flex flex-col justify-start items-start space-y-3"
              >
                <pillar.icon size={24} className="text-white/80" />
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="text-sm text-neutral-400">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0">
          <Scene />
        </div>
      </section>

      {/* About Lunoa Section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              The Vision
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Building the Operating System for Culture</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12">
              In a world of fragmented digital engagement, Lunoa creates a foundation where people's contributions,
              habits, and actions in the real world become visible, verifiable, and rewarded on-chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-background border">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-World Discovery</h3>
              <p className="text-muted-foreground">
                Transform everyday exploration into immersive, quest-driven experiences where every location tells a
                story.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-background border">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cultural Capital</h3>
              <p className="text-muted-foreground">
                Build and own your cultural contributions through tokenized experiences and verifiable on-chain
                reputation.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-background border">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community-Driven</h3>
              <p className="text-muted-foreground">
                Join Adventurer's Groups and participate in cultural DAO governance to shape the platform's future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Experience Culture Like Never Before</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Lunoa transforms how you discover, experience, and own cultural moments through blockchain technology and
              gamified social interaction.
            </p>
          </div>

          <BentoGrid className="lg:grid-rows-2 max-w-6xl mx-auto">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Glowing Cards Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Lunoa?</h2>
          </div>

          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 max-w-6xl mx-auto">
            <GridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<Zap className="h-4 w-4" />}
              title="Lightning Fast Transactions"
              description="Built on Aptos for massive throughput and near-zero gas fees, making micro-transactions seamless."
            />
            <GridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<Shield className="h-4 w-4" />}
              title="Decentralized & Secure"
              description="Your cultural data and NFTs are stored on decentralized infrastructure, ensuring permanent ownership."
            />
            <GridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Layers className="h-4 w-4" />}
              title="Composable Cultural Data"
              description="Link social interactions, financial transactions, and identity into rich, composable user profiles."
            />
            <GridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<Users className="h-4 w-4" />}
              title="Community-Driven Discovery"
              description="Join Adventurer's Groups and participate in cultural DAO governance to shape the platform's future."
            />
            <GridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={<Smartphone className="h-4 w-4" />}
              title="Mobile-First Experience"
              description="Seamlessly discover and mint experiences on-the-go with our intuitive mobile application."
            />
          </ul>
        </div>
      </section>

      {/* Why Aptos Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Built on Aptos
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Aptos is the Only Choice</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Aptos provides the critical advantages needed for Lunoa's integrated vision of cultural commerce and
              social interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <Zap className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Massive Throughput</h3>
              <p className="text-muted-foreground">
                Parallel execution handles simultaneous SocialFi interactions, financial transactions, and decentralized
                data calls seamlessly.
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <Coins className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Low-Cost Finance</h3>
              <p className="text-muted-foreground">
                Near-zero gas fees make micro-loans, streaming payments, and micro-transactions feasible and accessible
                for everyone.
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <Layers className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Composable Data</h3>
              <p className="text-muted-foreground">
                Seamlessly link on-chain social data, financial transactions, and identity NFTs into rich, composable
                user profiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <TypewriterEffectSmooth words={typewriterWords} className="mb-8" cursorClassName="bg-purple-500" />
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the revolution in cultural discovery and start building your on-chain cultural capital today.
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 justify-center">
            <Button className="px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700">Launch Testnet App</Button>
            <Button variant="outline" className="px-8 py-3 text-lg bg-transparent">
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}

interface GridItemProps {
  area: string
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">{icon}</div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
