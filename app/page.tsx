import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Leaf,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Users,
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
              href="#market-data"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Market Data
            </Link>
            <Link
              href="#regional-insights"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Regional Insights
            </Link>
            <Link
              href="#farmer-analytics"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Farmer Analytics
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
        {/* Market Data Overview Section */}
        <section id="market-data" className="w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Akulima - A Buyer-driven Marketplace
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Connecting women and youth led producer groups to fair market buyers
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-3 py-1">
                  <TrendingUp className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                  <span>Market data updated daily</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Users className="mr-1 h-3.5 w-3.5 text-blue-500" />
                  <span>5,200+ active users</span>
                </Badge>
              </div>
            </div>

            {/* Market Stats Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Akulima Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-xs text-muted-foreground">Registered farmer groups</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>18% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Market Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248 MT</div>
                  <p className="text-xs text-muted-foreground">Monthly trading volume</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>8.7% from previous month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">Agricultural products</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>4 new this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Market Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">187</div>
                  <p className="text-xs text-muted-foreground">Open buyer requests</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>23% from last week</span>
                  </div>
                </CardContent>
              </Card>
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
                          <span className="text-xs text-muted-foreground">Volume Traded</span>
                          <span className="text-xs font-medium">320 MT</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[80%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Orders</span>
                          <span className="text-xs font-medium">48</span>
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
                          <span className="text-xs text-muted-foreground">Volume Traded</span>
                          <span className="text-xs font-medium">580 MT</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[95%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Orders</span>
                          <span className="text-xs font-medium">72</span>
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
                    <CardTitle className="text-sm font-medium">Tomatoes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Price Trend</span>
                          <span className="text-xs font-medium text-rose-500">↓ 8.3%</span>
                        </div>
                        <div className="text-base font-semibold">KES 4,800 per crate</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Volume Traded</span>
                          <span className="text-xs font-medium">248 MT</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[70%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Orders</span>
                          <span className="text-xs font-medium">56</span>
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
                          <span className="text-xs text-muted-foreground">Volume Traded</span>
                          <span className="text-xs font-medium">185 MT</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 w-[60%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Orders</span>
                          <span className="text-xs font-medium">38</span>
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
          </div>
        </section>

        {/* Regional Insights Section */}
        <section id="regional-insights" className="w-full py-8 md:py-12 lg:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Regional Market Insights</h2>
              <p className="text-muted-foreground">Production and price data across key agricultural regions</p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <CardTitle>Rift Valley Region</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Tomato Production</span>
                        <span className="font-medium">3.2M crates</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[85%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Kale (Sukuma Wiki)</span>
                        <span className="font-medium">1.8M bundles</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[65%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Cabbage</span>
                        <span className="font-medium">1.5M heads</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[55%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">High Supply</Badge>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <CardTitle>Central Region</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Avocado Production</span>
                        <span className="font-medium">42,000 crates</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[75%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>French Beans</span>
                        <span className="font-medium">120,000 kg</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[90%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Spinach</span>
                        <span className="font-medium">3.8M bundles</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[80%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Badge className="bg-blue-500 hover:bg-blue-600">Stable Market</Badge>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <CardTitle>Eastern Region</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Mango Production</span>
                        <span className="font-medium">85,000 crates</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[45%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Green Grams</span>
                        <span className="font-medium">32,000 bags</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[35%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Watermelon</span>
                        <span className="font-medium">28,000 tons</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[30%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Badge className="bg-amber-500 hover:bg-amber-600">Low Supply</Badge>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <CardTitle>Western Region</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Banana Production</span>
                        <span className="font-medium">1.2M bunches</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[70%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Green Peas</span>
                        <span className="font-medium">45,000 bags</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[50%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Passion Fruit</span>
                        <span className="font-medium">68,000 crates</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[60%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Badge className="bg-blue-500 hover:bg-blue-600">Stable Market</Badge>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Top Producing Counties</CardTitle>
                  <CardDescription>Agricultural output by region (2023 data)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        <span>Nakuru</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">4.2M crates</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[95%] rounded-full bg-primary"></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                        <span>Kiambu</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">3.8M bundles</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[85%] rounded-full bg-blue-500"></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                        <span>Machakos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">3.5M crates</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[80%] rounded-full bg-emerald-500"></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                        <span>Meru</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">3.2M kg</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[75%] rounded-full bg-amber-500"></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-rose-500"></div>
                        <span>Kisii</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">2.8M bunches</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[65%] rounded-full bg-rose-500"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Farmer Analytics Section */}
        <section id="farmer-analytics" className="w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Farmer Group Analytics</h2>
              <p className="text-muted-foreground">Insights into farmer demographics and economic impact</p>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="earnings" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="earnings">Earnings Analysis</TabsTrigger>
                  <TabsTrigger value="gender">Gender Distribution</TabsTrigger>
                  <TabsTrigger value="age">Age Demographics</TabsTrigger>
                </TabsList>
                <TabsContent value="earnings" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Farmer Earnings Trends</CardTitle>
                      <CardDescription>Average monthly earnings per farmer (KES)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FarmerAnalyticsChart />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">42% increase in farmer earnings since 2022</span>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/register">View detailed analytics</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="gender" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gender Distribution</CardTitle>
                      <CardDescription>Breakdown of farmer group membership by gender</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GenderDistributionChart />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#ff6b6b]"></div>
                          <span className="text-sm">65% of registered farmers are women</span>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/register">View detailed analytics</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="age" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Age Distribution</CardTitle>
                      <CardDescription>Breakdown of farmer group membership by age</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AgeDistributionChart />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">43% of farmers are under 35 years old</span>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/register">View detailed analytics</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Registered Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-xs text-muted-foreground">Across 28 counties</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>18% growth in last quarter</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Group Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,450</div>
                  <p className="text-xs text-muted-foreground">Active farmers</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>22% growth in last quarter</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Value Transacted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES 86.4M</div>
                  <p className="text-xs text-muted-foreground">Last 12 months</p>
                  <div className="mt-2 flex items-center text-xs text-emerald-500">
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    <span>32% increase year-over-year</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section id="platform-features" className="w-full py-8 md:py-12 lg:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Platform Features</h2>
              <p className="text-muted-foreground">Discover how Akulima transforms agricultural commerce</p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Leaf className="h-8 w-8 text-primary" />
                  <CardTitle>For Farmers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">Key benefits for agricultural producers</CardDescription>
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
                  <CardTitle>For Buyers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">Advantages for produce purchasers</CardDescription>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Source directly from farmers</span>
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
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>For Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">Benefits for farmer cooperatives</CardDescription>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Collective bargaining</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Group management tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Payment distribution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Analytics and reporting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Training opportunities</span>
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
                  Ready to Transform Your Agricultural Business?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of farmers and buyers already benefiting from the Akulima platform
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register">
                    Register Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Login</Link>
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
