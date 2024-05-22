import { execute } from "./mysql.js";
import { INotion } from "nagu-triples-types";

export class Notion<T> implements INotion<T> {
  constructor(public name: T, public id?: number) {
    this.name = name;
    this.id = id;
  }
  toString () {
    if (typeof this.name === 'string')
    return this.name;
  }
}

async function getByName<T>(name: T, options: object) {
  const [ rows, ] = await execute(`SELECT * FROM notions WHERE name = '${name}'`, options);
  if (!rows[0]) return null;
  else return new Notion(name, rows[0].id);
}

async function create<T>(name: T, options: object) {
  const [result, ] = await execute(`INSERT INTO notions (name) VALUES ('${name}')`, options);
  return new Notion(name, result.insertId);
}

export async function getOrCreate<T>(name: T, options: object) {
  const row = await getByName(name, options);
  if (row) return row;
  else {
    const notion = await create(name, options);
    return notion;
  }
}

export default {
  getOrCreate,
  Notion,
}