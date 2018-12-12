import axios from 'axios';
import NProgress from 'nprogress';

const globalAxios = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
});

globalAxios.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjdjZmQxODA3N2Q5NjJjMWZhZWVlMWJkYWU0NjVlZGFiM2EwMTg3MDY1NjY3YzBlNjI5M2EwZGZmNzI3NmE1NmU5ZmYwYjJkOWUzOWE5YzM2In0.eyJhdWQiOiIxNiIsImp0aSI6IjdjZmQxODA3N2Q5NjJjMWZhZWVlMWJkYWU0NjVlZGFiM2EwMTg3MDY1NjY3YzBlNjI5M2EwZGZmNzI3NmE1NmU5ZmYwYjJkOWUzOWE5YzM2IiwiaWF0IjoxNTQ0NTIzOTY5LCJuYmYiOjE1NDQ1MjM5NjksImV4cCI6MTU0NTgxOTk2OCwic3ViIjoiMSIsInNjb3BlcyI6W119.ZXR5lI306Iq90WM5GxulXKIttnykidosWjmkcb0Wy-annK75QD52tnJsaItWAM8z8dEmzIvT7Pr2dEL0U4K-koJ95qb-2ty0lN0FOsAnF5Z8wSmAWCxMWbQzRyoFjTCWG5iBo-xl4tlikjky947RuVtpVav_mHakIi_h_bVebVqRn3KIlrap6dQV8D0qxN0cZ8aSmzZNiDXFMKEiVP6xfccDZH01VubI61zg4qy9r2WympT-ql6-qR8FmgrQ2D40HIbsQRKFuPVQrnwelGyIFnBMIc4ozS6W4oM14xRipXeHPiZ99Y8m-jGgBMvERXQCHMIx-thH7_Fyi6rki7k4j3LpYTunelIgyJ3a9T6AG3Pd7D6etfSs_YCVWU0474PZ8HFNYBQfBWoFabFw_Ve1fmacmnXtiJE_pslhvAG1Pa6o4gAOI-4tB5-MTJY5bnyWNM7neDga1T9rEQZ4d4lYLKJMHDtACA9a-OktOO-GtQNJkfa0PU6ZrIHMR6jZD4WH8FpvMZxxKNwxdATP3piiXh4W-Yn_Nv5CtVaNv-Ntb4GWP37YnlaFvPF-H-TYHkJjj3cEdLCDcU2n8_CKtziyMujsRkqN-7rYfg21Xy7d4xEtE-fK9mpChFRciqzK1AkqYMGDmapQwUf0a9vt90fZUy2WUdImWN19s7ckot_BhII';

// before a request is made start the nprogress
globalAxios.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

// before a response is returned stop nprogress
globalAxios.interceptors.response.use((response) => {
  NProgress.done();
  return response;
}, (error) => {
  if (error.response.status === 401) {
    localStorage.clear();
    window.location.reload();
  }
  return Promise.reject(error);
});

export default globalAxios;
