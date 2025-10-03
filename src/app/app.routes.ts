import { Routes } from '@angular/router';

export const routes: Routes = [

    { 
        path: 'auth', 
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    { 
        path: 'home', 
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },


    { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    },
    { 
        path: '**', 
        redirectTo: 'home' 
    }
];