import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Truck, 
  Star,
  Wallet,
  FileText,
  MessageSquare,
  User,
  LogOut,
  Home,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Edit2,
  Eye,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  QrCode
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  customerName: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  status: 'pending' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
  quotedPrice?: number;
}

const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    customerName: 'Priya Sharma',
    fromLocation: 'Andheri, Mumbai',
    toLocation: 'Bandra, Mumbai',
    date: '2026-01-15',
    status: 'pending'
  },
  {
    id: '2',
    customerName: 'Raj Patel',
    fromLocation: 'Pune',
    toLocation: 'Mumbai',
    date: '2026-01-18',
    status: 'quoted',
    quotedPrice: 15000
  },
  {
    id: '3',
    customerName: 'Anita Desai',
    fromLocation: 'Thane',
    toLocation: 'Navi Mumbai',
    date: '2026-01-20',
    status: 'confirmed',
    quotedPrice: 8500
  }
];

const ProviderDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'quoted': return 'bg-primary/10 text-primary';
      case 'confirmed': return 'bg-success/10 text-success';
      case 'completed': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'requests', label: 'Service Requests', icon: FileText },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'services', label: 'My Services', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSendQuote = () => {
    // Handle quote submission
    setShowQuoteModal(false);
    setQuotePrice('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-5rem)] bg-card border-r border-border p-4">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">Provider Dashboard</p>
            <p className="font-semibold text-foreground">{user?.name || 'Provider'}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
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
                  <h1 className="text-2xl font-bold text-foreground">Provider Dashboard</h1>
                  <p className="text-muted-foreground">Manage your services and bookings</p>
                </div>
                <Button onClick={() => setActiveTab('services')}>
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'New Requests', value: '5', icon: FileText, color: 'primary' },
                  { label: 'Active Bookings', value: '3', icon: Calendar, color: 'secondary' },
                  { label: 'This Month Earnings', value: '₹45,000', icon: TrendingUp, color: 'success' },
                  { label: 'Wallet Balance', value: '₹12,500', icon: Wallet, color: 'primary' }
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

              {/* Recent Requests */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Recent Requests</h2>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {mockRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{request.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.fromLocation} → {request.toLocation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {request.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowQuoteModal(true);
                            }}
                          >
                            Send Quote
                          </Button>
                        )}
                        {request.quotedPrice && (
                          <p className="font-semibold text-foreground">₹{request.quotedPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-5 h-5 text-secondary fill-secondary" />
                    <span className="font-semibold text-foreground">Your Rating</span>
                  </div>
                  <p className="text-4xl font-bold text-foreground">4.9</p>
                  <p className="text-sm text-muted-foreground">Based on 156 reviews</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Total Customers</span>
                  </div>
                  <p className="text-4xl font-bold text-foreground">234</p>
                  <p className="text-sm text-muted-foreground">Served till date</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground">Service Requests</h1>
              
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <User className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{request.customerName}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {request.fromLocation} → {request.toLocation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {request.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {request.status === 'pending' && (
                          <Button 
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowQuoteModal(true);
                            }}
                          >
                            <DollarSign className="w-4 h-4" />
                            Send Quote
                          </Button>
                        )}
                        {request.quotedPrice && (
                          <p className="text-xl font-bold text-foreground">₹{request.quotedPrice.toLocaleString()}</p>
                        )}
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                          Chat
                        </Button>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                      <Wallet className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-3xl font-bold text-foreground">₹12,500.00</p>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    <DollarSign className="w-5 h-5" />
                    Withdraw Funds
                  </Button>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">UPI QR Code</h3>
                  <div className="w-40 h-40 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-20 h-20 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Edit2 className="w-4 h-4" />
                    Update UPI Details
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Transaction History</h3>
                <div className="space-y-3">
                  {[
                    { type: 'credit', amount: 8500, desc: 'Payment from Priya Sharma', date: '2026-01-05' },
                    { type: 'debit', amount: 850, desc: 'Platform fee deducted', date: '2026-01-05' },
                    { type: 'credit', amount: 12000, desc: 'Payment from Raj Patel', date: '2026-01-02' },
                    { type: 'debit', amount: 5000, desc: 'Withdrawal to bank', date: '2025-12-28' },
                  ].map((txn, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${txn.type === 'credit' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                          {txn.type === 'credit' ? (
                            <TrendingUp className="w-5 h-5 text-success" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-destructive rotate-180" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{txn.desc}</p>
                          <p className="text-xs text-muted-foreground">{txn.date}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${txn.type === 'credit' ? 'text-success' : 'text-destructive'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">My Services</h1>
                <Button>
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Packing Service</h3>
                      <p className="text-sm text-muted-foreground">Professional packing with quality materials</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Base Price: <span className="font-semibold text-foreground">₹2,000</span></p>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                      <Truck className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Transport Service</h3>
                      <p className="text-sm text-muted-foreground">Safe and timely delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Base Price: <span className="font-semibold text-foreground">₹3,500</span></p>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {['Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Nashik'].map((area) => (
                    <span key={area} className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                      {area}
                    </span>
                  ))}
                  <button className="px-4 py-2 rounded-lg border-2 border-dashed border-border text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors">
                    + Add Area
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs follow similar patterns */}
          {(activeTab === 'bookings' || activeTab === 'messages' || activeTab === 'settings') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground capitalize">{activeTab}</h1>
              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <p className="text-muted-foreground">Connect to backend to enable full functionality.</p>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Send Price Quote</h2>
            {selectedRequest && (
              <div className="mb-4 p-4 rounded-xl bg-muted/50">
                <p className="font-medium text-foreground">{selectedRequest.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.fromLocation} → {selectedRequest.toLocation}
                </p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Quote Amount (₹)</label>
                <input
                  type="number"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="Enter your price"
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowQuoteModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSendQuote}>
                  Send Quote
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
