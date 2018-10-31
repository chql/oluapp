import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';

import { AlergiaProvider, Alergia } from "../../providers/alergia/alergia";

@IonicPage()
@Component({
  selector: 'page-alergias-edit',
  templateUrl: 'alergias-edit.html',
})
export class AlergiasEditPage {

  /**
   * Tipo da alergia.
   */
  alergiaTipo : string = '';

  /**
   * Nivel da alergia.
   */
  alergiaNivel : string = '';

  /**
   * Sintomas da alergia.
   */
  alergiaSintomas : string = '';

  /**
   * Observacoes da alergia.
   */
  alergiaObservacoes : string = '';

  /**
   * Anexos.
   */
  alergiaAnexos : Array<any> = [];

  /**
   * Id da alergia sendo modificada.
   */
  alergiaId : number = null;

  /**
   * Resultado retornado para tela de listagem.
   * Utilizado em caso da entrada ser adicionada ou alterada.
   */
  pageResult : any = { result: false, message: '' };

  /**
   *
   * @param navCtrl
   * @param navParams
   * @param dbAlergia
   * @param alert
   * @param fileChooser
   * @param path
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dbAlergia : AlergiaProvider,
              private alert : AlertController,
              private fileChooser : FileChooser,
              private path : FilePath) {

    // recupera os parametros de navegacao
    this.alergiaId = this.navParams.get('itemId');
    this.pageResult = this.navParams.get('result');

    if(this.alergiaId) {
      this.dbAlergia.get(this.alergiaId).then(alergia => {
        //this.alergiaTipo = alergia.tipo;
        //this.alergiaNivel = alergia.nivel;
        this.alergiaSintomas = alergia.sintomas;
        this.alergiaObservacoes = alergia.observacoes;
        this.alergiaAnexos = alergia.anexos;
      });
    }
  }

  /**
   * Verifica e notifica sobre campos obrigatorios.
   */
  formValidate() {
    let hasError : boolean = false;
    let message  : string = '';

    if(this.alergiaSintomas.length < 1) {
      hasError = true;
      message = 'Preencha os sintomas provinientes da alergia';
    }

    if(hasError) {
      this.alert.create({
        title: 'Erro',
        subTitle: message,
        buttons: ['OK']
      }).present();
    }

    return !hasError;
  }

  /**
   * Salva os dados da entrada que foi adicionada ou modificada.
   * Preenche o resultado da adicao/modificacao e retorna para tela anterior.
   */
  submitSave() {
    if(!this.formValidate()) {
      return;
    }

    let novaAlergia = new Alergia();

    //novaAlergia.tipo = this.alergiaTipo;
    //novaAlergia.nivel = this.alergiaNivel;
    novaAlergia.sintomas = this.alergiaSintomas;
    novaAlergia.observacoes = this.alergiaObservacoes;
    novaAlergia.anexos = this.alergiaAnexos;

    if(this.alergiaId) {
      this.dbAlergia.save(novaAlergia, this.alergiaId).then((result) => {
        if(result > 0) {
          this.pageResult.result = true;
          this.pageResult.message = 'Alergia alterada com sucesso!';
          this.navCtrl.pop();
        }
        else {
          // TODO: Fail cases
        }
      }).catch(e => console.log(e));
    }
    else {
      this.dbAlergia.insert(novaAlergia, -1).then((result) => {
        if(result > 0) {
          this.pageResult.result = true;
          this.pageResult.message = 'Alergia adicionada com sucesso!';
          this.navCtrl.pop();
        }
        else {
          // TODO: Fail cases
        }
      }).catch(e => console.log(e));
    }
  }

  /**
   * Exibe dialogo para adicao de anexo.
   * Resolve caminho do anexo selecionado para armazenamento.
   */
  addAttachment() {
    this.fileChooser.open().then(uri => {
        this.path.resolveNativePath(uri).then(p => {
          let a = {
            caminho: p,
            nome: p.split('/').pop()
          };
          this.alergiaAnexos.push(a);
        });
      }
    );
  }

  /**
   * Remove um anexo da lista de anexos.
   * @param uri
   */
  removeAttachment(uri : string) {
    let idx = this.alergiaAnexos.indexOf(uri);
    console.log('Trying to remove attachament ' + uri + ' at idx ' + idx);
    if(idx != -1) {
      this.alergiaAnexos.splice(idx, 1);
    }
  }

  /**
   * Resolve o nome de um anexo.
   * @param uri
   */
  attachmentName(uri : string) {
    return uri.split('/').pop();
  }

  /**
   * Cancela modificacoes pendentes e retorna para tela anterior.
   */
  cancelEditing() {
    this.navCtrl.pop();
  }
}
