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
        path: 'suppliers', 
        loadChildren: () => import('./features/supplier/supplier.routes').then(m => m.suppliersRoutes)
    },

    // Agregar esta ruta a tus rutas principales
    {
    path: 'materials',
    loadChildren: () => import('./features/material/material.module').then(m => m.MaterialsModule)
    },


    { 
        path: '', 
        redirectTo: 'auth', 
        pathMatch: 'full' 
    },
    { 
        path: '**', 
        redirectTo: 'auth' 
    }
];