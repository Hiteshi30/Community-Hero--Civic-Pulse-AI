import React, { useState, useEffect } from 'react';
import { Complaint } from '../types';
import { MapPin, Navigation, Info, Search, ShieldAlert, Plus } from 'lucide-react';

interface MapComponentProps {
  complaints: Complaint[];
  selectedCity: string;
  onSelectComplaint?: (complaint: Complaint) => void;
  onDropPin?: (lat: number, lng: number, address: string) => void;
  interactiveMode?: 'view' | 'report';
}

// City boundaries and centers for Indian cities
export const INDIAN_CITIES = [
  { name: 'Delhi', lat: 28.6304, lng: 77.2177, zoom: 12 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 12 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, zoom: 12 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, zoom: 12 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, zoom: 12 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, zoom: 12 },
];

export const MapComponent: React.FC<MapComponentProps> = ({
  complaints,
  selectedCity,
  onSelectComplaint,
  onDropPin,
  interactiveMode = 'view'
}) => {
  const currentCityObj = INDIAN_CITIES.find(c => c.name.toLowerCase() === selectedCity.toLowerCase()) || INDIAN_CITIES[0];
  const [zoomLevel, setZoomLevel] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reported pin coordination states
  const [reportedPin, setReportedPin] = useState<{lat: number, lng: number, address: string} | null>(null);

  // Filter complaints matching current city
  const filteredComplaints = complaints.filter(
    c => c.city.toLowerCase() === currentCityObj.name.toLowerCase()
  );

  // Auto-address simulator on dropping pin
  const simulateAddress = (lat: number, lng: number) => {
    const sectors = ['Sector 4', 'Connaught Circus', 'HAL Stage 2', 'T-Nagar Main Road', 'C-Scheme', 'Gomti Vihar'];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    return `${sector}, ${currentCityObj.name}, India`;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveMode !== 'report') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel position to approximate latitude/longitude offset from city center
    // Let's map coordinates based on offset from center
    const width = rect.width;
    const height = rect.height;

    const xOffset = (x / width - 0.5) * 0.1; // scale factor
    const yOffset = (0.5 - y / height) * 0.1;

    const lat = currentCityObj.lat + yOffset;
    const lng = currentCityObj.lng + xOffset;
    const address = simulateAddress(lat, lng);

    setReportedPin({ lat, lng, address });
    if (onDropPin) {
      onDropPin(lat, lng, address);
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-slate-100 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
      {/* Map Control Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2 pointer-events-none">
        <div className="flex items-center gap-2 p-2 bg-white/95 dark:bg-zinc-900/95 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-lg pointer-events-auto backdrop-blur-md grow md:grow-0">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            id="map-location-search"
            type="text"
            placeholder={`Search coordinates in ${currentCityObj.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-transparent border-none outline-none focus:ring-0 text-slate-700 dark:text-zinc-200 w-full md:w-48"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-zinc-900/95 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-lg text-xs font-semibold text-slate-600 dark:text-zinc-300 pointer-events-auto backdrop-blur-md">
          <Navigation className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
          <span>City: {currentCityObj.name}</span>
        </div>

        {interactiveMode === 'report' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl shadow-lg text-xs font-bold pointer-events-auto glow-primary shadow-indigo-100 dark:shadow-none">
            <Plus className="w-3.5 h-3.5" />
            <span>Click on map canvas to drop complaint pin</span>
          </div>
        )}
      </div>

      {/* Map Body Canvas fallback */}
      <div 
        id="map-canvas-container"
        onClick={handleCanvasClick}
        className={`relative w-full grow select-none cursor-pointer overflow-hidden ${
          interactiveMode === 'report' ? 'cursor-crosshair' : ''
        }`}
        style={{
          // Use grid/lines background representing city blocks
          background: 'radial-gradient(circle, rgba(14,116,144,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Simplified Vector City Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-25" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="0" x2="10%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-zinc-800" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-zinc-800" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-zinc-700" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-zinc-800" />
          <line x1="90%" y1="0" x2="90%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-zinc-800" />
          
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-zinc-800" />
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-zinc-800" />
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-zinc-700" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-zinc-800" />

          {/* Central Park / Waterbody representation for visual design */}
          <rect x="15%" y="25%" width="20%" height="15%" rx="12" fill="#E6F4EA" className="dark:fill-[#1b3d2b] transition-colors" />
          <text x="18%" y="33%" className="text-[10px] font-bold fill-emerald-700 dark:fill-emerald-400 font-sans">Neighbourhood Green Park</text>

          <path d="M 50,250 Q 150,220 250,260 T 550,240 T 850,270" fill="none" stroke="#EEF2FF" strokeWidth="32" className="stroke-indigo-100 dark:stroke-indigo-950/40" />
          <text x="45%" y="54%" className="text-[10px] font-bold fill-indigo-500 dark:fill-indigo-400/70 font-sans tracking-widest">CIVIC WATER CORRIDOR</text>
        </svg>

        {/* Dynamic Complaint Beacons */}
        {filteredComplaints.map((comp) => {
          // Convert latitude/longitude to coordinate percentage offsets
          // City Center acts as 50%, 50%
          const dLat = comp.latitude - currentCityObj.lat;
          const dLng = comp.longitude - currentCityObj.lng;

          // Scaling coordinates to canvas bounds
          const leftPct = 50 + dLng * 500;
          const topPct = 50 - dLat * 500;

          // Prevent markers from jumping outside container bounds
          const clampedLeft = Math.max(10, Math.min(90, leftPct));
          const clampedTop = Math.max(15, Math.min(85, topPct));

          const priorityColors = {
            LOW: 'bg-slate-500 text-slate-500',
            MEDIUM: 'bg-indigo-500 text-indigo-500',
            HIGH: 'bg-amber-500 text-amber-500',
            CRITICAL: 'bg-rose-500 text-rose-500',
          };

          const color = priorityColors[comp.priority] || 'bg-brand-primary';

          return (
            <div
              key={comp.id}
              className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 z-20"
              style={{ left: `${clampedLeft}%`, top: `${clampedTop}%` }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectComplaint) onSelectComplaint(comp);
              }}
            >
              {/* Radar pulse effect for active, non-resolved issues */}
              {comp.status !== 'RESOLVED' && (
                <span className={`absolute inline-flex h-10 w-10 rounded-full opacity-30 animate-ping -left-3 -top-3 ${color}`} />
              )}
              
              <div className={`relative flex items-center justify-center w-5.5 h-5.5 rounded-full shadow-md text-white ${
                comp.status === 'RESOLVED' ? 'bg-emerald-500' : color.split(' ')[0]
              }`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* Tooltip Hover Info Card */}
              <div className="absolute top-7 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 p-2.5 rounded-lg border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xl w-48 text-left text-xs">
                <p className="font-bold text-slate-800 dark:text-zinc-100 truncate">{comp.title}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                    {comp.department.split(' ')[0]}
                  </span>
                  <span className="font-bold text-slate-500">{comp.priority}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Dropped Pin Beacon (for reporting a new issue) */}
        {reportedPin && (
          <div
            className="absolute -translate-x-1/2 -translate-y-full z-30 animate-bounce"
            style={{
              left: `${Math.max(10, Math.min(90, 50 + (reportedPin.lng - currentCityObj.lng) * 500))}%`,
              top: `${Math.max(15, Math.min(85, 50 - (reportedPin.lat - currentCityObj.lat) * 500))}%`
            }}
          >
            <div className="flex flex-col items-center">
              <div className="px-2 py-1 bg-indigo-600 text-white font-bold rounded shadow-lg text-[10px] whitespace-nowrap mb-1 shadow-indigo-100 dark:shadow-none">
                New Issue Location
              </div>
              <MapPin className="w-8 h-8 text-indigo-600 drop-shadow-md fill-indigo-200" />
            </div>
          </div>
        )}
      </div>

      {/* Map Info Bar footer */}
      <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400" />
          <span>Interactive Municipal Vector Map: {filteredComplaints.length} issues in {currentCityObj.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
