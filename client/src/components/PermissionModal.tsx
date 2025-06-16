import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, MapPin, Clock, CheckCircle } from "lucide-react";

interface PermissionModalProps {
  isOpen: boolean;
  onRequestPermissions: () => void;
  onClose: () => void;
}

export function PermissionModal({ isOpen, onRequestPermissions, onClose }: PermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron to-sacred rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="text-white w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Device Permissions</h3>
            <p className="text-gray-600 mb-6">
              We need access to your device's compass and location to provide accurate direction to your Guru.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-divine" />
                  <span className="text-sm text-gray-700">Location Services</span>
                </div>
                <CheckCircle className="w-5 h-5 text-divine" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Device Orientation</span>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Later
              </Button>
              <Button 
                onClick={onRequestPermissions}
                className="flex-1 bg-gradient-to-r from-saffron to-sacred hover:from-saffron/90 hover:to-sacred/90"
              >
                Allow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
