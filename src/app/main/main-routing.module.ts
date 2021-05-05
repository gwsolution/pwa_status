import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: 'main',
    component: MainPage,
    children: [
      {
        path: 'explore',
        children: [
          {
            path: '',
            loadChildren: () => import('./explore/explore.module').then( m => m.ExplorePageModule)
          }
        ]  
      },
      {
        path: 'post',
        children: [
          {
            path: '',
            loadChildren: () => import('./post/post.module').then( m => m.PostPageModule)
          }
        ] 
        
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
          }
        ] 
        
      },
      {
        path: '',
        redirectTo: 'main/explore',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'main/explore',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
