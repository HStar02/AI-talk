# 使用说明（AI Talk 角色语音对话）

## 一、产品说明
- **定位**: 利用 LLM + 语音交互实现的角色扮演对话网站，提供沉浸式、角色一致性的语音交流体验。
- **目标用户**: IP粉丝、语言/历史/哲学学习者、创作者/主播、教师/教育机构。
- **核心价值**: 低门槛沉浸式角色对话、稳定的人设与世界观、语音化实时反馈、基础内容安全。

### 已内置的示例角色
- 哈利·波特：温暖好奇、霍格沃茨世界观、剧情推进
- 苏格拉底：诘问启发式对话、反思与定义
- 丘吉尔：演讲风格、历史一致性与合规
- 派蒙：活泼俏皮、称呼“旅行者”、避免剧透
- 鲁迅：冷峻克制、注重比喻与洞察
- 李白：清新洒脱、可按请求作五/七言诗

### 主要功能
- 角色搜索与选择：内置角色卡（人设、风格、禁忌、开场）
- 文本/语音双通道对话：浏览器内置 ASR/TTS（演示级）
- 角色一致性与基础安全：系统提示约束 + 关键词软拒答
- 会话基础体验：消息展示、自动 TTS 播报

---

## 二、架构设计

### 总览
- 前端（静态页）: `public/index.html`
  - 原生 HTML/JS/CSS，提供角色列表、搜索、聊天气泡、ASR/TTS、主题切换（浅/暗）
- 后端（Node/Express）: `server/`
  - `routes/roles.js` 角色列表/搜索
  - `routes/chat.js` 聊天接口（注入角色卡 + 安全过滤 + LLM 提供者）
  - `services/provider.js` LLM 提供者（通义千问 Qwen / 本地回退）
  - `safety/basic.js` 基础安全过滤（关键词拦截 + 替代建议）
  - `data/roles.js` 角色卡配置

### 数据流（一次对话）
1) 用户通过浏览器输入文本或语音（ASR -> 文本）
2) 前端 POST `/api/chat`（携带 `roleId` 与消息历史）
3) 后端应用安全过滤与角色系统提示，调用 LLM（Qwen 或本地回退）
4) 返回角色化文本，前端展示并用 TTS 播报

### API 设计
- `GET /api/health` 健康检查
- `GET /api/roles?q=关键词` 角色搜索/列表
- `GET /api/roles/:id` 角色详情
- `POST /api/chat`
```
{
  "roleId": "harry-potter",
  "messages": [ { "role": "user", "content": "你好" } ],
  "locale": "zh-CN"
}
```
返回：`{ "text": "角色化回复" }`

### 关键技术点
- 角色一致性：系统提示注入人设/风格/禁忌，短消息历史维持上下文
- 安全：关键词级软拒答 + 替代话题提示（可扩展为策略提示/多级分类）
- 语音：浏览器 `SpeechRecognition` 与 `SpeechSynthesis` 演示，后续可替换云端低延迟链路（ASR/TTS）
- 可扩展：新增角色 = 追加 `server/data/roles.js` 条目

---

## 三、运行程序（Windows/PowerShell）

### 1) 安装依赖
```
npm install
```

### 2) 启动服务
```
npm run start
```
启动成功后看到：`AI Talk server listening on http://localhost:8787`

### 3) 打开前端
- 浏览器访问: `http://localhost:8787`

### 4) 可选：接入通义千问 Qwen
在项目根目录创建 `.env`：
```
DASHSCOPE_API_KEY=你的阿里云DashScope密钥
QWEN_MODEL=qwen2.5-72b-instruct
LLM_PROVIDER=qwen
PORT=8787
```
保存后重启 `npm run start`。未配置时走本地回退生成（便于离线演示）。

### 5) 自检命令
- 健康检查：
```
Invoke-WebRequest -UseBasicParsing http://localhost:8787/api/health
```
- 角色列表：
```
Invoke-RestMethod -UseBasicParsing http://localhost:8787/api/roles | ConvertTo-Json -Depth 5
```
- 聊天测试脚本：
```
npm run test:chat
```

---

## 四、使用指南
1) 左侧搜索/选择角色 → 右侧聊天区显示消息
2) 输入文字或点击“🎤 录音”（Chrome 兼容更佳）
3) 回复自动以角色风格呈现，并用 TTS 播放
4) 顶栏按钮可切换“浅色/暗色”主题

---

## 五、常见问题（FAQ）
- 样式未更新/仍是深色：强制刷新缓存（Ctrl+F5）
- 端口占用：修改 `.env` 的 `PORT` 或释放 8787 端口
- PowerShell 不支持 `&&`：将命令拆成多行依次执行
- 聊天 JSON 错误：确保 `Content-Type: application/json` 且 Body 为合法 JSON；也可使用 `npm run test:chat`
- 新增角色不显示：重启服务并刷新；用 `GET /api/roles` 确认返回 6 个角色

---

## 六、后续规划
- 流式 LLM 输出与流式 TTS 起播（降首包、提连续性）
- 情绪标签 → SSML 参数映射，增强语音表现力
- 多角色同场景扮演与剧情节点推进
- 可视化角色工坊与分享/评分

---

## 七、目录结构速览
- `server/` 后端
  - `index.js` 服务入口（API + 静态资源）
  - `routes/roles.js` 角色列表/搜索
  - `routes/chat.js` 聊天接口
  - `services/provider.js` LLM 提供者（Qwen/本地）
  - `safety/basic.js` 基础安全过滤
  - `data/roles.js` 角色卡
- `public/index.html` 前端单页（UI/ASR/TTS/主题）
- `scripts/testChat.js` 聊天接口本地测试脚本
- `README.md` 项目摘要；`使用说明.md` 详细指南
