const stagingConfig = {
  apiKey: 'AIzaSyBzlTB9UjDQDpFMoDnAmo2m4Z6fqNUTvVE',
  authDomain: 'rugby-2023-e5f84.firebaseapp.com',
  projectId: 'rugby-2023-e5f84',
  storageBucket: 'rugby-2023-e5f84.appspot.com',
  messagingSenderId: '903319843295',
  appId: '1:903319843295:web:d2ecdc7fe03ec8a523546a',
  vapidKey:
    'BKUX8X37Ln6RYbXTwFpuAZBoQabfMFZNie2gF9ZVT9guHA4uqQiCbwrLwXB-XTEBhOFbzMwgAlQH1U70QHcSa0k',
}

const productionConfig = {
  apiKey: 'AIzaSyCSRoHM86m0HqvpYxXoOd7gg6raFlvK9nc',
  authDomain: 'paris-entre-potos.fun',
  databaseURL:
    'https://rugby-2023-prod-4fa68-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'rugby-2023-prod-4fa68',
  storageBucket: 'rugby-2023-prod-4fa68.appspot.com',
  messagingSenderId: '239202981493',
  appId: '1:239202981493:web:5591e1ba83e749b3854a3c',
  vapidKey:
    'BKv6VnjpAWRMJcYFWnWzRoq5R47VCIW5HSvTMJ1-Ov-O4T8NgBjrNu9iyMt1br4s6d6LX4kXb1SSQWWlGUpJRiU',
}

if (process.env.REACT_APP_DATABASE === 'PRODUCTION') {
  module.exports = productionConfig
} else {
  module.exports = stagingConfig
}
