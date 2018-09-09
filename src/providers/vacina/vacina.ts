import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class VacinaProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public insert(vacina: Vacina) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'INSERT INTO vacina (nome, tipo, data, observacoes) VALUES (?, ?, ?, ?)';
        let data = [vacina.nome, vacina.tipo, vacina.data, vacina.observacoes];

        return db.executeSql(sql, data)
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
              vacina.data = item.data;
              vacina.tipo = item.tipo;
              vacina.observacoes = item.observacoes;
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
        var data: any[];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let vacinas: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var vacina = data.rows.item(i);
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
  data: Date;
  observacoes: string;
  anexos: number[];
}
