import { Component } from '@angular/core';
import { IonicPage,NavController, ToastController, Platform, ModalController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';
import { VacinasEditPage } from '../vacinas-edit/vacinas-edit';
import { Vacina, VacinaProvider } from "../../providers/vacina/vacina";
import { AlertController } from 'ionic-angular';

import { ControladorBase } from "../../commom/controlador";

@Component({
  templateUrl: 'detalhe.html'
})
export class VacinaDetalhesModal
{
  vacina : Vacina = null;
  constructor(public params : NavParams,
              public viewCtrl : ViewController,
              private fOpener: FileOpener,
              private file : File,
              ) {
    this.vacina = params.get('item');
  }

  dismiss() {
    this.viewCtrl.dismiss().then(() => {});
  }

  /**
   * Formata data para exibicao.
   * @param rawDate
   */
  dateFormat(str : string) {
    let date = new Date(str);
    return date.getDate() + '/' + (date.getMonth()+1) + '/' + (date.getFullYear());
  }

  /**
   * Exibe um anexo ao clicar nele nos detalhes de uma vacina.
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
  selector: 'page-vacinas',
  templateUrl: 'vacinas.html',
})
/**
 * Componente de controle para visualizacao, e exclusao de vacinas.
 */
export class VacinasPage extends ControladorBase {

  /**
   *
   * @param navCtrl Para navegar para pagina de edicao.
   * @param platform Controle do botao voltar.
   * @param translate Obtencao de mensagens da interface.
   * @param dbVacina Recuperar e alterar dados de vacinas.
   * @param toast Exibicao de mensagens ao modificar uma vacina.
   * @param alert Confirmacao de exclusao.
   * @param fOpener Exibicao de anexos.
   * @param file Metadados de anexos.
   * @param modal Modal de detalhes.
   */
  constructor(public navCtrl: NavController,
              public platform : Platform,
              public translate : TranslateService,
              protected dbVacina: VacinaProvider,
              protected toast : ToastController,
              protected alert : AlertController,
              protected fOpener: FileOpener,
              protected file : File,
              protected modal : ModalController) {
    super(navCtrl, alert, toast, modal, platform, dbVacina);
  }

  getDeleteConfirmMessage() {
    return 'Tem certeza que deseja excluir essa vacina?';
  }

  getPostDeleteMessage() {
    return 'A vacina foi excluída!';
  }

  getDetailModal() {
    return VacinaDetalhesModal;
  }

  getEditPage() {
    return VacinasEditPage;
  }

  /**
   * Retorna estrutura detalhada para uma data.
   * @param str
   */
  getDate(str: string) {
    let d = new Date(str);
    return d;
  }
}
