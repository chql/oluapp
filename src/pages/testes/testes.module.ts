import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPage } from './testes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TestPage,
  ],
  imports: [
    IonicPageModule.forChild(TestPage),
    TranslateModule.forChild()
  ],
  exports: [
    TestPage,
  ]
})
export class TutorialPageModule { }
