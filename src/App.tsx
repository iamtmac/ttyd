import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Search, 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight, 
  Loader2,
  Maximize2,
  MessageSquare,
  ArrowRight,
  PieChart,
  BarChart3,
  Network,
  Mic,
  Square,
  History,
  Send,
  User,
  Bot,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentFile, InvestmentAnalysis, ChatMessage, MeetingMinutes } from './types';
import { analyzeInvestmentDocument, generateMeetingMinutes, chatWithAI } from './services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

type AppMode = 'documents' | 'meetings' | 'chat' | 'dashboard';
type AnalysisTab = 'financial' | 'industrial' | 'screening' | 'comparison';

export default function App() {
  const [mode, setMode] = useState<AppMode>('dashboard');
  const [analysisTab, setAnalysisTab] = useState<AnalysisTab>('financial');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(['sim-1']);
  const [files, setFiles] = useState<DocumentFile[]>([
    {
      id: 'sim-1',
      name: '金数湾科技公共数据服务平台_BP.pdf',
      type: 'application/pdf',
      content: '【项目背景】金数湾科技致力于构建区域级公共数据授权运营平台，响应嘉兴市南湖区“数据要素×”行动计划。公司核心产品包括数据资产登记系统、隐私计算平台及行业数据空间。目前已与南湖基金小镇达成初步合作，旨在为金融机构提供精准的普惠金融数据支持。\n\n【市场机会】嘉兴市作为长三角一体化重要节点，拥有庞大的制造业集群，数据要素市场化需求迫切。南湖区正全力打造“金数湾”数据要素产业集聚区。\n\n【融资计划】本轮拟融资5000万元，主要用于研发投入及市场拓展。',
      status: 'completed',
      analysis: {
        companyName: '嘉兴金数湾科技有限公司',
        onePageTeaser: '深耕嘉兴南湖，打造长三角领先的数据要素市场化基础设施，通过公共数据授权运营，赋能普惠金融与智能制造。',
        highlights: ['数据要素×试点', '南湖区重点项目', '国资背景背书', '长三角一体化'],
        founderBackground: [
          {
            name: '张博士',
            education: '清华大学计算机博士',
            experience: '曾任阿里数据事业部资深架构师，拥有15年大数据处理经验。',
            keyStrength: '数据架构与隐私计算专家'
          },
          {
            name: '李总',
            education: '浙江大学MBA',
            experience: '嘉兴本地连续创业者，深谙本地政务数据运作体系。',
            keyStrength: '政企关系与市场拓展'
          }
        ],
        marketAnalysis: {
          size: '500亿',
          growth: '35%',
          competitors: [
            { name: '上海数据交易所', advantage: '国家级平台，资源广', disadvantage: '区域下沉服务能力有限' },
            { name: '杭州数梦工场', advantage: '政务云经验丰富', disadvantage: '数据要素运营切入较晚' }
          ]
        },
        financials: {
          revenue: [
            { year: '2023', amount: 1200 },
            { year: '2024', amount: 2800 },
            { year: '2025(E)', amount: 6500 }
          ],
          burnRate: '150万/月',
          valuationExpectation: '5.5亿'
        },
        risks: [
          '数据合规政策变动风险',
          '跨区域数据流通壁垒',
          '技术迭代压力'
        ],
        industrialPromotion: {
          fitScore: 95,
          fitReasoning: '该项目完美契合南湖区“数字经济一号工程”及“金数湾”数据要素产业集聚区规划。作为基础设施类项目，能有效吸引上下游数据服务商入驻，形成产业集群效应。',
          relocationSignal: {
            intensity: 'high',
            evidence: ['已在南湖区完成工商注册', '核心团队已入驻嘉兴科技城', '与本地国资平台有深度合作意向'],
            recommendation: '建议由区招商局牵头，协调大数据局开放更多授权运营场景，加速项目落地。'
          },
          policyMatching: {
            qualifications: ['国家高新技术企业', '浙江省专精特新中小企业', '南湖区领军人才企业'],
            matchedPolicies: [
              { name: '南湖区数字经济专项扶持', benefit: '最高300万研发补助' },
              { name: '金数湾入驻租金减免', benefit: '三年免租，两年减半' }
            ],
            negotiationChips: ['提供政务数据授权试点', '引导南湖产业基金直投', '协助对接本地银行普惠金融业务']
          },
          roiPrediction: {
            taxRevenue: [
              { year: '2025', amount: 450 },
              { year: '2026', amount: 1200 },
              { year: '2027', amount: 2500 }
            ],
            employment: 150,
            industrialOutput: '带动相关产业产值超10亿元'
          }
        },
        preliminaryScreening: {
          team: {
            managementOverview: '公司核心管理团队由创始人张博士、李总及技术副总裁王工组成，均具备10年以上数据要素与隐私计算行业经验。',
            keyPersonnel: [
              {
                name: '张博士',
                role: '创始人 & CEO',
                experience: '15年',
                background: '清华大学计算机博士，曾任阿里数据事业部资深架构师。',
                achievements: '主导研发了国内首个商用级隐私计算平台，拥有20余项核心专利。',
                qualifications: '高级工程师，国家科技进步二等奖获得者。'
              },
              {
                name: '李总',
                role: '联合创始人 & 市场负责人',
                experience: '12年',
                background: '浙江大学MBA，嘉兴本地资深创业者。',
                achievements: '成功搭建嘉兴市首个政务数据共享交换体系，覆盖30余个政府部门。',
                qualifications: '嘉兴市领军人才，优秀创业导师。'
              }
            ],
            teamAdvantages: '团队具备极强的“技术+市场”双轮驱动能力，既有顶尖的技术研发实力，又深谙本地政务数据运作逻辑，形成了极高的竞争门槛。'
          },
          industry: {
            chainAnalysis: {
              upstream: '数据提供方（政府部门、公共企事业单位、互联网平台等）。',
              midstream: '数据要素运营商（数据清洗、脱敏、资产登记、隐私计算等服务商）。',
              downstream: '数据应用方（金融机构、制造企业、智慧城市建设方等）。'
            },
            competitionLandscape: {
              upstream: '资源高度集中在政府手中，准入门槛高。',
              midstream: '目前处于群雄逐鹿阶段，技术领先与场景落地能力是核心。',
              downstream: '需求旺盛但碎片化，需要极强的行业理解能力。'
            },
            trends: '数据要素市场化已上升为国家战略，隐私计算与授权运营成为核心技术路径，行业正从“实验期”迈入“爆发期”。'
          },
          competition: {
            overallStatus: '行业竞争日益激烈，但区域性数据要素运营仍存在蓝海机会。',
            competitors: [
              {
                name: '上海数据交易所',
                advantages: '国家级平台，品牌影响力大，资源整合能力强。',
                layout: '覆盖全国，重点关注大宗数据交易。',
                gap: '在区域下沉服务和特定行业（如普惠金融）的精细化运营上存在不足。'
              },
              {
                name: '数梦工场',
                advantages: '深耕政务云多年，技术底座扎实。',
                layout: '主要服务于省级政务大脑。',
                gap: '在数据要素的市场化变现与商业模式创新上起步较晚。'
              }
            ],
            targetAdvantages: '拥有南湖区独家授权试点，技术架构更贴合金融场景需求，响应速度快。',
            targetDisadvantages: '品牌知名度尚在提升中，跨区域扩张面临地方保护壁垒。',
            barriers: '技术壁垒（隐私计算算法）、资源壁垒（政府授权）、场景壁垒（金融机构深度集成）。'
          },
          risks: {
            industryRisks: ['数据安全政策收紧', '行业标准尚未统一'],
            enterpriseRisks: ['核心技术人才流失', '市场拓展不及预期'],
            capitalMarketRisks: ['估值回调风险', '上市政策变动'],
            impactAndTips: {
              longTerm: '政策风险是核心，需持续关注国家数据局动向。',
              midTerm: '市场竞争加剧，需快速建立行业壁垒。',
              shortTerm: '现金流管理，需加快商业化落地。'
            }
          }
        }
      },
      meetingMinutes: {
        title: '金数湾项目投决预备会',
        date: '2026-03-10',
        participants: ['投资部王总', '招商局李处', '金数湾张博士', '财务顾问陈经理'],
        summary: '会议重点讨论了金数湾项目在南湖区的落地细节。张博士介绍了平台的技术架构及目前在金融场景的试点情况。招商局李处明确了南湖区对数据要素产业的支持态度，并就办公场地及人才补贴进行了初步沟通。',
        keyDecisions: [
          '启动对金数湾项目的尽职调查',
          '初步确定入驻南湖基金小镇二期办公区',
          '由招商局协调大数据局进行数据合规性评估'
        ],
        actionItems: [
          { task: '提交近三年财务审计报告', owner: '张博士', deadline: '2026-03-20' },
          { task: '起草招商引资协议草案', owner: '李处', deadline: '2026-03-25' },
          { task: '安排实地考察杭州研发中心', owner: '王总', deadline: '2026-03-18' }
        ],
        transcript: '王总：张博士，请先介绍一下你们在南湖区的具体落地计划。\n张博士：好的。我们计划将总部整体搬迁至南湖区金数湾，并在本地组建超过100人的研发与运营团队。目前我们已经和本地几家农商行谈妥了数据赋能的试点。\n李处：南湖区非常欢迎这类高技术含量的项目。我们会提供全方位的政策支持，包括人才公寓和研发补贴。\n陈经理：财务方面，我们本轮融资的5000万将主要用于隐私计算实验室的建设。'
      }
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'chat-1',
      role: 'user',
      text: '南湖区对于数据要素类企业有哪些具体的招商优惠政策？',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: 'chat-2',
      role: 'model',
      text: '根据嘉兴市南湖区最新的数字经济扶持政策，针对“金数湾”入驻企业，主要有以下优惠：\n1. **租金补贴**：符合条件的企业可享受“三免两减半”政策。\n2. **研发奖励**：对新认定的国家高新技术企业给予一次性奖励，并按研发投入比例给予最高300万元补助。\n3. **人才支持**：入选“南湖英才”计划的创业团队，可获得最高1000万元的项目资助。\n4. **数据特区**：优先获得南湖区公共数据授权运营试点资格。',
      timestamp: new Date(Date.now() - 86300000)
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedFiles = files.filter(f => selectedFileIds.includes(f.id));
  const activeFile = selectedFiles.length === 1 ? selectedFiles[0] : null;

  const toggleFileSelection = (id: string, isMeeting: boolean) => {
    setSelectedFileIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(fid => fid !== id);
        return next;
      } else {
        return [...prev, id];
      }
    });
    setMode(isMeeting ? 'meetings' : 'documents');
  };

  // Dashboard Stats (Mock data for demo - Jiaxing Nanhu Context)
  const dashboardStats = {
    totalProjects: files.length + 24, // Adding some historical count
    chainCompletion: 72,
    conversionRate: 15.8,
    taxRevenueForecast: 12800, // in 10k
    pipeline: [
      { name: '数字经济', count: 18, color: '#10b981' },
      { name: '微电子', count: 12, color: '#6366f1' },
      { name: '智能装备', count: 9, color: '#f59e0b' },
      { name: '生物医药', count: 7, color: '#ef4444' },
    ]
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (selectedFileIds.length > 1) {
      setAnalysisTab('comparison');
    } else if (selectedFileIds.length === 1 && analysisTab === 'comparison') {
      setAnalysisTab('financial');
    }
  }, [selectedFileIds.length]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    setMode('documents');
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const reader = new FileReader();
      
      const filePromise = new Promise<DocumentFile>((resolve) => {
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          const newFile: DocumentFile = {
            id: Math.random().toString(36).substring(7),
            name: file.name,
            type: file.type,
            content: content,
            status: 'processing'
          };
          resolve(newFile);
        };
        reader.readAsText(file);
      });

      const docFile = await filePromise;
      setFiles(prev => [...prev, docFile]);
      setSelectedFileIds([docFile.id]);

      try {
        const analysis = await analyzeInvestmentDocument(docFile.content, docFile.name);
        setFiles(prev => prev.map(f => f.id === docFile.id ? { ...f, status: 'completed', analysis } : f));
      } catch (error) {
        console.error(error);
        setFiles(prev => prev.map(f => f.id === docFile.id ? { ...f, status: 'error' } : f));
      }
    }
    setIsUploading(false);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          const newMeeting: DocumentFile = {
            id: Math.random().toString(36).substring(7),
            name: `会议录音 ${new Date().toLocaleString()}`,
            type: 'audio/webm',
            content: '',
            status: 'processing'
          };
          setFiles(prev => [...prev, newMeeting]);
          setSelectedFileIds([newMeeting.id]);
          setMode('meetings');

          try {
            const minutes = await generateMeetingMinutes(base64Audio, 'audio/webm');
            setFiles(prev => prev.map(f => f.id === newMeeting.id ? { ...f, status: 'completed', meetingMinutes: minutes } : f));
          } catch (error) {
            console.error(error);
            setFiles(prev => prev.map(f => f.id === newMeeting.id ? { ...f, status: 'error' } : f));
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await chatWithAI([...chatMessages, userMsg], activeFile?.analysis?.onePageTeaser);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-[#F5F5F0] text-[#1A1A1A] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black/5 flex flex-col bg-white/50 backdrop-blur-sm">
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">投投有道</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-semibold">Digital Employee v1.0</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-black/40 font-bold px-2 mb-2">Workspace</div>
          <button 
            onClick={() => setMode('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'dashboard' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
          >
            <LayoutDashboard size={18} />
            招投一体驾驶舱
          </button>
          <button 
            onClick={() => {
              setMode('documents');
              setSelectedFileIds([]);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'documents' && selectedFileIds.length === 0 ? 'bg-black text-white' : 'hover:bg-black/5'}`}
          >
            <FileText size={18} />
            项目处理中心
          </button>
          <button 
            onClick={() => {
              setMode('meetings');
              setSelectedFileIds([]);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'meetings' && selectedFileIds.length === 0 ? 'bg-black text-white' : 'hover:bg-black/5'}`}
          >
            <Mic size={18} />
            会议纪要录音
          </button>
          <button 
            onClick={() => setMode('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'chat' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
          >
            <MessageSquare size={18} />
            智能问答对话
          </button>
          
          <div className="mt-8 text-[10px] uppercase tracking-widest text-black/40 font-bold px-2 mb-2">History</div>
          {files.map(file => (
            <div 
              key={file.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${selectedFileIds.includes(file.id) ? 'bg-black/5 font-medium' : 'hover:bg-black/5 text-black/60'}`}
            >
              <input 
                type="checkbox" 
                checked={selectedFileIds.includes(file.id)}
                onChange={() => toggleFileSelection(file.id, !!file.meetingMinutes)}
                className="w-4 h-4 rounded border-black/20 text-black focus:ring-black cursor-pointer"
              />
              <button 
                onClick={() => {
                  setSelectedFileIds([file.id]);
                  setMode(file.meetingMinutes ? 'meetings' : 'documents');
                }}
                className="flex-1 flex items-center gap-3 truncate text-left"
              >
                {file.meetingMinutes ? <Mic size={16} /> : <FileText size={16} />}
                <span className="truncate">{file.name}</span>
                {file.status === 'processing' && <Loader2 size={12} className="animate-spin ml-auto" />}
              </button>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5 space-y-2">
          <button 
            onClick={() => {
              setMode('documents');
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.onchange = (e) => handleFileUpload(e as any);
              input.click();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-black/10 rounded-2xl text-sm font-semibold hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <Upload size={18} />
            上传文档
          </button>
          {isRecording ? (
            <button 
              onClick={stopRecording}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-2xl text-sm font-semibold hover:bg-red-600 transition-all shadow-lg animate-pulse"
            >
              <Square size={18} />
              停止录音 ({formatTime(recordingTime)})
            </button>
          ) : (
            <button 
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-2xl text-sm font-semibold hover:bg-black/80 transition-all shadow-sm"
            >
              <Mic size={18} />
              开启会议录音
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {mode === 'dashboard' ? (
          <div className="flex-1 flex flex-col bg-[#F9F9F7] overflow-y-auto">
            <header className="h-14 border-b border-black/5 flex items-center px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <LayoutDashboard size={18} className="text-black/40" />
                <h2 className="text-sm font-bold uppercase tracking-widest">招投一体驾驶舱</h2>
              </div>
            </header>
            
            <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: '在审项目总数', value: dashboardStats.totalProjects, icon: FileText, color: 'text-blue-600' },
                  { label: '产业链补链进度', value: `${dashboardStats.chainCompletion}%`, icon: Network, color: 'text-emerald-600' },
                  { label: '招商落地转化率', value: `${dashboardStats.conversionRate}%`, icon: TrendingUp, color: 'text-violet-600' },
                  { label: '预估年度税收 (万元)', value: dashboardStats.taxRevenueForecast, icon: BarChart3, color: 'text-amber-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl bg-black/5 ${stat.color}`}>
                        <stat.icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Live Update</span>
                    </div>
                    <p className="text-3xl font-bold tracking-tight mb-1">{stat.value}</p>
                    <p className="text-xs font-medium text-black/40">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Pipeline Chart */}
                <div className="col-span-2 bg-white rounded-[40px] p-8 border border-black/5 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold">重点产业链分布</h3>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">查看详细报告</button>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardStats.pipeline} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#00000005" />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 12, fontWeight: 600}}
                          width={80}
                        />
                        <Tooltip cursor={{fill: '#00000005'}} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                          {dashboardStats.pipeline.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Industrial Map Placeholder */}
                <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-sm overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">产业园区动态地图</h3>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1 bg-[#F5F5F0] rounded-3xl relative overflow-hidden border border-black/5 group">
                    {/* Mock Map SVG */}
                    <svg viewBox="0 0 200 200" className="w-full h-full opacity-40">
                      <path d="M20,20 L180,20 L180,180 L20,180 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      <path d="M20,60 L180,60 M20,120 L180,120 M60,20 L60,180 M120,20 L120,180" stroke="currentColor" strokeWidth="0.2" />
                    </svg>
                    {/* Pins */}
                    {[
                      { x: '30%', y: '40%', color: 'bg-emerald-500', name: '经开区' },
                      { x: '70%', y: '20%', color: 'bg-blue-500', name: '高新区' },
                      { x: '50%', y: '70%', color: 'bg-amber-500', name: '自贸区' },
                    ].map((pin, i) => (
                      <div key={i} className="absolute" style={{ left: pin.x, top: pin.y }}>
                        <div className={`w-3 h-3 ${pin.color} rounded-full border-2 border-white shadow-lg animate-bounce`} />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-white rounded-md text-[8px] font-bold shadow-sm whitespace-nowrap">
                          {pin.name}
                        </div>
                      </div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold">进入全屏地图模式</button>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] text-black/40 font-medium leading-relaxed">
                    当前共有 <span className="text-black font-bold">12</span> 个项目处于“选址考察”阶段，重点分布在经开区新能源产业园。
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : mode === 'chat' ? (
          <div className="flex-1 flex flex-col bg-white">
            <header className="h-14 border-b border-black/5 flex items-center px-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-black/40" />
                <h2 className="text-sm font-bold uppercase tracking-widest">智能问答对话</h2>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 bg-black/5 rounded-3xl flex items-center justify-center">
                    <Bot size={32} className="text-black/20" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">我是您的一级市场助手</h3>
                    <p className="text-sm text-black/40 max-w-xs">您可以询问关于行业趋势、尽调方法或特定项目的分析建议。</p>
                  </div>
                </div>
              )}
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-black text-white' : 'bg-emerald-500 text-white'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-[#F5F5F0] text-black rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 bg-[#F5F5F0] rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-black/20" />
                      <span className="text-xs text-black/40 font-medium">正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 border-t border-black/5">
              <div className="max-w-4xl mx-auto relative">
                <textarea 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="输入您的问题或指令..." 
                  className="w-full pl-6 pr-16 py-4 bg-[#F5F5F0] rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none min-h-[60px]"
                  rows={1}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="absolute right-3 bottom-3 p-3 bg-black text-white rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : mode === 'meetings' ? (
          <div className="flex-1 flex flex-col bg-white">
            <header className="h-14 border-b border-black/5 flex items-center px-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Mic size={18} className="text-black/40" />
                <h2 className="text-sm font-bold uppercase tracking-widest">会议纪要录音</h2>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-12 bg-[#F9F9F7]">
              {activeFile?.meetingMinutes ? (
                <div className="max-w-4xl mx-auto space-y-8">
                  <button 
                    onClick={() => setSelectedFileIds([])}
                    className="flex items-center gap-2 text-xs font-bold text-black/40 hover:text-black transition-colors mb-4"
                  >
                    <ArrowRight size={14} className="rotate-180" />
                    返回会议列表
                  </button>
                  <div className="bg-white rounded-[40px] p-12 shadow-sm border border-black/5">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="flex items-center gap-2 text-black/40 mb-2">
                          <Calendar size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{activeFile.meetingMinutes.date}</span>
                        </div>
                        <h3 className="text-4xl font-bold tracking-tight">{activeFile.meetingMinutes.title}</h3>
                      </div>
                      <div className="flex -space-x-2">
                        {activeFile.meetingMinutes.participants.map((p, i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-black text-white border-2 border-white flex items-center justify-center text-xs font-bold" title={p}>
                            {p[0]}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <section>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">会议摘要</h4>
                        <p className="text-lg leading-relaxed text-black/80 font-serif italic">
                          "{activeFile.meetingMinutes.summary}"
                        </p>
                      </section>

                      <div className="grid grid-cols-2 gap-8">
                        <section>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">关键决策</h4>
                          <ul className="space-y-3">
                            {activeFile.meetingMinutes.keyDecisions.map((d, i) => (
                              <li key={i} className="flex gap-3 items-start">
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{d}</p>
                              </li>
                            ))}
                          </ul>
                        </section>
                        <section>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">待办事项</h4>
                          <div className="space-y-3">
                            {activeFile.meetingMinutes.actionItems.map((item, i) => (
                              <div key={i} className="p-4 bg-[#F5F5F0] rounded-2xl border border-black/5">
                                <p className="text-sm font-bold mb-1">{item.task}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-black/40 uppercase">Owner: {item.owner}</span>
                                  <span className="text-[10px] font-bold text-red-500 uppercase">Due: {item.deadline}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>

                      <section className="pt-8 border-t border-black/5">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">录音转录全文</h4>
                        <div className="bg-[#F5F5F0] p-6 rounded-2xl text-xs leading-relaxed text-black/60 max-h-60 overflow-y-auto">
                          {activeFile.meetingMinutes.transcript}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              ) : activeFile?.status === 'processing' ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Loader2 size={48} className="animate-spin text-black/20" />
                  <div className="text-center">
                    <p className="font-bold text-lg">正在生成会议纪要...</p>
                    <p className="text-sm text-black/40">正在转录音频并提取关键决策与待办事项</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-bold tracking-tight">会议纪要存档</h3>
                      <p className="text-sm text-black/40">管理并查阅所有已录制的项目访谈与内部会议</p>
                    </div>
                    <button 
                      onClick={startRecording}
                      className="px-6 py-3 bg-black text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <Mic size={18} />
                      开启新录音
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {files.filter(f => f.meetingMinutes).map(file => (
                      <button 
                        key={file.id}
                        onClick={() => {
                          setSelectedFileIds([file.id]);
                          setMode('meetings');
                        }}
                        className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm hover:shadow-md transition-all text-left group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-black/5 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                            <Mic size={20} />
                          </div>
                          <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{file.meetingMinutes?.date}</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors">{file.meetingMinutes?.title}</h4>
                        <p className="text-xs text-black/40 line-clamp-2 mb-4">{file.meetingMinutes?.summary}</p>
                        <div className="flex items-center gap-2">
                          {file.meetingMinutes?.participants.slice(0, 3).map((p, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-[8px] font-bold border border-white">
                              {p[0]}
                            </div>
                          ))}
                          {file.meetingMinutes && file.meetingMinutes.participants.length > 3 && (
                            <span className="text-[8px] font-bold text-black/20">+{file.meetingMinutes.participants.length - 3}</span>
                          )}
                        </div>
                      </button>
                    ))}
                    {files.filter(f => f.meetingMinutes).length === 0 && (
                      <div className="col-span-2 py-20 text-center bg-white rounded-[40px] border border-dashed border-black/10">
                        <Mic size={40} className="mx-auto text-black/10 mb-4" />
                        <p className="text-sm text-black/40 font-medium">暂无会议录音记录</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Document Viewer */}
            <section className="w-1/2 border-r border-black/5 flex flex-col bg-white">
              <header className="h-14 border-b border-black/5 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-black/40" />
                  <h2 className="text-sm font-semibold truncate max-w-[300px]">{activeFile?.name || '项目库概览'}</h2>
                </div>
                {activeFile && (
                  <button 
                    onClick={() => setSelectedFileIds([])}
                    className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                  >
                    返回列表
                  </button>
                )}
              </header>
              <div className="flex-1 overflow-y-auto p-12 bg-[#F9F9F7]">
                {activeFile ? (
                  <div className="max-w-2xl mx-auto bg-white shadow-2xl shadow-black/5 p-16 min-h-[1000px] rounded-sm border border-black/5">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-black/70">
                        {activeFile.content}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-3xl font-bold tracking-tight">项目库概览</h3>
                        <p className="text-sm text-black/40">管理并深度研判所有已上传的商业计划书与行业报告</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {files.filter(f => f.analysis).map(file => (
                        <button 
                          key={file.id}
                          onClick={() => setSelectedFileIds([file.id])}
                          className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-6 group"
                        >
                          <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                            <FileText size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold truncate">{file.analysis?.companyName}</h4>
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold uppercase rounded-full border border-emerald-100">
                                Fit: {file.analysis?.industrialPromotion?.fitScore}
                              </span>
                            </div>
                            <p className="text-xs text-black/40 line-clamp-1">{file.analysis?.onePageTeaser}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Valuation</p>
                            <p className="text-sm font-mono font-bold">{file.analysis?.financials.valuationExpectation}</p>
                          </div>
                          <ChevronRight size={20} className="text-black/10 group-hover:text-black transition-colors" />
                        </button>
                      ))}
                      {files.filter(f => f.analysis).length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-black/10">
                          <FileText size={40} className="mx-auto text-black/10 mb-4" />
                          <p className="text-sm text-black/40 font-medium">暂无项目分析记录</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Right: AI Analysis Panel */}
            <section className="w-1/2 flex flex-col bg-[#F5F5F0] overflow-y-auto">
              <header className="h-14 border-b border-black/5 flex items-center justify-between px-6 bg-[#F5F5F0]/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">AI 智能分析引擎</h2>
                </div>
                <div className="flex bg-black/5 p-1 rounded-xl">
                  <button 
                    onClick={() => setAnalysisTab('financial')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${analysisTab === 'financial' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
                  >
                    财务与投资视角
                  </button>
                  <button 
                    onClick={() => setAnalysisTab('industrial')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${analysisTab === 'industrial' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
                  >
                    产业与招商视角
                  </button>
                  <button 
                    onClick={() => setAnalysisTab('screening')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${analysisTab === 'screening' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
                  >
                    投前初筛材料
                  </button>
                  <button 
                    onClick={() => setAnalysisTab('comparison')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${analysisTab === 'comparison' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
                  >
                    项目对比
                  </button>
                </div>
              </header>

              <div className="p-8 space-y-8">
                {selectedFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                    <LayoutDashboard size={48} className="mb-4" />
                    <p className="font-bold">等待文档分析</p>
                  </div>
                ) : selectedFiles.some(f => f.status === 'processing') ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 size={48} className="animate-spin text-black/20" />
                    <div className="text-center">
                      <p className="font-bold text-lg">正在深度解析文档...</p>
                      <p className="text-sm text-black/40">正在提取核心数据、创始人背景及市场竞争格局</p>
                    </div>
                  </div>
                ) : selectedFiles.every(f => f.analysis) ? (
                  <AnimatePresence mode="wait">
                    {analysisTab === 'financial' && activeFile ? (
                      <motion.div 
                        key="financial"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                      >
                        {/* Teaser Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h3 className="text-3xl font-bold tracking-tight mb-2">{activeFile.analysis?.companyName}</h3>
                              <div className="flex gap-2">
                                {activeFile.analysis?.highlights.map((h, i) => (
                                  <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                                    {h}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Valuation Expectation</p>
                              <p className="text-xl font-mono font-bold">{activeFile.analysis?.financials.valuationExpectation}</p>
                            </div>
                          </div>
                          <p className="text-lg leading-relaxed text-black/80 font-serif italic">
                            "{activeFile.analysis?.onePageTeaser}"
                          </p>
                        </div>

                        {/* Founder Grid */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users size={18} />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">核心团队构成</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {activeFile.analysis.founderBackground.map((founder, i) => (
                              <div key={i} className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center font-bold text-black/40">
                                    {founder.name[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">{founder.name}</p>
                                    <p className="text-[10px] text-black/40">{founder.education}</p>
                                  </div>
                                </div>
                                <p className="text-xs text-black/60 leading-relaxed mb-3">{founder.experience}</p>
                                <div className="pt-3 border-t border-black/5">
                                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Core Strength</p>
                                  <p className="text-xs font-medium">{founder.keyStrength}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financials Chart */}
                        <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                              <BarChart3 size={18} />
                              <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">财务预测与烧钱率</h4>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-black/40 uppercase font-bold">Monthly Burn</p>
                              <p className="font-mono font-bold">{activeFile.analysis.financials.burnRate}</p>
                            </div>
                          </div>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={activeFile.analysis.financials.revenue}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
                                <XAxis 
                                  dataKey="year" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fontSize: 10, fontWeight: 600}} 
                                />
                                <YAxis 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fontSize: 10, fontWeight: 600}}
                                />
                                <Tooltip 
                                  cursor={{fill: '#00000005'}}
                                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                                />
                                <Bar dataKey="amount" fill="#141414" radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Market & Risks */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <Network size={18} />
                              <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">市场竞争格局</h4>
                            </div>
                            <div className="space-y-4">
                              {activeFile.analysis.marketAnalysis.competitors.map((comp, i) => (
                                <div key={i} className="space-y-1">
                                  <p className="text-sm font-bold">{comp.name}</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 bg-emerald-50 rounded-lg">
                                      <p className="text-[8px] font-bold text-emerald-700 uppercase">Advantage</p>
                                      <p className="text-[10px]">{comp.advantage}</p>
                                    </div>
                                    <div className="p-2 bg-red-50 rounded-lg">
                                      <p className="text-[8px] font-bold text-red-700 uppercase">Weakness</p>
                                      <p className="text-[10px]">{comp.disadvantage}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <AlertTriangle size={18} className="text-amber-500" />
                              <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">风险点提示</h4>
                            </div>
                            <ul className="space-y-3">
                              {activeFile.analysis.risks.map((risk, i) => (
                                <li key={i} className="flex gap-2 items-start">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                  <p className="text-xs text-black/70 leading-relaxed">{risk}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ) : analysisTab === 'industrial' && activeFile ? (
                      <motion.div 
                        key="industrial"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        {/* Industrial Fit Score */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold tracking-tight">本地产业契合度分析</h3>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Fit Score</p>
                                <p className={`text-3xl font-bold ${activeFile.analysis.industrialPromotion?.fitScore && activeFile.analysis.industrialPromotion.fitScore > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {activeFile.analysis.industrialPromotion?.fitScore}
                                </p>
                              </div>
                              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                                <TrendingUp className="text-emerald-500" size={24} />
                              </div>
                            </div>
                          </div>
                          <div className="p-6 bg-[#F5F5F0] rounded-2xl border border-black/5">
                            <p className="text-sm leading-relaxed font-medium text-black/80">
                              {activeFile.analysis.industrialPromotion?.fitReasoning}
                            </p>
                          </div>
                        </div>

                        {/* Relocation Radar */}
                        <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                          <div className="flex items-center gap-2 mb-6">
                            <Maximize2 size={18} className="text-blue-500" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">落地/迁址意愿智能雷达</h4>
                          </div>
                          <div className="flex items-center gap-6 mb-6">
                            <div className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest ${
                              activeFile.analysis.industrialPromotion?.relocationSignal.intensity === 'high' ? 'bg-red-500 text-white' : 
                              activeFile.analysis.industrialPromotion?.relocationSignal.intensity === 'medium' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                            }`}>
                              {activeFile.analysis.industrialPromotion?.relocationSignal.intensity === 'high' ? '强烈迁址信号' : 
                               activeFile.analysis.industrialPromotion?.relocationSignal.intensity === 'medium' ? '中等迁址意愿' : '低迁址倾向'}
                            </div>
                            <p className="text-xs font-medium text-black/60 italic">
                              "{activeFile.analysis.industrialPromotion?.relocationSignal.recommendation}"
                            </p>
                          </div>
                          <div className="space-y-3">
                            {activeFile.analysis.industrialPromotion?.relocationSignal.evidence.map((ev, i) => (
                              <div key={i} className="flex gap-3 items-start p-3 bg-black/5 rounded-xl">
                                <Search size={14} className="text-black/40 mt-0.5" />
                                <p className="text-xs font-medium">{ev}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Policy Matching */}
                        <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                          <div className="flex items-center gap-2 mb-6">
                            <BarChart3 size={18} className="text-violet-500" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">招商政策一键打包</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">企业资质认定</p>
                              <div className="flex flex-wrap gap-2">
                                {activeFile.analysis.industrialPromotion?.policyMatching.qualifications.map((q, i) => (
                                  <span key={i} className="px-3 py-1 bg-violet-50 text-violet-700 text-[10px] font-bold rounded-full border border-violet-100">
                                    {q}
                                  </span>
                                ))}
                              </div>
                              <div className="pt-4 space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">谈判筹码建议</p>
                                {activeFile.analysis.industrialPromotion?.policyMatching.negotiationChips.map((chip, i) => (
                                  <div key={i} className="flex gap-2 items-center text-xs font-medium">
                                    <ArrowRight size={12} className="text-violet-500" />
                                    {chip}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">匹配政策方案</p>
                              {activeFile.analysis.industrialPromotion?.policyMatching.matchedPolicies.map((p, i) => (
                                <div key={i} className="p-4 bg-violet-50/50 rounded-2xl border border-violet-100">
                                  <p className="text-xs font-bold text-violet-900 mb-1">{p.name}</p>
                                  <p className="text-[10px] text-violet-700 font-medium">{p.benefit}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* ROI Prediction */}
                        <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                              <TrendingUp size={18} className="text-emerald-500" />
                              <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">落地效益 (ROI) 预测</h4>
                            </div>
                            <div className="flex gap-4">
                              <div className="text-right">
                                <p className="text-[10px] text-black/40 uppercase font-bold">带动就业</p>
                                <p className="font-mono font-bold text-emerald-600">+{activeFile.analysis.industrialPromotion?.roiPrediction.employment} 人</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-black/40 uppercase font-bold">产值拉动</p>
                                <p className="font-mono font-bold text-emerald-600">{activeFile.analysis.industrialPromotion?.roiPrediction.industrialOutput}</p>
                              </div>
                            </div>
                          </div>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={activeFile.analysis.industrialPromotion?.roiPrediction.taxRevenue}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600}} />
                                <Tooltip cursor={{fill: '#00000005'}} />
                                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <p className="mt-4 text-[10px] text-center text-black/40 font-bold uppercase tracking-widest">预计未来三年地方纳税额预测 (万元)</p>
                        </div>
                      </motion.div>
                    ) : analysisTab === 'screening' && activeFile ? (
                      <motion.div 
                        key="screening"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        {/* Section 1: Team */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                          <div className="flex items-center gap-2 mb-6">
                            <Users size={18} className="text-blue-500" />
                            <h3 className="text-xl font-bold tracking-tight">一、企业团队介绍</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="p-6 bg-[#F5F5F0] rounded-2xl border border-black/5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">核心管理层概览</p>
                              <p className="text-sm font-medium leading-relaxed">{activeFile.analysis.preliminaryScreening?.team.managementOverview}</p>
                            </div>
                            <div className="space-y-4">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">关键人物详情</p>
                              {activeFile.analysis.preliminaryScreening?.team.keyPersonnel.map((person, i) => (
                                <div key={i} className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm">
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h4 className="text-lg font-bold">{person.name}</h4>
                                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{person.role}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-black/40 bg-black/5 px-2 py-1 rounded-md">{person.experience}</span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4 text-xs">
                                    <div>
                                      <p className="font-bold text-black/40 uppercase mb-1">过往履历</p>
                                      <p className="text-black/70 leading-relaxed">{person.background}</p>
                                    </div>
                                    <div>
                                      <p className="font-bold text-black/40 uppercase mb-1">核心成就</p>
                                      <p className="text-black/70 leading-relaxed">{person.achievements}</p>
                                    </div>
                                    <div>
                                      <p className="font-bold text-black/40 uppercase mb-1">专业资质</p>
                                      <p className="text-black/70 leading-relaxed">{person.qualifications}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">团队优势总结</p>
                              <p className="text-sm font-medium leading-relaxed text-emerald-900">{activeFile.analysis.preliminaryScreening?.team.teamAdvantages}</p>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Industry */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                          <div className="flex items-center gap-2 mb-6">
                            <Network size={18} className="text-emerald-500" />
                            <h3 className="text-xl font-bold tracking-tight">二、行业分析</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                              {[
                                { label: '上游 (供给端)', content: activeFile.analysis.preliminaryScreening?.industry.chainAnalysis.upstream },
                                { label: '中游 (加工/开发端)', content: activeFile.analysis.preliminaryScreening?.industry.chainAnalysis.midstream },
                                { label: '下游 (需求/变现端)', content: activeFile.analysis.preliminaryScreening?.industry.chainAnalysis.downstream },
                              ].map((item, i) => (
                                <div key={i} className="p-4 bg-[#F5F5F0] rounded-2xl border border-black/5">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">{item.label}</p>
                                  <p className="text-xs leading-relaxed">{item.content}</p>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-4">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">各环节竞争格局</p>
                              <div className="grid grid-cols-1 gap-3">
                                {[
                                  { key: 'upstream', label: '上游环节' },
                                  { key: 'midstream', label: '中游环节' },
                                  { key: 'downstream', label: '下游环节' }
                                ].map((item) => (
                                  <div key={item.key} className="flex gap-4 items-start p-4 bg-white rounded-2xl border border-black/5">
                                    <div className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-widest text-black/40 pt-1">{item.label}</div>
                                    <p className="text-xs leading-relaxed">{(activeFile.analysis.preliminaryScreening?.industry.competitionLandscape as any)[item.key]}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700 mb-2">行业发展趋势</p>
                              <p className="text-sm font-medium leading-relaxed text-blue-900">{activeFile.analysis.preliminaryScreening?.industry.trends}</p>
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Competition */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                          <div className="flex items-center gap-2 mb-6">
                            <BarChart3 size={18} className="text-amber-500" />
                            <h3 className="text-xl font-bold tracking-tight">三、竞争分析</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="p-6 bg-[#F5F5F0] rounded-2xl border border-black/5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">行业竞争态势总述</p>
                              <p className="text-sm font-medium leading-relaxed">{activeFile.analysis.preliminaryScreening?.competition.overallStatus}</p>
                            </div>
                            <div className="space-y-4">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">核心竞争对手分析</p>
                              <div className="grid grid-cols-1 gap-4">
                                {activeFile.analysis.preliminaryScreening?.competition.competitors.map((comp, i) => (
                                  <div key={i} className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm">
                                    <h4 className="text-lg font-bold mb-3">{comp.name}</h4>
                                    <div className="grid grid-cols-3 gap-4 text-xs">
                                      <div>
                                        <p className="font-bold text-black/40 uppercase mb-1">核心优势</p>
                                        <p className="text-black/70">{comp.advantages}</p>
                                      </div>
                                      <div>
                                        <p className="font-bold text-black/40 uppercase mb-1">业务布局</p>
                                        <p className="text-black/70">{comp.layout}</p>
                                      </div>
                                      <div>
                                        <p className="font-bold text-black/40 uppercase mb-1">竞争差距</p>
                                        <p className="text-black/70">{comp.gap}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">目标企业竞争优势</p>
                                <p className="text-xs leading-relaxed text-emerald-900">{activeFile.analysis.preliminaryScreening?.competition.targetAdvantages}</p>
                              </div>
                              <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-red-700 mb-2">目标企业竞争劣势</p>
                                <p className="text-xs leading-relaxed text-red-900">{activeFile.analysis.preliminaryScreening?.competition.targetDisadvantages}</p>
                              </div>
                            </div>
                            <div className="p-6 bg-black text-white rounded-2xl">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">竞争壁垒总结</p>
                              <p className="text-sm font-medium leading-relaxed">{activeFile.analysis.preliminaryScreening?.competition.barriers}</p>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Risks */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                          <div className="flex items-center gap-2 mb-6">
                            <AlertTriangle size={18} className="text-red-500" />
                            <h3 className="text-xl font-bold tracking-tight">四、投资风险</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                              {[
                                { label: '行业层面风险', list: activeFile.analysis.preliminaryScreening?.risks.industryRisks },
                                { label: '企业层面风险', list: activeFile.analysis.preliminaryScreening?.risks.enterpriseRisks },
                                { label: '资本市场层面风险', list: activeFile.analysis.preliminaryScreening?.risks.capitalMarketRisks },
                              ].map((item, i) => (
                                <div key={i} className="p-6 bg-[#F5F5F0] rounded-2xl border border-black/5">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">{item.label}</p>
                                  <ul className="space-y-3">
                                    {item.list?.map((risk, j) => (
                                      <li key={j} className="flex gap-2 items-start">
                                        <div className="mt-1.5 w-1 h-1 rounded-full bg-black/20 shrink-0" />
                                        <p className="text-[10px] leading-relaxed text-black/60">{risk}</p>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <div className="p-8 bg-red-50 rounded-[32px] border border-red-100">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-red-700 mb-6">风险影响程度及提示</p>
                              <div className="grid grid-cols-3 gap-8">
                                {[
                                  { label: '长期重度风险', content: activeFile.analysis.preliminaryScreening?.risks.impactAndTips.longTerm },
                                  { label: '中期中度风险', content: activeFile.analysis.preliminaryScreening?.risks.impactAndTips.midTerm },
                                  { label: '短期轻度风险', content: activeFile.analysis.preliminaryScreening?.risks.impactAndTips.shortTerm },
                                ].map((item, i) => (
                                  <div key={i} className="space-y-2">
                                    <p className="text-xs font-bold text-red-900">{item.label}</p>
                                    <p className="text-[10px] leading-relaxed text-red-700/80">{item.content}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="comparison"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold tracking-tight">项目多维对比视图</h3>
                          <p className="text-xs text-black/40 font-bold uppercase tracking-widest">已选择 {selectedFiles.length} 个项目</p>
                        </div>
                        
                        <div className="overflow-x-auto pb-6 -mx-8 px-8">
                          <div className="flex gap-6 min-w-max">
                            {selectedFiles.map(file => (
                              <div key={file.id} className="w-[380px] shrink-0 space-y-6">
                                {/* Header */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-full -mr-12 -mt-12" />
                                  <h4 className="text-lg font-bold mb-2 relative z-10">{file.analysis?.companyName}</h4>
                                  <div className="flex gap-2 relative z-10">
                                    {file.analysis?.highlights.slice(0, 2).map((h, i) => (
                                      <span key={i} className="px-2 py-0.5 bg-black/5 text-[8px] font-bold uppercase rounded-full">
                                        {h}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Team */}
                                <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Users size={14} className="text-blue-500" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">团队背景</p>
                                  </div>
                                  <p className="text-xs leading-relaxed text-black/70 line-clamp-4">
                                    {file.analysis?.preliminaryScreening?.team.managementOverview}
                                  </p>
                                </div>

                                {/* Industry */}
                                <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Network size={14} className="text-emerald-500" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">行业趋势</p>
                                  </div>
                                  <p className="text-xs leading-relaxed text-black/70 line-clamp-4">
                                    {file.analysis?.preliminaryScreening?.industry.trends}
                                  </p>
                                </div>

                                {/* Competition */}
                                <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
                                  <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 size={14} className="text-amber-500" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">竞争优势</p>
                                  </div>
                                  <p className="text-xs leading-relaxed text-black/70 line-clamp-4">
                                    {file.analysis?.preliminaryScreening?.competition.targetAdvantages}
                                  </p>
                                </div>

                                {/* Risks */}
                                <div className="bg-white rounded-[32px] p-6 bg-red-50 border border-red-100 shadow-sm">
                                  <div className="flex items-center gap-2 mb-4">
                                    <AlertTriangle size={14} className="text-red-500" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">核心风险</p>
                                  </div>
                                  <p className="text-xs leading-relaxed text-red-900 font-medium">
                                    {file.analysis?.preliminaryScreening?.risks.impactAndTips.longTerm}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertTriangle className="text-red-500 mb-4" />
                    <p className="font-bold">分析失败</p>
                    <p className="text-sm text-black/40">请检查网络连接或重试</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Floating Chat Trigger (Only visible in non-chat modes) */}
      {mode !== 'chat' && (
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => setMode('chat')}
            className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          >
            <MessageSquare size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
