import { Component, ViewChild } from '@angular/core';
import { IonicPage,NavController, ToastController, Platform, ModalController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';
import { VacinasEditPage } from '../vacinas-edit/vacinas-edit';
import { Vacina, VacinaProvider } from "../../providers/vacina/vacina";
import { AlertController, Searchbar } from 'ionic-angular';
import { timer } from 'rxjs/observable/timer';

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
    this.vacina = params.get('vacina');
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
export class VacinasPage {

  /**
   * Armazenas todas as vacinas visiveis.
   */
  vacinas : Array<any> = [];

  /**
   * Estrutura auxiliar para comunicacao com a pagina de edicao.
   */
  editPageResult : any = { result : false, message: '' };

  /**
   * Textos para exibicao de meses na interface.
   */
  monthsName : Array<string> = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  /**
   * Modo de busca ativdao
   */
  searchMode : boolean = false;

  /**
   * Conteudo da busca
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
              private dbVacina: VacinaProvider,
              private toast : ToastController,
              private alert : AlertController,
              private fOpener: FileOpener,
              private file : File,
              private modal : ModalController) {
	  this.getVacinas();
  }

  /**
   * Busca todas as vacinas disponiveis no banco de dados.
   * Sempre que o usuario entrar ou voltar para tela de exibicao.
   */
  getVacinas() {
    return this.dbVacina.getAll().then(vacinas => this.vacinas = vacinas);
  }

  /**
   * Expande a visualizacao detalhada de uma vacina ao clicar sobre o item.
   * @param vacina
   */
  expandView(vacina : Vacina) {
    let modal = this.modal.create(VacinaDetalhesModal, { 'vacina': vacina });
    modal.onDidDismiss(data => {
      if(data) {
        if(data.toDelete === true) {
          this.openDelete(vacina);
        }
        else if(data.toEdit === true) {
          this.openEdit(vacina.id);
        }
      }
    });
    modal.present();
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
   * Abre a pagina de edicao para adicao de uma nova vacina.
   */
  openAdd() {
	  this.navCtrl.push(VacinasEditPage, {result: this.editPageResult});
  }

  /**
   * Abre a pagina de edicao para editar uma vacina ja existente.
   * @param id
   */
  openEdit(id : number) {
    this.navCtrl.push(VacinasEditPage, {
      result: this.editPageResult,
      vacinaId: id
    });
  }

  /**
   * Confirma e exclui uma vacina selecionada pelo usuario.
   * @param vacina
   */
  openDelete(vacina : Vacina) {
    this.alert.create({
      title: 'Confirmação',
      message: 'Tem certeza que deseja excluir essa vacina?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => this.expandView(vacina)
        },
        {
          text: 'Excluir',
          handler: () => {
            this.dbVacina.delete(vacina.id).then(() => {
              let idx = -1;
              for(let i = 0; i < this.vacinas.length; i++) {
                if(this.vacinas[i].id == vacina.id) {
                  idx = i;
                  break;
                }
              }
              if(idx != -1) {
                this.vacinas.splice(idx, 1);
                this.toast.create({
                  message: 'Vacina excluída!',
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
   * Atualiza os resultados de busca de acordo com o campo de busca.
   */
  loadSearchResults() {
    console.log('search: ' + this.search);
    if(this.searchMode) {
      if(this.search.length > 0) {
        this.dbVacina.search(this.search).then(resultados => {
          this.vacinas = resultados;
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
    this.getVacinas();
    if(this.restoreBackButton) {
      this.restoreBackButton();
      this.restoreBackButton = null;
    }
  }

  /**
   * Retorna para o menu inicial.
   */
  navBack() {
    this.navCtrl.pop();
  }

  /**
   * Metodo executado sempre que a pagina aberta ou fechada.
   * Caso esteja retornando da tela de edicao exibe mensagem do resultado.
   */
  ionViewDidEnter() {
    if(this.editPageResult.result) {
      this.getVacinas().then(() => this.toast.create({
        message: this.editPageResult.message,
        duration: 3000
      }).present());
      this.editPageResult.result = false;
    }
  }
}
