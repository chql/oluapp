import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExamesPage } from './exames';

@NgModule({
  declarations: [
    ExamesPage,
  ],
  imports: [
    IonicPageModule.forChild(ExamesPage),
  ],
  exports: [
    ExamesPage,
  ]
})
export class ExamesPageModule {}
