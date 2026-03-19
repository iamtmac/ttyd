# 招投一体数字员工 (Investment & Promotion AI Agent) - 本地运行指南

本项目是一个基于 React + Vite + Tailwind CSS 开发的高级招商引资管理系统。您可以按照以下步骤在本地环境中运行并查看系统。

## 1. 环境准备

在开始之前，请确保您的电脑已安装以下软件：
*   **Node.js**: 建议版本为 v18 或更高。您可以从 [nodejs.org](https://nodejs.org/) 下载安装。
*   **浏览器**: 建议使用 Chrome、Edge 或 Safari。

## 2. 快速开始

下载并解压 ZIP 文件后，请打开终端（Windows 使用 PowerShell 或 CMD，Mac 使用 Terminal），进入项目根目录执行以下命令：

### 第一步：安装依赖
```bash
npm install
```
*这将安装项目运行所需的所有库，如 React, Lucide-React, Tailwind CSS 等。*

### 第二步：启动开发服务器
```bash
npm run dev
```
*启动成功后，终端会显示一个本地地址（通常是 `http://localhost:3000`）。*

### 第三步：在浏览器中查看
打开浏览器，访问终端中显示的地址即可进入系统。

## 3. 项目结构说明

*   `src/App.tsx`: 系统的核心逻辑与 UI 界面。
*   `src/main.tsx`: 应用入口文件。
*   `src/index.css`: 全局样式与 Tailwind CSS 配置。
*   `package.json`: 项目依赖与运行脚本配置。
*   `DOCS.md`: 产品说明书与需求文档。

## 4. 注意事项

*   **AI 功能说明**: 本系统目前使用的是模拟数据进行演示。如果您需要接入真实的 Gemini AI 能力，请在本地环境变量中配置您的 `GEMINI_API_KEY`。
*   **端口占用**: 如果 3000 端口被占用，Vite 会自动尝试其他端口，请以终端输出的实际地址为准。

---

祝您使用愉快！如有任何技术问题，请参考项目中的 `DOCS.md` 文档。
