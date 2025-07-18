"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

export default function TermsPage() {
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
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Please read these terms carefully before using the Lunoa platform and services.
            </p>
            <p className="text-sm text-muted-foreground">Last updated: December 18, 2024</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <Card>
                <CardHeader>
                  <CardTitle>1. Acceptance of Terms</CardTitle>
                  <CardDescription>Agreement to use Lunoa services</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By accessing or using Lunoa, you agree to be bound by these Terms of Service and all applicable laws
                    and regulations. If you do not agree with any of these terms, you are prohibited from using or
                    accessing this platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Description of Service</CardTitle>
                  <CardDescription>What Lunoa provides</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Lunoa is a decentralized platform that enables users to:</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Discover and explore cultural locations and experiences</li>
                    <li>Mint and trade Vibe NFTs representing real-world cultural moments</li>
                    <li>Complete quests and earn rewards through cultural exploration</li>
                    <li>Participate in communities and governance activities</li>
                    <li>Engage in cultural commerce and trading</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. User Accounts and Wallets</CardTitle>
                  <CardDescription>Account creation and wallet requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Wallet Connection</h4>
                    <p className="text-muted-foreground mb-2">
                      You must connect a compatible Aptos wallet to use Lunoa services. You are responsible for:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Maintaining the security of your private keys</li>
                      <li>All transactions made from your wallet</li>
                      <li>Ensuring sufficient funds for transaction fees</li>
                      <li>Compliance with applicable laws in your jurisdiction</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Account Responsibilities</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Provide accurate and complete information</li>
                      <li>Maintain account security and confidentiality</li>
                      <li>Notify us immediately of any unauthorized access</li>
                      <li>Use the platform in accordance with these terms</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Vibe NFTs and Digital Assets</CardTitle>
                  <CardDescription>Terms governing NFT creation and ownership</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">NFT Creation</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>You retain ownership of content you create and mint as NFTs</li>
                      <li>You grant Lunoa a license to display and distribute your content</li>
                      <li>You represent that you have rights to all content you mint</li>
                      <li>NFTs are stored on the Aptos blockchain and cannot be deleted</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Trading and Ownership</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>NFT ownership is determined by blockchain records</li>
                      <li>All sales are final and cannot be reversed</li>
                      <li>Creator royalties are automatically enforced by smart contracts</li>
                      <li>You are responsible for tax implications of NFT transactions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Platform Tokens and Rewards</CardTitle>
                  <CardDescription>$LUNOA token usage and governance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Token Utility</h4>
                    <p className="text-muted-foreground mb-2">$LUNOA tokens are used for:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Quest rewards and platform incentives</li>
                      <li>Content boosting and curation</li>
                      <li>Governance voting and proposals</li>
                      <li>Premium features and services</li>
                      <li>Community participation and reputation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Token Risks</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Token values may fluctuate significantly</li>
                      <li>No guarantee of future utility or value</li>
                      <li>Regulatory changes may affect token usage</li>
                      <li>Smart contract risks and potential bugs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Community Guidelines</CardTitle>
                  <CardDescription>Rules for community participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Prohibited Activities</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Harassment, abuse, or discrimination of other users</li>
                      <li>Sharing illegal, harmful, or inappropriate content</li>
                      <li>Attempting to manipulate quest systems or rewards</li>
                      <li>Creating fake locations or misleading information</li>
                      <li>Violating intellectual property rights</li>
                      <li>Engaging in fraudulent or deceptive practices</li>
                      <li>Spamming or excessive promotional content</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Privacy and Data</CardTitle>
                  <CardDescription>Data collection and privacy practices</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
                    and protect your information. By using Lunoa, you consent to our data practices as described in the
                    Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. Disclaimers and Limitations</CardTitle>
                  <CardDescription>Service limitations and disclaimers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Service Availability</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Services are provided "as is" without warranties</li>
                      <li>We do not guarantee uninterrupted service availability</li>
                      <li>Blockchain networks may experience delays or congestion</li>
                      <li>Third-party services may affect platform functionality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Financial Risks</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Cryptocurrency and NFT investments carry significant risks</li>
                      <li>You may lose all invested funds</li>
                      <li>Past performance does not guarantee future results</li>
                      <li>Regulatory changes may affect asset values</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Termination</CardTitle>
                  <CardDescription>Account termination and suspension</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    We reserve the right to terminate or suspend your access to Lunoa at any time for violations of
                    these terms or other reasons. Upon termination:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Your access to platform features will be revoked</li>
                    <li>Blockchain assets remain under your control</li>
                    <li>Outstanding obligations survive termination</li>
                    <li>You may appeal termination decisions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Changes to Terms</CardTitle>
                  <CardDescription>How we handle terms updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may modify these terms at any time. Material changes will be communicated through the platform
                    and via email. Continued use after changes constitutes acceptance of the updated terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>11. Contact Information</CardTitle>
                  <CardDescription>How to reach us</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">For questions about these terms:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Email: legal@lunoa.io</li>
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
