import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ToastController, ModalController, AlertController } from 'ionic-angular';
import { ControladorBase } from "../../commom/controlador";
import { TranslateService } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';

import { ExameProvider, Exame } from "../../providers/exame/exame";
import { ExamesEditPage } from "../exames-edit/exames-edit";

@Component({
  templateUrl: 'detalhe.html'
})
export class ExameDetalhesModal {
  exame : Exame = null;

  /**
   *
   * @param params
   * @param viewCtrl
   * @param fOpener
   * @param file
   */
  constructor(public params : NavParams,
              public viewCtrl : ViewController,
              private fOpener: FileOpener,
              private file : File,
  ) {
    this.exame = params.get('item');
  }

  dismiss() {
    this.viewCtrl.dismiss().then(() => {});
  }

  backToDelete() {
    this.viewCtrl.dismiss({ toDelete: true });
  }

  backToEdit() {
    this.viewCtrl.dismiss({ toEdit: true });
  }

  dateFormat(date : Date) {
    return date.getDate() + '/' + (date.getMonth()+1) + '/' + (date.getFullYear());
  }

  openAttachment(anexo: any) {
    return this.file.resolveLocalFilesystemUrl(anexo.caminho)
      .then((entry: FileEntry) => {
        if (entry) {
          entry.file(meta => {
            this.fOpener.open(anexo.caminho, meta.type).then(() => console.log('Abriu'))
          }, error => {
            console.log(error);
          })
        }
      });
  }
}
@IonicPage()
@Component({
  selector: 'page-exames',
  templateUrl: 'exames.html',
})
export class ExamesPage extends ControladorBase {
  /**
   *
   * @param navCtrl Para navegar para pagina de edicao.
   * @param platform Controle do botao voltar.
   * @param translate Obtencao de mensagens da interface.
   * @param dbExame Banco de dados.
   * @param toast Exibicao de mensagens.
   * @param alert Confirmacao de exclusao.
   * @param modal Exibe detalhes de uma entrada.
   */
  constructor(public navCtrl: NavController,
              public platform: Platform,
              public translate: TranslateService,
              protected dbExame: ExameProvider,
              protected toast: ToastController,
              protected alert: AlertController,
              protected modal : ModalController) {
    super(navCtrl, alert, toast, modal, platform, dbExame);
  }

  getDeleteConfirmMessage() {
    return 'Tem certeza que deseja excluir esse exame?';
  }

  getPostDeleteMessage() {
    return 'Exame foi excluído!';
  }

  getDetailModal() {
    return ExameDetalhesModal;
  }

  getEditPage() {
    return ExamesEditPage;
  }
}
