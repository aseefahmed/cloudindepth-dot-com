import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import {
  Download,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Eye,
  Star,
  Clock,
  Tag,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  SortAsc,
  SortDesc,
  File,
  Archive,
  Globe,
  Shield,
  Zap,
  Building,
  Cloud,
  Database,
  Server,
  Code,
  Network,
  Lock,
  Settings,
  Monitor,
  Container,
  GitBranch,
  Target,
  CheckCircle,
  TrendingUp,
  Users,
  Bookmark,
  Share2,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { mockDownloads, type DownloadableFile } from "@/components/mockDownloads";


const categories = ["All", ...Array.from(new Set(mockDownloads.map(d => d.category)))];

export default function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "rating" | "downloads">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedFilters, setExpandedFilters] = useState(false);
  const { toast } = useToast();

  const filteredDownloads = mockDownloads
    .filter(download => {
      const matchesSearch = 
        download.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        download.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        download.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || download.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloadCount - a.downloadCount;
        case "newest":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case "rating":
          return b.rating - a.rating;
        case "downloads":
          return b.downloadCount - a.downloadCount;
        default:
          return 0;
      }
    });

  const handleDownload = (file: DownloadableFile) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.title}...`,
    });
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = 'https://cloudindepth.com/downloads/'+file.fileName;
    link.download = `${file.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message after a short delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${file.title} has been downloaded successfully!`,
      });
    }, 1000);
  };

  const getCategoryCount = (category: string) => {
    if (category === "All") return mockDownloads.length;
    return mockDownloads.filter(d => d.category === category).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDownloadCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation scrollToSection={scrollToSection} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 pt-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Download className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Downloads</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">Access our comprehensive collection of guides, cheat sheets, and resources</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{mockDownloads.length}</h3>
            <p className="text-slate-600 dark:text-slate-400">Total Resources</p>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {formatDownloadCount(mockDownloads.reduce((sum, d) => sum + d.downloadCount, 0))}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Total Downloads</p>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-center p-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {(mockDownloads.reduce((sum, d) => sum + d.rating, 0) / mockDownloads.length).toFixed(1)}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Average Rating</p>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
              <Tag className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{categories.length - 1}</h3>
            <p className="text-slate-600 dark:text-slate-400">Categories</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedFilters(!expandedFilters)}
                  className="lg:hidden"
                >
                  {expandedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              <div className={`space-y-4 ${expandedFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Search Resources
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search downloads..."
                      className="pl-10 border-slate-200 dark:border-slate-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className={`w-full justify-between text-left ${
                          selectedCategory === category
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span>{category}</span>
                        <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {getCategoryCount(category)}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Sort By
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "popular", label: "Most Popular", icon: TrendingUp },
                      { value: "newest", label: "Newest First", icon: Calendar },
                      { value: "rating", label: "Highest Rated", icon: Star },
                      { value: "downloads", label: "Most Downloaded", icon: Download }
                    ].map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <Button
                          key={option.value}
                          variant="ghost"
                          className={`w-full justify-start text-left ${
                            sortBy === option.value
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                              : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                          onClick={() => setSortBy(option.value as any)}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* View Controls */}
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {filteredDownloads.length} Resources Found
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedCategory !== "All" && `in ${selectedCategory}`}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Downloads Grid/List */}
            {filteredDownloads.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                {filteredDownloads.map((download) => {
                  const IconComponent = download.icon;
                  return (
                    <Card
                      key={download.id}
                      className={`border-2 ${download.borderColor} ${download.bgColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`p-3 bg-gradient-to-br ${download.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white break-words">
                                    {download.title}
                                  </h3>
                                  {download.isPopular && (
                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                      <Star className="h-3 w-3 mr-1" />
                                      Popular
                                    </Badge>
                                  )}
                                  {download.isNew && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      New
                                    </Badge>
                                  )}
                                  {download.isFree && (
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      Free
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                                  {download.description}
                                </p>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              <Badge variant="outline" className="text-xs">
                                {download.category}
                              </Badge>
                              {download.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {download.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{download.tags.length - 3}
                                </Badge>
                              )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Download className="h-4 w-4" />
                                  {formatDownloadCount(download.downloadCount)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  {download.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                  <File className="h-4 w-4" />
                                  {download.fileSize}
                                </span>
                              </div>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(download.uploadDate)}
                              </span>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                              <User className="h-4 w-4" />
                              <span>By {download.author}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleDownload(download)}
                                className={`flex-1 bg-gradient-to-r ${download.color} hover:opacity-90 text-white font-semibold`}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-slate-200 dark:border-slate-700"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-slate-200 dark:border-slate-700"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-12 text-center">
                <Download className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Resources Found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Stay Updated with New Resources</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
                Get notified when we release new guides, cheat sheets, and resources to help you stay ahead in your cloud journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Bookmark className="mr-2 h-5 w-5" />
                  Subscribe to Updates
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share with Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
      
      </div>
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}
