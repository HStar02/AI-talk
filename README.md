# AI Talk

角色扮演语音对话 MVP。内置 6 个示例角色（哈利·波特、苏格拉底、丘吉尔、派蒙、鲁迅、李白），支持：

- 角色搜索/选择
- 语音输入（浏览器 SpeechRecognition 作为演示）
- TTS 朗读（浏览器 SpeechSynthesis 作为演示）
- 聊天后端（可接入通义千问 Qwen，未配置时使用本地回退生成）

## 启动与使用（Windows/PowerShell）

1) 安装与启动
```
npm install
npm run start
# 打开 http://localhost:8787
```

2) 自检接口
```
# 健康检查
Invoke-WebRequest -UseBasicParsing http://localhost:8787/api/health
# 角色列表
Invoke-RestMethod -UseBasicParsing http://localhost:8787/api/roles | ConvertTo-Json -Depth 5
# 聊天脚本
npm run test:chat
```

3) 可选：接入通义千问 Qwen
在项目根目录创建 `.env`：
```
DASHSCOPE_API_KEY=your_dashscope_api_key
QWEN_MODEL=qwen2.5-72b-instruct
LLM_PROVIDER=qwen
PORT=8787
```
保存后重启。未配置时使用本地回退生成。

## 架构一览
- 前端：`public/index.html` 原生 HTML/JS/CSS，角色列表、搜索、聊天、ASR/TTS、浅/暗主题
- 后端：`server/`
  - `routes/roles.js` 角色列表/搜索
  - `routes/chat.js` 聊天接口（角色卡 + 安全过滤 + LLM）
  - `services/provider.js` LLM 提供者（Qwen/本地回退）
  - `safety/basic.js` 关键词级安全过滤
  - `data/roles.js` 角色卡配置

## 已实现的角色技能（MVP）

- 角色一致性与世界观维持（系统提示与风格约束）
- 引导式剧情/诘问（角色卡中预置风格与开场）
- 情绪与风格控制（文本风格 + 浏览器 TTS 演示）
- 轻量安全过滤（关键词拦截 + 替代建议）

## 后续规划

- 接入实时 ASR 与流式 TTS（降低延迟）
- 情绪标签 → SSML 参数映射
- 多角色同场对话与剧情节点推进
