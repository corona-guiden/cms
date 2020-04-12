import firebase from 'firebase/app'
import 'firebase/auth'

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: "AIzaSyBCdVW9i6vEYJO874MEJJYPm-MDTHAiLIU",
  authDomain: "corona-guiden-scraper.firebaseapp.com",
  databaseURL: "https://corona-guiden-scraper.firebaseio.com",
  projectId: "corona-guiden-scraper",
  storageBucket: "corona-guiden-scraper.appspot.com",
  messagingSenderId: "449725604269",
  appId: "1:449725604269:web:131b3331048a68bf1ec124",
  measurementId: "G-M5JC3BVMP5"
}

firebase.initializeApp(config)
