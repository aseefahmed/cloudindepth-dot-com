import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import articlesData from "../data/articles.json";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Code,
  Cloud,
  Shield,
  Database,
  TrendingUp,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Smartphone
} from "lucide-react";

interface Author {
  name: string;
  title: string;
  avatar: string;
  bio: string;
}

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  tags: string[];
  image_url: string | null;
  created_at: string;
}


export default function BlogDetails() {
  const [, params] = useRoute("/blog/:id");
  const [post, setPost] = useState<Article | null>(null);
  const [allPosts, setAllPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const loadPost = () => {
      console.log('Loading article from local JSON data...');
      const postId = params?.id;
      
      if (postId) {
        console.log('Local data loaded:', articlesData.length, 'articles');
        
        setAllPosts(articlesData);
        
        // Find the specific article by ID (convert both to string for comparison)
        const foundPost = articlesData.find((p: Article) => String(p.id) === String(postId));
        console.log("Found article:", foundPost);
        if (foundPost) {
          setPost(foundPost);
          setLikeCount(0); // Articles don't have likes in the current structure
        } else {
          console.error('Article not found for ID:', postId);
        }
      }
      setIsLoading(false);
    };

    loadPost();
  }, [params?.id]);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      "Cloud Architecture": Cloud,
      "DevOps": Code,
      "Security": Shield,
      "Database": Database
    };
    return icons[category] || BookOpen;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Cloud Architecture": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "DevOps": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "Security": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      "Database": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = async (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const title = post.title || '';
    const description = post.title || '';
    const hashtags = post.tags ? post.tags.slice(0, 3).join(',') : 'cloud,devops,aws';
    
    try {
      switch (platform) {
        case 'twitter':
          const twitterText = `${title} - ${description}`.substring(0, 200);
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
          window.open(twitterUrl, '_blank', 'width=550,height=420');
          break;
          
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
          window.open(facebookUrl, '_blank', 'width=550,height=420');
          break;
          
        case 'linkedin':
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
          window.open(linkedinUrl, '_blank', 'width=550,height=420');
          break;
          
        case 'copy':
          try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          } catch (err) {
            console.error('Failed to copy URL:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          }
          break;
          
        case 'native':
          if (navigator.share) {
            try {
              await navigator.share({
                title: title,
                text: description,
                url: url,
              });
            } catch (err) {
              console.log('Native share cancelled or failed:', err);
            }
          } else {
            // Fallback to copy if native share is not available
            handleShare('copy');
          }
          break;
          
        default:
          console.warn('Unknown share platform:', platform);
      }
    } catch (error) {
      console.error('Share error:', error);
      // Show user-friendly error message
      alert('Failed to share. Please try again or copy the link manually.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Navigation scrollToSection={scrollToSection} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Navigation scrollToSection={scrollToSection} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon("Cloud Architecture");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navigation scrollToSection={scrollToSection} />
      
      {/* Hero Section */}
      <div className="pt-20">
        <div className="relative h-[600px] overflow-hidden">
          <img
            src={post.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Badge className={`${getCategoryColor("Cloud Architecture")} px-4 py-2 text-sm font-semibold shadow-lg`}>
                  <CategoryIcon className="h-4 w-4 mr-2" />
                  Cloud Architecture
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 text-white/90">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                    alt={post.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg"
                  />
                  
                </div>
                <div className="flex items-center gap-6 text-sm lg:text-base">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">5 min read</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">0 views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Back to Blog Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline" className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
              <ArrowLeft className="h-4 w-4" />
              Back to All Articles
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/98 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-16">

                {/* Article Content */}
                <div 
                  className="prose prose-xl max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:leading-relaxed prose-p:text-lg prose-li:text-lg prose-li:leading-relaxed prose-headings:tracking-tight prose-h1:mb-8 prose-h2:mb-6 prose-h3:mb-4 prose-h4:mb-3 prose-p:mb-6 prose-ul:mb-6 prose-ol:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-16 pt-8 border-t border-gray-200/60">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-xl text-foreground">Related Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-sm px-4 py-2 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer border-primary/20 hover:border-primary hover:shadow-md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-16 pt-8 border-t border-gray-200/60">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* <div className="flex items-center gap-4">
                      <Button
                        variant={isLiked ? "default" : "outline"}
                        size="lg"
                        onClick={handleLike}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                          isLiked 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl' 
                            : 'border-2 border-gray-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>0</span>
                      </Button>
                    </div> */}

                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <span className="text-sm text-muted-foreground font-semibold">Share this article:</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare('twitter')}
                          className="w-12 h-12 rounded-full hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Twitter className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare('facebook')}
                          className="w-12 h-12 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Facebook className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare('linkedin')}
                          className="w-12 h-12 rounded-full hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Linkedin className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare('copy')}
                          className="w-12 h-12 rounded-full hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Author Card */}
              {/* <Card className="border-0 shadow-2xl bg-white/98 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                        alt={post.author}
                        className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-white shadow-2xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    <h3 className="font-bold text-2xl mb-2 text-foreground">{post.author}</h3>
                    <p className="text-sm text-primary mb-4 font-semibold">Admin</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      Experienced professional with expertise in cloud technologies and DevOps practices.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" size="sm" className="rounded-full px-6 py-2 hover:bg-primary hover:text-white transition-all duration-300">
                        Follow
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full px-6 py-2 hover:bg-primary hover:text-white transition-all duration-300">
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* AWS Practice Test Banner */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/aws-solution-architect-associate-practice-test.jpg"
                  alt="AWS Solution Architect Associate Practice Test"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* <h3 className="text-white font-bold text-lg mb-2">AWS Practice Test</h3>
                  <p className="text-white/90 text-sm mb-4">Prepare for your AWS Solution Architect Associate certification</p> */}
                  <Link href="/practice-tests/saa">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                      Start Practice Test
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
