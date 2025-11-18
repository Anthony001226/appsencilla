// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// AQUÍ ESTÁ EL CAMBIO IMPORTANTE: Importar AppComponent
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));