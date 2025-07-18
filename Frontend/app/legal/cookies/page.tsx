"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cookie } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footerdemo } from "@/components/ui/footer-section"

export default function CookiesPage() {
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
              <Cookie className="w-4 h-4 mr-2" />
              Cookie Policy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Cookie Settings</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn about how Lunoa uses cookies and similar technologies to enhance your experience.
            </p>
            <p className="text-sm text-muted-foreground">Last updated: December 18, 2024</p>
          </div>
        </div>
      </section>

      {/* Cookie Policy Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <Card>
                <CardHeader>
                  <CardTitle>What Are Cookies?</CardTitle>
                  <CardDescription>Understanding cookies and similar technologies</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cookies are small text files stored on your device when you visit websites. They help us provide you
                    with a better experience by remembering your preferences, keeping you logged in, and analyzing how
                    you use our platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Types of Cookies We Use</CardTitle>
                  <CardDescription>Different categories of cookies on Lunoa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Essential Cookies (Always Active)</h4>
                    <p className="text-muted-foreground mb-2">
                      These cookies are necessary for the platform to function properly:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Wallet connection and authentication</li>
                      <li>Security and fraud prevention</li>
                      <li>Basic platform functionality</li>
                      <li>Load balancing and performance</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Functional Cookies</h4>
                    <p className="text-muted-foreground mb-2">
                      These cookies enhance your experience by remembering your preferences:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Language and region preferences</li>
                      <li>Dark/light mode settings</li>
                      <li>Map view preferences</li>
                      <li>Notification settings</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600">Analytics Cookies</h4>
                    <p className="text-muted-foreground mb-2">These cookies help us understand how you use Lunoa:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Page views and user interactions</li>
                      <li>Feature usage and performance metrics</li>
                      <li>Error tracking and debugging</li>
                      <li>Platform optimization insights</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Marketing Cookies</h4>
                    <p className="text-muted-foreground mb-2">
                      These cookies help us provide relevant content and measure campaign effectiveness:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Personalized quest recommendations</li>
                      <li>Targeted community suggestions</li>
                      <li>Campaign performance tracking</li>
                      <li>Social media integration</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Third-Party Cookies</CardTitle>
                  <CardDescription>External services that may set cookies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Analytics Services</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Google Analytics for usage insights</li>
                      <li>Mixpanel for user behavior tracking</li>
                      <li>Sentry for error monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Blockchain Services</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Aptos network providers</li>
                      <li>Wallet connection services</li>
                      <li>IPFS and Arweave gateways</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Communication Tools</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Discord integration</li>
                      <li>Email service providers</li>
                      <li>Push notification services</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Managing Your Cookie Preferences</CardTitle>
                  <CardDescription>How to control cookies on Lunoa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Platform Settings</h4>
                    <p className="text-muted-foreground mb-2">You can manage your cookie preferences through:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Cookie banner when you first visit</li>
                      <li>Privacy settings in your account</li>
                      <li>Cookie preference center (link in footer)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Browser Settings</h4>
                    <p className="text-muted-foreground mb-2">You can also control cookies through your browser:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Block all cookies (may break functionality)</li>
                      <li>Delete existing cookies</li>
                      <li>Set preferences for specific sites</li>
                      <li>Use private/incognito browsing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cookie Consent</CardTitle>
                  <CardDescription>Your choices and consent management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    When you first visit Lunoa, you'll see a cookie banner asking for your consent. You can:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Accept all cookies for the full experience</li>
                    <li>Reject non-essential cookies</li>
                    <li>Customize your preferences by category</li>
                    <li>Change your mind at any time through settings</li>
                  </ul>
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Rejecting certain cookies may limit platform functionality, such as
                      personalized recommendations or saved preferences.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Retention</CardTitle>
                  <CardDescription>How long we keep cookie data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Session Cookies</h4>
                      <p className="text-muted-foreground">Deleted when you close your browser or end your session.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                      <p className="text-muted-foreground">
                        Stored for specific periods ranging from 30 days to 2 years, depending on their purpose.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Analytics Data</h4>
                      <p className="text-muted-foreground">
                        Aggregated and anonymized data may be retained longer for platform improvement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Updates to This Policy</CardTitle>
                  <CardDescription>How we handle cookie policy changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may update this cookie policy periodically to reflect changes in our practices or applicable
                    laws. We'll notify you of significant changes through the platform or via email.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                  <CardDescription>Questions about cookies and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">For questions about our cookie practices:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Email: privacy@lunoa.io</li>
                    <li>Discord: Join our community server</li>
                    <li>Cookie Settings: Available in platform footer</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Cookie Preferences Panel */}
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>Manage Cookie Preferences</CardTitle>
                  <CardDescription>Update your cookie settings anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Essential Cookies</h4>
                        <p className="text-sm text-muted-foreground">Required for platform functionality</p>
                      </div>
                      <div className="text-sm text-green-600 font-medium">Always Active</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Functional Cookies</h4>
                        <p className="text-sm text-muted-foreground">Remember your preferences</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Analytics Cookies</h4>
                        <p className="text-sm text-muted-foreground">Help us improve the platform</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Marketing Cookies</h4>
                        <p className="text-sm text-muted-foreground">Personalized recommendations</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button className="flex-1">Save Preferences</Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Accept All
                      </Button>
                    </div>
                  </div>
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
