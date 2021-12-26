(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["apiUrl"] = "${API_URL}";
  window["env"]["whitelistedDomains"] = "${WHITELISTED_DOMAINS}";
  window["env"]["blacklistedRoutes"] = "${BLACKLISTED_ROUTES}";
})(this);
