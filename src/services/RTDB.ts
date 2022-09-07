import { initializeApp } from 'firebase/app'
import { getDatabase, ref } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyC01dpBT00At1GwJUwJAPzKBu-mYNX4Z4E',
  authDomain: 'carmonitor-4fc29.firebaseapp.com',
  databaseURL: 'https://carmonitor-4fc29-default-rtdb.firebaseio.com',
  projectId: 'carmonitor-4fc29',
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const carsReference = ref(database, 'cars')

export const RTDB = {
  database,
  carsReference,
}
