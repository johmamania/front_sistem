export const environment = {
  produccion:true,
  HOST: 'https://net.ejercito.mil.pe/backend-sistem',

  TOKEN_NAME: 'access_token',
  RETRY: 0,
  recaptcha: {
    siteKey: '6Ldd10IqAAAAAAIUhpweJLu_KNC-oGoeqjgTopcl',
  },
  allowedDomains: ['net.ejercito.mil.pe'],  // Dominio permitido en producción
  disallowedRoutes: ['https://net.ejercito.mil.pe/backend-sistem/login/forget'], 
};
