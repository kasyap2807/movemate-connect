import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Truck, DollarSign, TrendingUp, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

interface Booking {
  trackingId: string;
  pickup: { address?: string };
  drop: { address?: string };
  serviceType: 'packers' | 'movers' | 'both';
  status: 'confirmed' | 'picked_up' | 'in_transit' | 'delivered';
  confirmedAt: string;
  pricing: {
    total: number;
    distance: string;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login&redirect=/admin');
      return;
    }

    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, [isAuthenticated, navigate]);

  const totalRevenue = bookings.reduce((acc, b) => acc + b.pricing.total, 0);
  const platformFee = bookings.filter(b => b.status === 'delivered').reduce((acc, b) => acc + b.pricing.total * 0.2, 0);

  const statusColors = {
    confirmed: 'bg-blue-500/10 text-blue-500',
    picked_up: 'bg-yellow-500/10 text-yellow-500',
    in_transit: 'bg-purple-500/10 text-purple-500',
    delivered: 'bg-green-500/10 text-green-500',
  };

  const statusLabels = {
    confirmed: 'Confirmed',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
  };

  // Mock data for users and providers
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', bookings: 3 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', bookings: 1 },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user', bookings: 5 },
  ];

  const mockProviders = [
    { id: 1, name: 'Quick Movers', type: 'both', jobs: 12, rating: 4.8 },
    { id: 2, name: 'Safe Packers', type: 'packers', jobs: 8, rating: 4.5 },
    { id: 3, name: 'Express Transport', type: 'movers', jobs: 15, rating: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, providers, bookings, and platform settings
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockProviders.length}</p>
                  <p className="text-sm text-muted-foreground">Providers</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{Math.round(platformFee)}</p>
                  <p className="text-sm text-muted-foreground">Platform Earnings</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="bookings" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                    <TabsTrigger 
                      value="bookings" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Bookings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="users"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Users
                    </TabsTrigger>
                    <TabsTrigger 
                      value="providers"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Providers
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="bookings" className="p-4">
                    {bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No bookings yet</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tracking ID</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.trackingId}>
                              <TableCell className="font-medium">{booking.trackingId}</TableCell>
                              <TableCell className="max-w-xs">
                                <div className="truncate text-xs">
                                  {booking.pickup.address} → {booking.drop.address}
                                </div>
                              </TableCell>
                              <TableCell className="capitalize">{booking.serviceType}</TableCell>
                              <TableCell>
                                <Badge className={statusColors[booking.status]}>
                                  {statusLabels[booking.status]}
                                </Badge>
                              </TableCell>
                              <TableCell>₹{booking.pricing.total}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/track?id=${booking.trackingId}`)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>

                  <TabsContent value="users" className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Bookings</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="capitalize">{user.role}</TableCell>
                            <TableCell>{user.bookings}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="providers" className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Completed Jobs</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockProviders.map((provider) => (
                          <TableRow key={provider.id}>
                            <TableCell className="font-medium">{provider.name}</TableCell>
                            <TableCell className="capitalize">{provider.type}</TableCell>
                            <TableCell>{provider.jobs}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1">
                                ⭐ {provider.rating}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
