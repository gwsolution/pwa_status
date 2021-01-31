import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'appliance',
    pathMatch: 'full'
  },
  { path: 'user/:id', loadChildren: () => import('./user-detail/user-detail.module').then(m => m.UserDetailPageModule) },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'ashish',
    loadChildren: () => import('./new-page/new-page.module').then( m => m.NewPagePageModule)
  },
  {
    path: 'appliance',
    loadChildren: () => import('./appliance/appliance.module').then( m => m.AppliancePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
