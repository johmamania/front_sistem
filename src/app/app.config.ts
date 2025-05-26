import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule  } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { environment } from '../environments/environment.development';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { ServerErrorsInterceptor } from './interceptor/server-errors.interceptor';


export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}
export const appConfig: ApplicationConfig = {

  providers: [provideRouter(routes),

    provideAnimationsAsync(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,            

                 allowedDomains: environment.allowedDomains,
                 disallowedRoutes: environment.disallowedRoutes,
           //allowedDomains: ["localhost:8080"],
         //  disallowedRoutes: ["http://localhost:8080/backend-sistem/login/forget"]

           //para generar war
          // allowedDomains: [""],
          // disallowedRoutes: ["https://  /backend-sistem/login/forget"]

        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi()), //para peticion HTTP -Forma cuando viaje el token jwt
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true,

    },
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    }, provideAnimationsAsync(),

  ]
};
