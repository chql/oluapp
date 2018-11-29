import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, ViewController, ModalController, AlertController } from 'ionic-angular';
import { ConsultaProvider, Consulta } from "../../providers/consulta/consulta";
import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';

import { ControladorBase } from "../../commom/controlador";
import { ConsultasEditPage } from "../consultas-edit/consultas-edit";

@Component({
  templateUrl: 'detalhe.html'
})
export class ConsultaDetalhesModal
{
  consulta : Consulta = null;
  constructor(public params : NavParams,
              public viewCtrl : ViewController,
              private fOpener: FileOpener,
              private file : File,
  ) {
    this.consulta = params.get('item');
  }

  dismiss() {
    this.viewCtrl.dismiss().then(() => {});
  }

  /**
   * Formata a data da consulta para exibicao.
   * @param date
   */
  dateFormat(date : Date) {
    return date.getDate() + '/' + (date.getMonth()+1) + '/' + (date.getFullYear());
  }

  /**
   * Exibe um anexo ao clicar nele nos detalhes.
   * @param anexo
   */
  openAttachment(anexo : any){
    return this.file.resolveLocalFilesystemUrl(anexo.caminho)
      .then ((entry : FileEntry) => {
        if(entry){
          entry.file(meta => {
            this.fOpener.open(anexo.caminho, meta.type).then(()=> console.log('Abriu'))
          }, error =>{
            console.log(error);
          })
        }
      });
  }

  backToDelete() {
    this.viewCtrl.dismiss({ toDelete: true });
  }

  backToEdit() {
    this.viewCtrl.dismiss({ toEdit: true });
  }
}

@IonicPage()
@Component({
  selector: 'page-consultas',
  templateUrl: 'consultas.html',
})
export class ConsultasPage extends ControladorBase {

  constructor(public navCtrl : NavController,
              public platform : Platform,
              protected dbConsulta : ConsultaProvider,
              protected toast : ToastController,
              protected modal : ModalController,
              protected alert : AlertController) {
    super(navCtrl, alert, toast, modal, platform, dbConsulta);
  }

  /**
   * Retorna estrutura detalhada para uma data.
   * @param str
   */
  getDate(str: string) {
    let d = new Date(str);
    return d;
  }

  getDeleteConfirmMessage() {
    return 'Tem certeza que deseja excluir essa consulta?';
  }

  getPostDeleteMessage() {
    return 'A consulta foi excluída!';
  }

  getDetailModal() {
    return ConsultaDetalhesModal;
  }

  getEditPage() {
    return ConsultasEditPage;
  }
}
