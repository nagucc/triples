# NaguTriples

## Introduction

`NaguTriples` implements the persistent storage of triples in the form of `<subject, predicate, object>`。Main features include:

- All parts of the triples are stored as `String` in  `UTF-8`, with the maximum length of `512B`.
- The current version is only supports storage in `Mysql`.

## Installation

`npm install nagu-triples`

## Usage

### 引入包

`import triples from 'nagu-triples'`

每一个方法调用都需要带入Mysql的连接信息：

```
const options = {
  host: '192.168.0.231',
  database: 'owl',
  user: 'owl',
  password: 'password',
  port: 3306,
};
```

### 类型

#### Notion
三元组中subject, predicate, object 都是一个Notion，Notion是一个对象，包括id和name两个字段。

### getOrCreate

获取或创建一个三元组

```

const trpileId = getOrCreate('a', 'b', 'c', options);

```
注意：
- 前三个参数分别是subject, predicate, object, 可以是String或Notion(如果传入Notion，将忽略name属性)。

### 查询

查询函数包括：
- getById
- listByS
- listByP
- listByO
...

