"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 ml-8">
            <Image src="/lunoa-logo.svg" alt="Lunoa" width={120} height={120} className="w-30 h-30 dark:invert" />
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
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Privacy Matters</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn how Lunoa collects, uses, and protects your personal information in our decentralized cultural
              platform.
            </p>
            <p className="text-sm text-muted-foreground">Last updated: December 18, 2024</p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <div className="space-y-12">
              <Card>
                <CardHeader>
                  <CardTitle>1. Information We Collect</CardTitle>
                  <CardDescription>Types of information collected when you use Lunoa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Wallet addresses and blockchain transaction data</li>
                      <li>Location data when you check-in at cultural venues</li>
                      <li>Photos, videos, and media you upload for Vibe NFTs</li>
                      <li>Profile information and preferences</li>
                      <li>Communication data within communities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Usage Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>App usage patterns and feature interactions</li>
                      <li>Quest completion and cultural activity data</li>
                      <li>Community participation and governance voting</li>
                      <li>Device information and technical logs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. How We Use Your Information</CardTitle>
                  <CardDescription>Purposes for which we process your personal data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Provide and improve our cultural discovery platform</li>
                    <li>Enable NFT minting and blockchain transactions</li>
                    <li>Personalize content recommendations and quest suggestions</li>
                    <li>Facilitate community interactions and governance</li>
                    <li>Ensure platform security and prevent fraud</li>
                    <li>Comply with legal obligations and regulatory requirements</li>
                    <li>Communicate important updates and platform changes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Blockchain and Decentralization</CardTitle>
                  <CardDescription>How decentralized technology affects your privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">On-Chain Data</h4>
                    <p className="text-muted-foreground mb-2">
                      Information stored on the Aptos blockchain is public and immutable:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Vibe NFT metadata and transaction history</li>
                      <li>Quest completions and token rewards</li>
                      <li>Community governance votes and proposals</li>
                      <li>Wallet addresses and transaction amounts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Decentralized Storage</h4>
                    <p className="text-muted-foreground">
                      Media files are stored on decentralized networks like Arweave, ensuring permanent availability
                      while maintaining user ownership and control.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Information Sharing</CardTitle>
                  <CardDescription>When and how we share your information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Community Sharing</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Vibe NFTs and cultural contributions are publicly visible</li>
                      <li>Community participation and reputation scores</li>
                      <li>Quest completions and achievements</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Third-Party Services</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Blockchain infrastructure providers (Aptos network)</li>
                      <li>Decentralized storage networks (Arweave)</li>
                      <li>Analytics and performance monitoring services</li>
                      <li>Legal compliance and regulatory reporting</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Your Rights and Controls</CardTitle>
                  <CardDescription>How you can control your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>
                      <strong>Access:</strong> Request copies of your personal data
                    </li>
                    <li>
                      <strong>Correction:</strong> Update or correct inaccurate information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of personal data (subject to blockchain limitations)
                    </li>
                    <li>
                      <strong>Portability:</strong> Export your data in a machine-readable format
                    </li>
                    <li>
                      <strong>Objection:</strong> Object to certain types of data processing
                    </li>
                    <li>
                      <strong>Withdrawal:</strong> Withdraw consent for optional data collection
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Note: Some data stored on blockchain cannot be deleted due to the immutable nature of distributed
                    ledgers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Data Security</CardTitle>
                  <CardDescription>How we protect your information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>End-to-end encryption for sensitive communications</li>
                    <li>Secure wallet integration and transaction signing</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Decentralized architecture reducing single points of failure</li>
                    <li>Multi-signature controls for critical platform functions</li>
                    <li>Incident response and breach notification procedures</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. International Transfers</CardTitle>
                  <CardDescription>How we handle cross-border data transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    As a decentralized platform, your data may be processed and stored across multiple jurisdictions. We
                    implement appropriate safeguards including standard contractual clauses and adequacy decisions to
                    ensure your data remains protected regardless of location.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. Children's Privacy</CardTitle>
                  <CardDescription>Our policy regarding users under 18</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Lunoa is not intended for users under 18 years of age. We do not knowingly collect personal
                    information from children. If you believe we have collected information from a child, please contact
                    us immediately.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Changes to This Policy</CardTitle>
                  <CardDescription>How we handle privacy policy updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may update this privacy policy periodically. Material changes will be communicated through the
                    platform and via email. Continued use of Lunoa after changes constitutes acceptance of the updated
                    policy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Contact Us</CardTitle>
                  <CardDescription>How to reach us with privacy questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">For privacy-related questions or to exercise your rights:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Email: privacy@lunoa.io</li>
                    <li>Discord: Join our community server</li>
                    <li>Address: [Company Address]</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />
    </div>
  )
}
