import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createIcon = (color: string) => new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const pickupIcon = createIcon('#22c55e');
const dropIcon = createIcon('#ef4444');
const liveIcon = createIcon('#3b82f6');

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationMapProps {
  pickupLocation: Location | null;
  dropLocation: Location | null;
  onPickupChange?: (location: Location) => void;
  onDropChange?: (location: Location) => void;
  liveLocation?: Location | null;
  selectionMode?: 'pickup' | 'drop' | 'none';
  readonly?: boolean;
  showRoute?: boolean;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{
  selectionMode: 'pickup' | 'drop' | 'none';
  onPickupChange?: (location: Location) => void;
  onDropChange?: (location: Location) => void;
}> = ({ selectionMode, onPickupChange, onDropChange }) => {
  useMapEvents({
    click: async (e) => {
      if (selectionMode === 'none') return;
      
      const location: Location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };
      
      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        );
        const data = await response.json();
        location.address = data.display_name || 'Unknown location';
      } catch {
        location.address = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
      }
      
      if (selectionMode === 'pickup' && onPickupChange) {
        onPickupChange(location);
      } else if (selectionMode === 'drop' && onDropChange) {
        onDropChange(location);
      }
    },
  });
  
  return null;
};

// Component to fit bounds when locations change
const FitBounds: React.FC<{
  pickupLocation: Location | null;
  dropLocation: Location | null;
  liveLocation?: Location | null;
}> = ({ pickupLocation, dropLocation, liveLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    const points: L.LatLng[] = [];
    
    if (pickupLocation) {
      points.push(L.latLng(pickupLocation.lat, pickupLocation.lng));
    }
    if (dropLocation) {
      points.push(L.latLng(dropLocation.lat, dropLocation.lng));
    }
    if (liveLocation) {
      points.push(L.latLng(liveLocation.lat, liveLocation.lng));
    }
    
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
  }, [pickupLocation, dropLocation, liveLocation, map]);
  
  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({
  pickupLocation,
  dropLocation,
  onPickupChange,
  onDropChange,
  liveLocation,
  selectionMode = 'none',
  readonly = false,
  showRoute = true,
}) => {
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India
  
  const routePositions: [number, number][] = [];
  if (pickupLocation && dropLocation) {
    routePositions.push([pickupLocation.lat, pickupLocation.lng]);
    if (liveLocation) {
      routePositions.push([liveLocation.lat, liveLocation.lng]);
    }
    routePositions.push([dropLocation.lat, dropLocation.lng]);
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={5}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {!readonly && (
        <MapClickHandler
          selectionMode={selectionMode}
          onPickupChange={onPickupChange}
          onDropChange={onDropChange}
        />
      )}
      
      <FitBounds
        pickupLocation={pickupLocation}
        dropLocation={dropLocation}
        liveLocation={liveLocation}
      />
      
      {pickupLocation && (
        <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
          <Popup>
            <strong>Pickup Location</strong>
            <br />
            {pickupLocation.address || 'Selected location'}
          </Popup>
        </Marker>
      )}
      
      {dropLocation && (
        <Marker position={[dropLocation.lat, dropLocation.lng]} icon={dropIcon}>
          <Popup>
            <strong>Drop Location</strong>
            <br />
            {dropLocation.address || 'Selected location'}
          </Popup>
        </Marker>
      )}
      
      {liveLocation && (
        <Marker position={[liveLocation.lat, liveLocation.lng]} icon={liveIcon}>
          <Popup>
            <strong>Live Location</strong>
            <br />
            Your shipment is here
          </Popup>
        </Marker>
      )}
      
      {showRoute && routePositions.length >= 2 && (
        <Polyline
          positions={routePositions}
          color="#22c55e"
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
      )}
    </MapContainer>
  );
};

export default LocationMap;
