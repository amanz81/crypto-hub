'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { ArrowRight, Bitcoin, DollarSign, TrendingUp, Youtube, Twitter } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for demonstration purposes
const mockCryptoData = [
  { name: 'Bitcoin', symbol: 'BTC', price: 50000, change: 2.5, color: 'text-orange-500', chartData: Array.from({length: 7}, (_, i) => ({day: i + 1, price: Math.random() * 10000 + 45000})) },
  { name: 'Ethereum', symbol: 'ETH', price: 3000, change: -1.2, color: 'text-purple-500', chartData: Array.from({length: 7}, (_, i) => ({day: i + 1, price: Math.random() * 500 + 2750})) },
  { name: 'Cardano', symbol: 'ADA', price: 2, change: 5.7, color: 'text-blue-500', chartData: Array.from({length: 7}, (_, i) => ({day: i + 1, price: Math.random() * 0.5 + 1.75})) },
]

const mockFeedData = [
  { type: 'youtube', title: 'Bitcoin Price Prediction 2024', channel: 'Crypto Daily', url: '#' },
  { type: 'twitter', content: 'Ethereum 2.0 launch date confirmed!', author: '@ethereumproject', url: '#' },
  { type: 'news', title: 'Cardano Smart Contracts Go Live', source: 'CoinDesk', url: '#' },
]

const mockTrendingData = [
  { name: 'Solana', symbol: 'SOL', change: 15.3, color: 'text-green-500' },
  { name: 'Polkadot', symbol: 'DOT', change: 8.7, color: 'text-pink-500' },
  { name: 'Avalanche', symbol: 'AVAX', change: 12.1, color: 'text-red-500' },
]

export default function CryptoHub() {
  const [email, setEmail] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [feedSource, setFeedSource] = useState('all')

  // Simulating data fetching
  useEffect(() => {
    // In a real application, you would fetch data from an API here
    console.log('Fetching data for', selectedCrypto)
  }, [selectedCrypto])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <Bitcoin className="h-6 w-6 text-yellow-500" />
              <span className="hidden font-bold sm:inline-block">Crypto Hub</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a className="transition-colors hover:text-yellow-500 text-gray-300" href="#dashboard">Dashboard</a>
              <a className="transition-colors hover:text-yellow-500 text-gray-300" href="#feed">Feed</a>
              <a className="transition-colors hover:text-yellow-500 text-gray-300" href="#trending">Trending</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="container py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Your Personalized Crypto Hub
            </h1>
            <p className="max-w-[700px] text-lg text-gray-300 mb-8">
              Stay updated with your favorite cryptocurrencies, get insights from trusted sources, and discover trending tokens all in one place.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </section>

        <section id="dashboard" className="container py-24 sm:py-32">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-yellow-400">Your Crypto Dashboard</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCryptoData.map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="transform transition duration-300 ease-in-out"
              >
                <Card className="bg-gray-800 border-gray-700 overflow-hidden">
                  <CardHeader>
                    <CardTitle className={`text-2xl ${crypto.color}`}>{crypto.name}</CardTitle>
                    <CardDescription className="text-gray-400">{crypto.symbol}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">${crypto.price.toLocaleString()}</div>
                    <div className={`text-sm ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'} mb-4`}>
                      {crypto.change >= 0 ? '▲' : '▼'} {Math.abs(crypto.change)}%
                    </div>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart data={crypto.chartData}>
                        <Line type="monotone" dataKey="price" stroke={crypto.color.split('-')[1]} strokeWidth={2} dot={false} />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                          labelStyle={{ color: '#9CA3AF' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-8">
            <Label htmlFor="crypto-select" className="text-gray-300">Add cryptocurrency to track</Label>
            <div className="flex mt-2">
              <Input
                id="crypto-select"
                placeholder="Enter crypto symbol (e.g., BTC)"
                value={selectedCrypto}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedCrypto(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
              />
              <Button className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900">Add</Button>
            </div>
          </div>
        </section>

        <section id="feed" className="container py-24 sm:py-32">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-yellow-400">Your Crypto Feed</h2>
          <Tabs defaultValue="all" className="w-full mb-6">
            <TabsList className="bg-gray-700">
              <TabsTrigger value="all" onClick={() => setFeedSource('all')} className="data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900">All</TabsTrigger>
              <TabsTrigger value="youtube" onClick={() => setFeedSource('youtube')} className="data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900">YouTube</TabsTrigger>
              <TabsTrigger value="twitter" onClick={() => setFeedSource('twitter')} className="data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900">Twitter</TabsTrigger>
              <TabsTrigger value="news" onClick={() => setFeedSource('news')} className="data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900">News</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockFeedData
              .filter(item => feedSource === 'all' || item.type === feedSource)
              .map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="transform transition duration-300 ease-in-out"
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        {item.type === 'youtube' && <Youtube className="mr-2 h-4 w-4 text-red-500" />}
                        {item.type === 'twitter' && <Twitter className="mr-2 h-4 w-4 text-blue-400" />}
                        {item.type === 'news' && <DollarSign className="mr-2 h-4 w-4 text-green-500" />}
                        {item.title || item.content}
                      </CardTitle>
                      <CardDescription className="text-gray-400">{item.channel || item.author || item.source}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a href={item.url} className="text-yellow-500 hover:underline">View {item.type === 'youtube' ? 'video' : item.type === 'twitter' ? 'tweet' : 'article'}</a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
          <div className="mt-8">
            <Label htmlFor="feed-source" className="text-gray-300">Add new feed source</Label>
            <div className="flex mt-2">
              <Input id="feed-source" placeholder="Enter YouTube channel, Twitter handle, or news site" className="bg-gray-700 text-white border-gray-600 focus:border-yellow-500" />
              <Button className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900">Add</Button>
            </div>
          </div>
        </section>

        <section id="trending" className="container py-24 sm:py-32">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-yellow-400">Trending Cryptocurrencies</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockTrendingData.map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="transform transition duration-300 ease-in-out"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className={`flex items-center ${crypto.color}`}>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {crypto.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">{crypto.symbol}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-green-500 font-bold">▲ {crypto.change}%</div>
                    <Button variant="outline" className="mt-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900">Add to Dashboard</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container py-24 sm:py-32">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-4 text-yellow-400">About Crypto Hub</h2>
              <p className="text-gray-300 mb-4">
                Crypto Hub is your personalized gateway to the world of cryptocurrencies. We aggregate information from your favorite sources, provide real-time updates on your selected tokens, and offer insights on trending cryptocurrencies.
              </p>
              <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900">
                Learn More
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Stay Updated</h3>
              <p className="text-gray-300 mb-4">
                Subscribe to our newsletter for weekly crypto insights and analysis.
              </p>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                  />
                </div>
                <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-700">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
            © 2024 Crypto Hub. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a className="text-sm text-gray-400 hover:text-yellow-500 hover:underline underline-offset-4" href="#">
              Terms of Service
            </a>
            <a className="text-sm text-gray-400 hover:text-yellow-500 hover:underline underline-offset-4" href="#">
              Privacy Policy
            </a>
            <a className="text-sm text-gray-400 hover:text-yellow-500 hover:underline underline-offset-4" href="#">
              Contact Us
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}