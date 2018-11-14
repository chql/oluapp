import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, ViewController, ModalController, AlertController } from 'ionic-angular';

import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

import { ControladorBase } from "../../commom/controlador";
import { DetalheModal } from "../../commom/detalhe-modal";
import { CirurgiaProvider, Cirurgia } from "../../providers/cirurgia/cirurgia";
import { CirurgiasEditPage } from "../cirurgias-edit/cirurgias-edit";

@Component({
  templateUrl: 'detalhe.html'
})
export class CirurgiaDetalhesModal extends DetalheModal
{
  cirurgia : Cirurgia;

  constructor(public params : NavParams,
              public viewCtrl : ViewController,
              protected fOpener: FileOpener,
              protected file : File,
  ) {
    super(params, viewCtrl, fOpener, file);
    this.cirurgia = this.item;
  }
}
@IonicPage()
@Component({
  selector: 'page-cirurgias',
  templateUrl: 'cirurgias.html',
})
export class CirurgiasPage extends ControladorBase {

  /**
   *
   * @param navCtrl
   * @param platform
   * @param dbCirurgia
   * @param toast
   * @param modal
   * @param alert
   */
  constructor(public navCtrl: NavController,
              public platform: Platform,
              protected dbCirurgia: CirurgiaProvider,
              protected toast: ToastController,
              protected modal: ModalController,
              protected alert: AlertController) {
    super(navCtrl, alert, toast, modal, platform, dbCirurgia);
  }

  getDeleteConfirmMessage() {
    return 'Tem certeza que deseja remover essa cirurgia?';
  }

  getPostDeleteMessage() {
    return 'A cirurgia foi removida!';
  }

  getEditPage() {
    return CirurgiasEditPage;
  }

  getDetailModal() {
    return CirurgiaDetalhesModal;
  }
}
