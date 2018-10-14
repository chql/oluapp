import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Settings } from '../providers';
import { MyApp } from './app.component';
import { SQLite } from "@ionic-native/sqlite";
import { DatabaseProvider } from '../providers/database/database';
import { VacinaProvider } from '../providers/vacina/vacina';
import { MedicamentoProvider } from '../providers/medicamento/medicamento';
import { AnexoProvider } from '../providers/anexo/anexo';

import { VacinasPage, VacinaDetalhesModal } from '../pages/vacinas/vacinas';
import { VacinasEditPage } from '../pages/vacinas-edit/vacinas-edit';
import { MedicamentosPage, MedicamentoDetalhesModal } from '../pages/medicamentos/medicamentos';
import { MedicamentosEditPage } from '../pages/medicamentos-edit/medicamentos-edit';


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    VacinasPage,
    VacinasEditPage,
    MedicamentosPage,
    MedicamentosEditPage,
	  VacinaDetalhesModal,
    MedicamentoDetalhesModal
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    VacinasPage,
    VacinasEditPage,
    MedicamentosPage,
    MedicamentosEditPage,
	  VacinaDetalhesModal,
    MedicamentoDetalhesModal
  ],
  providers: [
    Camera,
    SplashScreen,
    StatusBar,
    FileChooser,
    FilePath,
    FileOpener,
    File,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SQLite,
    DatabaseProvider,
    VacinaProvider,
    MedicamentoProvider,
    AnexoProvider
  ]
})
export class AppModule { }
