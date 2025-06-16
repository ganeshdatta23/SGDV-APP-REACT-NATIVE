import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, MapPin, Shield, Upload } from "lucide-react";
import { Link } from "wouter";

const authSchema = z.object({
  token: z.string().min(1, "Admin token is required"),
});

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

type AuthForm = z.infer<typeof authSchema>;
type LocationForm = z.infer<typeof locationSchema>;

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const { toast } = useToast();

  const authForm = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      token: "",
    },
  });

  const locationForm = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      latitude: 0,
      longitude: 0,
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const { data: currentLocation, isLoading: isLoadingLocation } = useQuery({
    queryKey: ["/api/guru-location"],
    enabled: isAuthenticated,
  });

  const authMutation = useMutation({
    mutationFn: async (data: AuthForm) => {
      const response = await apiRequest("POST", "/api/admin/auth", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        setAuthToken(authForm.getValues("token"));
        toast({
          title: "Authentication Successful",
          description: "You can now update Guru's location",
        });
        
        // Load current location data into form
        if (currentLocation) {
          locationForm.reset({
            latitude: parseFloat(currentLocation.latitude),
            longitude: parseFloat(currentLocation.longitude),
            address: currentLocation.address,
            city: currentLocation.city,
            state: currentLocation.state,
            country: currentLocation.country,
          });
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (data: LocationForm) => {
      const response = await apiRequest("POST", "/api/admin/update-location", data, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Location Updated",
          description: "Guru's location has been successfully updated",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/guru-location"] });
      }
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAuth = (data: AuthForm) => {
    authMutation.mutate(data);
  };

  const handleLocationUpdate = (data: LocationForm) => {
    updateLocationMutation.mutate(data);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationForm.setValue("latitude", position.coords.latitude);
          locationForm.setValue("longitude", position.coords.longitude);
          toast({
            title: "Location Retrieved",
            description: "Current GPS coordinates have been filled in",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Failed to get current location: " + error.message,
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-white via-soft-gray to-meditation/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron to-sacred rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-sacred">Admin Access</CardTitle>
            <CardDescription>
              Enter admin token to update Guru's location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...authForm}>
              <form onSubmit={authForm.handleSubmit(handleAuth)} className="space-y-4">
                <FormField
                  control={authForm.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Token</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter admin token"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-3">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-saffron to-sacred"
                    disabled={authMutation.isPending}
                  >
                    {authMutation.isPending ? "Verifying..." : "Authenticate"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-soft-gray to-meditation/10">
      {/* Header */}
      <header className="bg-gradient-to-r from-spiritual to-meditation p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-white font-sacred font-semibold text-lg">Admin Panel</h1>
            <p className="text-white/80 text-sm">Update Guru's location</p>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Current Location Display */}
        {currentLocation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-spiritual" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Address:</strong> {currentLocation.address}</p>
                <p><strong>City:</strong> {currentLocation.city}, {currentLocation.state}</p>
                <p><strong>Country:</strong> {currentLocation.country}</p>
                <p><strong>Coordinates:</strong> {currentLocation.latitude}, {currentLocation.longitude}</p>
                <p><strong>Last Updated:</strong> {new Date(currentLocation.createdAt).toLocaleString()}</p>
                <p><strong>Updated By:</strong> {currentLocation.updatedBy}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Update Location Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Location</CardTitle>
            <CardDescription>
              Enter new location details for Guru's current position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...locationForm}>
              <form onSubmit={locationForm.handleSubmit(handleLocationUpdate)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={locationForm.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0.000000"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0.000000"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetCurrentLocation}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current GPS Location
                </Button>

                <FormField
                  control={locationForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={locationForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={locationForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-saffron to-sacred"
                  disabled={updateLocationMutation.isPending}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {updateLocationMutation.isPending ? "Updating..." : "Update Location"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
