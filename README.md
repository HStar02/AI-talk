# AI Talk

角色扮演语音对话 MVP。内置 3 个示例角色（哈利·波特、苏格拉底、丘吉尔），支持：

- 角色搜索/选择
- 语音输入（浏览器 SpeechRecognition 作为演示）
- TTS 朗读（浏览器 SpeechSynthesis 作为演示）
- 聊天后端（可接入通义千问 Qwen，未配置时使用本地回退生成）

## 本地运行

### 1) 安装与启动

```bash
npm install
npm run start
# 打开浏览器访问 http://localhost:8787
```

### 2) API 健康检查

```bash
# Windows PowerShell
Invoke-WebRequest -UseBasicParsing http://localhost:8787/api/health
```

### 3) 角色列表

```bash
Invoke-RestMethod -UseBasicParsing http://localhost:8787/api/roles | ConvertTo-Json -Depth 5
```

### 4) 聊天测试（脚本）

```bash
npm run test:chat
```

## 配置通义千问（可选）

在项目根目录创建 `.env`：

```ini
DASHSCOPE_API_KEY=your_dashscope_api_key
QWEN_MODEL=qwen2.5-72b-instruct
LLM_PROVIDER=qwen
PORT=8787
```

未设置 `DASHSCOPE_API_KEY` 时，后端将回退为本地简单生成（便于无网快速自测）。

## 目录结构

- `server/` Node/Express 后端
  - `routes/roles.js` 角色搜索与详情
  - `routes/chat.js` 聊天路由
  - `services/provider.js` LLM 提供者（Qwen/本地）
  - `safety/basic.js` 基础内容安全
  - `data/roles.js` 角色卡
- `public/` 静态前端（原生JS）
- `scripts/testChat.js` 本地API测试脚本

## 已实现的角色技能（MVP）

- 角色一致性与世界观维持（通过系统提示与样式约束）
- 引导式剧情/诘问（角色卡中预置风格与开场）
- 情绪与风格控制（文本风格 + 浏览器TTS作为演示）
- 轻量安全过滤（关键词拦截+替代建议）

## 后续规划

- 接入实时ASR与流式TTS（云端低延迟）
- 情绪标签→SSML 参数映射
- 多角色同场对话与剧情节点推进
-$ powershell -Command "Invoke-WebRequest -UseBasicParsing http://localhost:8787/api/health | Select-Object -ExpandProperty StatusCode"
-$ start http://localhost:8787