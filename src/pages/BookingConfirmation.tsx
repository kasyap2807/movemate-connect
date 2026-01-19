import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Package, Truck, ArrowRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

interface BookingData {
  pickup: { lat: number; lng: number; address?: string };
  drop: { lat: number; lng: number; address?: string };
  serviceType: 'packers' | 'movers' | 'both';
  pricing: {
    distance: string;
    baseCharge: number;
    distanceCost: number;
    subtotal: number;
    gst: number;
    total: number;
  };
  createdAt: string;
}

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login&redirect=/booking-confirmation');
      return;
    }

    const storedData = localStorage.getItem('pendingBooking');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    } else {
      navigate('/book');
    }
  }, [isAuthenticated, navigate]);

  const handleConfirm = () => {
    // Generate tracking ID
    const id = 'MM' + Date.now().toString().slice(-8);
    setTrackingId(id);
    setIsConfirmed(true);
    
    // Clear pending booking
    localStorage.removeItem('pendingBooking');
    
    // Store confirmed booking
    const confirmedBooking = {
      ...bookingData,
      trackingId: id,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      userId: user?.id,
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, confirmedBooking]));
    
    toast.success('Booking confirmed successfully!');
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    toast.success('Tracking ID copied!');
  };

  if (!bookingData) return null;

  const serviceLabels = {
    packers: 'Packers Only',
    movers: 'Movers Only',
    both: 'Packers & Movers',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {!isConfirmed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Confirm Your Booking</CardTitle>
                  <p className="text-muted-foreground">
                    Please review your booking details below
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Route Summary */}
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h4 className="font-semibold mb-3">Route Details</h4>
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="text-sm">{bookingData.pickup.address}</p>
                      </div>
                    </div>
                    <div className="w-0.5 h-4 bg-border ml-1.5" />
                    <div className="flex items-start gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="text-sm">{bookingData.drop.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      {bookingData.serviceType === 'packers' && <Package className="w-5 h-5 text-primary" />}
                      {bookingData.serviceType === 'movers' && <Truck className="w-5 h-5 text-primary" />}
                      {bookingData.serviceType === 'both' && (
                        <div className="flex -space-x-2">
                          <Package className="w-5 h-5 text-primary" />
                          <Truck className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <span className="font-medium">{serviceLabels[bookingData.serviceType]}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {bookingData.pricing.distance} km
                    </span>
                  </div>

                  {/* Price Summary */}
                  <div className="p-4 rounded-xl border border-border">
                    <h4 className="font-semibold mb-3">Price Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Charge</span>
                        <span>₹{bookingData.pricing.baseCharge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance Cost ({bookingData.pricing.distance} km)</span>
                        <span>₹{bookingData.pricing.distanceCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span>₹{bookingData.pricing.gst}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span className="text-primary text-lg">₹{bookingData.pricing.total}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By confirming, you agree to our terms and conditions. 
                    Payment will be collected after service completion.
                  </p>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/book')} className="flex-1">
                      Back
                    </Button>
                    <Button className="flex-1 gap-2" onClick={handleConfirm}>
                      <CheckCircle className="w-4 h-4" />
                      Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-primary-foreground" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your booking has been confirmed. You can track your shipment using the tracking ID below.
                  </p>

                  <div className="p-4 rounded-xl bg-muted/50 mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Tracking ID</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-primary">{trackingId}</span>
                      <Button variant="ghost" size="icon" onClick={copyTrackingId}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/dashboard')}
                    >
                      Go to Dashboard
                    </Button>
                    <Button 
                      className="flex-1 gap-2"
                      onClick={() => navigate(`/track?id=${trackingId}`)}
                    >
                      Track Shipment <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
