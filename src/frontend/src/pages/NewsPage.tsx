import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function NewsPage() {
  const newsArticles = [
    {
      id: 1,
      title: 'Real Estate Market Trends 2026: What to Expect',
      excerpt: 'Discover the latest trends shaping the Indian real estate market in 2026, from smart homes to sustainable living.',
      category: 'Market Analysis',
      date: '2026-02-20',
      image: '/assets/generated/news-header.dim_1200x400.png',
    },
    {
      id: 2,
      title: 'Top 10 Cities for Real Estate Investment in India',
      excerpt: 'Explore the most promising cities for real estate investment with high growth potential and excellent returns.',
      category: 'Investment Guide',
      date: '2026-02-18',
      image: '/assets/generated/property-residential.dim_800x600.png',
    },
    {
      id: 3,
      title: 'Understanding RERA: A Complete Guide for Buyers',
      excerpt: 'Everything you need to know about RERA regulations and how they protect homebuyers in India.',
      category: 'Legal',
      date: '2026-02-15',
      image: '/assets/generated/property-commercial.dim_800x600.png',
    },
    {
      id: 4,
      title: 'Luxury Real Estate: The Rise of Premium Properties',
      excerpt: 'Luxury real estate segment sees unprecedented growth with high-net-worth individuals seeking premium properties.',
      category: 'Luxury Segment',
      date: '2026-02-12',
      image: '/assets/generated/hero-luxury.dim_1920x600.png',
    },
    {
      id: 5,
      title: 'Commercial Real Estate: Office Spaces in Demand',
      excerpt: 'Post-pandemic recovery drives demand for modern office spaces with hybrid work-friendly amenities.',
      category: 'Commercial',
      date: '2026-02-10',
      image: '/assets/generated/property-commercial.dim_800x600.png',
    },
    {
      id: 6,
      title: 'Green Buildings: The Future of Sustainable Living',
      excerpt: 'Eco-friendly construction and green certifications become key factors in property buying decisions.',
      category: 'Sustainability',
      date: '2026-02-08',
      image: '/assets/generated/property-residential.dim_800x600.png',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="/assets/generated/news-header.dim_1200x400.png"
          alt="News & Magazine"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60">
          <div className="container h-full flex items-center">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Newspaper className="h-8 w-8" />
                <span className="text-sm font-semibold uppercase tracking-wide">QubeYards Magazine</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Real Estate News & Insights
              </h1>
              <p className="text-lg text-muted-foreground">
                Stay updated with the latest trends, market analysis, and expert insights in the real estate industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-medium transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground">
                    {article.category}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.date).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="group/btn">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
