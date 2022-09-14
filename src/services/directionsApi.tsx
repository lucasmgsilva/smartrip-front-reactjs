import axios from 'axios'

export const directionsApi = axios.create({
  baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',

  params: {
    alternatives: false,
    geometries: 'geojson',
    overview: 'simplified',
    steps: false,
    access_token: process.env.REACT_APP_MAPBOX_TOKEN,
  },
})
