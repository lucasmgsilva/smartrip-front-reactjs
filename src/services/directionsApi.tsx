import axios from 'axios'

const API_TOKEN =
  'pk.eyJ1IjoibHVjYXNtZ3NpbHZhIiwiYSI6ImNreHF0aGVidDRlaGQybm80OWg2dzVoeXQifQ.exF-UiLvicFXXWKMkn4Kfg'

export const directionsApi = axios.create({
  baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic',

  params: {
    alternatives: false,
    geometries: 'geojson',
    // annotations: 'distance;duration;speed;congestion',
    // geometries: 'full',
    overview: 'full',
    steps: false,
    access_token: API_TOKEN,
  },
})
