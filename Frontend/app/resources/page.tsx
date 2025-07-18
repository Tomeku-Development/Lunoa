"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Book, Code, FileText, MessageCircle, Newspaper } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

const resources = [
  {
    id: "documentation",
    icon: Book,
    title: "Documentation",
    description: "Comprehensive guides and tutorials to get you started with Lunoa's platform and APIs.",
    items: [
      "Getting Started Guide",
      "Platform Overview",
      "Vibe NFT Creation",
      "Quest System Guide",
      "Community Management",
    ],
    href: "/resources/documentation",
    cta: "View Docs",
  },
  {
    id: "api",
    icon: Code,
    title: "API Reference",
    description: "Complete API documentation for developers building on top of the Lunoa protocol.",
    items: ["REST API Endpoints", "GraphQL Schema", "WebSocket Events", "SDK Libraries", "Code Examples"],
    href: "/resources/api",
    cta: "Explore API",
  },
  {
    id: "whitepaper",
    icon: FileText,
    title: "Whitepaper",
    description: "Deep dive into Lunoa's technical architecture, tokenomics, and vision for the future of culture.",
    items: [
      "Technical Architecture",
      "Tokenomics Model",
      "Governance Structure",
      "Roadmap & Milestones",
      "Economic Incentives",
    ],
    href: "/resources/whitepaper",
    cta: "Read Whitepaper",
  },
  {
    id: "blog",
    icon: Newspaper,
    title: "Blog",
    description: "Latest updates, insights, and stories from the Lunoa community and development team.",
    items: [
      "Platform Updates",
      "Community Spotlights",
      "Technical Deep Dives",
      "Partnership Announcements",
      "Cultural Insights",
    ],
    href: "/resources/blog",
    cta: "Read Blog",
  },
  {
    id: "support",
    icon: MessageCircle,
    title: "Support",
    description: "Get help from our community and support team. Find answers to common questions.",
    items: ["FAQ & Help Center", "Community Discord", "Developer Support", "Bug Reports", "Feature Requests"],
    href: "/resources/support",
    cta: "Get Support",
  },
]

const recentBlogPosts = [
  {
    title: "Introducing Vibe NFTs: Cultural Moments as Digital Assets",
    excerpt: "Learn how Lunoa is revolutionizing cultural experiences through tokenized real-world moments.",
    date: "December 15, 2024",
    readTime: "5 min read",
    category: "Product",
  },
  {
    title: "Building on Aptos: Why We Chose the Future of Blockchain",
    excerpt: "Exploring the technical advantages that make Aptos the perfect foundation for Lunoa's vision.",
    date: "December 10, 2024",
    readTime: "8 min read",
    category: "Technical",
  },
  {
    title: "Community Spotlight: The Tokyo Street Art Adventurers",
    excerpt: "Meet the community that's mapping Tokyo's underground art scene through collaborative quests.",
    date: "December 5, 2024",
    readTime: "6 min read",
    category: "Community",
  },
]

export default function ResourcesPage() {
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
            <Link href="/resources" className="text-sm font-medium text-primary">
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
            Resources & Documentation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Everything You Need to Build with Lunoa</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive documentation, APIs, guides, and community resources to help you succeed on the Lunoa
            platform.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <resource.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {resource.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                  >
                    <Link href={resource.href}>
                      {resource.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from Our Blog</h2>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest news, insights, and stories from the Lunoa community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentBlogPosts.map((post, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                      Read More
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/resources/blog">
                View All Posts
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Developer CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build on Lunoa?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join our developer community and start building the future of cultural discovery and commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Get API Access
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
              >
                Join Discord
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}
