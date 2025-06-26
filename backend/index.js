/*
** EPITECH PROJECT, 2025
** SimuRoute [WSL: Ubuntu]
** File description:
** index
*/

const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT || 3001;

const FUEL_PRICE_PER_LITER = 1.85;
const TOLL_COST_PER_KM = 0.08;
const WEAR_COST_PER_KM = 0.15;

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo';
const FUEL_CONSUMPTION = {
  fast: {
    highway: 7.5,
    secondary: 6.8
  },
  eco: {
    highway: 6.5,
    secondary: 5.8
  },
  comfort: {
    highway: 7.0,
    secondary: 6.2
  }
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API SimuRoute !");
});

async function getGraphHopperRoute(oLng, oLat, dLng, dLat) {
  const osrmURL = `http://router.project-osrm.org/route/v1/driving/` +
                  `${oLng},${oLat};${dLng},${dLat}` +
                  `?overview=full&geometries=geojson&alternatives=true`;
  const osrmRes = await axios.get(osrmURL);
  const routes = osrmRes.data.routes;
  
  const ecoRoute = routes.reduce((best, route) => 
    route.distance < best.distance ? route : best
  );
  
  return {
    geometry: ecoRoute.geometry,
    distance: ecoRoute.distance,
    duration: ecoRoute.duration
  };
}

async function getComfortRoute(oLng, oLat, dLng, dLat) {
  const osrmUrl = `http://router.project-osrm.org/route/v1/driving/` +
                  `${oLng},${oLat};${dLng},${dLat}` +
                  `?overview=full&geometries=geojson&alternatives=true&exclude=motorway`;
  
  try {
    const osrmRes = await axios.get(osrmUrl);
    const routes = osrmRes.data.routes;
    
    if (routes && routes.length > 0) {
      const comfortRoute = routes.find(route => {
        const ratio = route.duration / route.distance;
        return ratio > 0.02 && ratio < 0.05;
      }) || routes[0];
      
      return {
        geometry: comfortRoute.geometry,
        distance: comfortRoute.distance,
        duration: comfortRoute.duration
      };
    }
  } catch (error) {
    const fallbackUrl = `http://router.project-osrm.org/route/v1/driving/` +
                        `${oLng},${oLat};${dLng},${dLat}` +
                        `?overview=full&geometries=geojson`;
    const osrmRes = await axios.get(fallbackUrl);
    return {
      geometry: osrmRes.data.routes[0].geometry,
      distance: osrmRes.data.routes[0].distance,
      duration: osrmRes.data.routes[0].duration
    };
  }
}

const simulationRoutes = require('./routes/simulation');
app.use('/api/simulation', simulationRoutes);

app.get('/route', async (req, res) => {
  try {
    const { origin, destination, style = 'fast' } = req.query;
    if (!origin || !destination) {
      return res.status(400).send({ error: 'origin et destination requis' });
    }
    const [oLat, oLng] = origin.split(',').map(Number);
    const [dLat, dLng] = destination.split(',').map(Number);

    let geometry, distance, duration;
    if (style === 'eco') {
      const gh = await getGraphHopperRoute(oLng, oLat, dLng, dLat);
      geometry = gh.geometry;
      distance = gh.distance;
      duration = gh.duration;
    } else if (style === 'comfort') {
      const cr = await getComfortRoute(oLng, oLat, dLng, dLat);
      geometry = cr.geometry;
      distance = cr.distance;
      duration = cr.duration;
    } else {
      const osrmURL = `http://router.project-osrm.org/route/v1/driving/` +
                  `${oLng},${oLat};${dLng},${dLat}` +
                  `?overview=full&geometries=geojson`;
      const osrmRes = await axios.get(osrmURL);
      const route = osrmRes.data.routes[0];
      geometry = route.geometry;
      distance = route.distance;
      duration = route.duration;
    }
    
    const weatherData = await getWeatherData(oLat, oLng);
    
    const indicators = calculateIndicators(distance, duration, style, weatherData);
    
    // const musicRecommendations = generateMusicRecommendations(distance, duration, style, weatherData);
    
    res.send({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry,
        properties: { 
          distance, 
          duration, 
          style,
          indicators,
          weather: weatherData,
          // music: musicRecommendations
        }
      }]
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Échec du calcul de l'itinéraire"});
  }
});

function calculateIndicators(distance, duration, style, weather = null) {
  const distanceKm = distance / 1000;
  const durationHours = duration / 3600;
  
  let highwayPercentage;
  switch(style) {
    case 'fast':
      highwayPercentage = 0.7;
      break;
    case 'eco':
      highwayPercentage = 0.5;
      break;
    case 'comfort':
      highwayPercentage = 0.2;
      break;
    default:
      highwayPercentage = 0.6;
  }
  
  const secondaryPercentage = 1 - highwayPercentage;
  
  const consumption = FUEL_CONSUMPTION[style] || FUEL_CONSUMPTION.fast;
  let avgConsumption = (
    consumption.highway * highwayPercentage + 
    consumption.secondary * secondaryPercentage
  );
  
  if (weather) {
    avgConsumption = adjustConsumptionForWeather(avgConsumption, weather, style);
  }
  
  const totalFuelLiters = (distanceKm * avgConsumption) / 100;
  
  const fuelCost = totalFuelLiters * FUEL_PRICE_PER_LITER;
  const tollCost = distanceKm * highwayPercentage * TOLL_COST_PER_KM;
  const wearCost = distanceKm * WEAR_COST_PER_KM;
  const totalCost = fuelCost + tollCost + wearCost;
  
  return {
    time: {
      hours: Math.floor(durationHours),
      minutes: Math.round((durationHours % 1) * 60),
      totalMinutes: Math.round(duration / 60)
    },
    cost: {
      fuel: Math.round(fuelCost * 100) / 100,
      toll: Math.round(tollCost * 100) / 100,
      wear: Math.round(wearCost * 100) / 100,
      total: Math.round(totalCost * 100) / 100
    },
    consumption: {
      liters: Math.round(totalFuelLiters * 100) / 100,
      per100km: Math.round(avgConsumption * 10) / 10
    },
    efficiency: {
      co2kg: Math.round(totalFuelLiters * 2.31 * 100) / 100,
      highwayPercentage: Math.round(highwayPercentage * 100)
    }
  };
}

async function getWeatherData(lat, lng) {
  try {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'demo') {
      console.log('⚠️  Clé API météo manquante - utilisation de données fictives');
      return {
        temperature: 20,
        description: "Conditions normales (API manquante)",
        icon: "01d",
        humidity: 60,
        windSpeed: 10,
        visibility: 10,
        conditions: "clear"
      };
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`;
    console.log('🌤️  Appel API météo pour:', lat, lng);
    const response = await axios.get(url);
    const weather = response.data;
    
    return {
      temperature: Math.round(weather.main.temp),
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      humidity: weather.main.humidity,
      windSpeed: Math.round(weather.wind?.speed * 3.6),
      visibility: weather.visibility ? Math.round(weather.visibility / 1000) : null,
      conditions: weather.weather[0].main.toLowerCase()
    };
  } catch (error) {
    console.log('❌ Erreur API météo:', error.response?.status, error.response?.data?.message || error.message);
    return {
      temperature: 20,
      description: "Conditions normales (erreur API)",
      icon: "01d",
      humidity: 60,
      windSpeed: 10,
      visibility: 10,
      conditions: "clear"
    };
  }
}

function adjustConsumptionForWeather(baseConsumption, weather, style) {
  let multiplier = 1.0;
  
  if (weather.temperature < 0) {
    multiplier += 0.15;
  } else if (weather.temperature > 30) {
    multiplier += 0.08;
  }
  
  switch(weather.conditions) {
    case 'rain':
    case 'drizzle':
      multiplier += 0.05;
      break;
    case 'snow':
      multiplier += 0.12;
      break;
    case 'fog':
    case 'mist':
      multiplier += 0.03;
      break;
  }
  
  if (weather.windSpeed > 30) {
    multiplier += 0.06;
  }
  
  return baseConsumption * multiplier;
}

/*
function generateMusicRecommendations(distance, duration, style, weather) {
  const durationMinutes = Math.round(duration / 60);
  const distanceKm = distance / 1000;
  
  let musicStyle = "Pop/Rock";
  let energy = "Modérée";
  let recommendations = [];
  
  if (durationMinutes > 120) {
    recommendations.push("• Long Journey - Mix varié pour longs trajets");
  }
  
  return {
    style: musicStyle,
    energy: energy,
    duration: `${Math.ceil(durationMinutes / 30) * 30} min`,
    playlists: recommendations
  };
}
*/

let favoriteRoutes = [
  {
    id: 1,
    name: "Domicile → Travail",
    origin: { lat: 48.8566, lng: 2.3522, address: "Paris, France" },
    destination: { lat: 48.8738, lng: 2.2950, address: "La Défense, France" },
    preferredStyle: "fast",
    usage: 25,
    lastUsed: "2025-06-20"
  },
  {
    id: 2,
    name: "Week-end à Lyon",
    origin: { lat: 48.8566, lng: 2.3522, address: "Paris, France" },
    destination: { lat: 45.7640, lng: 4.8357, address: "Lyon, France" },
    preferredStyle: "comfort",
    usage: 5,
    lastUsed: "2025-06-15"
  },
  {
    id: 3,
    name: "Courses au centre commercial",
    origin: { lat: 48.8566, lng: 2.3522, address: "Paris, France" },
    destination: { lat: 48.8499, lng: 2.2877, address: "Boulogne-Billancourt, France" },
    preferredStyle: "eco",
    usage: 12,
    lastUsed: "2025-06-18"
  }
];

app.get('/favorites', (req, res) => {
  const sortedFavorites = favoriteRoutes
    .sort((a, b) => b.usage - a.usage || new Date(b.lastUsed) - new Date(a.lastUsed))
    .slice(0, 10);
  
  res.json(sortedFavorites);
});

app.post('/favorites', (req, res) => {
  const { name, origin, destination, preferredStyle } = req.body;
  
  if (!name || !origin || !destination) {
    return res.status(400).json({ error: 'Nom, origine et destination requis' });
  }
  
  const newFavorite = {
    id: favoriteRoutes.length + 1,
    name,
    origin,
    destination,
    preferredStyle: preferredStyle || 'fast',
    usage: 1,
    lastUsed: new Date().toISOString().split('T')[0]
  };
  
  favoriteRoutes.push(newFavorite);
  res.json(newFavorite);
});

app.post('/favorites/:id/use', (req, res) => {
  const routeId = parseInt(req.params.id);
  const favorite = favoriteRoutes.find(r => r.id === routeId);
  
  if (!favorite) {
    return res.status(404).json({ error: 'Trajet favori non trouvé' });
  }
  
  favorite.usage++;
  favorite.lastUsed = new Date().toISOString().split('T')[0];
  
  res.json(favorite);
});

app.listen(PORT, () => {
  console.log(`Serveur backend SimuRoute lancé sur http://localhost:${PORT}`);
});
