import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://api.cg.test',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// instance.defaults.headers.common['X-CSRF-TOKEN'] = token.content;

export default instance;
