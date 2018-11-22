import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';

import {AlergiaProvider, Alergia, tipoAlergia, nivelAlergia} from "../../providers/alergia/alergia";

@IonicPage()
@Component({
  selector: 'page-alergias-edit',
  templateUrl: 'alergias-edit.html',
})
export class AlergiasEditPage {

  /**
   * Nome da alergia.
   */
  alergiaNome : string = '';

  /**
   * Tipo da alergia.
   */
  alergiaTipo : string = AlergiasEditPage.getAlergiaTipo(tipoAlergia.alimentar);

  /**
   * Nivel da alergia.
   */
  alergiaNivel : number = nivelAlergia.leve;

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
        this.alergiaNome = alergia.nome;
        this.alergiaTipo = AlergiasEditPage.getAlergiaTipo(alergia.tipo);
        this.alergiaNivel = alergia.nivel;
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

    if(this.alergiaNome.length < 1) {
      hasError = true;
      message = "Informe o nome da alergia";
    }

    if(this.alergiaSintomas.length < 1) {
      hasError = true;
      message = 'Preencha os sintomas provinientes da alergia';
    }

    if(this.alergiaObservacoes.length < 1) {
      hasError = true;
      message = 'Adicione observações para a alergia';
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

    novaAlergia.nome = this.alergiaNome;
    novaAlergia.tipo = tipoAlergia[this.alergiaTipo];
    novaAlergia.nivel = this.alergiaNivel;
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
          alert("Já existe outra alergia com mesmo nome e tipo.");
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
          alert("Já existe outra alergia com mesmo nome e tipo.");
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

  /**
   * Converte tipo da vacina para valor do campo de opcao.
   */
  static getAlergiaTipo(tipo : string) {
    for (let t in tipoAlergia)
      if(tipo == tipoAlergia[t])
        return t;
      return null;
  }

  /**
   * Formata o tipo da alergia para exibicao.
   * @param t
   */
  static formatTipoAlergia(valor : string) {
    if(valor == tipoAlergia.anafilaxia) return 'Anafilaxia';
    if(valor == tipoAlergia.complexo_imune) return 'Complexo imune';
    if(valor == tipoAlergia.bacterianas) return 'Bacteriana';
    if(valor == tipoAlergia.virus) return 'Vírus';
    if(valor == tipoAlergia.parasitaria) return 'Parasitária';
    if(valor == tipoAlergia.proteina_purificada) return 'Proteína purificada';
    if(valor == tipoAlergia.substancia_quimica) return 'Substância química';
    if(valor == tipoAlergia.alimentar) return 'Alergia alimentar';
  }

  /**
   * Formata o nivel de gravidade de alergia para exibicao.
   */
  static formatNivelAlergia(valor : number) {
    if(valor == nivelAlergia.leve) return 'Leve';
    if(valor == nivelAlergia.moderado) return 'Moderado';
    if(valor == nivelAlergia.grave) return 'Grave';
    if(valor == nivelAlergia.gravissimo) return 'Gravíssimo';
  }
}
