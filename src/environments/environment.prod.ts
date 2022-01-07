// AMBIENTE PROD
// ng serve --prod
// ng build --prod
export const environment = {
  production: true,
  // para mi fiel /////
  APP_ID: '',
  APP_SECRET: '',
  URL_MIFIEL: '',
  // para mi fiel /////
  URL_SERVICIOS: 'https://devfactorgfc.com/api/v1',
 // SECRET_KEY: '456e967b6f8d9c98e0709461398c9f2d',
  SECRET_KEY: 'a487efef14bed450a9709ca41f2619cb',
  CLIENTE: 'FACTORGFCGLOBAL',
  firebase: {
    apiKey: "AIzaSyC85g6-IphFJZC_SM6PLeI_G_8P25afZuQ",
  authDomain: "prodfactoring.firebaseapp.com",
  databaseURL: "https://prodfactoring.firebaseio.com",
  projectId: "prodfactoring",
  storageBucket: "prodfactoring.appspot.com",
  messagingSenderId: "359478518912",
  appId: "1:359478518912:web:3a63041c3879a2cd1cf265",
  measurementId: "G-Y1J05DR204"
  }
};
