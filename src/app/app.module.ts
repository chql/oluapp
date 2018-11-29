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
import { ConsultaProvider } from '../providers/consulta/consulta';
import { AlergiaProvider } from '../providers/alergia/alergia';
import { CirurgiaProvider } from '../providers/cirurgia/cirurgia';
import { ExameProvider } from '../providers/exame/exame';

import { VacinasPage, VacinaDetalhesModal } from '../pages/vacinas/vacinas';
import { VacinasEditPage } from '../pages/vacinas-edit/vacinas-edit';
import { MedicamentosPage, MedicamentoDetalhesModal } from '../pages/medicamentos/medicamentos';
import { MedicamentosEditPage } from '../pages/medicamentos-edit/medicamentos-edit';
import { ConsultasPage, ConsultaDetalhesModal } from "../pages/consultas/consultas";
import { ConsultasEditPage } from "../pages/consultas-edit/consultas-edit";
import { AlergiasPage, AlergiaDetalhesModal } from "../pages/alergias/alergias";
import { AlergiasEditPage } from "../pages/alergias-edit/alergias-edit";
import { CirurgiasPage, CirurgiaDetalhesModal } from "../pages/cirurgias/cirurgias";
import { CirurgiasEditPage } from "../pages/cirurgias-edit/cirurgias-edit";
import { ExamesPage, ExameDetalhesModal } from "../pages/exames/exames";
import { ExamesEditPage } from "../pages/exames-edit/exames-edit";

import { VacinasPageModule } from "../pages/vacinas/vacinas.module";
import { MedicamentosPageModule } from "../pages/medicamentos/medicamentos.module";
import { ConsultasPageModule } from "../pages/consultas/consultas.module";
import { AlergiasPageModule } from "../pages/alergias/alergias.module";
import { CirurgiasPageModule } from "../pages/cirurgias/cirurgias.module";
import { ExamesPageModule } from "../pages/exames/exames.module";


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
    VacinasEditPage,
    VacinaDetalhesModal,
    MedicamentosEditPage,
    MedicamentoDetalhesModal,
    ConsultasEditPage,
    ConsultaDetalhesModal,
    AlergiasEditPage,
    AlergiaDetalhesModal,
    CirurgiasEditPage,
    CirurgiaDetalhesModal,
    ExamesEditPage,
    ExameDetalhesModal
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    VacinasPageModule,
    MedicamentosPageModule,
    ConsultasPageModule,
    AlergiasPageModule,
    CirurgiasPageModule,
    ExamesPageModule,
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
    VacinaDetalhesModal,
    MedicamentosPage,
    MedicamentosEditPage,
    MedicamentoDetalhesModal,
    ConsultasPage,
    ConsultasEditPage,
    ConsultaDetalhesModal,
    AlergiasPage,
    AlergiasEditPage,
    AlergiaDetalhesModal,
    CirurgiasPage,
    CirurgiasEditPage,
    CirurgiaDetalhesModal,
    ExamesPage,
    ExamesEditPage,
    ExameDetalhesModal
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
    AnexoProvider,
    ConsultaProvider,
    AlergiaProvider,
    CirurgiaProvider,
    ExameProvider
  ]
})
export class AppModule { }
