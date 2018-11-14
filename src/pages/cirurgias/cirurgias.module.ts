import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CirurgiasPage } from './cirurgias';

@NgModule({
  declarations: [
    CirurgiasPage,
  ],
  imports: [
    IonicPageModule.forChild(CirurgiasPage),
  ],
  exports: [
    CirurgiasPage
  ]
})
export class CirurgiasPageModule {}
