import assert from 'assert';
import triples from '../src/index.js';
import { options } from './config.js';

describe('Notion', () => {
  it('getOrCreate', async () => {
    const value = 'test_value';
    const res = await triples.notions.getOrCreate(value, options);
    assert.equal(res.name, value);
    assert.ok(res.id);
  });
});