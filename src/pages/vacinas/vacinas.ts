import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';
import { VacinasEditPage } from '../vacinas-edit/vacinas-edit';
import { VacinaProvider } from "../../providers/vacina/vacina";
import { AlertController, Searchbar } from 'ionic-angular';
import { timer } from 'rxjs/observable/timer';

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
   * Componentes de interface
   */
  @ViewChild('qinput') searchInput : Searchbar;

  /**
   *
   * @param navCtrl Para navegar para pagina de edicao.
   * @param translate Obtencao de mensagens da interface.
   * @param dbVacina Recuperar e alterar dados de vacinas.
   * @param toast Exibicao de mensagens ao modificar uma vacina.
   * @param alert Confirmacao de exclusao.
   * @param fOpener Exibicao de anexos.
   * @param file Metadados de anexos.
   */
  constructor(public navCtrl: NavController,
              public translate : TranslateService,
              private dbVacina: VacinaProvider,
              private toast : ToastController,
              private alert : AlertController,
              private fOpener: FileOpener,
              private file : File) {
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

  /**
   * Expande a visualizacao detalhada de uma vacina ao clicar sobre o item.
   * @param vacina
   */
  expandView(vacina) {
	  if(vacina.detail === undefined) {
		  vacina.detail = true;
	  }
	  else {
		  vacina.detail = !vacina.detail;
	  }
  }

  /**
   * Formata a data de aplicacao da vacina para exibicao.
   * @param rawDate
   */
  dateFormat(rawDate : string) {
	  let date = new Date(rawDate);
	  return date.getDate() + '/' + (date.getMonth()+1) + '/' + (date.getFullYear());
  }

  /**
   * Retorna estrutura detalhada para uma data.
   * @param str
   */
  getDate(str : string) {
    return new Date(str);
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
   * @param id
   */
  openDelete(id : number) {
    this.alert.create({
      title: 'Confirmação',
      message: 'Tem certeza que deseja excluir essa vacina?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.dbVacina.delete(id).then(() => {
              let idx = -1;
              for(let i = 0; i < this.vacinas.length; i++) {
                if(this.vacinas[i].id == id) {
                  idx = i;
                  break;
                }
              }
              if(idx != -1) {
                this.vacinas.splice(idx, 1);
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
    if(this.searchMode && this.search.length > 0) {
      // TODO: Implement database search
      // this.dbVacina.search(this.search).then(resultados => {
        if(this.searchMode) {
        // this.vacinas = resultados;
          timer(3000).subscribe(this.loadSearchResults);
        }
      //});
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
