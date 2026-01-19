import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Package, Truck, ArrowRight, Calculator, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LocationMap from '@/components/LocationMap';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

type ServiceType = 'packers' | 'movers' | 'both';

const Book: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropLocation, setDropLocation] = useState<Location | null>(null);
  const [selectionMode, setSelectionMode] = useState<'pickup' | 'drop' | 'none'>('none');
  const [serviceType, setServiceType] = useState<ServiceType>('both');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate distance using Haversine formula
  const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate approximate cost
  const pricing = useMemo(() => {
    if (!pickupLocation || !dropLocation) return null;
    
    const distance = calculateDistance(pickupLocation, dropLocation);
    
    // Base rates per km
    const rates = {
      packers: 15, // ₹15/km for packing service
      movers: 25,  // ₹25/km for moving/transport
      both: 35,    // ₹35/km for combined service
    };
    
    // Base charges
    const baseCharges = {
      packers: 500,
      movers: 1000,
      both: 1200,
    };
    
    const baseRate = rates[serviceType];
    const baseCharge = baseCharges[serviceType];
    const distanceCost = distance * baseRate;
    const subtotal = baseCharge + distanceCost;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    
    return {
      distance: distance.toFixed(1),
      baseCharge,
      distanceCost: Math.round(distanceCost),
      subtotal: Math.round(subtotal),
      gst: Math.round(gst),
      total: Math.round(total),
    };
  }, [pickupLocation, dropLocation, serviceType]);

  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const location: Location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name,
        };
        
        if (selectionMode === 'pickup') {
          setPickupLocation(location);
        } else if (selectionMode === 'drop') {
          setDropLocation(location);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login&redirect=/book');
      return;
    }
    
    // Store booking data and navigate to confirmation
    const bookingData = {
      pickup: pickupLocation,
      drop: dropLocation,
      serviceType,
      pricing,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    navigate('/booking-confirmation');
  };

  const canProceedToStep2 = pickupLocation && dropLocation;
  const canProceedToStep3 = canProceedToStep2 && serviceType;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8 pt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s
                      ? 'gradient-hero text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 rounded ${
                      step > s ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-border shadow-lg"
            >
              <LocationMap
                pickupLocation={pickupLocation}
                dropLocation={dropLocation}
                onPickupChange={setPickupLocation}
                onDropChange={setDropLocation}
                selectionMode={selectionMode}
              />
            </motion.div>

            {/* Booking Form */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          Step 1: Select Locations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Search Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                          />
                          <Button onClick={handleLocationSearch} size="icon" variant="outline">
                            <Search className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Pickup Location */}
                        <div
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectionMode === 'pickup'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectionMode(selectionMode === 'pickup' ? 'none' : 'pickup')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">Pickup Location</p>
                              <p className="text-sm text-muted-foreground">
                                {pickupLocation?.address || 'Click to select on map'}
                              </p>
                            </div>
                            {pickupLocation && <CheckCircle className="w-5 h-5 text-green-500" />}
                          </div>
                        </div>

                        {/* Drop Location */}
                        <div
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectionMode === 'drop'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectionMode(selectionMode === 'drop' ? 'none' : 'drop')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">Drop Location</p>
                              <p className="text-sm text-muted-foreground">
                                {dropLocation?.address || 'Click to select on map'}
                              </p>
                            </div>
                            {dropLocation && <CheckCircle className="w-5 h-5 text-green-500" />}
                          </div>
                        </div>

                        <Button
                          className="w-full gap-2"
                          onClick={() => setStep(2)}
                          disabled={!canProceedToStep2}
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          Step 2: Choose Service Type
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <RadioGroup
                          value={serviceType}
                          onValueChange={(v) => setServiceType(v as ServiceType)}
                          className="space-y-3"
                        >
                          <div className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                            serviceType === 'packers' ? 'border-primary bg-primary/5' : 'border-border'
                          }`}>
                            <RadioGroupItem value="packers" id="packers" />
                            <Label htmlFor="packers" className="flex-1 cursor-pointer ml-3">
                              <div className="flex items-center gap-3">
                                <Package className="w-6 h-6 text-primary" />
                                <div>
                                  <p className="font-medium">Packers Only</p>
                                  <p className="text-sm text-muted-foreground">
                                    Professional packing service for your belongings
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>

                          <div className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                            serviceType === 'movers' ? 'border-primary bg-primary/5' : 'border-border'
                          }`}>
                            <RadioGroupItem value="movers" id="movers" />
                            <Label htmlFor="movers" className="flex-1 cursor-pointer ml-3">
                              <div className="flex items-center gap-3">
                                <Truck className="w-6 h-6 text-primary" />
                                <div>
                                  <p className="font-medium">Movers Only</p>
                                  <p className="text-sm text-muted-foreground">
                                    Transportation service for your items
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>

                          <div className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                            serviceType === 'both' ? 'border-primary bg-primary/5' : 'border-border'
                          }`}>
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both" className="flex-1 cursor-pointer ml-3">
                              <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                  <Package className="w-5 h-5 text-primary" />
                                  <Truck className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">Packers & Movers</p>
                                  <p className="text-sm text-muted-foreground">
                                    Complete packing and moving solution
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                            Back
                          </Button>
                          <Button className="flex-1 gap-2" onClick={() => setStep(3)}>
                            Continue <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {step === 3 && pricing && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-primary" />
                          Step 3: Cost Estimate
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Route Summary */}
                        <div className="p-4 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <p className="text-sm text-muted-foreground truncate">
                              {pickupLocation?.address}
                            </p>
                          </div>
                          <div className="w-0.5 h-4 bg-border ml-1.5" />
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <p className="text-sm text-muted-foreground truncate">
                              {dropLocation?.address}
                            </p>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Distance</span>
                            <span className="font-medium">{pricing.distance} km</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Base Charge</span>
                            <span className="font-medium">₹{pricing.baseCharge}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Distance Cost</span>
                            <span className="font-medium">₹{pricing.distanceCost}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">₹{pricing.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">GST (18%)</span>
                            <span className="font-medium">₹{pricing.gst}</span>
                          </div>
                          <div className="border-t border-border pt-3 flex justify-between">
                            <span className="font-semibold text-foreground">Total Amount</span>
                            <span className="text-xl font-bold text-primary">₹{pricing.total}</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                          * This is an approximate cost. Final amount may vary based on actual conditions.
                        </p>

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                            Back
                          </Button>
                          <Button 
                            className="flex-1 gap-2" 
                            onClick={handleConfirmBooking}
                          >
                            <CheckCircle className="w-4 h-4" />
                            {isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
