/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "pages/homepage" },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/

  "GET /": "home/index",

  "POST /user/register": "user/register",
  "GET /user/confirm": "user/confirm",
  "POST /user/login": "user/login",
  "POST /user/forgot-password": "user/forgot-password",
  "POST /user/reset-password": "user/reset-password",
  "POST /user/logout": "user/logout",

  "GET /posts": "post/index",
  "GET /posts/:id": "post/view-single-post",
  "POST /posts": "post/create",
  "PUT /posts/:id": "post/update",
  "DELETE /posts/:id": "post/delete",

  "POST /posts/:id/like": "post/like",
  "POST /posts/:id/unlike": "post/unlike",
  "POST /posts/:id/comment": "post/comment",

  "GET /join-blog": "post/join-room",
  "GET /leave-blog": "post/leave-room",
  "GET /join-blog/:id": "post/join-single-blog-room",
  "GET /leave-blog/:id": "post/leave-single-blog-room",

  "GET /chat/conversations": "chat/get-conversation",
  "POST /chat/send": "chat/send",
  "GET /chat/contact-list": "chat/get-contact-list",
  "GET /chat/join-room": "chat/join-room",
  "GET /chat/leave-room": "chat/leave-room",
  "PUT /chat/mark-read/:id": "chat/mark-as-read",
};
