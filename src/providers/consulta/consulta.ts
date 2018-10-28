import { Injectable } from '@angular/core';
import { SQLiteObject } from "@ionic-native/sqlite";
import { DatabaseProvider } from "../database/database";
import { DateTime } from "ionic-angular";
import {AnexoProvider} from "../anexo/anexo";

const CATEGORIA = 3;

@Injectable()
export class ConsultaProvider {
  anexos: AnexoProvider;

  constructor(private dbProvider: DatabaseProvider) {
    this.anexos = new AnexoProvider(dbProvider)
  }

  private struct(obj){
    let c = new Consulta();
    c.id = obj['id'];
    c.nome = obj['nome'];
    c.especialidade = obj['especialidade'];
    c.data = new Date(obj['data']);
    c.causa = obj['causa'];
    c.preco = obj['preco'];
    c.exames = obj['exames'];
    c.retorno = new Date(obj['retorno']);
    c.observacoes = obj['observacoes'];
    c._data_criacao = obj['_data_criacao'];

    c.data.setTime(c.data.getTime() + c.data.getTimezoneOffset()*60000);
    c.retorno.setTime(c.retorno.getTime() + c.retorno.getTimezoneOffset()*60000);

    return c;
  }

  public insert(con: Consulta, id: number) {
    return new Promise<number> ( (resolve) => {
      this.dbProvider.getDB()
        .then((db: SQLiteObject) => {
          db.executeSql(`SELECT * FROM consulta WHERE nome = ? AND data = ? ;`,
            [con.nome, this.dbProvider.formatDate(con.data)]).then( (result : any) => {
            if(result.rows.length > 0 && result.rows.item(0)['id'] != id) {
              resolve(-1);
            }
            if(con.data > con.retorno){
              resolve(-2);
            }
            else {
              if(id > 0){
                this.delete(id);
              }
              let sql = `INSERT INTO consulta (nome, especialidade, data, causa, preco, exames, retorno, observacoes) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
              let data = [con.nome, con.especialidade, this.dbProvider.formatDate(con.data), con.causa, con.preco,
                con.exames, this.dbProvider.formatDate(con.retorno), con.observacoes];
              db.executeSql(sql, data)
                .then((data: any) => {
                  for (let i = 0; i < con.anexos.length; i++) {
                    let a = con.anexos[i];
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
        db.executeSql(`DELETE FROM consulta WHERE id = ?`, [id]).then(() => {
          db.executeSql(`DELETE FROM anexo WHERE categoria_id = ? AND registro_id = ?;`, [CATEGORIA, id])
            .then(() => resolve());
        });
      });
    });
  }

  public get(id: number) {
    return new Promise<Consulta>(resolve => {
      this.dbProvider.getDB().then((db: SQLiteObject) => {
        return db.executeSql(`SELECT * FROM consulta WHERE id = ?;`, [id]).then((data: any) => {
          if (data.rows.length > 0){
            let con = this.struct(data.rows.item(0));
            return this.anexos.getAttachment(con.id, CATEGORIA, (anexos) => {
              con.anexos = anexos;
              resolve(con);
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
      return db.executeSql(`SELECT * FROM consulta ORDER BY id DESC;`, [])
        .then((data: any) => {
          if(data.rows.length > 0){
            let consultas: any[] = [];
            for(let i=0; i<data.rows.length; i++){
              let c = this.struct(data.rows.item(i));
              this.anexos.getAttachment(c.id, CATEGORIA, (anexos) => {
                c.anexos = anexos;
              });
              consultas.push(c);
            }
            return consultas;
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

  public save(c: Consulta, id: number) {
    return this.insert(c, id);
  }

  public search(query: string){
    query = '%' + query + '%';
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      return db.executeSql(`SELECT * FROM consulta WHERE nome LIKE ? OR especialidade LIKE ? OR causa LIKE ? 
      OR exames LIKE ? OR observacoes LIKE ?;`, [query, query, query, query, query]).then((data: any) => {
        if(data.rows.length > 0){
          let consultas: any[] = [];
          for(let i=0; i<data.rows.length; i++){
            let c = this.struct(data.rows.item(i));
            this.anexos.getAttachment(c.id, CATEGORIA, (anexos) => {
              c.anexos = anexos;
            });
            consultas.push(c);
          }
          return consultas;
        } else {
          return [];
        }
      }).catch();
    }).catch();
  }

}

export class Consulta {
  id: number;
  nome: string;
  especialidade: string;
  data: Date;
  causa: string;
  preco: number;
  exames: string;
  retorno: Date;
  observacoes: string;
  _data_criacao: DateTime;
  anexos: any;
}
