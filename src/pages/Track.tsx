import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Package, Truck, CheckCircle, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LocationMap from '@/components/LocationMap';

interface Booking {
  trackingId: string;
  pickup: { lat: number; lng: number; address?: string };
  drop: { lat: number; lng: number; address?: string };
  serviceType: 'packers' | 'movers' | 'both';
  status: 'confirmed' | 'picked_up' | 'in_transit' | 'delivered';
  confirmedAt: string;
  pricing: {
    total: number;
    distance: string;
  };
}

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

const Track: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [liveLocation, setLiveLocation] = useState<Location | null>(null);
  const [error, setError] = useState('');

  const statusSteps = [
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'picked_up', label: 'Picked Up', icon: Package },
    { key: 'in_transit', label: 'In Transit', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: MapPin },
  ];

  const handleSearch = () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const found = bookings.find((b: Booking) => b.trackingId === trackingId);

    if (found) {
      setBooking(found);
      setError('');
      
      // Simulate live location for in_transit status
      if (found.status === 'in_transit') {
        // Calculate a point between pickup and drop
        const lat = (found.pickup.lat + found.drop.lat) / 2 + (Math.random() - 0.5) * 0.1;
        const lng = (found.pickup.lng + found.drop.lng) / 2 + (Math.random() - 0.5) * 0.1;
        setLiveLocation({ lat, lng, address: 'Current Location' });
      } else {
        setLiveLocation(null);
      }
    } else {
      setBooking(null);
      setError('No booking found with this tracking ID');
    }
  };

  useEffect(() => {
    if (trackingId) {
      handleSearch();
    }
  }, []);

  // Simulate live location updates
  useEffect(() => {
    if (!booking || booking.status !== 'in_transit') return;

    const interval = setInterval(() => {
      setLiveLocation((prev) => {
        if (!prev || !booking) return prev;
        
        // Move towards destination
        const targetLat = booking.drop.lat;
        const targetLng = booking.drop.lng;
        const newLat = prev.lat + (targetLat - prev.lat) * 0.1;
        const newLng = prev.lng + (targetLng - prev.lng) * 0.1;
        
        return { lat: newLat, lng: newLng, address: 'Current Location' };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [booking]);

  const getCurrentStepIndex = () => {
    if (!booking) return -1;
    return statusSteps.findIndex((step) => step.key === booking.status);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Track Your Shipment
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter your tracking ID to see real-time location and status of your shipment
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="flex gap-2">
              <Input
                placeholder="Enter Tracking ID (e.g., MM12345678)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="gap-2">
                <Search className="w-4 h-4" />
                Track
              </Button>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2 text-center">{error}</p>
            )}
          </motion.div>

          {booking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* Map */}
              <div className="h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-border shadow-lg">
                <LocationMap
                  pickupLocation={booking.pickup}
                  dropLocation={booking.drop}
                  liveLocation={liveLocation}
                  readonly
                />
              </div>

              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Tracking: {booking.trackingId}</span>
                    {booking.status === 'in_transit' && (
                      <span className="flex items-center gap-1 text-sm font-normal text-primary animate-pulse">
                        <Navigation className="w-4 h-4" />
                        Live
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Timeline */}
                  <div className="relative">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getCurrentStepIndex();
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;

                      return (
                        <div key={step.key} className="flex items-start gap-4 pb-6 last:pb-0">
                          <div className="relative">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? 'gradient-hero text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}
                            >
                              <step.icon className="w-5 h-5" />
                            </div>
                            {index < statusSteps.length - 1 && (
                              <div
                                className={`absolute left-5 top-10 w-0.5 h-6 ${
                                  index < currentIndex ? 'bg-primary' : 'bg-muted'
                                }`}
                              />
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-primary">Current Status</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Route Details */}
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="text-sm">{booking.pickup.address}</p>
                      </div>
                    </div>
                    <div className="w-0.5 h-4 bg-border ml-1.5" />
                    <div className="flex items-start gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="text-sm">{booking.drop.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-semibold text-foreground">{booking.pricing.distance} km</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-primary">₹{booking.pricing.total}</p>
                    </div>
                  </div>

                  {liveLocation && (
                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                      <div className="flex items-center gap-2 text-primary">
                        <Navigation className="w-5 h-5 animate-pulse" />
                        <span className="font-medium">Live Tracking Active</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your shipment is currently in transit. Location updates every few seconds.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!booking && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Truck className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Enter your tracking ID above to track your shipment
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;
