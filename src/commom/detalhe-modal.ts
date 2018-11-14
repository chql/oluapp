import { NavParams, ViewController } from 'ionic-angular';

import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';

export abstract class DetalheModal {

  item : any = null;

  /**
   *
   * @param params
   * @param viewCtrl
   * @param fOpener
   * @param file
   */
  protected constructor(public params : NavParams,
              public viewCtrl : ViewController,
              protected fOpener: FileOpener,
              protected file : File,
  ) {
    this.item = params.get('item');
  }

  /**
   * Fecha modal de detalhes.
   */
  dismiss() {
    this.viewCtrl.dismiss().then(() => {});
  }

  /**
   * Formata a data da consulta para exibicao.
   * @param rawDate
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

  /**
   * Solicita exclusao do item sendo visualizado.
   */
  backToDelete() {
    this.viewCtrl.dismiss({ toDelete: true });
  }

  /**
   * Solicita transferencia para pagina de edicao do item sendo visualizado.
   */
  backToEdit() {
    this.viewCtrl.dismiss({ toEdit: true });
  }
}
