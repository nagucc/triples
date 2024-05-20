--
-- 表的结构 `notions`
--

CREATE TABLE `notions` (
  `id` int NOT NULL,
  `name` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 表的结构 `triples`
--

CREATE TABLE `triples` (
  `id` int NOT NULL,
  `subject` int NOT NULL,
  `predicate` int NOT NULL,
  `object` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 转储表的索引
--

--
-- 表的索引 `notions`
--
ALTER TABLE `notions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`) USING BTREE;

--
-- 表的索引 `triples`
--
ALTER TABLE `triples`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subject` (`subject`,`predicate`,`object`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `notions`
--
ALTER TABLE `notions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `triples`
--
ALTER TABLE `triples`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;