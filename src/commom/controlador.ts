import { AlertController, NavController, Platform, Searchbar, ToastController, ModalController} from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { timer } from 'rxjs/observable/timer';

export abstract class ControladorBase {
  /**
   * Items visiveis na tela.
   */
  entries : Array<any> = [];

  /**
   * Modo de busca ativdao
   */
  searchMode: boolean = false;

  /**
   * Conteudo da busca
   */
  search: string = '';

  /**
   * Referencia para restaurar o comportamento do botao voltar.
   */
  restoreBackButton: Function = null;

  /**
   * Componentes de interface
   */
  @ViewChild('qinput') searchInput: Searchbar;

  /**
   * Textos para exibicao de meses na interface.
   */
  monthsName: Array<string> = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  /**
   * Estrutura auxiliar para comunicacao com a pagina de edicao.
   */
  editPageResult: any = {result: false, message: ''};

  protected constructor(protected navCtrl: NavController,
                        protected alert : AlertController,
                        protected toast : ToastController,
                        protected modal : ModalController,
                        protected platform : Platform,
                        protected db : any) {
    this.loadAllEntries();
  }

  /**
   * Carrega todas as entradas do banco de dados.
   */
  loadAllEntries() {
    return this.db.getAll().then(items => {
      this.entries = items;
    });
  }

  /**
   * Expande a visualizacao detalhada de um item.
   * @param medicamento
   */
  expandView(item) {
    let modal = this.modal.create(this.getDetailModal(), { item : item });
    modal.onDidDismiss(data => {
      if(data) {
        if(data.toEdit === true) {
          this.openEdit(item.id);
        }
        else if(data.toDelete === true) {
          this.openDelete(item);
        }
      }
    });
    modal.present();
  }

  /**
   * Exibe pagina para edicao.
   * @param id
   */
  openEdit(id: number) {
    this.navCtrl.push(this.getEditPage(), {
      result: this.editPageResult,
      itemId: id
    });
  }

  /**
   * Exclui um item apos confirmacao do usuario.
   * @param medicamento
   */
  openDelete(item) {
    this.alert.create({
      title: 'Confirmação',
      message: this.getDeleteConfirmMessage(),
      buttons: [
        {
          text: 'Cancelar',
          handler: () => this.expandView(item)
        },
        {
          text: 'Excluir',
          handler: () => {
            this.db.delete(item.id).then(() => {
              let idx = -1;
              for(let i = 0; i < this.entries.length; i++) {
                if(this.entries[i].id == item.id) {
                  idx = i;
                  break;
                }
              }
              if(idx != -1) {
                this.entries.splice(idx, 1);
                this.toast.create({
                  message: this.getPostDeleteMessage(),
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
   * Metodo executado sempre que a pagina aberta ou fechada.
   * Caso esteja retornando da tela de edicao exibe mensagem do resultado.
   */
  ionViewDidEnter() {
    if(this.editPageResult.result) {
      this.loadAllEntries().then(() => this.toast.create({
        message: this.editPageResult.message,
        duration: 3000
      }).present());
      this.editPageResult.result = false;
    }
  }

  /**
   * Abre a pagina de edicao para cadastrar uma nova entrada.
   */
  openAdd() {
    this.navCtrl.push(this.getEditPage(), {result: this.editPageResult});
  }

  /**
   * Retorna a classe do controlador usado para edicao de uma entrada.
   */
  protected abstract getEditPage();

  /**
   * Retorna a classe usada para o modal de detalhes de um item.
   */
  protected abstract getDetailModal();

  /**
   * Mensagem para confirmar exclusao de item.
   */
  protected abstract getDeleteConfirmMessage();

  /**
   * Mensagem de notificacao de exclusao de item.
   */
  protected abstract getPostDeleteMessage();

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
   */
  leaveSearchMode() {
    this.searchMode = false;
    this.search = '';
    this.loadAllEntries();
    if (this.restoreBackButton) {
      this.restoreBackButton();
      this.restoreBackButton = null;
    }
  }

  /**
   * Atualiza os resultados de busca de acordo com o campo de busca.
   */
  loadSearchResults() {
    if(this.searchMode) {
      if(this.search.length > 0) {
        this.db.search(this.search).then(items => {
          this.entries = items;
        });
      }
    }
  }
}
