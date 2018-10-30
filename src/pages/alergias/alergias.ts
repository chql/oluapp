import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ToastController, ModalController, AlertController } from 'ionic-angular';
import { ControladorBase } from "../../commom/controlador";
import { TranslateService } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

import { AlergiaProvider } from "../../providers/alergia/alergia";
import { AlergiasEditPage } from "../alergias-edit/alergias-edit";

@Component({
  templateUrl: 'detalhe.html'
})
export class AlergiaDetalhesModal {
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
   * @param fOpener Exibicao de anexos.
   * @param file Metadados de anexos.
   * @param modal Exibe detalhes de uma entrada.
   */
  constructor(public navCtrl: NavController,
              public platform: Platform,
              public translate: TranslateService,
              protected dbAlergia: AlergiaProvider,
              protected toast: ToastController,
              protected alert: AlertController,
              private fOpener: FileOpener,
              private file: File,
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
}
