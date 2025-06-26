/*
** EPITECH PROJECT, 2025
** SimuRoute [WSL: Ubuntu]
** File description:
** FavoritesPanel
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FavoritesPanel.css';

export default function FavoritesPanel({ onSelectFavorite, onClose }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:3001/favorites');
      setFavorites(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFavorite = async (favorite) => {
    try {
      await axios.post(`http://localhost:3001/favorites/${favorite.id}/use`);
      
      if (onSelectFavorite) {
        onSelectFavorite({
          origin: favorite.origin.address,
          destination: favorite.destination.address,
          style: favorite.preferredStyle
        });
      }
      
      if (onClose) onClose();
    } catch (err) {
      console.error('Erreur lors de la sélection du favori:', err);
    }
  };

  if (loading) return <div className="favorites-panel">Chargement...</div>;

  return (
    <div className="favorites-panel">
      <div className="favorites-header">
        <h3>⭐ Trajets Favoris</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      <div className="favorites-list">
        {favorites.length === 0 ? (
          <div className="no-favorites">Aucun trajet favori</div>
        ) : (
          favorites.map(favorite => (
            <div 
              key={favorite.id} 
              className="favorite-item"
              onClick={() => handleSelectFavorite(favorite)}
            >
              <div className="favorite-name">{favorite.name}</div>
              <div className="favorite-route">
                {favorite.origin.address} → {favorite.destination.address}
              </div>
              <div className="favorite-meta">
                <span className="favorite-style">
                  {favorite.preferredStyle === 'eco' ? '🌱' : 
                   favorite.preferredStyle === 'comfort' ? '🌸' : '🚀'} {favorite.preferredStyle}
                </span>
                <span className="favorite-usage">Utilisé {favorite.usage} fois</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
