import axios from "axios";

function getToken() {
    return import.meta.env.VITE_API_TOKEN
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  timeout: 600000,
});

api.interceptors.request.use((request) => {
  const token = getToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// api.interceptors.response.use((request) => {
//   return request;
// }, function (error) {
//   //window.location.href = '/login'
// });


export { api };
