import { useState } from 'react';
import { Clock, Users, BarChart3, QrCode, Smartphone, Shield, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const features = [
    {
      icon: Clock,
      title: 'Real-time Clock In/Out',
      description: 'Employees can clock in and out instantly with precise timestamp tracking'
    },
    {
      icon: QrCode,
      title: 'QR Code Scanning',
      description: 'Mobile app with QR code scanning for quick and secure attendance'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed reports, overtime calculations, and productivity insights'
    },
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Manage unlimited employees with custom roles and permissions'
    },
    {
      icon: Smartphone,
      title: 'Mobile & Web App',
      description: 'Access from anywhere with our responsive web and mobile applications'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee'
    }
  ];

  const plans = [
    {
      name: 'Free Trial',
      price: 'Free',
      duration: '14 days',
      description: 'Perfect for testing all features',
      features: [
        'Unlimited employees',
        'QR code scanning',
        'Real-time tracking',
        'Basic reports',
        'Mobile app access',
        'Email support'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Monthly',
      price: '৳5',
      duration: 'per month',
      description: 'Great for small businesses',
      features: [
        'Everything in Free Trial',
        'Advanced analytics',
        'Custom reports',
        'Priority support',
        'Data export',
        'API access'
      ],
      popular: true,
      cta: 'Get Started'
    },
    {
      name: 'Yearly',
      price: '৳15',
      duration: 'per month (billed yearly)',
      description: 'Best value for growing teams',
      features: [
        'Everything in Monthly',
        'Advanced integrations',
        'Custom branding',
        'Dedicated support',
        'Training sessions',
        'SLA guarantee'
      ],
      popular: false,
      cta: 'Save 75%'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmed Rahman',
      company: 'Dhaka Restaurant Group',
      text: 'OLA Time Clock has revolutionized our attendance tracking. The QR code feature is amazing!',
      rating: 5
    },
    {
      name: 'Fatima Khan',
      company: 'Khan Industries',
      text: 'Simple, reliable, and affordable. Perfect for our manufacturing business.',
      rating: 5
    },
    {
      name: 'Mohammad Ali',
      company: 'Tech Solutions BD',
      text: 'The mobile app makes it so easy for our remote workers to track time.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">OLA Time Clock</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="/account/signin" className="text-blue-600 hover:text-blue-700">Sign In</a>
              <a 
                href="/account/signup" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Modern Time Clock for
              <span className="text-blue-600"> Bangladesh Businesses</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline employee attendance with QR code scanning, real-time tracking, 
              and powerful analytics. Start your 14-day free trial today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/account/signup" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Free Trial - 14 Days
              </a>
              <a 
                href="#demo" 
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Watch Demo
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Setup in 5 minutes • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Time Tracking
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for Bangladesh businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple setup in 3 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up & Setup</h3>
              <p className="text-gray-600">Create your account and add employees in minutes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate QR Codes</h3>
              <p className="text-gray-600">Create QR codes for different locations or departments</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Tracking</h3>
              <p className="text-gray-600">Employees scan QR codes to clock in/out instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that works best for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-lg border-2 p-8 ${
                  plan.popular 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.duration}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href="/account/signup" 
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              All plans include unlimited employees and 24/7 support. 
              <a href="#contact" className="text-blue-600 hover:text-blue-700 ml-1">
                Contact us for enterprise pricing.
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Bangladesh Businesses
            </h2>
            <p className="text-xl text-gray-600">See what our customers are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Time Tracking?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Bangladesh businesses already using OLA Time Clock. 
            Start your free trial today!
          </p>
          <a 
            href="/account/signup" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Free 14-Day Trial
          </a>
          <p className="text-blue-100 text-sm mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-blue-400 mr-2" />
                <h3 className="text-xl font-bold">OLA Time Clock</h3>
              </div>
              <p className="text-gray-400">
                Modern time tracking solution for Bangladesh businesses.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/admin" className="hover:text-white">Admin Panel</a></li>
                <li><a href="#mobile" className="hover:text-white">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#help" className="hover:text-white">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white">Contact Us</a></li>
                <li><a href="#docs" className="hover:text-white">Documentation</a></li>
                <li><a href="#api" className="hover:text-white">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#security" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OLA Time Clock. All rights reserved. Made in Bangladesh 🇧🇩</p>
          </div>
        </div>
      </footer>
    </div>
  );
}