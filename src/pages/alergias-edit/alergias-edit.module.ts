import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlergiasEditPage } from './alergias-edit';

@NgModule({
  declarations: [
    AlergiasEditPage,
  ],
  imports: [
    IonicPageModule.forChild(AlergiasEditPage),
  ],
})
export class AlergiasEditPageModule {}
