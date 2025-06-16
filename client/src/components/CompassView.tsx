import { useEffect, useRef } from "react";

interface CompassViewProps {
  heading: number;
  bearing: number;
  isAligned: boolean;
  hasPermission: boolean;
}

export function CompassView({ heading, bearing, isAligned, hasPermission }: CompassViewProps) {
  const compassRef = useRef<HTMLDivElement>(null);
  const guruIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (compassRef.current) {
      compassRef.current.style.transform = `rotate(${-heading}deg)`;
    }
  }, [heading]);

  useEffect(() => {
    if (guruIndicatorRef.current) {
      guruIndicatorRef.current.style.transform = `rotate(${bearing}deg)`;
    }
  }, [bearing]);

  return (
    <div className="relative h-96 bg-gradient-to-br from-spiritual/10 to-meditation/20 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(107, 70, 193, 0.3) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        />
      </div>
      
      {/* Compass Container */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-72 h-72 rounded-full border-4 border-sacred/30 relative animate-compass-spin" style={{ animationDuration: '30s' }}>
          
          {/* Compass Rose Background */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white to-soft-gray shadow-xl">
            
            {/* Direction Markers */}
            <div ref={compassRef} className="absolute inset-0 rounded-full transition-transform duration-300">
              {/* North */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-spiritual font-bold text-sm">N</div>
              {/* East */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-spiritual font-bold text-sm">E</div>
              {/* South */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-spiritual font-bold text-sm">S</div>
              {/* West */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-spiritual font-bold text-sm">W</div>
              
              {/* Degree Markings */}
              {Array.from({ length: 36 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-4 bg-spiritual/30 top-1 left-1/2 transform -translate-x-1/2 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${i * 10}deg) translateY(124px)` }}
                />
              ))}
            </div>
            
            {/* Guru Direction Indicator */}
            <div ref={guruIndicatorRef} className="absolute inset-0 rounded-full transition-transform duration-500">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className={`w-6 h-16 bg-gradient-to-b from-saffron to-sacred rounded-full ${isAligned ? 'animate-glow' : ''}`} />
                <div className="mt-1 text-center">
                  <div className="text-saffron text-lg animate-pulse-sacred">🕉</div>
                </div>
              </div>
            </div>
            
            {/* Center Circle */}
            <div className="absolute inset-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full bg-gradient-to-br from-saffron to-sacred shadow-lg flex items-center justify-center">
              <div className="text-white text-xl">📍</div>
            </div>
            
            {/* Alignment Ring */}
            <div className={`absolute inset-6 rounded-full border-2 transition-all duration-300 ${
              isAligned 
                ? 'border-divine animate-pulse' 
                : 'border-divine/20'
            }`} />
          </div>
        </div>
        
        {/* Calibration Hint */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-spiritual/70 text-sm">
            {!hasPermission ? "Grant permissions to use compass" : "Move device in figure-8 to calibrate"}
          </p>
        </div>
        
        {/* Heading Display */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-white/90 backdrop-blur rounded-lg px-4 py-2 shadow-lg">
            <div className="text-spiritual font-semibold text-lg">{Math.round(heading)}°</div>
            <div className="text-xs text-spiritual/70">Current Heading</div>
          </div>
        </div>
      </div>
    </div>
  );
}
