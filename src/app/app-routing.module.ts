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
  {
    path: 'utility',
    loadChildren: () => import('./utility/utility.module').then( m => m.UtilityPageModule)
  },
  {
    path: 'appliance/:id',
    loadChildren: () => import('./service-type/service-type.module').then( m => m.ServiceTypePageModule)
  },
  {
    path: 'utility/:id',
    loadChildren: () => import('./utility-service-type/utility-service-type.module').then( m => m.UtilityServiceTypePageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./ad-category/ad-category.module').then( m => m.AdCategoryPageModule)
  },{
    path: 'category/:id',
    loadChildren: () => import('./ad-category/ad-category.module').then( m => m.AdCategoryPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
