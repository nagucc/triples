import { randomUUID } from "crypto";
import { Notion } from "./notions"

export type ConditionTripleItem = {
  id: string,
  status?: 'intact'|'computed',
  values?: Notion<string>[],
}

export type ConditionTriple = {
  subject: ConditionTripleItem,
  predicate: ConditionTripleItem,
  object: ConditionTripleItem,
}

export const query = async (conditions:ConditionTriple[]): Promise<ConditionTripleItem[]> => {
  // 对每个条件三元组进行查询，获取查询结果
  const singleResults = await Promise.all(conditions.map( async c => querySingleTriple(c)));
  return singleResults.reduce((pre, cur) => {
    // 对每一组查询进行合并，将pre合并到cur中
    pre.forEach(item => {
      // 从结果集cur中找出与item id一致的数据
      const cur_item = cur.find(i => i.id === item.id);
      if (!cur_item) cur.push(item); // 如果在cur中没找到item，则将item加入到结果集cur中
      else {
        // 如果能找到，则将两边的values按AND进行合并(求交集)
        // 需要检查status，如果其中一个的status为'intact'，则说明这个值还没获取；
        if (cur_item.status === 'intact') {
          cur_item.status = item.status;
          cur_item.values = item.values;
        } else if (item.status !== 'intact') {
          cur_item.values = cur_item.values?.filter(v => item.values?.find(n => (n.id === v.id) || (n.name === v.name)));
        }
      }
    });
    return cur;
  })
}

export const querySingleTriple = async (condition: ConditionTriple): Promise<ConditionTripleItem[]> => {
  // 初始化返回值
  const {subject, predicate, object} = condition;
  subject.status = subject.values ? 'computed' : 'intact';
  predicate.status = predicate.values ? 'computed' : 'intact';
  object.status = object.values ? 'computed' : 'intact';
  const items = [subject, predicate, object];

  // 判断条件语句中的参数情况
  let key = 0;
  if (subject.status === 'computed') key += 4; // subject是已知数或已被计算出来
  if (predicate.status === 'computed') key += 2; // predicate是已知数或已被计算出来
  if (object.status === 'computed') key += 1; // object是已知数或已被计算出来
  switch (key) {
    case 0: // 全部都是未知数
      // 全是未知数无法处理，直接返回。
      return items;
    case 1: // S,P是未知数，O是已知数
    case 2: // S,O是未知数, P是已知数
    case 4: // S是已知数，P,O是未知数
      return querySingleTripleWithOneComputedItem(condition);
    case 3: // S是未知数，P,O是已知数
    case 5: // S,O是已知数，P是未知数
    case 6: // S,P是已知数，O是未知数
      let result1, result2;
      const result1_id = randomUUID(), result2_id = randomUUID();
      switch (key) {
        case 3:
          result1 = querySingleTripleWithOneComputedItem({
            subject,
            predicate: {
              id: result1_id,
              status: "intact",
              values: null,
            },
            object,
          });
          result2 = querySingleTripleWithOneComputedItem({
            subject,
            predicate,
            object: {
              id: result2_id,
              status: "intact",
              values: null,
            },
          });
          break;
        case 5:
          result1 = querySingleTripleWithOneComputedItem({
            subject: {
              id: result1_id,
              status: "intact",
              values: null,
            },
            predicate,
            object,
          });
          result2 = querySingleTripleWithOneComputedItem({
            subject,
            predicate,
            object: {
              id: result2_id,
              status: "intact",
              values: null,
            },
          });
          break;
        case 6:
          result1 = querySingleTripleWithOneComputedItem({
            subject: {
              id: result1_id,
              status: "intact",
              values: null,
            },
            predicate,
            object,
          });
          result2 = querySingleTripleWithOneComputedItem({
            subject,
            predicate: {
              id: result2_id,
              status: "intact",
              values: null,
            },
            object,
          });
          break;
      }
      break;
    
    
    case 7: // S,P,O都是已知数
    default:
      break;
  }
  return items;
}

export const querySingleTripleWithOneComputedItem = async (condition:ConditionTriple): Promise<ConditionTripleItem[]> => {
    // 由于values可能有多个值，因此需要查询多次合并结果

  return [];
}