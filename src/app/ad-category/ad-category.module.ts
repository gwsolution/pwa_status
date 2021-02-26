import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdCategoryPageRoutingModule } from './ad-category-routing.module';

import { AdCategoryPage } from './ad-category.page';
import { FormatFileSizeModule } from '../format-file-size/format-file-size.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdCategoryPageRoutingModule, FormatFileSizeModule
  ],
  declarations: [AdCategoryPage]
})
export class AdCategoryPageModule {}
