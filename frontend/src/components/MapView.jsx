/*
** EPITECH PROJECT, 2025
** SimuRoute [WSL: Ubuntu]
** File description:
** MapView
*/

import {MapContainer, TileLayer, Polyline, Marker, ZoomControl, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {useEffect} from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FitBoundsOnRoute({ routeLine }) {
  const map = useMap();
  useEffect(() => {
    if (routeLine && routeLine.length > 0) {
      map.fitBounds(routeLine);
    }
  }, [routeLine, map]);
  return null;
}

export default function MapView({ originMarker, destinationMarker, routeLine }) {
  return (
    <MapContainer
      center={originMarker ? [originMarker.lat, originMarker.lng] : [48.85, 2.35]}
      zoom={originMarker ? 7 : 13}
      style={{ height: '100vh' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      {originMarker && <Marker position={[originMarker.lat, originMarker.lng]} />}
      {destinationMarker && <Marker position={[destinationMarker.lat, destinationMarker.lng]} />}
      {routeLine && routeLine.length > 0 && (
    <>
        <Polyline positions={routeLine} pathOptions={{ weight: 4 }}  />
        <FitBoundsOnRoute routeLine={routeLine} />
    </>
      )}
    </MapContainer>
  );
}
