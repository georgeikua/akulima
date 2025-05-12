import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Leaf,
  MapPin,
  ShoppingCart,
  Heart,
  DollarSign,
  Award,
  LineChart,
  Handshake,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FarmerAnalyticsChart } from "@/components/farmer-analytics-chart"
import { GenderDistributionChart } from "@/components/gender-distribution-chart"
import { AgeDistributionChart } from "@/components/age-distribution-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/akulima-logo.png" alt="Akulima Logo" width={40} height={40} />
            <span className="text-xl font-bold text-primary">Akulima</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#impact-metrics"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Impact Metrics
            </Link>
            <Link
              href="#market-insights"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Market Insights
            </Link>
            <Link
              href="#women-empowerment"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Women Empowerment
            </Link>
            <Link
              href="#platform-features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Platform Features
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - For Donors */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="inline-flex mb-2 bg-primary/20 text-primary border-none">
                    Women-Led Agriculture
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Empowering Women Farmers Across Africa
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Akulima connects women farmer groups to fair market buyers, creating sustainable livelihoods and
                    economic independence.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="#impact-metrics">
                      See Our Impact <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/register">Partner With Us</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                  <Card className="bg-primary/10 border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Women Farmers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">12,450+</div>
                      <p className="text-sm text-muted-foreground">Active across 28 counties</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/10 border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Income Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">42%</div>
                      <p className="text-sm text-muted-foreground">Average increase since 2022</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/10 border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Market Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">248</div>
                      <p className="text-sm text-muted-foreground">Women-led farmer groups</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/10 border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Value Transacted</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">KES 86.4M</div>
                      <p className="text-sm text-muted-foreground">Last 12 months</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Metrics Section - For Donors */}
        <section id="impact-metrics" className="w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                  Measurable Impact for Women in Agriculture
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Transforming lives through sustainable market access and fair prices
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-3 py-1">
                  <Heart className="mr-1 h-3.5 w-3.5 text-rose-500" />
                  <span>100% Women-focused</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <LineChart className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                  <span>Impact data updated monthly</span>
                </Badge>
              </div>
            </div>

            {/* Impact Stats Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Financial Inclusion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">Women with new financial access</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>23% from last year</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Household Nutrition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">62%</div>
                  <p className="text-xs text-muted-foreground">Improved family nutrition</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>18% from baseline</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Education Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">74%</div>
                  <p className="text-xs text-muted-foreground">Increased children's education</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>31% from baseline</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sustainable Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">Adoption of sustainable farming</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>27% from last year</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SDG Alignment */}
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-semibold">UN Sustainable Development Goals Alignment</h3>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <Card className="bg-[#E5243B]/10 border-[#E5243B]/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-[#E5243B] font-bold text-xl mb-1">SDG 1</div>
                    <p className="text-sm">No Poverty</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#DDA63A]/10 border-[#DDA63A]/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-[#DDA63A] font-bold text-xl mb-1">SDG 2</div>
                    <p className="text-sm">Zero Hunger</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#4C9F38]/10 border-[#4C9F38]/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-[#4C9F38] font-bold text-xl mb-1">SDG 5</div>
                    <p className="text-sm">Gender Equality</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#FF3A21]/10 border-[#FF3A21]/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-[#FF3A21] font-bold text-xl mb-1">SDG 8</div>
                    <p className="text-sm">Decent Work</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#FD6925]/10 border-[#FD6925]/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-[#FD6925] font-bold text-xl mb-1">SDG 10</div>
                    <p className="text-sm">Reduced Inequalities</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#56C02B]/10 border-[#56C02B]/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-[#56C02B] font-bold text-xl mb-1">SDG 12</div>
                    <p className="text-sm">Responsible Consumption</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Market Insights Section - For Buyers */}
        <section id="market-insights" className="w-full py-8 md:py-12 lg:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Market Insights for Ethical Buyers</h2>
              <p className="text-muted-foreground">Quality produce at fair prices while supporting women farmers</p>
            </div>

            {/* Top Products Market Trends */}
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-semibold">Top Products Market Trends</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tomatoes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Price Trend</span>
                          <span className="text-xs font-medium text-emerald-500">↑ 12.4%</span>
                        </div>
                        <div className="text-base font-semibold">KES 3,850 per crate</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Volume Available</span>
                          <span className="text-xs font-medium">320 MT</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[80%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Women Producers</span>
                          <span className="text-xs font-medium">48 groups</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[65%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Kale (Sukuma Wiki)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Price Trend</span>
                          <span className="text-xs font-medium text-emerald-500">↑ 5.2%</span>
                        </div>
                        <div className="text-base font-semibold">KES 35 per bundle</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Volume Available</span>
                          <span className="text-xs font-medium">580 MT</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[95%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Women Producers</span>
                          <span className="text-xs font-medium">72 groups</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[85%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Potatoes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Price Trend</span>
                          <span className="text-xs font-medium text-rose-500">↓ 8.3%</span>
                        </div>
                        <div className="text-base font-semibold">KES 4,800 per bag</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Volume Available</span>
                          <span className="text-xs font-medium">248 MT</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[70%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Women Producers</span>
                          <span className="text-xs font-medium">56 groups</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[75%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Onions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Price Trend</span>
                          <span className="text-xs font-medium text-emerald-500">↑ 15.7%</span>
                        </div>
                        <div className="text-base font-semibold">KES 2,850 per bag</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Volume Available</span>
                          <span className="text-xs font-medium">185 MT</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[60%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Women Producers</span>
                          <span className="text-xs font-medium">38 groups</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[50%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Buyer Impact */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Buyer Impact Metrics</CardTitle>
                  <CardDescription>How your purchases directly support women farmers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="rounded-full bg-primary/10 p-3 mb-3">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-semibold mb-1">85%</h4>
                      <p className="text-sm text-muted-foreground">Of your purchase goes directly to women farmers</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="rounded-full bg-primary/10 p-3 mb-3">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-semibold mb-1">100%</h4>
                      <p className="text-sm text-muted-foreground">Traceable to specific women farmer groups</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="rounded-full bg-primary/10 p-3 mb-3">
                        <Handshake className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-semibold mb-1">3.2x</h4>
                      <p className="text-sm text-muted-foreground">Social return on investment multiplier</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button asChild className="w-full">
                    <Link href="/register">
                      Become an Ethical Buyer <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Women Empowerment Section - For Farmer Groups */}
        <section id="women-empowerment" className="w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Women Farmer Group Success Stories</h2>
              <p className="text-muted-foreground">
                Join hundreds of women-led producer groups already thriving on our platform
              </p>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="earnings" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="earnings">Earnings Growth</TabsTrigger>
                  <TabsTrigger value="gender">Gender Impact</TabsTrigger>
                  <TabsTrigger value="age">Age Demographics</TabsTrigger>
                </TabsList>
                <TabsContent value="earnings" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Farmer Earnings Trends</CardTitle>
                      <CardDescription>Average monthly earnings per woman farmer (KES)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FarmerAnalyticsChart />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">42% increase in women farmer earnings since 2022</span>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/register">Join as a farmer group</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="gender" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gender Distribution</CardTitle>
                      <CardDescription>Our platform exclusively supports women farmers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GenderDistributionChart />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#ff6b6b]"></div>
                          <span className="text-sm">100% of registered farmers are women</span>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/register">Join as a farmer group</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="age" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Age Distribution</CardTitle>
                      <CardDescription>Breakdown of women farmer group membership by age</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AgeDistributionChart />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">43% of women farmers are under 35 years old</span>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/register">Join as a farmer group</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Success Stories */}
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <CardTitle>Nakuru Women's Cooperative</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      "Since joining Akulima, our 78 members have seen a 53% increase in income. We've been able to
                      invest in better seeds and equipment, and many of our women have opened their first bank
                      accounts."
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Jane Wanjiku</span>
                      <span className="text-muted-foreground">Group Chairperson</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <Badge>Tomatoes & Kale</Badge>
                    <span className="text-sm text-muted-foreground">Member since 2022</span>
                  </div>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <CardTitle>Machakos Women Farmers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      "The transparent pricing on Akulima has transformed our business. Our 64 members now know exactly
                      what buyers are willing to pay, and we've eliminated exploitative middlemen completely."
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Grace Mutua</span>
                      <span className="text-muted-foreground">Group Secretary</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <Badge>Onions & Potatoes</Badge>
                    <span className="text-sm text-muted-foreground">Member since 2021</span>
                  </div>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <CardTitle>Kisii Women's Alliance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      "The WhatsApp integration has been revolutionary for our 92 members. Even those without
                      smartphones can check prices and communicate with buyers. Our sales volume has increased by 78%."
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Sarah Nyaboke</span>
                      <span className="text-muted-foreground">Group Treasurer</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <Badge>Bananas & Avocados</Badge>
                    <span className="text-sm text-muted-foreground">Member since 2023</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section id="platform-features" className="w-full py-8 md:py-12 lg:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Platform Features</h2>
              <p className="text-muted-foreground">How Akulima empowers women in agriculture</p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Leaf className="h-8 w-8 text-primary" />
                  <CardTitle>For Women Farmers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">Key benefits for women producers</CardDescription>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Direct market access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Better prices for produce</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Group selling power</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>WhatsApp integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>M-Pesa payments</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  <CardTitle>For Ethical Buyers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">Advantages for produce purchasers</CardDescription>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Source directly from women farmers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Consistent quality produce</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Transparent pricing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Bulk purchasing options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Delivery coordination</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Heart className="h-8 w-8 text-primary" />
                  <CardTitle>For Impact Donors</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">Benefits for funding partners</CardDescription>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Transparent impact metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Real-time data dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>SDG alignment reporting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Field visit coordination</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Customized impact reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-8 md:py-12 lg:py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Join the Movement for Women's Economic Empowerment
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Partner with Akulima to transform women's livelihoods across Africa
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3 max-w-[900px] w-full">
                <Button asChild size="lg" className="w-full">
                  <Link href="/register">
                    Fund Our Impact <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <Link href="/register">Buy From Women Farmers</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full bg-white/10 hover:bg-white/20">
                  <Link href="/register">Join As A Farmer Group</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/akulima-logo.png" alt="Akulima Logo" width={30} height={30} />
            <span className="text-lg font-semibold text-primary">Akulima</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Akulima. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
