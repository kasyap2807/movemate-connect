import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search,
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Package, 
  Truck, 
  Star,
  Wallet,
  FileText,
  Bell,
  User,
  LogOut,
  Home,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Booking {
  id: string;
  providerName: string;
  providerType: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  fromLocation: string;
  toLocation: string;
  date: string;
  price: number;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    providerName: 'Swift Packers & Movers',
    providerType: 'both',
    status: 'confirmed',
    fromLocation: 'Andheri, Mumbai',
    toLocation: 'Bandra, Mumbai',
    date: '2026-01-15',
    price: 8500
  },
  {
    id: '2',
    providerName: 'SafeMove Transport',
    providerType: 'mover',
    status: 'in_progress',
    fromLocation: 'Pune',
    toLocation: 'Mumbai',
    date: '2026-01-10',
    price: 12000
  },
  {
    id: '3',
    providerName: 'ProPack Solutions',
    providerType: 'packer',
    status: 'completed',
    fromLocation: 'Thane',
    toLocation: 'Navi Mumbai',
    date: '2025-12-28',
    price: 4500
  }
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'confirmed': return 'bg-primary/10 text-primary';
      case 'in_progress': return 'bg-secondary/10 text-secondary';
      case 'completed': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'bookings', label: 'My Bookings', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-5rem)] bg-card border-r border-border p-4">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
            <p className="font-semibold text-foreground">{user?.name || 'User'}</p>
          </div>
          
          <nav className="space-y-1 flex-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground">Manage your bookings and activities</p>
                </div>
                <Link to="/search">
                  <Button>
                    <Search className="w-4 h-4" />
                    Find Services
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Bookings', value: '2', icon: Package, color: 'primary' },
                  { label: 'Completed', value: '5', icon: CheckCircle2, color: 'success' },
                  { label: 'Messages', value: '3', icon: MessageSquare, color: 'secondary' },
                  { label: 'Wallet Balance', value: '₹0', icon: Wallet, color: 'primary' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl border border-border p-5"
                  >
                    <div className={`w-10 h-10 rounded-xl ${stat.color === 'primary' ? 'bg-primary/10' : stat.color === 'success' ? 'bg-success/10' : 'bg-secondary/10'} flex items-center justify-center mb-3`}>
                      <stat.icon className={`w-5 h-5 ${stat.color === 'primary' ? 'text-primary' : stat.color === 'success' ? 'text-success' : 'text-secondary'}`} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {mockBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                          {booking.providerType === 'both' ? (
                            <Package className="w-6 h-6 text-primary-foreground" />
                          ) : booking.providerType === 'mover' ? (
                            <Truck className="w-6 h-6 text-primary-foreground" />
                          ) : (
                            <Package className="w-6 h-6 text-primary-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{booking.providerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.fromLocation} → {booking.toLocation}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">₹{booking.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/search" className="block">
                  <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Find New Providers</h3>
                        <p className="text-sm text-muted-foreground">Search for packers and movers</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Link>
                <Link to="/chat" className="block">
                  <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">View Messages</h3>
                        <p className="text-sm text-muted-foreground">Chat with your providers</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
              
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                          <Truck className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{booking.providerName}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {booking.fromLocation} → {booking.toLocation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {booking.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                          <p className="text-xl font-bold text-foreground mt-1">₹{booking.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
              
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-3xl font-bold text-foreground">₹0.00</p>
                  </div>
                </div>
                <p className="text-muted-foreground">No transactions yet. Your payment history will appear here.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground">Messages</h1>
              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages yet. Start a conversation with a provider.</p>
                <Link to="/search">
                  <Button className="mt-4">Find Providers</Button>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-foreground">{user?.name || 'User'}</p>
                    <p className="text-muted-foreground">{user?.email || 'user@email.com'}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">Profile editing coming soon. Connect to backend to enable full functionality.</p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
