import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ToastController, ModalController, AlertController } from 'ionic-angular';
import { ControladorBase } from "../../commom/controlador";
import { TranslateService } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';

import { AlergiaProvider, Alergia, tipoAlergia, nivelAlergia } from "../../providers/alergia/alergia";
import { AlergiasEditPage } from "../alergias-edit/alergias-edit";

@Component({
  templateUrl: 'detalhe.html'
})
export class AlergiaDetalhesModal {
  alergia : Alergia = null;

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
    this.alergia = params.get('item');
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

  formatTipoAlergia(tipo : string) {
    return AlergiasEditPage.formatTipoAlergia(tipo);
  }

  formatNivelAlergia(nivel : number) {
    return AlergiasEditPage.formatNivelAlergia(nivel);
  }

  /**
   * Exibe um anexo ao clicar nele nos detalhes.
   * @param anexo
   */
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
  selector: 'page-alergias',
  templateUrl: 'alergias.html',
})
export class AlergiasPage extends ControladorBase  {
  /**
   *
   * @param navCtrl Para navegar para pagina de edicao.
   * @param platform Controle do botao voltar.
   * @param translate Obtencao de mensagens da interface.
   * @param dbAlergia Banco de dados de alergia.
   * @param toast Exibicao de mensagens.
   * @param alert Confirmacao de exclusao.
   * @param modal Exibe detalhes de uma entrada.
   */
  constructor(public navCtrl: NavController,
              public platform: Platform,
              public translate: TranslateService,
              protected dbAlergia: AlergiaProvider,
              protected toast: ToastController,
              protected alert: AlertController,
              protected modal : ModalController) {
    super(navCtrl, alert, toast, modal, platform, dbAlergia);
  }

  getDeleteConfirmMessage() {
    return 'Tem certeza que deseja excluir essa alergia?';
  }

  getPostDeleteMessage() {
    return 'Alergia foi excluída!';
  }

  getDetailModal() {
    return AlergiaDetalhesModal;
  }

  getEditPage() {
    return AlergiasEditPage;
  }

  formatTipoAlergia(tipo : string) {
    return AlergiasEditPage.formatTipoAlergia(tipo);
  }

  formatNivelAlergia(nivel : number) {
    return AlergiasEditPage.formatNivelAlergia(nivel);
  }
}
