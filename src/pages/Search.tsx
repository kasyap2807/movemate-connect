import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  Truck, 
  Star, 
  MessageSquare, 
  Filter,
  SlidersHorizontal,
  Search as SearchIcon,
  ChevronDown,
  Heart
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  type: 'packer' | 'mover' | 'both';
  rating: number;
  reviews: number;
  basePrice: number;
  location: string;
  verified: boolean;
  avatar: string;
  services: string[];
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Swift Packers & Movers',
    type: 'both',
    rating: 4.9,
    reviews: 234,
    basePrice: 5000,
    location: 'Mumbai, Maharashtra',
    verified: true,
    avatar: '',
    services: ['Packing', 'Loading', 'Transport', 'Unloading']
  },
  {
    id: '2',
    name: 'SafeMove Transport',
    type: 'mover',
    rating: 4.7,
    reviews: 189,
    basePrice: 3500,
    location: 'Pune, Maharashtra',
    verified: true,
    avatar: '',
    services: ['Loading', 'Transport', 'Unloading']
  },
  {
    id: '3',
    name: 'ProPack Solutions',
    type: 'packer',
    rating: 4.8,
    reviews: 156,
    basePrice: 2000,
    location: 'Mumbai, Maharashtra',
    verified: true,
    avatar: '',
    services: ['Packing', 'Wrapping', 'Labeling']
  },
  {
    id: '4',
    name: 'QuickShift Logistics',
    type: 'both',
    rating: 4.6,
    reviews: 312,
    basePrice: 4500,
    location: 'Thane, Maharashtra',
    verified: false,
    avatar: '',
    services: ['Packing', 'Loading', 'Transport', 'Unloading', 'Storage']
  },
  {
    id: '5',
    name: 'CarefulCargo Movers',
    type: 'mover',
    rating: 4.9,
    reviews: 98,
    basePrice: 4000,
    location: 'Navi Mumbai, Maharashtra',
    verified: true,
    avatar: '',
    services: ['Transport', 'Heavy Items', 'Fragile Items']
  },
];

const Search: React.FC = () => {
  const [filters, setFilters] = useState({
    fromLocation: '',
    toLocation: '',
    date: '',
    serviceType: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'packer': return Package;
      case 'mover': return Truck;
      default: return Package;
    }
  };

  const getServiceLabel = (type: string) => {
    switch (type) {
      case 'packer': return 'Packer';
      case 'mover': return 'Mover';
      case 'both': return 'Full Service';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Search Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Find Service Providers</h1>
            <p className="text-muted-foreground">Browse verified packers and movers in your area</p>
          </motion.div>

          {/* Search Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  From
                </label>
                <input
                  type="text"
                  value={filters.fromLocation}
                  onChange={(e) => setFilters({ ...filters, fromLocation: e.target.value })}
                  placeholder="Pickup location"
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  To
                </label>
                <input
                  type="text"
                  value={filters.toLocation}
                  onChange={(e) => setFilters({ ...filters, toLocation: e.target.value })}
                  placeholder="Destination"
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Service Type
                </label>
                <select
                  value={filters.serviceType}
                  onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Services</option>
                  <option value="packer">Packer Only</option>
                  <option value="mover">Mover Only</option>
                  <option value="both">Full Service</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full h-11">
                  <SearchIcon className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 flex items-center gap-2 text-sm text-primary font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Advanced Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Price Range</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
                    <option>Any Price</option>
                    <option>Under ₹3,000</option>
                    <option>₹3,000 - ₹5,000</option>
                    <option>₹5,000 - ₹10,000</option>
                    <option>Above ₹10,000</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Rating</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
                    <option>Any Rating</option>
                    <option>4+ Stars</option>
                    <option>4.5+ Stars</option>
                    <option>5 Stars Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Verified Only</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
                    <option>All Providers</option>
                    <option>Verified Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sort By</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                    <option>Reviews</option>
                  </select>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{mockProviders.length}</span> providers found
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                      {React.createElement(getServiceIcon(provider.type), { className: 'w-7 h-7 text-primary-foreground' })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-foreground">{provider.name}</h3>
                        {provider.verified && (
                          <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {provider.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(provider.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.includes(provider.id)
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted text-muted-foreground hover:text-destructive'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(provider.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-semibold text-foreground">{provider.rating}</span>
                    <span className="text-sm text-muted-foreground">({provider.reviews} reviews)</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {getServiceLabel(provider.type)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.services.map((service, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs">
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-2xl font-bold text-foreground">₹{provider.basePrice.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/chat/${provider.id}`}>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4" />
                        Chat
                      </Button>
                    </Link>
                    <Link to={`/booking/${provider.id}`}>
                      <Button size="sm">
                        Request Quote
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
