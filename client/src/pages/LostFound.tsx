import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Search, 
  Plus, 
  Clock, 
  MapPin, 
  Phone,
  CheckCircle,
  AlertCircle,
  Camera,
  Filter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const lostFoundSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["lost", "found"]),
  category: z.string().min(1, "Category is required"),
  location: z.string().optional(),
  contactInfo: z.string().min(1, "Contact information is required"),
});

type LostFoundFormData = z.infer<typeof lostFoundSchema>;

export default function LostFound() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createItemOpen, setCreateItemOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/lost-found", { type: typeFilter === "all" ? undefined : typeFilter }],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LostFoundFormData>({
    resolver: zodResolver(lostFoundSchema),
  });

  const selectedType = watch("type");

  const createItemMutation = useMutation({
    mutationFn: async (data: LostFoundFormData) => {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch("/api/lost-found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item posted successfully!",
        description: "Your lost/found item has been published and is now visible to all users.",
      });
      setCreateItemOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
    },
    onError: (error) => {
      console.error("Create item error:", error);
      toast({
        title: "Error posting item",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LostFoundFormData) => {
    createItemMutation.mutate(data);
  };

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "Electronics", "Books", "Clothing", "Accessories", "Documents", 
    "Sports Equipment", "Personal Items", "Bags", "Keys", "Other"
  ];

  const getTypeIcon = (type: string) => {
    return type === "lost" ? "❌" : "✅";
  };

  const getTypeColor = (type: string) => {
    return type === "lost" 
      ? "bg-red-100 text-red-800" 
      : "bg-green-100 text-green-800";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden md:block border-r bg-white" />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lost & Found</h1>
                <p className="text-gray-600">
                  Help your college community by reporting lost items or found items
                </p>
              </div>
              <Button
                onClick={() => setCreateItemOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Item
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search lost or found items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="found">Found</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredItems.length === 0 ? (
                <EmptyState
                  icon={<Search className="h-12 w-12" />}
                  title="No Items Found"
                  description={searchQuery ? "Try adjusting your search or filters" : "Be the first to report a lost or found item!"}
                  action={
                    <Button
                      onClick={() => setCreateItemOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Report Item
                    </Button>
                  }
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredItems.map((item: any) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{getTypeIcon(item.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.title}
                              </h3>
                              <Badge className={getTypeColor(item.type)}>
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-3">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              {item.location && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {item.location}
                                </div>
                              )}
                            </div>
                            
                            <p className="text-gray-700 mb-4 line-clamp-3">
                              {item.description}
                            </p>
                            
                            {/* Images placeholder */}
                            {item.images && item.images.length > 0 && (
                              <div className="mb-4">
                                <div className="grid grid-cols-2 gap-2">
                                  {item.images.slice(0, 2).map((image: string, index: number) => (
                                    <div
                                      key={index}
                                      className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center"
                                    >
                                      <Camera className="h-6 w-6 text-gray-400" />
                                      <span className="text-xs text-gray-500 ml-2">Image {index + 1}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={item.poster?.profileImage} />
                                    <AvatarFallback>
                                      {item.poster?.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {item.poster?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.poster?.role}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>
                                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                    </span>
                                  </div>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Phone className="h-3 w-3 mr-1" />
                                    Contact
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Items</span>
                    <span className="font-semibold">{items.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lost Items</span>
                    <span className="font-semibold text-red-600">
                      {items.filter((item: any) => item.type === "lost").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Found Items</span>
                    <span className="font-semibold text-green-600">
                      {items.filter((item: any) => item.type === "found").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resolved</span>
                    <span className="font-semibold text-blue-600">
                      {items.filter((item: any) => item.isResolved).length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.slice(0, 6).map((category) => {
                      const count = items.filter((item: any) => item.category === category).length;
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{category}</span>
                          <Badge variant="outline" className="text-xs">
                            {count}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    • Include clear photos when possible
                  </p>
                  <p className="text-sm text-gray-600">
                    • Mention specific identifying features
                  </p>
                  <p className="text-sm text-gray-600">
                    • Provide accurate location details
                  </p>
                  <p className="text-sm text-gray-600">
                    • Update your post when item is found/returned
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Create Item Modal */}
      <Dialog open={createItemOpen} onOpenChange={setCreateItemOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Lost or Found Item</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => setValue("type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lost">Lost Item (I lost something)</SelectItem>
                  <SelectItem value="found">Found Item (I found something)</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Item Name</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder={selectedType === "lost" ? "What did you lose?" : "What did you find?"}
                error={errors.title?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Where was it lost/found?"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Provide detailed description including color, size, brand, distinguishing features..."
                rows={4}
                error={errors.description?.message}
              />
            </div>

            <div>
              <Label htmlFor="contactInfo">Contact Information</Label>
              <Input
                id="contactInfo"
                {...register("contactInfo")}
                placeholder="Phone number, email, or how to reach you"
                error={errors.contactInfo?.message}
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Add photos to help identify the item</p>
              <Button type="button" variant="outline" size="sm">
                Upload Images
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Supports JPG, PNG files up to 5MB each
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateItemOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createItemMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createItemMutation.isPending ? "Publishing..." : "Publish Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
