import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';  // If you also want to set up routing
import { routes } from './app.routes';  // Your app's routing module
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// Define your app configuration
export const appConfig = {
  providers: [
    provideHttpClient(), // Provides HttpClient to your app
    provideRouter(routes) // You can add routing if needed
  ],
};

// Bootstrap your Angular application
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
