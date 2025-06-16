import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DarshanModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAligned: boolean;
}

export function DarshanModal({ isOpen, onClose, isAligned }: DarshanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex flex-col justify-center items-center">
      {/* Background Video - Using a placeholder gradient since we can't include actual video */}
      <div className="absolute inset-0 bg-gradient-to-b from-spiritual/20 via-meditation/30 to-saffron/20 opacity-30" />
      
      {/* Sacred Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.3) 2px, transparent 2px)',
            backgroundSize: '40px 40px',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
      </div>

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Darshan Content */}
      <div className="relative z-10 text-center p-8 max-w-md">
        
        {/* Guru Image Placeholder with Sacred Symbol */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-saffron to-sacred p-2 animate-glow mb-8 mx-auto">
          <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center">
            <div className="text-6xl text-saffron">🕉</div>
          </div>
        </div>
        
        {/* Sacred Text */}
        <div className="mb-8">
          <h2 className="text-white font-sacred text-2xl mb-4">श्री गुरु दिग्वन्दनम्</h2>
          <p className="text-white/90 font-sacred text-lg leading-relaxed">
            "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।<br />
            गुरुरेव परं ब्रह्म तस्मै श्रीगुरवे नमः॥"
          </p>
          <p className="text-white/70 text-sm mt-4 italic">
            "The Guru is Brahma, the Guru is Vishnu, the Guru is Maheshwara.<br />
            The Guru is indeed the Supreme Brahman. Salutations to that Guru."
          </p>
        </div>
        
        {/* Alignment Status */}
        <div className="bg-divine/20 backdrop-blur rounded-xl px-6 py-3 mb-8">
          <div className="flex items-center justify-center text-white">
            <div className={`w-3 h-3 rounded-full mr-2 ${isAligned ? 'bg-divine animate-pulse' : 'bg-white/50'}`} />
            <span className="font-medium">
              {isAligned ? 'Perfectly Aligned' : 'Seeking Alignment'}
            </span>
          </div>
        </div>
        
        {/* Spiritual Message */}
        <div className="text-white/80 text-sm space-y-2">
          <p>In this sacred moment of alignment,</p>
          <p>Feel the divine presence and guidance.</p>
          <p className="font-sacred italic">ॐ शान्ति शान्ति शान्ति:</p>
        </div>
      </div>
      
      {/* Floating Spiritual Elements */}
      <div className="absolute top-20 left-8 animate-float opacity-60">
        <div className="text-2xl text-sacred">✨</div>
      </div>
      <div className="absolute bottom-32 right-12 animate-float opacity-60" style={{ animationDelay: '1s' }}>
        <div className="text-xl text-lotus">🌸</div>
      </div>
      <div className="absolute top-1/3 left-16 animate-float opacity-60" style={{ animationDelay: '2s' }}>
        <div className="text-lg text-divine">☸</div>
      </div>
      <div className="absolute bottom-1/4 left-8 animate-float opacity-60" style={{ animationDelay: '3s' }}>
        <div className="text-xl text-sacred">🕉</div>
      </div>
      <div className="absolute top-16 right-16 animate-float opacity-60" style={{ animationDelay: '0.5s' }}>
        <div className="text-lg text-lotus">🪷</div>
      </div>
    </div>
  );
}
