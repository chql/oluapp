import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CirurgiasEditPage } from './cirurgias-edit';

@NgModule({
  declarations: [
    CirurgiasEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CirurgiasEditPage),
  ],
})
export class CirurgiasEditPageModule {}
