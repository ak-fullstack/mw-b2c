import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'',
        loadComponent: () => import('./web-layout/web-layout.component').then(m => m.WebLayoutComponent),
        children: [
            {
                path:'',
                loadComponent: () => import('./web-layout/home/home.component').then(m => m.HomeComponent)
            },
            {
                path:'buy',
                loadComponent: () => import('./buy/buy.component').then(m => m.BuyComponent)
            }
        ]
    }
];
