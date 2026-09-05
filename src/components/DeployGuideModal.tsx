import React, { useState } from 'react';
import { Github, X, Check, Copy, Download, Terminal, Globe, ShieldCheck } from 'lucide-react';
import { GameSaveData } from '../types';

interface DeployGuideModalProps {
  currentSave?: GameSaveData;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({
  currentSave,
  onClose,
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExportSave = () => {
    if (!currentSave) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentSave, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `qilian-adventure-save-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-stone-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-100">GitHub Pages 部署与项目指南</h3>
              <p className="text-xs text-stone-400">零外部 CDN / 零外部素材依赖 · 一键上线静态网页</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights for GitHub Pages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 flex flex-col gap-1">
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 零外链图片
            </div>
            <p className="text-stone-400">所有祁连山景、人物、风雪与营火均由 Canvas 纯代码程序化渲染。</p>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 flex flex-col gap-1">
            <div className="text-sky-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 零外链音频
            </div>
            <p className="text-stone-400">风声、步音、营火声与古风背景韵律均由 Web Audio API 原生振荡器生成。</p>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 flex flex-col gap-1">
            <div className="text-amber-400 font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> 相对路径配置
            </div>
            <p className="text-stone-400">Vite 配置已设为 base: './'，无论仓库名是什么，路径均不会 404。</p>
          </div>
        </div>

        {/* Step-by-Step GitHub Pages Deployment Guide */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm">
          <h4 className="font-bold text-stone-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>GitHub Pages 部署三步操作：</span>
          </h4>

          <div className="space-y-2.5">
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800">
              <div className="font-semibold text-amber-300 mb-1">
                第一步：上传代码至 GitHub 仓库
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                在 GitHub 创建新仓库（如 <code className="text-stone-300">qilian-adventure</code>），将本项目代码提交并 push 到 main 分支。
              </p>
            </div>

            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800">
              <div className="font-semibold text-amber-300 mb-1">
                第二步：在 GitHub 仓库开启 Pages 服务
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                进入仓库页面，点击上方导航栏的 <b className="text-stone-200">Settings</b> → 左侧侧边栏 <b className="text-stone-200">Pages</b>。
              </p>
              <p className="text-stone-400 text-xs leading-relaxed mt-1">
                在 <b>Build and deployment</b> 下的 <b>Source</b> 选择 <b>Deploy from a branch</b>，Branch 选择 <code className="text-stone-300">main</code>，目录选择 <code className="text-stone-300">/(root)</code> 或构建后的分支保存即可。
              </p>
            </div>

            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800">
              <div className="font-semibold text-amber-300 mb-1">
                第三步：访问即可开始冒险
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                等待 1-2 分钟，GitHub 会生成形如 <code className="text-stone-300">https://&lt;你的用户名&gt;.github.io/&lt;仓库名&gt;/</code> 的在线链接，点击即可畅玩！
              </p>
            </div>
          </div>
        </div>

        {/* Local Test Commands */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-stone-300">本地测试运行指令：</div>
          <div className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800 font-mono text-xs text-amber-300">
            <code>npm run build && npm run preview</code>
            <button
              onClick={() => copyToClipboard('npm run build && npm run preview', 'cmd')}
              className="text-stone-400 hover:text-stone-200 p-1"
            >
              {copied === 'cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Save Data Export */}
        {currentSave && (
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              当前冒险存档保存在浏览器 LocalStorage 中
            </span>
            <button
              onClick={handleExportSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>导出存档 JSON</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
