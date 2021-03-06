import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import { DateTime } from "ionic-angular";
import {AnexoProvider} from "../anexo/anexo";

const CATEGORIA = 1;

@Injectable()
export class VacinaProvider {
  anexos: AnexoProvider;

  constructor(private dbProvider: DatabaseProvider) {
    this.anexos = new AnexoProvider(dbProvider);
  }

  public insert(vacina: Vacina, id: number) {
    return new Promise<number> ( (resolve) => {
      this.dbProvider.getDB()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM vacina WHERE nome = ? AND data = ?',
            [vacina.nome, this.dbProvider.formatDate(vacina.data)]).then( (result : any) => {
            if(result.rows.length > 0 && result.rows.item(0)['id'] != id) {
              resolve(-1);
            }
            else {
              if(id > 0){
                this.delete(id);
              }
              let sql = `INSERT INTO vacina (nome, tipo, lote, data, data_proxima, observacoes) VALUES (?, ?, ?, ?, ?, ?)`;
              let data = [vacina.nome, vacina.tipo, vacina.lote, this.dbProvider.formatDate(vacina.data),
                this.dbProvider.formatDate(vacina.data_proxima), vacina.observacoes];
              db.executeSql(sql, data)
                .then((data: any) => {
                  for (let i = 0; i < vacina.anexos.length; i++) {
                    let a = vacina.anexos[i];
                    if (a['nome'] !== undefined && a['caminho'] !== undefined) {
                      this.anexos.insertAttachment(data.insertId, CATEGORIA, a.caminho, a.nome);
                    }
                  }
                  resolve(1);
                })
                .catch((e) => console.error(e));
            }
          }).catch((e) => console.log(e));
        })
        .catch((e) => console.error(e));
    });
  }

  public get(id: number) {
    return new Promise<Vacina>(resolve => {
      this.dbProvider.getDB()
        .then((db: SQLiteObject) => {
          let sql = 'SELECT * FROM vacina WHERE id = ?';
          let data = [id];
          return db.executeSql(sql, data).then((data: any) => {
              if (data.rows.length > 0) {
                let item = data.rows.item(0);
                let vacina = new Vacina();
                vacina.id = item.id;
                vacina.nome = item.nome;
                vacina.lote = item.lote;
                vacina.data = new Date(item.data);
                vacina.data_proxima = item.data_proxima;
                vacina.tipo = item.tipo;
                vacina.observacoes = item.observacoes;
                vacina._data_criacao = item._data_criacao;
                vacina.data.setTime(vacina.data.getTime() + vacina.data.getTimezoneOffset()*60000);
                this.anexos.getAttachment(vacina.id, CATEGORIA, (anexos) => {
                  vacina.anexos = anexos;
                  resolve(vacina);
                });
              }
              else {
                resolve(null);
              }
            })
            .catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));
    });
  }

  public getAll() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM vacina ORDER BY id DESC';
        let data: any[];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let vacinas: any[] = [];
              for (let i = 0; i < data.rows.length; i++) {
                let v = new Vacina();
                let t = data.rows.item(i);
                v.id = t['id'];
                v.nome = t['nome'];
                v.data = new Date(t['data']);
                v.observacoes = t['observacoes'];
                this.anexos.getAttachment(v.id, CATEGORIA, (anexos) => {
                    v.anexos = anexos;
                });
                v.data_proxima = t['data_proxima'];
                v.tipo = t['tipo'];
                v.lote = t['lote'];
                v._data_criacao = t['_data_criacao'];
                v.data.setTime(v.data.getTime() + v.data.getTimezoneOffset()*60000);
                vacinas.push(v);
              }
              return vacinas;
            } else {
              return [];
            }
          })
          .catch((e) => {
            console.error(e);
            return [];
          });
      })
      .catch((e) => {
        console.error(e);
        return [];
      });
  }

  delete(id : number) {
    return new Promise<null>((resolve) => {
      this.dbProvider.getDB().then((db : SQLiteObject) => {
        db.executeSql('DELETE FROM vacina WHERE id = ?', [id]).then(() => {
          db.executeSql('DELETE FROM anexo WHERE categoria_id = ? and registro_id = ?', [CATEGORIA, id])
            .then(() => resolve());
        });
      });
    });
  }

  public save(v:Vacina, id:number){
    return this.insert(v, id);
  }

  public search(query:string){
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT * FROM vacina 
        WHERE nome LIKE ? OR tipo LIKE ? OR observacoes LIKE ?
        ORDER BY id DESC`;
        query = '%' + query + '%';
        console.log(query);
        return db.executeSql(sql, [query, query, query])
          .then((data: any) => {
            if (data.rows.length > 0) {
              console.log(data);
              let vacinas: any[] = [];
              for (let i = 0; i < data.rows.length; i++) {
                let v = new Vacina();
                let t = data.rows.item(i);
                v.id = t['id'];
                v.nome = t['nome'];
                v.data = new Date(t['data']);
                v.observacoes = t['observacoes'];
                this.anexos.getAttachment(v.id, CATEGORIA, (anexos) => {
                  v.anexos = anexos;
                });
                v.data_proxima = t['data_proxima'];
                v.tipo = t['tipo'];
                v.lote = t['lote'];
                v._data_criacao = t['_data_criacao'];
                v.data.setTime(v.data.getTime() + v.data.getTimezoneOffset()*60000);
                vacinas.push(v);
              }
              return vacinas;
            } else {
              return [];
            }
          })
          .catch((e) => {
            console.error(e);
            return [];
          });
      })
      .catch((e) => {
        console.error(e);
        return [];
      });

  }
}

export class Vacina {
  id: number;
  nome: string;
  tipo: string;
  lote: string;
  data: Date;
  data_proxima: Date;
  _data_criacao: DateTime;
  observacoes: string;
  anexos: any;
}
