module.exports = {
  router: {
    linkActiveClass: "active",
    extendRoutes(routes, resolve) {
      routes.length = 0;
      routes.push(
        ...[
          {
            name: "home",
            path: "/",
            component: resolve(__dirname, "./pages/home.vue"),
          },
          {
            name: "login",
            path: "/login",
            component: resolve(__dirname, "./pages/loginOrRegister.vue"),
          },
          {
            name: "register",
            path: "/register",
            component: resolve(__dirname, "./pages/loginOrRegister.vue"),
          },
          {
            name: "profile",
            path: "/profile/:username?",
            component: resolve(__dirname, "./pages/profile/_username.vue"),
          },
          {
            name: "settings",
            path: "/settings",
            component: resolve(__dirname, "./pages/settings.vue"),
          },
          {
            name: "article",
            path: "/article/:slug",
            component: resolve(__dirname, "./pages/article/_slug.vue"),
          },
          {
            name: "createArticle",
            path: "/createArticle",
            component: resolve(__dirname, "./pages/createArticle.vue"),
          },
          {
            name: "editArticle",
            path: "/editArticle",
            component: resolve(__dirname, "./pages/editArticle.vue"),
          },
        ]
      );
    },
  },
  
  plugins: ["~/plugins/request.js", "~/plugins/dayjs.js"],
  modules: ["@nuxtjs/toast"],
  axios: {
    baseURL: "https://conduit.productionready.io",
  },
  toast: {
    duration: 1000,
  },
};
