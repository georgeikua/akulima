"use client"

import { useState } from "react"
import { Calendar, Download, RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProtectedRoute } from "@/components/protected-route"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Updated sample market price data for fresh perishable produce
const marketPrices = [
  {
    id: 1,
    product: "Tomatoes",
    market: "Nairobi",
    wholesalePrice: 80,
    retailPrice: 120,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "High",
  },
  {
    id: 2,
    product: "Kale",
    market: "Nairobi",
    wholesalePrice: 40,
    retailPrice: 60,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "High",
  },
  {
    id: 3,
    product: "Avocados",
    market: "Nairobi",
    wholesalePrice: 150,
    retailPrice: 200,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "Medium",
  },
  {
    id: 4,
    product: "Green Peppers",
    market: "Mombasa",
    wholesalePrice: 90,
    retailPrice: 130,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "Medium",
  },
  {
    id: 5,
    product: "Passion Fruit",
    market: "Mombasa",
    wholesalePrice: 120,
    retailPrice: 180,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "Low",
  },
  {
    id: 6,
    product: "Onions",
    market: "Mombasa",
    wholesalePrice: 60,
    retailPrice: 90,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "Medium",
  },
  {
    id: 7,
    product: "Watermelon",
    market: "Kisumu",
    wholesalePrice: 30,
    retailPrice: 50,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "High",
  },
  {
    id: 8,
    product: "Coriander",
    market: "Kisumu",
    wholesalePrice: 100,
    retailPrice: 150,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "Medium",
  },
  {
    id: 9,
    product: "Cucumber",
    market: "Nakuru",
    wholesalePrice: 55,
    retailPrice: 80,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "Medium",
  },
  {
    id: 10,
    product: "Chillies",
    market: "Nakuru",
    wholesalePrice: 150,
    retailPrice: 220,
    unit: "kg",
    date: "2023-05-10",
    supplyLevel: "Low",
  },
]

export default function MarketPricesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter market prices based on search term, selected market, and selected product
  const filteredPrices = marketPrices.filter(
    (price) =>
      price.product.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedMarket === "all" || price.market === selectedMarket) &&
      (selectedProduct === "all" || price.product === selectedProduct),
  )

  const handleRefresh = () => {
    setIsRefreshing(true)
    // In a real app, this would trigger a data refresh from AMIS.co.ke
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Get unique products for the dropdown
  const uniqueProducts = Array.from(new Set(marketPrices.map((price) => price.product)))

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Market Prices</h1>
            <p className="text-muted-foreground">Current market prices from AMIS.co.ke</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                Last updated: May 10, 2023
              </Badge>
              <Badge variant="outline" className="text-xs">
                Weekly updates from AMIS.co.ke
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="comparison">Market Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="table" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Markets</SelectItem>
                  <SelectItem value="Nairobi">Nairobi</SelectItem>
                  <SelectItem value="Mombasa">Mombasa</SelectItem>
                  <SelectItem value="Kisumu">Kisumu</SelectItem>
                  <SelectItem value="Nakuru">Nakuru</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {uniqueProducts.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Market Prices</CardTitle>
                <CardDescription>Wholesale and retail prices across different markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Market</TableHead>
                        <TableHead>Wholesale Price (KES)</TableHead>
                        <TableHead>Retail Price (KES)</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Supply Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrices.map((price) => (
                        <TableRow key={price.id}>
                          <TableCell className="font-medium">{price.product}</TableCell>
                          <TableCell>{price.market}</TableCell>
                          <TableCell>{price.wholesalePrice}</TableCell>
                          <TableCell>{price.retailPrice}</TableCell>
                          <TableCell>per {price.unit}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                price.supplyLevel === "High"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                                  : price.supplyLevel === "Medium"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                                    : "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400"
                              }
                            >
                              {price.supplyLevel}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Market Price Comparison</CardTitle>
                <CardDescription>Compare prices across different markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select defaultValue="Tomatoes">
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueProducts.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Market</TableHead>
                          <TableHead>Wholesale Price (KES)</TableHead>
                          <TableHead>Retail Price (KES)</TableHead>
                          <TableHead>Price Difference</TableHead>
                          <TableHead>Supply Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {marketPrices
                          .filter((price) => price.product === "Tomatoes")
                          .map((price) => (
                            <TableRow key={price.id}>
                              <TableCell className="font-medium">{price.market}</TableCell>
                              <TableCell>{price.wholesalePrice}</TableCell>
                              <TableCell>{price.retailPrice}</TableCell>
                              <TableCell>{price.retailPrice - price.wholesalePrice}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    price.supplyLevel === "High"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                                      : price.supplyLevel === "Medium"
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                                        : "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400"
                                  }
                                >
                                  {price.supplyLevel}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
