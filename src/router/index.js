import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AppLayout from "../layouts/AppLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true, layout: AppLayout },
  },
  {
    path: "/addabusiness",
    name: "AddBusiness",
    component: () =>
      import(
        /* webpackChunkName: "addbusiness" */ "../views/business/AddBusiness.vue"
      ),
    meta: { requiresAuth: true, layout: AppLayout },
  },
  {
    path: "/business/:id/verify",
    name: "Verify",
    component: () =>
      import(/* webpackChunkName: "verify" */ "../views/business/Verify.vue"),
    meta: { requiresAuth: true, layout: AppLayout },
    props: true,
  },
  {
    path: "/businesses",
    name: "Businesses",
    component: () =>
      import(
        /* webpackChunkName: "businesses" */ "../views/business/Businesses.vue"
      ),
    meta: { requiresAuth: true, layout: AppLayout },
  },
  {
    path: "/business/:id",
    name: "Business",
    // route level code-splitting
    // this generates a separate chunk (business.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "business" */ "../views/business/Business.vue"
      ),
    meta: { requiresAuth: true, layout: AppLayout },
  },
  {
    path: "/mybusiness/:id",
    name: "MyBusiness",
    // route level code-splitting
    // this generates a separate chunk (business.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "business" */ "../views/business/MyBusiness.vue"
      ),
    meta: { requiresAuth: true, layout: AppLayout },
  },
  {
    path: "/search/:query",
    name: "Search",
    // route level code-splitting
    // this generates a separate chunk (search.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "search" */ "../views/business/Search.vue"),
    meta: { requiresAuth: true, layout: AppLayout },
    props: true,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/profile/:id",
    name: "Profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
    meta: { requiresAuth: true, layout: AppLayout },
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/Login.vue"),
    meta: { requiresGuest: true, layout: AuthLayout },
  },
  {
    path: "/logout",
    name: "Logout",
    // route level code-splitting
    // this generates a separate chunk (logout.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "logout" */ "../views/auth/Logout.vue"),
    meta: { requiresAuth: true, layout: AppLayout },
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/auth/Register.vue"),
    meta: { requiresGuest: true, layout: AuthLayout },
  },
  {
    path: "*",
    // path: "/:catchAll(.*)",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "NotFound" */ "../views/NotFound.vue"),
    meta: { requiresAuth: true, layout: AppLayout },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
