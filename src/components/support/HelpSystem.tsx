
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MessageCircle, 
  Book, 
  Video, 
  HelpCircle, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  lastUpdated: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastReply: string;
}

export const HelpSystem: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with Card Creation',
      content: 'Learn how to create your first card using our intuitive editor...',
      category: 'Getting Started',
      tags: ['basics', 'editor', 'tutorial'],
      views: 1247,
      helpful: 89,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'Advanced 3D Effects and Materials',
      content: 'Explore premium 3D effects including holographic, metallic, and particle systems...',
      category: '3D Features',
      tags: ['3d', 'effects', 'premium'],
      views: 892,
      helpful: 76,
      lastUpdated: '2024-01-12'
    },
    {
      id: '3',
      title: 'Marketplace: Selling Your Templates',
      content: 'Step-by-step guide to monetize your card designs through our marketplace...',
      category: 'Monetization',
      tags: ['marketplace', 'selling', 'revenue'],
      views: 654,
      helpful: 95,
      lastUpdated: '2024-01-10'
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'T-001',
      subject: 'Premium 3D effects not loading',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-16',
      lastReply: '2024-01-16'
    },
    {
      id: 'T-002',
      subject: 'Payment processing issue',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-15',
      lastReply: '2024-01-15'
    }
  ];

  const videoTutorials = [
    {
      id: '1',
      title: 'Creating Your First 3D Card',
      duration: '5:32',
      thumbnail: '/tutorials/tutorial-1.jpg',
      url: '/tutorials/first-card'
    },
    {
      id: '2',
      title: 'Advanced Effect Combinations',
      duration: '8:15',
      thumbnail: '/tutorials/tutorial-2.jpg',
      url: '/tutorials/advanced-effects'
    },
    {
      id: '3',
      title: 'Marketplace Success Strategies',
      duration: '12:45',
      thumbnail: '/tutorials/tutorial-3.jpg',
      url: '/tutorials/marketplace-success'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(helpArticles.map(a => a.category)))];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Help & Support</h1>
        <p className="text-xl text-crd-lightGray">
          Get help with Cardshow's features and tools
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-5 h-5" />
          <Input
            placeholder="Search help articles, tutorials, and guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg bg-crd-dark border-crd-mediumGray"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors cursor-pointer">
          <CardHeader className="text-center">
            <MessageCircle className="w-8 h-8 text-crd-green mx-auto mb-2" />
            <CardTitle className="text-white">Live Chat</CardTitle>
            <CardDescription>Get instant help from our support team</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors cursor-pointer">
          <CardHeader className="text-center">
            <Book className="w-8 h-8 text-crd-green mx-auto mb-2" />
            <CardTitle className="text-white">Documentation</CardTitle>
            <CardDescription>Comprehensive guides and API docs</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">Browse Docs</Button>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors cursor-pointer">
          <CardHeader className="text-center">
            <Video className="w-8 h-8 text-crd-green mx-auto mb-2" />
            <CardTitle className="text-white">Video Tutorials</CardTitle>
            <CardDescription>Step-by-step video guides</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">Watch Videos</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-crd-dark border-crd-mediumGray">
          <TabsTrigger value="articles">Help Articles</TabsTrigger>
          <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <Card key={article.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-crd-lightGray">
                      <CheckCircle className="w-3 h-3" />
                      {article.helpful}% helpful
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{article.content}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-crd-lightGray">
                    <span>{article.views} views</span>
                    <span>Updated {article.lastUpdated}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map(tutorial => (
              <Card key={tutorial.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors cursor-pointer">
                <div className="aspect-video bg-crd-mediumGray rounded-t-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-12 h-12 text-crd-green" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                    {tutorial.duration}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{tutorial.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          {/* New Ticket Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Your Support Tickets</h2>
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {supportTickets.map(ticket => (
              <Card key={ticket.id} className="bg-crd-dark border-crd-mediumGray">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">{ticket.subject}</h3>
                      <p className="text-sm text-crd-lightGray">Ticket #{ticket.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={ticket.status === 'open' ? 'destructive' : 
                                ticket.status === 'pending' ? 'secondary' : 'default'}
                      >
                        {ticket.status}
                      </Badge>
                      <Badge variant="outline">
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-crd-lightGray">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created {ticket.createdAt}
                      </span>
                      <span>Last reply {ticket.lastReply}</span>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-crd-green" />
                  <div>
                    <p className="font-medium text-white">Live Chat</p>
                    <p className="text-sm text-crd-lightGray">Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-crd-green" />
                  <div>
                    <p className="font-medium text-white">Email Support</p>
                    <p className="text-sm text-crd-lightGray">support@cardshow.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-crd-green" />
                  <div>
                    <p className="font-medium text-white">Enterprise Support</p>
                    <p className="text-sm text-crd-lightGray">enterprise@cardshow.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Response Times</CardTitle>
                <CardDescription>Expected response times by plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Free Plan</span>
                  <Badge variant="outline">48 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Premium Plan</span>
                  <Badge variant="outline">24 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Creator Plan</span>
                  <Badge variant="outline">12 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Enterprise Plan</span>
                  <Badge>4 hours</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
