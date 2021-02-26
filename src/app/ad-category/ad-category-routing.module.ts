import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdCategoryPage } from './ad-category.page';

const routes: Routes = [
  {
    path: '',
    component: AdCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdCategoryPageRoutingModule {}
