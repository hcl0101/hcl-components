import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

export default new Router({
  // mode: "history",  
  mode: "hash",    //github上的demo 不能history模式，因为无后端配合
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        {
          path: "/button",
          name: "button",
          component: () => import("./views/button/Button.vue")
        }, {
          path: "/contextMenu",
          name: "contextMenu",
          component: () => import("./views/contextMenu/contextMenu.vue")
        }, {
          path: "/countUp",
          name: "countUp",
          component: () => import("./views/countUp/CountUp.vue")
        }, {
          path: "/directory",
          name: "directory",
          component: () => import("./views/directory/Directory.vue")
        }, {
          path: "/loading",
          name: "loading",
          component: () => import("./views/loading/Loading.vue")
        }, {
          path: "/dynamicForm",
          name: "dynamicForm",
          component: () => import("./views/dynamicForm/Index.vue")
        },
      ]
    }
  ]
});
