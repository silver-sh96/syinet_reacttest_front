/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import UserList from "views/UserList";
import UserReg from "views/UserReg";
import UserModify from "views/UserModify";

var routes = [
  {
    path: "/userList",
    name: "사용자 목록",
    icon: "nc-icon nc-tile-56",
    component: UserList,
    layout: "/admin"
  },
  
  {
    path: "/userReg",
    name: "사용자 등록",
    icon: "nc-icon nc-single-02",
    component: UserReg,
    layout: "/admin"
  },

  {
    path: "/userModify",
    name: "사용자 수정",
    icon: "nc-icon nc-settings-gear-65",
    component: UserModify,
    layout: "/admin"
  }
];
export default routes;
