// src/components/blog/HealthBlog.tsx
import React, { useState, useEffect } from 'react';
import { Search, Heart, Share2, Bookmark, Clock, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  readTime: string;
  publishedDate: string;
  likes: number;
  tags: string[];
}

export const HealthBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'Nutrition', 'Fitness', 'Mental Health', 
    'Pregnancy', 'Child Care', 'Medicine',
    'COVID-19', 'Heart Health', 'Diabetes'
  ];

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: '10 Tips for a Healthy Pregnancy',
      excerpt: 'Essential tips every expecting mother should know...',
      content: 'Full article content here...',
      author: 'Dr. Sarah Wilson',
      category: 'Pregnancy',
      imageUrl: '/blog/pregnancy-tips.jpg',
      readTime: '5 min',
      publishedDate: '2025-01-15',
      likes: 245,
      tags: ['pregnancy', 'health', 'tips']
    },
    {
      id: '2',
      title: 'Understanding Blood Pressure',
      excerpt: 'Everything you need to know about blood pressure...',
      content: 'Full article content here...',
      author: 'Dr. James Brown',
      category: 'Heart Health',
      imageUrl: '/blog/blood-pressure.jpg',
      readTime: '7 min',
      publishedDate: '2025-01-12',
      likes: 189,
      tags: ['blood pressure', 'heart', 'health']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Health Blog</h1>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-5">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {post.category}
              </span>
              <h3 className="text-lg font-semibold mt-2 line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime} read</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button className="text-gray-500 hover:text-blue-500">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="text-gray-500 hover:text-yellow-500">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthBlog;
