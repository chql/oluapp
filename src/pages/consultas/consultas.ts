import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Searchbar, ToastController, ViewController, ModalController, AlertController } from 'ionic-angular';
import { ConsultaProvider, Consulta } from "../../providers/consulta/consulta";
import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';
import { timer } from 'rxjs/observable/timer';

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
    this.consulta = params.get('consulta');
  }

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
export class ConsultasPage {

  /**
   * Todas consultas disponiveis.
   */
  consultas : Array<any> = [];

  /**
   * Modo de busca ativado.
   */
  searchMode : boolean = false;

  /**
   * Conteudo da busca.
   */
  search : string = '';

  /**
   * Referencia para restaurar o comportamento do botao voltar.
   */
  restoreBackButton : Function = null;

  /**
   * Componentes de interface
   */
  @ViewChild('qinput') searchInput : Searchbar;

  /**
   * Resultado da pagina de edicao/adicao de consultas.
   */
  editPageResult : any = { result : false, message: '' };

  /**
   * Textos para exibicao de meses na interface.
   */
  monthsName : Array<string> = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  constructor(public navCtrl : NavController,
              public navParams : NavParams,
              public platform : Platform,
              private dbConsulta : ConsultaProvider,
              private toast : ToastController,
              private modal : ModalController,
              private alert : AlertController) {
    this.getConsultas();
  }

  /**
   * Carrega todas as consultas disponiveis.
   */
  getConsultas() {
    return this.dbConsulta.getAll().then(consultas => this.consultas = consultas);
  }

  /**
   * Atualiza os resultados de busca de acordo com o campo de busca.
   */
  loadSearchResults() {
    console.log('search: ' + this.search);
    if(this.searchMode) {
      if(this.search.length > 0) {
        this.dbConsulta.search(this.search).then(resultados => {
          this.consultas = resultados;
        });
      }
    }
  }

  /**
   * Entra em modo de busca.
   * Elementos da barra de navegacao e botao de adicionar sao ocultados.
   */
  enterSearchMode() {
    this.searchMode = true;
    timer(500).subscribe(() => {
      this.searchInput.setFocus();
      this.loadSearchResults();
      this.restoreBackButton =
        this.platform.registerBackButtonAction(() => this.leaveSearchMode(), 666);
    });
  }

  /**
   * Sai do modo de busca.
   * Barra de navegacao e botoes voltam ao estado normal.
   * Buscas pendentes sao canceladas.
   */
  leaveSearchMode() {
    this.searchMode = false;
    this.search = '';
    this.getConsultas();
    if(this.restoreBackButton) {
      this.restoreBackButton();
      this.restoreBackButton = null;
    }
  }

  /**
   * Retorna estrutura detalhada para uma data.
   * @param str
   */
  getDate(str: string) {
    let d = new Date(str);
    return d;
  }

  /**
   * Retorna para o menu inicial.
   */
  navBack() {
    this.navCtrl.pop();
  }

  /**
   * Expande a visualizacao detalhada do item.
   * @param consulta
   */
  expandView(consulta : Consulta) {
    let modal = this.modal.create(ConsultaDetalhesModal, { consulta: consulta });
    modal.onDidDismiss(data => {
        if(data) {
            if(data.toDelete === true) {
                this.openDelete(consulta);
            }
            else if(data.toEdit === true) {
                this.openEdit(consulta.id);
            }
        }
    });
    modal.present();
  }

  /**
   * Abre a pagina de edicao para adicao de uma nova consulta.
   */
  openAdd() {
    this.navCtrl.push(ConsultasEditPage, {result: this.editPageResult});
  }

  /**
   * Abre a pagina de edicao para editar uma consulta ja existente.
   * @param id
   */
  openEdit(id : number) {
    this.navCtrl.push(ConsultasEditPage, {
      result: this.editPageResult,
      consultaId: id
    });
  }

  /**
   * Confirma e exclui uma consulta selecionada pelo usuario.
   * @param consulta
   */
  openDelete(consulta : Consulta) {
    this.alert.create({
      title: 'Confirmação',
      message: 'Tem certeza que deseja excluir essa consulta?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => this.expandView(consulta)
        },
        {
          text: 'Excluir',
          handler: () => {
            this.dbConsulta.delete(consulta.id).then(() => {
              let idx = -1;
              for(let i = 0; i < this.consultas.length; i++) {
                if(this.consultas[i].id == consulta.id) {
                  idx = i;
                  break;
                }
              }
              if(idx != -1) {
                this.consultas.splice(idx, 1);
                this.toast.create({
                  message: 'Consulta excluída!',
                  duration: 3000
                }).present();
              }
            });
          }
        }
      ]
    }).present();
  }

  /**
   * Restaura o estado da pagina se necessario ao voltar da tela de edicao.
   */
  ionViewDidEnter() {
    if(this.editPageResult.result) {
      this.getConsultas().then(() => this.toast.create({
        message: this.editPageResult.message,
        duration: 3000
      }).present());
      this.editPageResult.result = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsultasPage');
  }

}
