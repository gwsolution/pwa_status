import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatFileSizePipe } from 'src/providers/pipe/format-file-size.pipe';



@NgModule({
  declarations: [FormatFileSizePipe],
  imports: [
    CommonModule
  ],
  exports: [
    FormatFileSizePipe
  ]
})
export class FormatFileSizeModule { }
