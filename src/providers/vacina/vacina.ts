import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import {DateTime} from "ionic-angular";

const CATEGORIA = 1;

@Injectable()
export class VacinaProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  private insertAnexo(registro_id: Number, caminho: string, nome: string){
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `INSERT INTO anexo (nome, caminho, categoria_id, registro_id) VALUES (?, ?, ?, ?)`;
        let data = [nome, caminho, CATEGORIA, registro_id];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  private getAnexo(registro_id: Number){
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM anexo WHERE categoria_id = ? AND registro_id = ?';
        let data = [CATEGORIA, registro_id];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let anexos: any[] = [];
              for (let i = 0; i < data.rows.length; i++) {
                anexos.push(data.rows.item(i));
              }
              return anexos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public insert(vacina: Vacina) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `INSERT INTO vacina (nome, tipo, lote, data, data_proxima, observacoes) VALUES (?, ?, ?, ?, ?, ?)`;
        let data = [vacina.nome, vacina.tipo, vacina.lote, vacina.data, vacina.data_proxima, vacina.observacoes];

         db.executeSql(sql, data)
           .then((data : any) => {
             for (let i=0; i<vacina.anexos.length; i++){
               let a = vacina.anexos[i];
               if(a['nome'] !== undefined && a['caminho'] !== undefined){
                 this.insertAnexo(data.insertId, a.caminho, a.nome);
               }
             }
           })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM vacina WHERE id = ?';
        let data = [id];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let vacina = new Vacina();
              vacina.id = item.id;
              vacina.nome = item.nome;
              vacina.lote = item.lote;
              vacina.data = item.data;
              vacina.data_proxima = item.data_proxima;
              vacina.tipo = item.tipo;
              vacina.observacoes = item.observacoes;
              vacina._data_criacao = item._data_criacao;
              vacina.anexos = this.getAnexo(id);
              return vacina;
            }
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAll() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM vacina';
        let data: any[];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let vacinas: any[] = [];
              for (let i = 0; i < data.rows.length; i++) {
                let vacina = data.rows.item(i);
                vacinas.push(vacina);
              }
              return vacinas;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
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
