"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PriceTrendChart } from "@/components/price-trend-chart"
import { ProtectedRoute } from "@/components/protected-route"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample product price data
const productPrices = [
  {
    id: 1,
    name: "Watermelon",
    lastPrice: 400,
    priceChange: 5.2,
    orderSize: "500 kg",
    volumeTraded: 12500,
    volumeChange: 8.3,
    market: "Nairobi",
  },
  {
    id: 2,
    name: "Tomatoes",
    lastPrice: 120,
    priceChange: -3.1,
    orderSize: "200 kg",
    volumeTraded: 8200,
    volumeChange: -2.5,
    market: "Nakuru",
  },
  {
    id: 3,
    name: "Potatoes",
    lastPrice: 80,
    priceChange: 2.8,
    orderSize: "1000 kg",
    volumeTraded: 25000,
    volumeChange: 12.7,
    market: "Eldoret",
  },
  {
    id: 4,
    name: "Onions",
    lastPrice: 90,
    priceChange: 7.5,
    orderSize: "300 kg",
    volumeTraded: 9800,
    volumeChange: 5.2,
    market: "Mombasa",
  },
  {
    id: 5,
    name: "Maize",
    lastPrice: 50,
    priceChange: -1.2,
    orderSize: "2000 kg",
    volumeTraded: 42000,
    volumeChange: -3.8,
    market: "Kisumu",
  },
  {
    id: 6,
    name: "Beans",
    lastPrice: 110,
    priceChange: 3.5,
    orderSize: "500 kg",
    volumeTraded: 15000,
    volumeChange: 6.2,
    market: "Nairobi",
  },
  {
    id: 7,
    name: "Cabbage",
    lastPrice: 45,
    priceChange: -2.1,
    orderSize: "300 kg",
    volumeTraded: 7500,
    volumeChange: -1.8,
    market: "Nakuru",
  },
  {
    id: 8,
    name: "Carrots",
    lastPrice: 70,
    priceChange: 4.2,
    orderSize: "250 kg",
    volumeTraded: 6200,
    volumeChange: 3.5,
    market: "Eldoret",
  },
]

export default function PriceTrendsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMarket, setSelectedMarket] = useState("all")

  // Filter products based on search term and selected market
  const filteredProducts = productPrices.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedMarket === "all" || product.market === selectedMarket),
  )

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Price Trends</h1>
          <p className="text-muted-foreground">
            Track market prices to make informed decisions about when to sell your produce.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <Badge variant="outline" className="mr-2">
              Data Source
            </Badge>
            Prices are updated weekly from AMIS.co.ke
          </p>
        </div>

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
              <SelectItem value="Eldoret">Eldoret</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Price Trends</CardTitle>
            <CardDescription>Current market prices and trading volumes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Last Price (KES/kg)</TableHead>
                    <TableHead>Price Change</TableHead>
                    <TableHead>Order Size</TableHead>
                    <TableHead>Volume Traded (kg)</TableHead>
                    <TableHead>Volume Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.market}</TableCell>
                      <TableCell>{product.lastPrice}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {product.priceChange > 0 ? (
                            <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                          ) : (
                            <ArrowDown className="mr-1 h-4 w-4 text-rose-500" />
                          )}
                          <span className={product.priceChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                            {Math.abs(product.priceChange)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{product.orderSize}</TableCell>
                      <TableCell>{product.volumeTraded.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {product.volumeChange > 0 ? (
                            <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                          ) : (
                            <ArrowDown className="mr-1 h-4 w-4 text-rose-500" />
                          )}
                          <span className={product.volumeChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                            {Math.abs(product.volumeChange)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Comparison Chart</CardTitle>
            <CardDescription>Visual representation of price trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <PriceTrendChart />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
