
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Pill, Shield, User, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EntryPage = () => {
  const features = [
    {
      icon: <Pill className="w-8 h-8 text-primary" />,
      title: "Medication Management",
      description: "Track and manage your medications with ease"
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Smart Scheduling",
      description: "Never miss a dose with intelligent reminders"
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Real-time Tracking",
      description: "Monitor your medication intake in real-time"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure & Private",
      description: "Your health data is protected and encrypted"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-primary mb-4"
          >
            Welcome to Mediminder
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Your personal medication companion for better health management
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/auth">
              <Button size="lg" className="mr-4">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 2) }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-block p-3 bg-accent/10 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="grid md:grid-cols-3 gap-8 mb-16 text-center"
        >
          {[
            { number: "10k+", label: "Active Users" },
            { number: "1M+", label: "Reminders Sent" },
            { number: "99.9%", label: "Uptime" }
          ].map((stat, index) => (
            <div key={stat.label} className="p-6 bg-card rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center bg-accent/10 rounded-2xl p-8 md:p-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Mediminder for their medication management needs.
          </p>
          <Link to="/auth">
            <Button size="lg" className="animate-pulse">
              Start Your Journey
              <User className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default EntryPage;
