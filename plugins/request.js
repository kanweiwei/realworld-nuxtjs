import axios from "axios";

export const request = axios.create({
  baseURL: "https://conduit.productionready.io",
});

export default (context) => {
  request.interceptors.request.use(function(config) {
    const user = context.store.state.user;
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`;
    }
    return config;
  });
};
