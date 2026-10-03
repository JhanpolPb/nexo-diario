import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      // Pasa los parámetros de la URL (:id, ?categoria=) como inputs de los componentes
      withComponentInputBinding(),
      // Al cambiar de página vuelve al inicio de la ventana
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    )
  ]
};
