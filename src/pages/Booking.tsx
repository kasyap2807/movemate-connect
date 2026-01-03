import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CheckCircle2,
  CreditCard,
  Wallet,
  QrCode,
  ArrowRight,
  Shield,
  User
} from 'lucide-react';
import { toast } from 'sonner';

const Booking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('upi');
  const [bookingData, setBookingData] = useState({
    fromLocation: '',
    toLocation: '',
    date: '',
    time: '',
    notes: ''
  });

  const provider = {
    id: id,
    name: 'Swift Packers & Movers',
    type: 'both',
    rating: 4.9,
    reviews: 234,
    price: 8500,
    location: 'Mumbai, Maharashtra',
    verified: true
  };

  const handleBooking = () => {
    toast.success('Booking confirmed! You will receive a confirmation shortly.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-20 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <h2 className="text-xl font-bold text-foreground mb-6">Moving Details</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Pickup Location
                          </label>
                          <input
                            type="text"
                            value={bookingData.fromLocation}
                            onChange={(e) => setBookingData({ ...bookingData, fromLocation: e.target.value })}
                            placeholder="Enter full address"
                            className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary" />
                            Drop Location
                          </label>
                          <input
                            type="text"
                            value={bookingData.toLocation}
                            onChange={(e) => setBookingData({ ...bookingData, toLocation: e.target.value })}
                            placeholder="Enter full address"
                            className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Moving Date
                          </label>
                          <input
                            type="date"
                            value={bookingData.date}
                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Preferred Time
                          </label>
                          <select
                            value={bookingData.time}
                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select time slot</option>
                            <option value="morning">Morning (6 AM - 12 PM)</option>
                            <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                            <option value="evening">Evening (4 PM - 8 PM)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Additional Notes</label>
                        <textarea
                          value={bookingData.notes}
                          onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                          placeholder="Any special instructions or requirements..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>
                    </div>

                    <Button className="w-full mt-6" size="lg" onClick={() => setStep(2)}>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <h2 className="text-xl font-bold text-foreground mb-6">Payment Method</h2>
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === 'upi'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">Pay via UPI</p>
                            <p className="text-sm text-muted-foreground">Scan QR code or use UPI ID</p>
                          </div>
                          {paymentMethod === 'upi' && (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === 'cash'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">Pay by Cash</p>
                            <p className="text-sm text-muted-foreground">Pay directly to the provider after service</p>
                          </div>
                          {paymentMethod === 'cash' && (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </button>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button className="flex-1" onClick={() => setStep(3)}>
                        Review Booking
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <h2 className="text-xl font-bold text-foreground mb-6">Review & Confirm</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        <h3 className="font-medium text-foreground mb-3">Moving Details</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">From</p>
                            <p className="text-foreground">{bookingData.fromLocation || 'Andheri, Mumbai'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">To</p>
                            <p className="text-foreground">{bookingData.toLocation || 'Bandra, Mumbai'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="text-foreground">{bookingData.date || 'January 15, 2026'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="text-foreground">{bookingData.time || 'Morning'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-muted/50">
                        <h3 className="font-medium text-foreground mb-3">Payment Method</h3>
                        <p className="text-foreground flex items-center gap-2">
                          {paymentMethod === 'upi' ? (
                            <>
                              <QrCode className="w-5 h-5 text-primary" />
                              UPI Payment
                            </>
                          ) : (
                            <>
                              <Wallet className="w-5 h-5 text-secondary" />
                              Cash Payment
                            </>
                          )}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">Total Amount</span>
                          <span className="text-2xl font-bold text-primary">₹{provider.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button variant="success" className="flex-1" onClick={handleBooking}>
                        <CheckCircle2 className="w-5 h-5" />
                        Confirm Booking
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar - Provider Summary */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                      <Truck className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{provider.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-secondary fill-secondary" />
                        <span className="font-medium text-foreground">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {provider.verified && (
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-success/10 text-success text-sm">
                      <Shield className="w-4 h-4" />
                      Verified Provider
                    </div>
                  )}

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Service Charge</span>
                      <span className="text-foreground">₹{provider.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span className="text-foreground">₹0</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-xl text-primary">₹{provider.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
