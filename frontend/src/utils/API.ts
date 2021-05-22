import axios from 'axios';

// Server API is https://qodex-api.herokuapp.com
const url = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const API = axios.create({
  baseURL: url,
  responseType: 'json',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Headers': 'Set-Cookie',
    'Origin': url,
  }
});

export async function authenticated():
  Promise<{ isAuthenticated: boolean; user: string; isAdmin: boolean }> {
  let isAuthenticated = false;
  let isAdmin = false;
  let user = '';
  await API.get('/login/authenticated')
    .then((res) => {
      isAuthenticated = true;
      user = res.data.id;
      isAdmin = res.data.is_admin;
    })
    .catch(() => { isAuthenticated = false; });

  return { isAuthenticated, user, isAdmin };
}
