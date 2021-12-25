export const environment = {
  production: true,
  apiUrl: window['env']['apiUrl'] || 'http://your-api.your-domain.com',
  whitelistedDomains: [window['env']['whitelistedDomains'] || 'your-api.your-domain.com'],
  blacklistedRoutes: [window['env']['blacklistedRoutes'] || 'your-api.your-domain.com/user_token'],
  tokenCookie: 'token'
};
