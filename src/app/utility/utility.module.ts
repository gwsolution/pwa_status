import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UtilityPageRoutingModule } from './utility-routing.module';

import { UtilityPage } from './utility.page';
import { FormatFileSizeModule } from '../format-file-size/format-file-size.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilityPageRoutingModule, FormatFileSizeModule
  ],
  declarations: [UtilityPage]
})
export class UtilityPageModule {}
