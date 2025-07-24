import { useState } from 'react';

import { Target, CheckSquare, BarChart3, Clock, Users, Zap, Shield, Star, ArrowRight, Play, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Target,
      title: 'Smart Goal Tracking',
      description: 'Set and achieve your goals with AI-powered insights and milestone tracking.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Organize, prioritize, and complete tasks with our intuitive task management system.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Productivity Analytics',
      description: 'Get detailed insights into your productivity patterns and optimize your workflow.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Track your time with built-in Pomodoro timers and focus session management.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team and share projects in real-time.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Smart Automation',
      description: 'Automate repetitive tasks and let AI help you stay organized.',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      image: 'keys/sarah-avatar?prompt=professional%20woman%20headshot%20avatar',
      quote: "TaskFlow Pro has transformed how I manage my team's productivity. The analytics are incredibly insightful.",
    },
    {
      name: 'Michael Rodriguez',
      role: 'Freelance Designer',
      company: 'Independent',
      image: 'keys/michael-avatar?prompt=professional%20man%20headshot%20avatar',
      quote: "The goal tracking feature keeps me motivated and on track. I've achieved more in 3 months than ever before.",
    },
    {
      name: 'Emma Thompson',
      role: 'Software Engineer',
      company: 'StartupXYZ',
      image: 'keys/emma-avatar?prompt=professional%20woman%20headshot%20avatar%20tech',
      quote: 'Clean interface, powerful features, and the time tracking has made me so much more aware of my productivity.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 10 tasks',
        'Basic goal tracking',
        'Simple time tracking',
        'Mobile app access',
        'Community support',
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      description: 'For serious productivity enthusiasts',
      features: [
        'Unlimited tasks & goals',
        'Advanced analytics',
        'Team collaboration',
        'Custom integrations',
        'Priority support',
        'Advanced automation',
        'Custom themes',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$24',
      period: 'per member/month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Advanced team features',
        'Admin dashboard',
        'SSO integration',
        'Custom branding',
        'Dedicated support',
        'API access',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <div className='flex items-center space-x-3 cursor-pointer'>
              <Link to='/' className='logo-link'>
                <img
                  className='logo-image'
                  src='/src/assets/logo.png'
                  alt='Logo'
                />
                <span className='text-xl font-bold text-gray-900'>Master Management</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-8'>
              <a href='#features' className='text-gray-600 hover:text-gray-900 transition-colors'>Features</a>
              <a href='#pricing' className='text-gray-600 hover:text-gray-900 transition-colors'>Pricing</a>
              <a href='#testimonials' className='text-gray-600 hover:text-gray-900 transition-colors'>Reviews</a>
              <a href='#contact' className='text-gray-600 hover:text-gray-900 transition-colors'>Contact</a>
            </div>

            {/* Auth Buttons */}
            <div className='hidden md:flex items-center space-x-4'>
              <button className='text-gray-600 hover:text-gray-900 transition-colors font-medium'>
                Log In
              </button>
              <button className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium'>
                Sign Up Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className='md:hidden border-t border-gray-200 py-4'>
              <div className='flex flex-col space-y-4'>
                <a href='#features' className='text-gray-600 hover:text-gray-900 transition-colors'>Features</a>
                <a href='#pricing' className='text-gray-600 hover:text-gray-900 transition-colors'>Pricing</a>
                <a href='#testimonials' className='text-gray-600 hover:text-gray-900 transition-colors'>Reviews</a>
                <a href='#contact' className='text-gray-600 hover:text-gray-900 transition-colors'>Contact</a>
                <div className='pt-4 border-t border-gray-200 flex flex-col space-y-2'>
                  <button className='text-gray-600 hover:text-gray-900 transition-colors font-medium text-left'>
                    Log In
                  </button>
                  <button className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium'>
                    Sign Up Free
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50' />
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <div className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 text-sm font-medium mb-6'>
                <Zap className='w-4 h-4 mr-2' />
                Boost your productivity by 300%
              </div>
              <h1 className='text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6'>
                Achieve Your Goals with
                <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'> Smart Productivity</span>
              </h1>
              <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
                TaskFlow Pro combines intelligent task management, goal tracking, and productivity analytics to help you accomplish more than ever before.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <button className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold flex items-center justify-center group'>
                  Start Free Trial
                  <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
                </button>
                <button className='border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all duration-200 font-semibold flex items-center justify-center'>
                  <Play className='w-5 h-5 mr-2' />
                  Watch Demo
                </button>
              </div>
              <div className='flex items-center mt-8 text-sm text-gray-500'>
                <Shield className='w-4 h-4 mr-2' />
                No credit card required • 14-day free trial • Cancel anytime
              </div>
            </div>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl transform rotate-3 scale-105 opacity-20' />
              <img
                src='src/assets/dashboard-preview.png'
                alt='TaskFlow Pro Dashboard'
                className='relative rounded-2xl shadow-2xl w-full'
              />
              <div className='absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-white rounded-full animate-pulse' />
                  <span className='text-sm font-medium'>Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl lg:text-5xl font-bold text-gray-900 mb-6'>
              Everything you need to stay
              <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'> productive</span>
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              From simple task tracking to advanced analytics, TaskFlow Pro provides all the tools you need to achieve your goals and maximize productivity.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div key={index} className='group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-purple-200 transition-all duration-300'>
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className='w-7 h-7 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-4'>{feature.title}</h3>
                <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-gradient-to-r from-purple-600 to-pink-600'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2'>50K+</div>
              <div className='text-purple-100'>Active Users</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2'>2M+</div>
              <div className='text-purple-100'>Tasks Completed</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2'>98%</div>
              <div className='text-purple-100'>Satisfaction Rate</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2'>300%</div>
              <div className='text-purple-100'>Productivity Boost</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id='testimonials' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl lg:text-5xl font-bold text-gray-900 mb-6'>
              Loved by thousands of
              <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'> productive people</span>
            </h2>
            <p className='text-xl text-gray-600'>See what our users have to say about TaskFlow Pro</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                <div className='flex items-center mb-6'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-5 h-5 text-yellow-400 fill-current' />
                  ))}
                </div>
                <blockquote className='text-gray-700 mb-6 leading-relaxed'>
                  "
                  {testimonial.quote}
                  "
                </blockquote>
                <div className='flex items-center'>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='w-12 h-12 rounded-full mr-4'
                  />
                  <div>
                    <div className='font-semibold text-gray-900'>{testimonial.name}</div>
                    <div className='text-sm text-gray-600'>
                      {testimonial.role}
                      {' '}
                      at
                      {' '}
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl lg:text-5xl font-bold text-gray-900 mb-6'>
              Simple, transparent
              <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'> pricing</span>
            </h2>
            <p className='text-xl text-gray-600'>Choose the plan that works best for you</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 border-2 ${plan.highlighted
                  ? 'border-purple-500 bg-gradient-to-b from-purple-50 to-pink-50'
                  : 'border-gray-200 bg-white'} ${plan.highlighted ? 'scale-105 shadow-xl' : 'hover:shadow-lg'} transition-all duration-300`}
              >
                {plan.highlighted && (
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                    <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium'>
                      Most Popular
                    </span>
                  </div>
                )}
                <div className='text-center mb-8'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-2'>{plan.name}</h3>
                  <p className='text-gray-600 mb-4'>{plan.description}</p>
                  <div className='flex items-baseline justify-center'>
                    <span className='text-5xl font-bold text-gray-900'>{plan.price}</span>
                    <span className='text-gray-600 ml-2'>
                      /
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className='space-y-4 mb-8'>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className='flex items-center'>
                      <CheckSquare className='w-5 h-5 text-green-500 mr-3 flex-shrink-0' />
                      <span className='text-gray-700'>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${plan.highlighted
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  : 'border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className='text-center mt-12'>
            <p className='text-gray-600 mb-4'>Need a custom solution for your enterprise?</p>
            <button className='text-purple-600 hover:text-purple-700 font-semibold'>
              Contact our sales team
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-gray-900 to-purple-900'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl lg:text-5xl font-bold text-white mb-6'>
            Ready to supercharge your productivity?
          </h2>
          <p className='text-xl text-gray-300 mb-8'>
            Join thousands of professionals who have transformed their work and life with TaskFlow Pro.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold'>
              Start Your Free Trial
            </button>
            <button className='border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-200 font-semibold'>
              Schedule a Demo
            </button>
          </div>
          <div className='flex items-center justify-center mt-6 text-sm text-gray-400'>
            <Shield className='w-4 h-4 mr-2' />
            14-day free trial • No credit card required
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
            <div>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                  <Target className='w-4 h-4 text-white' />
                </div>
                <span className='text-xl font-bold'>TaskFlow Pro</span>
              </div>
              <p className='text-gray-400 leading-relaxed'>
                The ultimate productivity suite for achieving your goals and maximizing your potential.
              </p>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Product</h4>
              <ul className='space-y-2 text-gray-400'>
                <li><a href='#' className='hover:text-white transition-colors'>Features</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>Pricing</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>Integrations</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>API</a></li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Company</h4>
              <ul className='space-y-2 text-gray-400'>
                <li><a href='#' className='hover:text-white transition-colors'>About</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>Blog</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>Careers</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Support</h4>
              <ul className='space-y-2 text-gray-400'>
                <li><a href='#' className='hover:text-white transition-colors'>Help Center</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>Contact</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>Privacy</a></li>
                <li><a href='#' className='hover:text-white transition-colors'>Terms</a></li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-400 text-sm'>
              © 2025 TaskFlow Pro. All rights reserved.
            </p>
            <div className='flex space-x-6 mt-4 md:mt-0'>
              <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                <span className='sr-only'>Twitter</span>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                </svg>
              </a>
              <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                <span className='sr-only'>GitHub</span>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' />
                </svg>
              </a>
              <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                <span className='sr-only'>LinkedIn</span>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;