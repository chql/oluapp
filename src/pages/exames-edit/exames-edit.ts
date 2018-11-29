import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { ExameProvider, Exame } from "../../providers/exame/exame";

@IonicPage()
@Component({
  selector: 'page-exames-edit',
  templateUrl: 'exames-edit.html',
})
export class ExamesEditPage {

  /**
   * Tipo ou especialidade do exame.
   */
  exameTipo : string = '';

  /**
   * Nome do exame.
   */
  exameNome : string = '';

  /**
   * Data do exame.
   */
  exameData : string = (new Date()).toISOString();

  /**
   * Data limite de marcacao de exame.
   */
  exameMaxDate : string = ((new Date()).getFullYear()+10).toString();

  /**
   * Medico responsavel pelo exame.
   */
  exameResponsavel : string = '';

  /**
   * Medico ou profissional que solicitou o exame.
   */
  exameSolicitante : string = '';

  /**
   * Local alvo da cirurgia.
   */
  exameLocal : string = '';

  /**
   * Valor cobrado pelo exame.
   */
  exameValor : number = 0;

  /**
   * Observacoes adicionais do exame.
   */
  exameObservacoes : string = '';

  /**
   * Anexos referentes ao exame.
   */
  exameAnexos : Array<any> = [];

  /**
   * Id do exame a ser modificado.
   */
  exameId : number = null;

  /**
   * Resultado retornado para tela de listagem.
   * Utilizado em caso da entrada ser adicionada ou alterada.
   */
  pageResult : any = { result: false, message: '' };

  /**
   *
   * @param navCtrl
   * @param navParams
   * @param dbExame
   * @param alert
   * @param fileChooser
   * @param path
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dbExame : ExameProvider,
              private alert : AlertController,
              private fileChooser : FileChooser,
              private path : FilePath) {
    // recupera os parametros de navegacao
    this.exameId = this.navParams.get('itemId');
    this.pageResult = this.navParams.get('result');

    if(this.exameId) {
      this.dbExame.get(this.exameId).then(exame => {
        this.exameNome = exame.nome;
        this.exameTipo = exame.tipo;
        this.exameData = exame.data.toISOString();
        this.exameResponsavel = exame.medico_realizou;
        this.exameSolicitante = exame.medico_solicitou;
        this.exameLocal = exame.local;
        this.exameValor = exame.valor;
        this.exameObservacoes = exame.observacoes;
        this.exameAnexos = exame.anexos;
      });
    }
  }

  /**
   * Verifica e notifica sobre campos obrigatorios.
   */
  formValidate() {
    let hasError : boolean = false;
    let message  : string = '';

    if(this.exameNome.length < 1) {
      hasError = true;
      message = "Informe o nome do exame";
    }

    if(this.exameTipo.length < 1) {
      hasError = true;
      message = "Especifique o tipo do exame";
    }

    if(this.exameResponsavel.length < 1) {
      hasError = true;
      message = "Identifique o profissional que solicitou o exame";
    }

    if(this.exameSolicitante.length < 1) {
      hasError = true;
      message = "Identifique o profissional responsável pelo exame";
    }

    if(this.exameLocal.length < 1) {
      hasError = true;
      message = "Indique o local referente ao exame";
    }

    if(this.exameObservacoes.length < 1){
      hasError = true;
      message = "Adicione uma observação ao exame";
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

    let novoExame = new Exame();

    novoExame.nome = this.exameNome;
    novoExame.tipo = this.exameTipo;
    novoExame.data = new Date(this.exameData);
    novoExame.medico_realizou = this.exameResponsavel;
    novoExame.medico_solicitou = this.exameSolicitante;
    novoExame.local = this.exameLocal;
    novoExame.valor = this.exameValor;
    novoExame.observacoes = this.exameObservacoes;
    novoExame.anexos = this.exameAnexos;

    if(this.exameId) {
      this.dbExame.save(novoExame, this.exameId).then((result) => {
        if(result > 0) {
          this.pageResult.result = true;
          this.pageResult.message = 'Exame alterado com sucesso!';
          this.navCtrl.pop();
        }
      }).catch(e => console.log(e));
    }
    else {
      this.dbExame.insert(novoExame, -1).then((result) => {
        if(result > 0) {
          this.pageResult.result = true;
          this.pageResult.message = 'Exame adicionado com sucesso!';
          this.navCtrl.pop();
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
          this.exameAnexos.push(a);
        });
      }
    );
  }

  /**
   * Resolve o nome de um anexo.
   * @param uri
   */
  attachmentName(uri : string) {
    return uri.split('/').pop();
  }

  /**
   * Remove um anexo da lista de anexos.
   * @param uri
   */
  removeAttachment(uri : string) {
    let idx = this.exameAnexos.indexOf(uri);
    if(idx != -1) {
      this.exameAnexos.splice(idx, 1);
    }
  }

  /**
   * Cancela modificacoes pendentes e retorna para tela anterior.
   */
  cancelEditing() {
    this.navCtrl.pop();
  }
}
