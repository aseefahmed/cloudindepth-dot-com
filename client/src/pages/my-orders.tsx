import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  Download,
  Eye,
  Star,
  Clock,
  CheckCircle,
  BookOpen,
  Award,
  ExternalLink,
  Filter,
  Search,
  SortAsc,
  SortDesc
} from "lucide-react";
import { useAuth0Safe } from "@/components/auth-components";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
  total: number;
  items: OrderItem[];
  paymentMethod: string;
  transactionId: string;
}

interface OrderItem {
  id: string;
  name: string;
  type: "practice_test" | "course" | "certification";
  price: number;
  image?: string;
  description: string;
  status: "active" | "expired" | "completed";
  progress?: number;
  rating?: number;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { user } = useAuth0Safe();
  const { toast } = useToast();

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrders: Order[] = [
          {
            id: "1",
            orderNumber: "ORD-2024-001",
            date: "2024-01-15",
            status: "completed",
            total: 99.99,
            paymentMethod: "Credit Card",
            transactionId: "txn_123456789",
            items: [
              {
                id: "1",
                name: "AWS Solutions Architect Associate (SAA-C03)",
                type: "practice_test",
                price: 99.99,
                description: "Comprehensive practice tests for AWS SAA-C03 certification",
                status: "active",
                progress: 75,
                rating: 5
              }
            ]
          },
          {
            id: "2",
            orderNumber: "ORD-2024-002",
            date: "2024-01-10",
            status: "completed",
            total: 149.98,
            paymentMethod: "PayPal",
            transactionId: "txn_987654321",
            items: [
              {
                id: "2",
                name: "AWS DevOps Engineer Professional",
                type: "practice_test",
                price: 79.99,
                description: "Advanced DevOps practices and AWS services",
                status: "completed",
                progress: 100,
                rating: 5
              },
              {
                id: "3",
                name: "AWS Security Specialty",
                type: "practice_test",
                price: 69.99,
                description: "Security best practices and AWS security services",
                status: "active",
                progress: 45,
                rating: 4
              }
            ]
          },
          {
            id: "3",
            orderNumber: "ORD-2024-003",
            date: "2024-01-05",
            status: "completed",
            total: 199.97,
            paymentMethod: "Credit Card",
            transactionId: "txn_456789123",
            items: [
              {
                id: "4",
                name: "AWS Cloud Practitioner",
                type: "practice_test",
                price: 49.99,
                description: "Entry-level AWS certification practice tests",
                status: "completed",
                progress: 100,
                rating: 5
              },
              {
                id: "5",
                name: "AWS SysOps Administrator",
                type: "practice_test",
                price: 79.99,
                description: "System operations and administration on AWS",
                status: "completed",
                progress: 100,
                rating: 4
              },
              {
                id: "6",
                name: "AWS Machine Learning Specialty",
                type: "practice_test",
                price: 69.99,
                description: "ML and AI services on AWS platform",
                status: "active",
                progress: 30,
                rating: 5
              }
            ]
          }
        ];
        
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // Filter and sort orders
  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.total - b.total;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getItemStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Active</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "practice_test":
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case "course":
        return <Award className="h-5 w-5 text-purple-600" />;
      case "certification":
        return <Award className="h-5 w-5 text-yellow-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);
  const completedItems = orders.reduce((sum, order) => 
    sum + order.items.filter(item => item.status === "completed").length, 0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Orders</h1>
              <p className="text-slate-600 dark:text-slate-400">View and manage your past purchases</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Items</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalItems}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedItems}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search orders or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "status")}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="status">Sort by Status</option>
                </select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="border-slate-200 dark:border-slate-700"
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Orders Found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "No orders match your current filters." 
                    : "You haven't made any purchases yet."}
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Practice Tests
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CreditCard className="h-4 w-4" />
                          {order.paymentMethod}
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Amount</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                            {getItemIcon(item.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900 dark:text-white">${item.price.toFixed(2)}</p>
                                {getItemStatusBadge(item.status)}
                              </div>
                            </div>
                            
                            {item.progress !== undefined && (
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                                  <span className="text-slate-900 dark:text-white font-medium">{item.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${item.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {item.rating && (
                              <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'
                                    }`} 
                                  />
                                ))}
                                <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                                  ({item.rating}/5)
                                </span>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-200 dark:border-slate-600"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                              {item.status === "active" && (
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  Continue Learning
                                </Button>
                              )}
                              {item.status === "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Certificate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        {index < order.items.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}










