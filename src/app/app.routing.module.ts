import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '@shared/helpers/auth.guard';
import {FullLayoutComponent} from "@app/layout/full-layout/full-layout.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      {
        path: 'my-account',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/my-account/my-account.module').then(m => m.MyAccountModule),
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'smartaps',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/smartaps/smartaps.module').then(m => m.SmartAPsModule),
      },
      {
        path: 'smartlinks',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/smartlinks/smartlinks.module').then(m => m.SmartLinksModule),
      },
      {
        path: 'airlinks',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/airlinks/airlinks.module').then(m => m.AirLinksModule),
      },
      {
        path: 'missions',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/missions/missions.module').then(m => m.MissionsModule),
      },
      {
        path: 'logs',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/logs/logs.module').then(m => m.LogsModule),
      },
      {
        path: 'organisations',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/organisations/organisations.module').then(m => m.OrganisationsModule),
      },
      {
        path: 'gcs',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/gcs/gcs.module').then(m => m.GcsModule),
      },
      {
        path: 'manufacturers',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/manufacturers/manufacturers.module').then(m => m.ManufacturersModule),
      },
      {
        path: 'features',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/features/features.module').then(m => m.FeaturesModule),
      },
      {
        path: 'integrations',
        canActivate: [AuthGuard],
        loadChildren: () => import('@modules/integrations/integrations.module').then(m => m.IntegrationsModule),
      },
    ]
  },
  {
    path: '',
    loadChildren: () => import('@modules/auth/auth.module').then(m => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
