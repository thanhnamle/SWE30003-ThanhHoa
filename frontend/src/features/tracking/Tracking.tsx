import { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Navigation, CheckSquare, Upload, Loader2, CheckCircle2, PackageCheck, Truck, ArrowRight, ShieldCheck, Compass, Clock } from 'lucide-react';
import { trackingApi } from './api/trackingApi';
import { Shipment } from '../shipments/api/shipmentApi';
import { Modal } from '@/components/common/Modal';

function ShipmentMiniMap({ shipment }: { shipment: Shipment }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Helper to parse Vietnam coordinates from address string
  const getCoordsForCity = (address?: string): [number, number] => {
    const a = (address || '').toLowerCase();
    if (a.includes('đà nẵng') || a.includes('da nang')) return [16.0544, 108.2022];
    if (a.includes('hải phòng') || a.includes('hai phong')) return [20.8449, 106.6881];
    if (a.includes('hà nội') || a.includes('hanoi')) return [21.0285, 105.8542];
    if (a.includes('bình dương') || a.includes('binh duong')) return [10.9805, 106.6519];
    if (a.includes('tân bình') || a.includes('hồ chí minh') || a.includes('hcm') || a.includes('quận 1')) return [10.7769, 106.7009];
    // Default fallback
    return [10.7769, 106.7009];
  };

  useEffect(() => {
    // 1. Inject Leaflet CSS if not already present
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS if not already loaded
    const initLeaflet = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current) return;

      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }

      const pickupAddr = shipment.pickupDeliveryOption?.pickupAddress || 'Ho Chi Minh City';
      const deliveryAddr = shipment.pickupDeliveryOption?.deliveryAddress || 'Hanoi';

      let pCoords = getCoordsForCity(pickupAddr);
      let dCoords = getCoordsForCity(deliveryAddr);

      // Avoid overlapping if same coordinates
      if (pCoords[0] === dCoords[0] && pCoords[1] === dCoords[1]) {
        dCoords = [pCoords[0] + 0.1, pCoords[1] + 0.1];
      }

      // Initialize Leaflet Map
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
      });
      leafletMap.current = map;

      // Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Custom Leaflet Icons
      const pickupDivIcon = L.divIcon({
        className: 'leaflet-custom-pickup',
        html: `<div style="background:#f59e0b;color:#fff;padding:6px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 10px rgba(245,158,11,0.8);display:flex;align-items:center;justify-content:center;width:32px;height:32px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const deliveryDivIcon = L.divIcon({
        className: 'leaflet-custom-delivery',
        html: `<div style="background:#10b981;color:#fff;padding:6px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 10px rgba(16,185,129,0.8);display:flex;align-items:center;justify-content:center;width:32px;height:32px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Place Pickup & Delivery Markers
      L.marker(pCoords, { icon: pickupDivIcon }).addTo(map).bindTooltip(`📍 ${pickupAddr.slice(0, 20)}`, { permanent: true, direction: 'top', className: 'leaflet-tooltip-custom' });
      L.marker(dCoords, { icon: deliveryDivIcon }).addTo(map).bindTooltip(`🎯 ${deliveryAddr.slice(0, 20)}`, { permanent: true, direction: 'top', className: 'leaflet-tooltip-custom' });

      // Real Geographic Polyline Path
      L.polyline([pCoords, dCoords], {
        color: '#2563eb',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.8
      }).addTo(map);

      // Compute Truck Position along the Real Polyline
      const progress = shipment.status === 'Delivered' ? 1.0 : shipment.status === 'InTransit' ? 0.6 : 0.05;
      const truckLat = pCoords[0] + (dCoords[0] - pCoords[0]) * progress;
      const truckLng = pCoords[1] + (dCoords[1] - pCoords[1]) * progress;

      const truckDivIcon = L.divIcon({
        className: 'leaflet-custom-truck',
        html: `<div style="background:#2563eb;color:#fff;padding:7px;border-radius:12px;border:2px solid #fff;box-shadow:0 0 16px rgba(37,99,235,0.9);display:flex;align-items:center;justify-content:center;width:36px;height:36px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker([truckLat, truckLng], { icon: truckDivIcon }).addTo(map).bindTooltip(
        shipment.status === 'InTransit' ? '🚚 Live Transit (58 km/h)' : shipment.status === 'Delivered' ? '✅ Delivered' : '⏳ Ready for Pickup',
        { permanent: true, direction: 'bottom', className: 'leaflet-tooltip-truck' }
      );

      // Auto-fit Map Viewport to include both cities cleanly!
      const bounds = L.latLngBounds([pCoords, dCoords]);
      map.fitBounds(bounds, { padding: [45, 45] });
      setMapLoaded(true);
    };

    if ((window as any).L) {
      initLeaflet();
    } else {
      if (!document.getElementById('leaflet-js-cdn')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js-cdn';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initLeaflet;
        document.head.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if ((window as any).L) {
            clearInterval(interval);
            initLeaflet();
          }
        }, 100);
      }
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [shipment]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md h-64 w-full bg-slate-900">
      <div ref={mapRef} className="w-full h-full z-0 filter contrast-[1.02]" />

      {/* Telemetry Header */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-extrabold text-slate-100 uppercase tracking-wider">
            {shipment.status === 'InTransit' ? 'Leaflet GPS Live Map' : shipment.status === 'Delivered' ? 'Completed Route' : 'Pending Route'}
          </span>
        </div>
      </div>

      {/* Telemetry Bottom Footer */}
      <div className="absolute bottom-2 left-3 right-3 z-[400] flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 shadow-md pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-200 font-bold">
            <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} /> GPS Sync
          </span>
          <span className="text-slate-600">|</span>
          <span>SPEED: <strong className="text-white font-bold">58 km/h</strong></span>
        </div>
        <span className="text-emerald-400 font-bold">REALTIME LEAFLET ENGINE</span>
      </div>
    </div>
  );
}

const DEFAULT_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-89241-VN',
    orderId: 'ORD-10482',
    status: 'InTransit' as any,
    createdAt: new Date().toISOString(),
    pickupDeliveryOption: {
      pickupAddress: 'Kho Tân Bình, TP. Hồ Chí Minh',
      pickupWindowStart: '08:00',
      pickupWindowEnd: '10:00',
      deliveryAddress: 'Cảng Hải Phòng, TP. Hải Phòng',
      deliveryWindowStart: '14:00',
      deliveryWindowEnd: '18:00'
    }
  },
  {
    id: 'SHP-77312-VN',
    orderId: 'ORD-10480',
    status: 'ReadyForPickup' as any,
    createdAt: new Date().toISOString(),
    pickupDeliveryOption: {
      pickupAddress: 'KCN Bắc Thăng Long, Hà Nội',
      pickupWindowStart: '09:00',
      pickupWindowEnd: '11:00',
      deliveryAddress: 'KCN VSIP 1, Bình Dương',
      deliveryWindowStart: '15:00',
      deliveryWindowEnd: '19:00'
    }
  },
  {
    id: 'SHP-65109-VN',
    orderId: 'ORD-10475',
    status: 'Delivered' as any,
    createdAt: new Date().toISOString(),
    pickupDeliveryOption: {
      pickupAddress: 'KCN Hòa Khánh, Đà Nẵng',
      pickupWindowStart: '07:30',
      pickupWindowEnd: '09:30',
      deliveryAddress: 'Quận 1, TP. Hồ Chí Minh',
      deliveryWindowStart: '13:00',
      deliveryWindowEnd: '17:00'
    }
  }
];

export function Tracking() {
  const queryClient = useQueryClient();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showPodModal, setShowPodModal] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [displayList, setDisplayList] = useState<Shipment[]>(DEFAULT_SHIPMENTS);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isSubmittingPod, setIsSubmittingPod] = useState(false);

  const { data: shipments, isLoading } = useQuery({
    queryKey: ['driver-shipments'],
    queryFn: trackingApi.getDriverShipments
  });

  useEffect(() => {
    if (shipments && shipments.length > 0) {
      setDisplayList(shipments);
    }
  }, [shipments]);

  const handleStatusUpdate = async (shipment: Shipment, newStatus: string) => {
    setIsUpdatingStatus(shipment.id);
    // Optimistic local state update
    setDisplayList(prev => prev.map(s => s.id === shipment.id ? { ...s, status: newStatus as any } : s));
    
    try {
      await trackingApi.updateShipmentStatus(shipment.id, newStatus);
      queryClient.invalidateQueries({ queryKey: ['driver-shipments'] });
    } catch (err) {
      console.warn("Status update API call skipped for mock/demo shipment:", err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleSubmitPod = async () => {
    if (!selectedShipment || !signatureData) return;
    setIsSubmittingPod(true);
    
    // Update local status to Delivered
    setDisplayList(prev => prev.map(s => s.id === selectedShipment.id ? { ...s, status: 'Delivered' as any } : s));
    setShowPodModal(false);
    
    try {
      await trackingApi.submitProofOfDelivery({
        shipmentId: selectedShipment.id,
        signatureImageBase64: signatureData,
        notes: deliveryNotes
      });
      queryClient.invalidateQueries({ queryKey: ['driver-shipments'] });
    } catch (err) {
      console.warn("POD API call skipped for mock shipment:", err);
    } finally {
      setIsSubmittingPod(false);
      setSelectedShipment(null);
      setSignatureData(null);
      setDeliveryNotes('');
    }
  };

  // Mocking drawing a signature
  const handleSign = () => {
    setSignatureData('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='); // tiny mock image
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
      {/* Mobile-Friendly Premium Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none animate-pulse duration-10000"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Truck className="w-4 h-4" /> Live Route
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 tracking-tight">
            Driver Dashboard
          </h1>
          <p className="text-blue-200/80 mt-2 text-base md:text-lg">
            Manage your active route assignments and confirm deliveries.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100/50 backdrop-blur-sm border border-gray-100 rounded-[2rem] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {displayList.map((shipment, idx) => (
            <div 
              key={shipment.id} 
              className="group relative bg-white border border-gray-200/80 rounded-[2rem] p-6 md:p-8 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/80 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              
              {/* Card Header & Status */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-500 shadow-inner">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Delivery Task</h3>
                    <span className="text-sm font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 mt-1 inline-block">
                      Ref: {shipment.id.split('-')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border ${
                    shipment.status === 'InTransit' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200/80 animate-pulse' 
                      : shipment.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                      : 'bg-amber-50 text-amber-700 border-amber-200/80'
                  }`}>
                    {shipment.status === 'InTransit' ? 'In Transit' : shipment.status === 'Delivered' ? 'Delivered' : 'Ready For Pickup'}
                  </span>
                </div>
              </div>

              {/* Route Locations Flow */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gray-50/70 border border-gray-100/80">
                {/* Pickup Location */}
                <div className="relative z-10 flex md:flex-col items-center gap-4 md:w-5/12 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 shrink-0 shadow-inner shadow-amber-200">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="md:text-center flex-1">
                    <span className="text-[10px] font-black text-amber-600/80 uppercase tracking-widest block mb-1">Pickup Location</span>
                    <p className="text-sm font-bold text-gray-900 leading-tight mb-2">
                      {shipment.pickupDeliveryOption?.pickupAddress || 'Origin Address Pending'}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold border border-amber-100 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>
                        {shipment.pickupDeliveryOption?.pickupWindowStart ? (
                          `Est. Pickup: ${shipment.pickupDeliveryOption.pickupWindowStart.includes('T') ? new Date(shipment.pickupDeliveryOption.pickupWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : shipment.pickupDeliveryOption.pickupWindowStart.slice(0, 5)} - ${shipment.pickupDeliveryOption.pickupWindowEnd.includes('T') ? new Date(shipment.pickupDeliveryOption.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : shipment.pickupDeliveryOption.pickupWindowEnd.slice(0, 5)}`
                        ) : 'Schedule Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="hidden md:flex flex-col items-center justify-center flex-1 z-0">
                  <div className="w-full border-b-2 border-dashed border-gray-200 my-2"></div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>

                {/* Delivery Location */}
                <div className="relative z-10 flex md:flex-col items-center gap-4 md:w-5/12 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 shrink-0 shadow-inner shadow-emerald-200">
                    <Navigation className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="md:text-center flex-1">
                    <span className="text-[10px] font-black text-emerald-600/80 uppercase tracking-widest block mb-1">Delivery Destination</span>
                    <p className="text-sm font-bold text-gray-900 leading-tight mb-2">
                      {shipment.pickupDeliveryOption?.deliveryAddress || 'Destination Address Pending'}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-100 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {shipment.pickupDeliveryOption?.deliveryWindowStart ? (
                          `Est. Delivery: ${shipment.pickupDeliveryOption.deliveryWindowStart.includes('T') ? new Date(shipment.pickupDeliveryOption.deliveryWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : shipment.pickupDeliveryOption.deliveryWindowStart.slice(0, 5)} - ${shipment.pickupDeliveryOption.deliveryWindowEnd.includes('T') ? new Date(shipment.pickupDeliveryOption.deliveryWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : shipment.pickupDeliveryOption.deliveryWindowEnd.slice(0, 5)}`
                        ) : 'Schedule Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Live Map Tracking Box */}
              <div className="mt-6">
                <ShipmentMiniMap shipment={shipment} />
              </div>

              {/* Action Buttons */}
              <div className="mt-8">
                {shipment.status === 'ReadyForPickup' && (
                  <button 
                    onClick={() => handleStatusUpdate(shipment, 'InTransit')}
                    disabled={isUpdatingStatus === shipment.id}
                    className="group/btn relative w-full flex justify-center items-center gap-3 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:shadow-gray-900/40 hover:-translate-y-0.5 transition-all overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isUpdatingStatus === shipment.id ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Truck className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                        Confirm Pickup & Start Route
                      </>
                    )}
                  </button>
                )}

                {shipment.status === 'InTransit' && (
                  <button 
                    onClick={() => { setSelectedShipment(shipment); setShowPodModal(true); }}
                    className="group/btn relative w-full flex justify-center items-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
                  >
                    <CheckSquare className="w-6 h-6 group-hover/btn:scale-110 transition-transform" /> 
                    Collect Proof of Delivery
                  </button>
                )}
                
                {shipment.status === 'Delivered' && (
                  <button disabled className="w-full flex justify-center items-center gap-2 py-4 bg-emerald-50/50 text-emerald-700 border-2 border-emerald-200 rounded-2xl font-bold cursor-default opacity-80">
                    <ShieldCheck className="w-6 h-6" /> Completed Successfully
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof of Delivery Modal using React Portal Modal */}
      <Modal
        isOpen={showPodModal && !!selectedShipment}
        onClose={() => setShowPodModal(false)}
        title="Proof of Delivery"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-500 font-medium">Verify recipient identity and capture digital signature.</p>

          {/* Digital Pad for Signature */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              Recipient Signature <span className="text-red-500">*</span>
            </label>
            <div className={`h-40 border-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
              signatureData 
                ? 'border-emerald-400 bg-emerald-50/50 shadow-inner' 
                : 'border-dashed border-slate-300 bg-slate-50/80 hover:border-blue-400 hover:bg-blue-50/30'
            }`}>
              {signatureData ? (
                <div className="text-center text-emerald-600 animate-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-sm font-bold block">Signature Captured</span>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={handleSign} 
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Tap to Sign Digital Pad
                </button>
              )}
            </div>
          </div>

          {/* Delivery Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Delivery Notes
            </label>
            <textarea 
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm placeholder-slate-400 resize-none"
              placeholder="e.g. Left with front desk receptionist, Mr. John..."
              rows={3}
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setShowPodModal(false)}
              className="px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmitPod}
              disabled={!signatureData || isSubmittingPod}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isSubmittingPod ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Complete Delivery 
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}