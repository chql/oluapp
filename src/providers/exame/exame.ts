import { Injectable } from '@angular/core';
import { SQLiteObject } from "@ionic-native/sqlite";
import { DatabaseProvider } from "../database/database";
import { DateTime } from "ionic-angular";
import {AnexoProvider} from "../anexo/anexo";

const CATEGORIA = 6;

@Injectable()
export class ExameProvider {
  anexos: AnexoProvider;

  constructor(private dbProvider: DatabaseProvider) {
    this.anexos = new AnexoProvider(dbProvider)
  }

  private struct(obj){
    let e = new Exame();
    e.id = obj['id'];
    e.nome = obj['nome'];
    e.data = new Date(obj['data']);
    e.tipo = obj['tipo'];
    e.medico_solicitou = obj['medico_solicitou'];
    e.medico_realizou = obj['medico_realizou'];
    e.observacoes = obj['observacoes'];
    e.local = obj['local'];
    e.valor = obj['valor'];
    e._data_criacao = obj['_data_criacao'];

    e.data.setTime(e.data.getTime() + e.data.getTimezoneOffset()*60000);

    return e;
  }

  public insert(exa: Exame, id: number) {
    return new Promise<number> ( (resolve) => {
      this.dbProvider.getDB()
        .then((db: SQLiteObject) => {
          db.executeSql(`SELECT * FROM exame WHERE nome = ? AND data = ? AND tipo = ? ;`,
            [exa.nome, this.dbProvider.formatDate(exa.data), exa.tipo]).then( (result : any) => {
            if(result.rows.length > 0 && result.rows.item(0)['id'] != id) {
              resolve(-1);
            }
            else {
              if(id > 0){
                this.delete(id);
              }
              let sql = `INSERT INTO exame (nome, tipo, data, valor, medico_realizou, medico_solicitou, local, observacoes) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
              let data = [exa.nome, exa.tipo, this.dbProvider.formatDate(exa.data), exa.valor, exa.medico_realizou,
                exa.medico_solicitou, exa.local, exa.observacoes];
              db.executeSql(sql, data)
                .then((data: any) => {
                  for (let i = 0; i < exa.anexos.length; i++) {
                    let a = exa.anexos[i];
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

  public delete(id: number) {
    return new Promise<null>((resolve) => {
      this.dbProvider.getDB().then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM exame WHERE id = ?`, [id]).then(() => {
          db.executeSql(`DELETE FROM anexo WHERE categoria_id = ? AND registro_id = ?;`, [CATEGORIA, id])
            .then(() => resolve());
        });
      });
    });
  }

  public get(id: number) {
    return new Promise<Exame>(resolve => {
      this.dbProvider.getDB().then((db: SQLiteObject) => {
        return db.executeSql(`SELECT * FROM exame WHERE id = ?;`, [id]).then((data: any) => {
          if (data.rows.length > 0){
            let exa = this.struct(data.rows.item(0));
            return this.anexos.getAttachment(exa.id, CATEGORIA, (anexos) => {
              exa.anexos = anexos;
              resolve(exa);
            }).catch((e) => console.error(e));
          } else {
            resolve(null);
          }
        }).catch((e) => console.error(e));
      }).catch((e) => console.error(e));
    });
  }

  public getAll() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      return db.executeSql(`SELECT * FROM exame ORDER BY id DESC;`, [])
        .then((data: any) => {
          if(data.rows.length > 0){
            let exames: any[] = [];
            for(let i=0; i<data.rows.length; i++){
              let e = this.struct(data.rows.item(i));
              this.anexos.getAttachment(e.id, CATEGORIA, (anexos) => {
                e.anexos = anexos;
              });
              exames.push(e);
            }
            return exames;
          } else {
            return [];
          }
        }).catch((e) => {
          console.error(e);
          return [];
        })
    }).catch((e) => {
      console.error(e);
      return [];
    });
  }

  public save(e: Exame, id: number) {
    return this.insert(e, id);
  }

  public search(query: string){
    query = '%' + query + '%';
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      return db.executeSql(`SELECT * FROM exame WHERE nome LIKE ? OR medico_solicitou LIKE ? OR observacoes LIKE ? 
       OR tipo LIKE ? OR medico_realizou LIKE ? OR local LIKE ? ;`,
        [query, query, query, query, query, query]).then((data: any) => {
        if(data.rows.length > 0){
          let exames: any[] = [];
          for(let i=0; i<data.rows.length; i++){
            let e = this.struct(data.rows.item(i));
            this.anexos.getAttachment(e.id, CATEGORIA, (anexos) => {
              e.anexos = anexos;
            });
            exames.push(e);
          }
          return exames;
        } else {
          return [];
        }
      }).catch();
    }).catch();
  }
}

export class Exame {
  id: number;
  nome: string;
  tipo: string;
  data: Date;
  medico_solicitou: string;
  medico_realizou: string;
  local: string;
  valor: number;
  observacoes: string;
  _data_criacao: DateTime;
  anexos: any;
}
