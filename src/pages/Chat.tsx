import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  CheckCircle2,
  User,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'provider';
  timestamp: Date;
  type: 'text' | 'quote';
  quoteAmount?: number;
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hi, I need packing and moving services from Andheri to Bandra.',
    sender: 'user',
    timestamp: new Date('2026-01-03T10:00:00'),
    type: 'text'
  },
  {
    id: '2',
    text: 'Hello! Yes, we provide full packing and moving services. Can you share more details about the items?',
    sender: 'provider',
    timestamp: new Date('2026-01-03T10:05:00'),
    type: 'text'
  },
  {
    id: '3',
    text: 'I have a 2BHK apartment with standard furniture, appliances, and about 20 cartons of household items.',
    sender: 'user',
    timestamp: new Date('2026-01-03T10:10:00'),
    type: 'text'
  },
  {
    id: '4',
    text: 'Based on your requirements, here is my quote:',
    sender: 'provider',
    timestamp: new Date('2026-01-03T10:15:00'),
    type: 'quote',
    quoteAmount: 8500
  },
];

const Chat: React.FC = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [quoteAccepted, setQuoteAccepted] = useState(false);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleAcceptQuote = () => {
    setQuoteAccepted(true);
    const message: Message = {
      id: Date.now().toString(),
      text: 'I accept the quote. Please proceed with the booking.',
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([...messages, message]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col pt-20">
        {/* Chat Header */}
        <div className="bg-card border-b border-border px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="md:hidden">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Swift Packers & Movers</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : ''}`}>
                  {message.type === 'quote' ? (
                    <div className="bg-card rounded-2xl border-2 border-primary p-4">
                      <p className="text-sm text-muted-foreground mb-2">{message.text}</p>
                      <div className="bg-primary/10 rounded-xl p-4 mb-3">
                        <p className="text-sm text-muted-foreground">Total Quote Amount</p>
                        <p className="text-3xl font-bold text-primary">₹{message.quoteAmount?.toLocaleString()}</p>
                      </div>
                      {!quoteAccepted && message.sender === 'provider' && (
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            Negotiate
                          </Button>
                          <Button className="flex-1" onClick={handleAcceptQuote}>
                            <CheckCircle2 className="w-4 h-4" />
                            Accept
                          </Button>
                        </div>
                      )}
                      {quoteAccepted && (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Quote Accepted</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-card border border-border text-foreground rounded-bl-md'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-card border-t border-border p-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 h-12 px-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleSend} disabled={!newMessage.trim()}>
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
