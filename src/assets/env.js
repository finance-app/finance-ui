(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables.
  window["env"]["apiUrl"] = "http://localhost:3001";
  window["env"]["whitelistedDomains"] = "localhost:3001";
  window["env"]["blacklistedRoutes"] = "localhost:3001/user_token";
})(this);
