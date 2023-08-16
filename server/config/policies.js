/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
  "user/login": ["can-login", "is-not-logged-in"],
  "user/forgot-password": "can-login",

  "user/logout": "is-logged-in",

  "post/create": "is-logged-in",
  "post/update": ["is-logged-in", "is-post-author"],
  "post/delete": ["is-logged-in", "is-post-author"],

  "post/like": "is-logged-in",
  "post/unlike": "is-logged-in",
  "post/comment": "is-logged-in",
  //
  // session not working with socket virtual requests
  "chat/get-conversation": ["is-logged-in", "receiver-exists"],
  // "chat/get-person-contacts": "is-logged-in",
  "chat/send": ["is-logged-in", "receiver-exists"],
  // "chat/join-room": "is-logged-in",
  "user/get-user": "is-logged-in",
};
