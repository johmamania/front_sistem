export const environment = {
   //desarrollo
   produccion:false,
    HOST: 'http://localhost:8080/backend-sistem',
   TOKEN_NAME: 'access_token',
   RETRY: 0,
   recaptcha: {
    siteKey: '6Ldd10IqAAAAAAIUhpweJLu_KNC-oGoeqjgTopcl',
   },
   allowedDomains: ['localhost:8080'],  
   disallowedRoutes: ["http://localhost:8080/backend-sistem/login/forget"]

 };
