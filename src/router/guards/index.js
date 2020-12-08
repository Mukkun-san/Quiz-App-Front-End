import axios from "axios";
import { API_URL } from "@/store/consts";

function adminGuard(to, from, next) {
  axios
    .get(API_URL + "/admin/verifyToken", {
      headers: { authorization: window.localStorage.getItem("adminToken") }
    })
    .then(res => {
      if (res.data.authorized) {
        if (to.path === "/admin/login") {
          next("/admin/dashboard");
        } else {
          next();
        }
      } else {
        if (to.path === "/admin/login") {
          next();
        } else {
          next("/admin/login");
        }
      }
    })
    .catch(() => {
      if (to.path === "/admin/login") {
        next();
      } else {
        next("/admin/login");
      }
    });
}

function studentGuard(to, from, next) {
  const authorization =
    window.localStorage.getItem("student") &&
    JSON.parse(window.localStorage.getItem("student")).accessToken;
  axios
    .get(API_URL + "/student/verifyToken", {
      headers: { authorization }
    })
    .then(res => {
      if (res.data.authorized) {
        if (to.path === "/") {
          next();
        } else {
          next("/");
        }
      } else {
        if (to.path === "/") {
          next("/login");
        } else {
          next();
        }
      }
    })
    .catch(() => {
      if (to.path === "/") {
        next("/login");
      } else {
        next();
      }
    });
}

export { adminGuard, studentGuard };
