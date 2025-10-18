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

    
    {
        path: 'materials',
        loadChildren: () => import('./features/material/material.module').then(m => m.MaterialsModule)
    },

   
    {
        path: 'product-references',
        loadChildren: () => import('./features/product-reference/product-reference.module').then(m => m.ProductReferencesModule)
    },

    {
        path: 'production-batches',
        loadChildren: () => import('./features/production-batch/production-batch.module').then(m => m.ProductionBatchesModule)
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