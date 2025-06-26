/*
** EPITECH PROJECT,  const geocode = async address => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await res.json();
    if (!data.length) throw new Error(`Adresse introuvable : "${address}"`);
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  };muRoute [WSL: Ubuntu]
** File description:
** ItineraireForm
*/

import React, {useState} from 'react';
import axios from 'axios';
import './ItineraireForm.css';

export default function ItineraireForm({ onRouteCalculated }) {
  const [originAddr, setOriginAddr] = useState('Paris, France');
  const [destinationAddr, setDestinationAddr] = useState('Lyon, France');
  const [style, setStyle] = useState('fast');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [weather, setWeather] = useState(null);
  // const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1) fonction de géocodage avec Nominatim
  const geocode = async address => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await res.json();
    if (!data.length) throw new Error(`Adresse introuvable : “${address}”`);
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDistance(null);
    setDuration(null);
    setIndicators(null);
    setWeather(null);
    // setMusic(null);

    try {
      const orig = await geocode(originAddr);
      const dest = await geocode(destinationAddr);

      const res = await axios.get(`http://localhost:3001/route`, {
        params: {
          origin:      `${orig.lat},${orig.lng}`,
          destination: `${dest.lat},${dest.lng}`,
          style
        }
      });
      
      const routeData = res.data.features[0];
      const props = routeData.properties;
      const geometry = routeData.geometry;
      
      const routeLine = geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      setDistance(props.distance);
      setDuration(props.duration);
      setIndicators(props.indicators);
      setWeather(props.weather);
      // setMusic(props.music);

      if (onRouteCalculated) {
        onRouteCalculated({
          originMarker: orig,
          destinationMarker: dest,
          routeLine: routeLine,
          distance: props.distance,
          duration: props.duration
        });
      }

    } catch (err) {
      setError(err.message || "Erreur lors du calcul");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="itineraire-overlay">
      <form onSubmit={handleSubmit}>
        <label>
          Origine (adresse)
          <input
            type="text"
            value={originAddr}
            onChange={e => setOriginAddr(e.target.value)}
            placeholder="ex. 5 rue de Rivoli, Paris"
            required
          />
        </label>
        <label>
          Destination (adresse)
          <input
            type="text"
            value={destinationAddr}
            onChange={e => setDestinationAddr(e.target.value)}
            placeholder="ex. Place Bellecour, Lyon"
            required
          />
        </label>
        <label>
          Mode de calcul
          <select 
            value={style} 
            onChange={e => setStyle(e.target.value)}
          >
            <option value="fast">🚀 Rapide</option>
            <option value="eco">🌱 Économique</option>
            <option value="comfort">🌸 Confort</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Calcul en cours…' : 'Calculer'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {distance !== null && duration !== null && (
        <div className="results">
          <div className="result-item">
            <span className="result-label">Mode</span>
            <span className="result-value">
              {style === 'eco' ? '🌱 Économique' : 
               style === 'comfort' ? '🌸 Confort' : 
               '🚀 Rapide'}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Distance</span>
            <span className="result-value">{(distance/1000).toFixed(1)} km</span>
          </div>
          <div className="result-item">
            <span className="result-label">Durée</span>
            <span className="result-value">
              {indicators?.time ? 
                `${indicators.time.hours}h ${indicators.time.minutes}min` : 
                `${(duration/3600).toFixed(1)} h`}
            </span>
          </div>
          
          {indicators && (
            <>
              <div className="indicators-section">
                <h4>💰 Coûts</h4>
                <div className="result-item">
                  <span className="result-label">Carburant</span>
                  <span className="result-value">{indicators.cost.fuel}€</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Péages</span>
                  <span className="result-value">{indicators.cost.toll}€</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Usure</span>
                  <span className="result-value">{indicators.cost.wear}€</span>
                </div>
                <div className="result-item total-cost">
                  <span className="result-label">Total</span>
                  <span className="result-value">{indicators.cost.total}€</span>
                </div>
              </div>

              <div className="indicators-section">
                <h4>⛽ Consommation</h4>
                <div className="result-item">
                  <span className="result-label">Carburant total</span>
                  <span className="result-value">{indicators.consumption.liters}L</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Consommation</span>
                  <span className="result-value">{indicators.consumption.per100km}L/100km</span>
                </div>
                <div className="result-item">
                  <span className="result-label">CO₂</span>
                  <span className="result-value">{indicators.efficiency.co2kg}kg</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Autoroutes</span>
                  <span className="result-value">{indicators.efficiency.highwayPercentage}%</span>
                </div>
              </div>

              {weather && (
                <div className="indicators-section">
                  <h4>🌤️ Météo</h4>
                  <div className="result-item">
                    <span className="result-label">Conditions</span>
                    <span className="result-value">{weather.description}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Température</span>
                    <span className="result-value">{weather.temperature}°C</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Vent</span>
                    <span className="result-value">{weather.windSpeed} km/h</span>
                  </div>
                  {weather.visibility && (
                    <div className="result-item">
                      <span className="result-label">Visibilité</span>
                      <span className="result-value">{weather.visibility} km</span>
                    </div>
                  )}
                </div>
              )}

              {/* {music && (
                <div className="indicators-section">
                  <h4>🎵 Recommandations Musicales</h4>
                  <div className="result-item">
                    <span className="result-label">Style</span>
                    <span className="result-value">{music.style}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Énergie</span>
                    <span className="result-value">{music.energy}</span>
                  </div>
                  <div className="music-playlists">
                    {music.playlists.map((playlist, index) => (
                      <div key={index} className="playlist-item">
                        {playlist}
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </>
          )}
        </div>
      )}
    </div>
  );
}
