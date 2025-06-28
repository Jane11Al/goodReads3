import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), AuthGuard]
};
