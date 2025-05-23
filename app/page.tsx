import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Plane, Award, MapPin, Phone, Mail, ExternalLink } from "lucide-react"
import WhatsAppButton from "@/components/whatsapp-button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight">
                Certified Fresh Herbs & Vegetables from East Africa to Europe & the Gulf
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Traceable, GLOBALG.A.P.-certified basil, chives, and French beans — delivered weekly via airfreight.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Request Sample
                </Button>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  View Specs
                </Button>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Start a Contract
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/produce-export-packaging.png"
                alt="Fresh produce export facility"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Buyers Choose East Africa */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">Why Buyers Choose East Africa</h2>

          <div className="bg-white p-8 rounded-xl shadow-md mb-16">
            <blockquote className="text-xl italic text-gray-600 text-center">
              "East Africa has become our strategic source for seasonal diversification. The consistent quality and
              reliable airfreight connections have transformed our supply chain resilience."
              <footer className="mt-4 text-gray-500 font-medium">— Procurement Director, Leading EU Retailer</footer>
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Year-round Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Consistent production across seasons thanks to ideal equatorial growing conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Competitive Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Favorable production costs and efficient operations ensure market-competitive pricing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Fast Airfreight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Regular flights to major European and Gulf hubs ensure freshness and minimal transit time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Certified Farms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All partner farms maintain GLOBALG.A.P. certification and follow sustainable practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">Our Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=fresh basil herbs in packaging"
                  alt="Fresh Basil"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Basil</CardTitle>
                  <Badge className="bg-green-600">Available Now</Badge>
                </div>
                <CardDescription>Premium Sweet Genovese</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Quality:</span> Vibrant green, aromatic, 10-15cm length
                  </p>
                  <p>
                    <span className="font-medium">Packaging:</span> 50g EPS punnets, 10 per carton
                  </p>
                  <p>
                    <span className="font-medium">Certifications:</span> GLOBALG.A.P., GRASP
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  View Specifications
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=fresh chives herbs in packaging"
                  alt="Fresh Chives"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Chives</CardTitle>
                  <Badge className="bg-green-600">Available Now</Badge>
                </div>
                <CardDescription>Fine-Cut Culinary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Quality:</span> Bright green, uniform cut, 15-20cm length
                  </p>
                  <p>
                    <span className="font-medium">Packaging:</span> 30g EPS punnets, 12 per carton
                  </p>
                  <p>
                    <span className="font-medium">Certifications:</span> GLOBALG.A.P., GRASP
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  View Specifications
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=fresh french beans vegetables in packaging"
                  alt="French Beans"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>French Beans</CardTitle>
                  <Badge className="bg-green-600">Available Now</Badge>
                </div>
                <CardDescription>Extra Fine Selection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Quality:</span> Tender, straight, 8-12cm length
                  </p>
                  <p>
                    <span className="font-medium">Packaging:</span> 250g flow-wrap, 20 per carton
                  </p>
                  <p>
                    <span className="font-medium">Certifications:</span> GLOBALG.A.P., GRASP
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  View Specifications
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications & Traceability */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">Certifications & Traceability</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">GLOBALG.A.P. Certified</h3>
                  <p className="mt-2 text-gray-600">
                    All our partner farms maintain active GLOBALG.A.P. certification, ensuring good agricultural
                    practices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">GRASP Compliance</h3>
                  <p className="mt-2 text-gray-600">
                    GLOBALG.A.P. Risk Assessment on Social Practice ensures ethical labor standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Certificate of Analysis</h3>
                  <p className="mt-2 text-gray-600">
                    Every shipment includes COA documentation verifying product safety and quality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Phytosanitary Certification</h3>
                  <p className="mt-2 text-gray-600">
                    Official documentation confirming products are free from pests and diseases.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">QR Batch Traceability</h3>
              <p className="text-gray-600 mb-6">
                Every product includes a QR code linking to complete batch information, from farm to shelf.
              </p>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=200&query=QR code on product label"
                    alt="QR Code Sample"
                    fill
                    className="object-contain"
                  />
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">View Sample Batch Report</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Work With Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">How to Work With Us</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>

            {/* Timeline items */}
            <div className="grid grid-cols-1 gap-16">
              <div className="relative flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <h3 className="text-xl font-semibold text-gray-800">Introductory Call</h3>
                  <p className="mt-2 text-gray-600">
                    Schedule a WhatsApp or Zoom call to discuss your specific requirements and explore our offerings.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-green-600 z-10 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="w-5/12 pl-8"></div>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="w-5/12 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-green-600 z-10 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="w-5/12 pl-8">
                  <h3 className="text-xl font-semibold text-gray-800">Sample Request</h3>
                  <p className="mt-2 text-gray-600">
                    Receive a complimentary sample shipment to evaluate our product quality and packaging.
                  </p>
                </div>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <h3 className="text-xl font-semibold text-gray-800">Trial Order</h3>
                  <p className="mt-2 text-gray-600">
                    Place a small trial order to test our logistics, communication, and overall service.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-green-600 z-10 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="w-5/12 pl-8"></div>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="w-5/12 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-green-600 z-10 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="w-5/12 pl-8">
                  <h3 className="text-xl font-semibold text-gray-800">Contract Agreement</h3>
                  <p className="mt-2 text-gray-600">
                    Establish a formal contract with agreed volumes, pricing, and delivery schedules.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex justify-center gap-6">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Download Sell Sheet <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                WhatsApp Updates Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Airfreight Logistics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">Airfreight Logistics</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Flight Schedule</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Nairobi (NBO) → Amsterdam (AMS)</p>
                    <p className="text-gray-600">Monday, Wednesday, Friday</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Nairobi (NBO) → Milan (MXP)</p>
                    <p className="text-gray-600">Tuesday, Thursday, Saturday</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Nairobi (NBO) → Dubai (DXB)</p>
                    <p className="text-gray-600">Tuesday, Thursday, Sunday</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Cold Chain Process</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Harvest & Initial Cooling</p>
                    <p className="mt-1 text-gray-600">
                      Products harvested at optimal times and immediately pre-cooled to 4°C.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Processing & Packaging</p>
                    <p className="mt-1 text-gray-600">
                      Processed in temperature-controlled facilities and packed in specialized containers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Cold Storage</p>
                    <p className="mt-1 text-gray-600">
                      Maintained at 2-4°C in our cold storage facility before transport.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Refrigerated Transport</p>
                    <p className="mt-1 text-gray-600">
                      Transported to airport in refrigerated vehicles with temperature logging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    5
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Airfreight & Delivery</p>
                    <p className="mt-1 text-gray-600">
                      Expedited customs clearance and final delivery to your facility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EU & GCC Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">EU & GCC Support</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/placeholder.svg?height=30&width=50&query=UK flag"
                    alt="UK Flag"
                    width={30}
                    height={20}
                    className="rounded"
                  />
                  <CardTitle>UK Headquarters</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">107-111 Fleet St, London EC4A 2AB, United Kingdom</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-gray-600">+44 7366 480459</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-gray-600">info@fresh-xchange.co.uk</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  Contact UK Office
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/placeholder.svg?height=30&width=50&query=Netherlands flag"
                    alt="Netherlands Flag"
                    width={30}
                    height={20}
                    className="rounded"
                  />
                  <CardTitle>NL Buyer Desk</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">Zuidplein, H Toren 36, 1077 XX Amsterdam</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-gray-600">+31 97010283093</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-gray-600">nl@fresh-xchange.co.uk</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  Contact NL Office
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/placeholder.svg?height=30&width=50&query=Kenya flag"
                    alt="Kenya Flag"
                    width={30}
                    height={20}
                    className="rounded"
                  />
                  <CardTitle>Kenya Operations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">90 JGO, James Gichuru Rd, Lavington, Nairobi</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-gray-600">+254 708 406053</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-gray-600">ops@fresh-xchange.co.uk</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  Contact Kenya Office
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">What Our Clients Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-lg italic text-gray-600 mb-6">
                      "FreshXchange delivers year-round consistency — their WhatsApp updates changed how we work. We
                      always know exactly where our produce is in the supply chain."
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=100&width=100&query=professional headshot of European man"
                        alt="Client"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Thomas Bergman</p>
                      <p className="text-sm text-gray-500">Procurement Manager, Fresh Direct EU</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-lg italic text-gray-600 mb-6">
                      "Most professional onboarding we've had with an East African exporter. Their documentation and
                      traceability systems are exceptional, making compliance a breeze."
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=100&width=100&query=professional headshot of Middle Eastern woman"
                        alt="Client"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Amira Al-Faisal</p>
                      <p className="text-sm text-gray-500">Supply Chain Director, Gulf Fresh Foods</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
