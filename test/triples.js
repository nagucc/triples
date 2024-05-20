import assert from 'assert';
import triples from '../src/index.js';
import { options } from './config.js';


let tid = 0;
describe('Triples', () => {
  it('getById - 获取不存在的Triple', async () => {
    const res = await triples.getById(0, options);
    assert.equal(res, null);
  });
  it('listByS - 获取不存在的Triple列表', async () => {
    const res = await triples.listByS('not_value', options);
    assert.equal(res.length, 0);
  });
  it('listByP - 获取不存在的Triple列表', async () => {
    const res = await triples.listByP('not_value', options);
    assert.equal(res.length, 0);
  });
  it('listByO - 获取不存在的Triple列表', async () => {
    const res = await triples.listByO('not_value', options);
    assert.equal(res.length, 0);
  });
  it('listBySP - 获取不存在的Triple列表', async () => {
    const res = await triples.listBySP('not_value', 'not_value', options);
    assert.equal(res.length, 0);
  });
  it('listByPO - 获取不存在的Triple列表', async () => {
    const res = await triples.listByPO('not_value', 'not_value', options);
    assert.equal(res.length, 0);
  });
  it('listBySO - 获取不存在的Triple列表', async () => {
    const res = await triples.listBySO('not_value', 'not_value', options);
    assert.equal(res.length, 0);
  });
  it('getBySPO - 获取不存在的Triple', async () => {
    const res = await triples.getBySPO('not_value', 'not_value', 'not_value', options);
    assert.equal(res, null);
  });
  it('deletById - 删除不存在的Triple', async () => {
    const res = await triples.deleteById(0, options);
    assert.equal(res, 0);
  });
  it('getOrCreate - 创建Triple', async () => {
    const res = await triples.getOrCreate('s_value', 'p_value', 'o_value', options);
    tid = res.id;
    assert.ok(res instanceof triples.Triple);
    assert.ok(res.id);
    assert.ok(res.subject.id);
    assert.equal(res.subject.name, 's_value');
    assert.ok(res.predicate.id);
    assert.equal(res.predicate.name, 'p_value')
    assert.ok(res.object.id);
    assert.equal(res.object.name, 'o_value');
  });
  it('getById - 获取Triple', async () => {
    const res = await triples.getById(tid, options);
    assert.ok(res instanceof triples.Triple);
    assert.equal(res.id, tid);
    assert.ok(res.subject.id);
    assert.equal(res.subject.name, 's_value');
    assert.ok(res.predicate.id);
    assert.equal(res.predicate.name, 'p_value')
    assert.ok(res.object.id);
    assert.equal(res.object.name, 'o_value');
  });
  it('getBySPO - 获取Triple', async () => {
    const res = await triples.getBySPO('s_value', 'p_value', 'o_value', options);
    assert.ok(res instanceof triples.Triple);
    assert.ok(res.id);
    assert.ok(res.subject.id);
    assert.equal(res.subject.name, 's_value');
    assert.ok(res.predicate.id);
    assert.equal(res.predicate.name, 'p_value')
    assert.ok(res.object.id);
    assert.equal(res.object.name, 'o_value');
  });
  it('listByS - 获取Triple列表', async () => {
    const res = await triples.listByS('s_value', options);
    assert.equal(res.length, 1);
  });
  it('listByP - 获取Triple列表', async () => {
    const res = await triples.listByP('p_value', options);
    assert.equal(res.length, 1);
  });
  it('listByO - 获取Triple列表', async () => {
    const res = await triples.listByO('o_value', options);
    assert.equal(res.length, 1);
  });
  it('listBySP - 获取Triple列表', async () => {
    const res = await triples.listBySP('s_value', 'p_value', options);
    assert.equal(res.length, 1);
  });
  it('listBySO - 获取Triple列表', async () => {
    const res = await triples.listBySO('s_value', 'o_value', options);
    assert.equal(res.length, 1);
  });
  it('listByPO - 获取Triple列表', async () => {
    const res = await triples.listByPO('p_value', 'o_value', options);
    assert.equal(res.length, 1);
  });
  it('deleteById - 删除Triple', async () => {
    const res = await triples.deleteById(tid, options);
    assert.equal(res, 1);
  });
  it('getById - 删除后无法获得', async () => {
    const res = await triples.getById(tid, options);
    assert.equal(res, null);
  });
});