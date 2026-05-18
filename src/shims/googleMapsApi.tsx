import React from 'react';

type MapProps = {
  children?: React.ReactNode;
  mapContainerStyle?: React.CSSProperties;
  center?: { lat: number; lng: number };
  zoom?: number;
  onLoad?: (map: unknown) => void;
};

export const LoadScript: React.FC<{ children?: React.ReactNode; googleMapsApiKey?: string }> = ({ children }) => (
  <>{children}</>
);

export const GoogleMap: React.FC<MapProps> = ({ children, mapContainerStyle, center, zoom }) => (
  <div
    style={mapContainerStyle}
    className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/80"
  >
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
    <div className="relative z-10 flex h-full min-h-[240px] flex-col items-center justify-center text-center text-white/70">
      <div className="text-sm font-semibold">Map Preview</div>
      <div className="text-xs text-white/40">Lat {center?.lat ?? 0}, Lng {center?.lng ?? 0}, Zoom {zoom ?? 12}</div>
    </div>
    {children}
  </div>
);

export const Marker: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute left-1/2 top-1/2 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-lg shadow-red-500/40"
    aria-label="Map marker"
  />
);

export const InfoWindow: React.FC<{ children?: React.ReactNode; onCloseClick?: () => void }> = ({ children }) => (
  <div className="absolute left-1/2 top-1/2 z-30 mt-4 w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-black/80 p-3 text-xs text-white">
    {children}
  </div>
);

export const Circle: React.FC = () => null;
