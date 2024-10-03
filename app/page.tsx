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
import { ArrowRight, Bitcoin, DollarSign, Youtube, Twitter, Sun, Moon } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import useWebSocket from 'react-use-websocket';
import { useTheme } from 'next-themes'

// Define the structure of our cryptocurrency data
interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
}

// Define the structure for trending crypto data
interface TrendingCrypto {
  id: string;
  name: string;
  symbol: string;
  price_change_percentage_24h: {
    usd: number;
  };
  thumb: string;
}

// Mock data for demonstration purposes
const mockFeedData = [
  { type: 'youtube', title: 'Bitcoin Price Prediction 2024', channel: 'Crypto Daily', url: '#' },
  { type: 'twitter', content: 'Ethereum 2.0 launch date confirmed!', author: '@ethereumproject', url: '#' },
  { type: 'news', title: 'Cardano Smart Contracts Go Live', source: 'CoinDesk', url: '#' },
]

export default function CryptoHub() {
  const [email, setEmail] = useState('')
  const [feedSource, setFeedSource] = useState('all')
  const [cryptoData, setCryptoData] = useState<{[key: string]: CryptoData}>({});
  const [trendingCryptos, setTrendingCryptos] = useState<TrendingCrypto[]>([])
  const [realtimePrices, setRealtimePrices] = useState<{[key: string]: number}>({});
  const [portfolio, setPortfolio] = useState<{[key: string]: number}>({});
  const [priceAlerts, setPriceAlerts] = useState<{[key: string]: number}>({});
  const [newCryptoId, setNewCryptoId] = useState('');

  const { lastMessage } = useWebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano');

  const { theme, setTheme } = useTheme()

  const fetchCryptoData = async (coinId: string) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true
        }
      });
      const data = response.data;
      setCryptoData(prev => ({
        ...prev,
        [coinId]: {
          id: data.id,
          symbol: data.symbol,
          name: data.name,
          image: data.image.small,
          current_price: data.market_data.current_price.usd,
          price_change_percentage_24h: data.market_data.price_change_percentage_24h,
          sparkline_in_7d: { price: data.market_data.sparkline_7d.price }
        }
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    }
  };

  const fetchTrendingCryptos = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
      const trendingData = response.data.coins.slice(0, 3).map((coin: { item: TrendingCrypto }) => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        price_change_percentage_24h: coin.item.price_change_percentage_24h.usd,
        thumb: coin.item.thumb,
      }));
      setTrendingCryptos(trendingData);
    } catch (error) {
      console.error('Error fetching trending crypto data:', error);
    }
  };

  useEffect(() => {
    const initialCoins = ['bitcoin', 'ethereum', 'cardano'];
    initialCoins.forEach(coin => fetchCryptoData(coin));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTrendingCryptos();
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data) as Record<string, number>;
      setRealtimePrices(prevPrices => ({...prevPrices, ...data}));
      
      // Check price alerts
      Object.entries(data).forEach(([cryptoId, price]) => {
        if (priceAlerts[cryptoId] && price >= priceAlerts[cryptoId]) {
          alert(`${cryptoId.toUpperCase()} has reached your target price of $${priceAlerts[cryptoId]}!`);
          // Remove the alert after triggering
          setPriceAlerts(prev => {
            const { [cryptoId]: _, ...rest } = prev;
            return rest;
          });
        }
      });
    }
  }, [lastMessage, priceAlerts]);

  // Add a comment to suppress the warning for updatePortfolio
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updatePortfolio = (cryptoId: string, amount: number) => {
    setPortfolio(prev => ({...prev, [cryptoId]: (prev[cryptoId] || 0) + amount}));
  };

  const setPriceAlert = (cryptoId: string, price: number) => {
    setPriceAlerts(prev => ({...prev, [cryptoId]: price}));
  };

  const addCrypto = async (coinId: string) => {
    if (!cryptoData[coinId]) {
      await fetchCryptoData(coinId);
    }
    setNewCryptoId('');
  };

  const removeCrypto = (coinId: string) => {
    setCryptoData(prev => {
      const newData = { ...prev };
      delete newData[coinId];
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white dark:bg-gradient-to-b dark:from-gray-100 dark:to-gray-300 dark:text-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 dark:bg-gray-100/95 dark:border-gray-300">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <a className="flex items-center space-x-2" href="/">
              <Bitcoin className="h-8 w-8 text-yellow-500" />
              <span className="font-bold text-xl sm:inline-block">Crypto Hub</span>
            </a>
          </div>
          <nav className="flex-1 flex justify-center items-center space-x-8 text-sm font-medium">
            <a className="transition-colors hover:text-yellow-500 text-gray-300 dark:text-gray-700" href="#dashboard">Dashboard</a>
            <a className="transition-colors hover:text-yellow-500 text-gray-300 dark:text-gray-700" href="#feed">Feed</a>
            <a className="transition-colors hover:text-yellow-500 text-gray-300 dark:text-gray-700" href="#trending">Trending</a>
          </nav>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-2 rounded-full bg-gray-700 dark:bg-gray-300 text-gray-300 dark:text-gray-700"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-24 sm:py-32">
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

        <section id="dashboard" className="py-12 sm:py-16">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-yellow-400">Your Crypto Dashboard</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(cryptoData).map((crypto) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="transform transition duration-300 ease-in-out relative"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeCrypto(crypto.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                >
                  X
                </Button>
                <Card className="bg-gray-800 border-gray-700 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
                      {crypto.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">{crypto.symbol.toUpperCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      ${realtimePrices[crypto.id] ? realtimePrices[crypto.id].toLocaleString() : crypto.current_price.toLocaleString()}
                    </div>
                    <div className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'} mb-4`}>
                      {crypto.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </div>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart data={crypto.sparkline_in_7d.price.map((price, i) => ({ day: i + 1, price }))}>
                        <Line type="monotone" dataKey="price" stroke={crypto.price_change_percentage_24h >= 0 ? '#10B981' : '#EF4444'} strokeWidth={2} dot={false} />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                          labelStyle={{ color: '#9CA3AF' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                          labelFormatter={(label: number) => `Day ${label}`}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const target = e.target as HTMLFormElement;
                      const price = parseFloat(target.alertPrice.value);
                      if (!isNaN(price)) {
                        setPriceAlert(crypto.id, price);
                        target.reset();
                      }
                    }}>
                      <Input name="alertPrice" placeholder="Set price alert" type="number" step="0.01" min="0" />
                      <Button type="submit">Set Alert</Button>
                    </form>
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
                placeholder="Enter crypto ID (e.g., bitcoin)"
                value={newCryptoId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCryptoId(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
              />
              <Button 
                className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                onClick={() => addCrypto(newCryptoId)}
              >
                Add
              </Button>
            </div>
          </div>
        </section>

        <section id="feed" className="py-12 sm:py-16">
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

        <section id="trending" className="py-12 sm:py-16">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-yellow-400">Trending Cryptocurrencies</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingCryptos.map((crypto) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="transform transition duration-300 ease-in-out"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <img src={crypto.thumb} alt={crypto.name} className="w-6 h-6 mr-2" />
                      {crypto.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">{crypto.symbol.toUpperCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-sm ${crypto.price_change_percentage_24h.usd >= 0 ? 'text-green-500' : 'text-red-500'} font-bold`}>
                      {crypto.price_change_percentage_24h.usd >= 0 ? '▲' : '▼'} {Math.abs(crypto.price_change_percentage_24h.usd).toFixed(2)}%
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900"
                      onClick={() => addCrypto(crypto.id)}
                    >
                      Add to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="portfolio" className="py-12 sm:py-16">
          <h2 className="text-3xl font-bold tracking-tighter mb-8 text-yellow-400">Your Portfolio</h2>
          {Object.keys(portfolio).length > 0 ? (
            Object.entries(portfolio).map(([cryptoId, amount]) => {
              const crypto = cryptoData[cryptoId];
              if (!crypto) return null;
              const value = amount * (realtimePrices[cryptoId] || crypto.current_price);
              return (
                <div key={cryptoId} className="flex justify-between items-center mb-4">
                  <span>{crypto.name}</span>
                  <span>{amount} {crypto.symbol.toUpperCase()}</span>
                  <span>${value.toLocaleString()}</span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Your portfolio is empty. Add some cryptocurrencies to get started!</p>
              <Button 
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                onClick={() => {/* Implement a function to add crypto to portfolio */}}
              >
                Add Cryptocurrency
              </Button>
            </div>
          )}
        </section>

        <section className="py-12 sm:py-16">
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