import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./web-layout/web-layout.component').then(m => m.WebLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./web-layout/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'buy',
                loadComponent: () => import('./web-layout/buy/buy.component').then(m => m.BuyComponent)
            },
            {
                path: 'cart',
                loadComponent: () => import('./web-layout/buy/buy.component').then(m => m.BuyComponent)
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./web-layout/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
                children: [
                    {
                        path: 'profile',
                        loadComponent: () => import('./web-layout/dashboard-layout/profile/profile.component').then(m => m.ProfileComponent)
                    },
                    {
                        path: 'orders',
                        loadComponent: () => import('./web-layout/dashboard-layout/orders/orders.component').then(m => m.OrdersComponent)
                    },
                ]
            }
        ]
    }
];
