/*
** EPITECH PROJECT, 2025
** Si    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <ItineraireForm onRouteCalculated={handleRoute} />

      <buttonbuntu]
** File description:
** App
*/

import React, {useState} from 'react';
import ItineraireForm from './components/ItineraireForm';
import MapView from './components/MapView';
import FavoritesPanel from './components/FavoritesPanel';

function App() {
  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [routeLine, setRouteLine] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const handleRoute = ({ originMarker, destinationMarker, routeLine, distance, duration }) => {
    setOriginMarker(originMarker);
    setDestinationMarker(destinationMarker);
    setRouteLine(routeLine);
    setDistance(distance);
    setDuration(duration);
  };

  const handleFavoriteSelect = ({ origin, destination, style }) => {
    console.log('Favori sélectionné:', { origin, destination, style });
  };

  return (
    <div
      style={{
        position: 'relative',   // ← obligatoire pour que l’overlay se cale dessus
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'      // ← empêche les scrollbars
      }}
    >
      {/* Formulaire en absolute, au-dessus de tout */}
      <ItineraireForm onRouteCalculated={handleRoute} />

      {/* Bouton pour afficher les favoris */}
      <button 
        onClick={() => setShowFavorites(!showFavorites)}
        style={{
          position: 'absolute',
          top: 16,
          right: showFavorites ? 356 : 16,
          zIndex: 1000,
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          fontSize: '1.5em',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s'
        }}
        title="Trajets favoris"
      >
        ⭐
      </button>

      {showFavorites && (
        <FavoritesPanel 
          onSelectFavorite={handleFavoriteSelect}
          onClose={() => setShowFavorites(false)}
        />
      )}

      <MapView
        originMarker={originMarker}
        destinationMarker={destinationMarker}
        routeLine={routeLine}
      />

      {/* Affichage distance/durée */}
      {distance != null && duration != null && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 500,
            background: 'rgba(255,255,255,0.8)',
            padding: '8px',
            borderRadius: '4px'
          }}
        >
          <strong>Distance :</strong> {(distance/1000).toFixed(1)} km<br/>
          <strong>Durée :</strong> {(duration/3600).toFixed(1)} h
        </div>
      )}
    </div>
  );
}

export default App;