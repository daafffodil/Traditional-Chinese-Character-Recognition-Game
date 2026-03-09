# 繁体字识别训练游戏 PRD

## 产品名称
繁体字识别训练游戏

## 版本
MVP v1.3

## 目标用户
学习繁体字识别的小学生。

## 产品目标
通过简单、可重复的游戏循环，帮助学生建立繁体字识别能力，适用于课堂与课后练习。

---

## 学习模式

产品现阶段明确包含两种游戏模式：

### 模式 1：`single_mapping`（已完成 MVP）
- 一个简体字对应一个繁体字。
- 玩家看到简体字提示后，在字阵中点击对应繁体字。
- 该模式已实现，并已接入 Supabase 进行成绩/历史记录。
- 该模式是当前已完成且必须保持稳定的 MVP 主模式。

### 模式 2：`multi_mapping`（下一阶段 MVP 开发重点）
- 一个简体字在不同语境下可能对应多个繁体字。
- 玩法采用**句子/短语语境填空**。
- 单题包含**多个空格**。
- 采用**顺序高亮空格**（一次只回答当前高亮空格）。
- 交互方式为**点击填空（click-to-fill）**。
- 首个可运行版本仅需 **10～15 题**。
- 题库保留在**本地代码**中，不放数据库。
- 计分为**正确率导向**，不是速度导向。

---

## 当前开发重点
1. 先保证 `single_mapping` 持续稳定可用。
2. 再实现首个可运行的 `multi_mapping` MVP（多空格语境填空）。

---

## 各模式玩法要求

### `single_mapping` 单局流程（已上线）
1. 显示一个简体字。
2. 显示繁体字选项网格（如 3×3、4×4、5×5）。
3. 玩家点击正确繁体字。
4. 计时器记录从开始到答对的用时。
5. 将成绩/历史记录保存到 Supabase。

### `multi_mapping` 题目流程（MVP 开发中）
1. 显示带多个空格的句子或短语。
2. 高亮当前待填空格。
3. 玩家点击候选项填入当前空格。
4. 自动切换并高亮下一个空格，直到全部完成。
5. 对整题进行判定并反馈正误。
6. 按需要接入现有成绩/历史记录流程。

### `multi_mapping` 计分规则（更新）
- `multi_mapping` 不使用完成时间进行排名。
- 核心指标是单题中答对空格数量。
- `correct_blank_count` = 玩家答对的空格数。
- `is_correct` 仅在 `correct_blank_count == blank_count` 时为 `true`。
- 示例：若 `blank_count = 3` 且 `correct_blank_count = 2`，界面准确度显示为 `2 / 3`。

---

## 界面结构

### 通用
- 进度提示
- 正误音效与视觉反馈

### `single_mapping`
- 中间区域：繁体字选项网格
- 底部区域：难度按钮（3×3 / 4×4 / 5×5）

### `multi_mapping`
- 句子/短语展示区（含多个空格）
- 空格顺序高亮状态
- 可点击候选区（用于填空）
- 最近记录表格列：`Name | Simplified | Accuracy | Perfect | Date`
  - `Accuracy` 格式：`correct_blank_count / blank_count`（例如 `2 / 3`）
  - `Perfect`：全部空格正确显示 `✅`，否则留空
- 排名表不再使用 “Leaderboard (3x3)” 命名，改为 **Accuracy Leaderboard**
- 排名优先级：
  1. 完全正确优先（`is_correct = true`）
  2. 准确度更高优先（`correct_blank_count / blank_count`）
  3. `correct_blank_count` 更高优先
  4. `created_at` 更新（更晚）优先

---

## 数据范围

### 内容/题库
- `single_mapping` 字库继续保留在本地代码。
- `multi_mapping` 首版 10～15 题题库同样保留在本地代码。
- MVP 阶段不要求将玩法内容写入数据库。

### 数据库用途
- Supabase 仅用于**成绩、历史记录、排行榜相关数据**。
- 数据库不是 MVP 阶段题库/内容的来源。

---

## 语音
- 可使用 TTS（如 Web Speech API）播放读音或辅助提示。

---

## 技术方案

### 前端
- React
- Next.js

### 后端
- Supabase（仅成绩/历史/排行榜相关记录）

### 当前数据表

#### `tc_game_scores` 表
| 字段 | 类型 | 说明 |
|---|---|---|
| id | integer | 主键 |
| player_name | text | 玩家显示名称 |
| mode | text | `single_mapping` / `multi_mapping` |
| target_simplified | text | 简体提示字 |
| blank_count | integer | `multi_mapping` 单题总空格数 |
| correct_blank_count | integer | 玩家答对空格数量 |
| is_correct | boolean | 当 `correct_blank_count == blank_count` 时为 `true` |
| grid_size | integer | `single_mapping` 使用 |
| completion_time | float | `single_mapping` 使用 |
| created_at | timestamp | 记录创建时间 |

> 说明：`correct_blank_count` 为新增字段，用于 `multi_mapping` 的历史展示与准确度排名。

---

## 范围总结

### 已完成 / 已上线
- `single_mapping` 一对一映射玩法
- 简体提示 + 繁体字阵点击
- 计时与用时记录
- 正误反馈
- 通过 Supabase 持久化成绩/历史

### 当前 MVP 开发中
- `multi_mapping` 一对多语境判别玩法
- 句子/短语多空格填空
- 顺序高亮空格
- 点击填空交互
- 首版 10～15 题（本地代码题库）
- 基于 `correct_blank_count` 的计分逻辑
- 以准确度为核心的历史与排行榜展示

---

## 成功标准
- 学生可在 10 秒内理解 `single_mapping` 玩法。
- `single_mapping` 在新增功能期间保持稳定。
- 首个 `multi_mapping` MVP 可完整跑通 10～15 题。
