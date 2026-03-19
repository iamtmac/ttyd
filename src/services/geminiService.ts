import { GoogleGenAI, Type } from "@google/genai";
import { InvestmentAnalysis, MeetingMinutes, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateMeetingMinutes(audioBase64: string, mimeType: string): Promise<MeetingMinutes> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-native-audio-preview-12-2025",
    contents: [
      {
        parts: [
          { inlineData: { data: audioBase64, mimeType } },
          { text: "你是一个专业的投研秘书。请听这段会议录音，并生成详细的会议纪要。包括会议标题、日期、参与人、摘要、关键决策和待办事项。请以JSON格式输出。" }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          date: { type: Type.STRING },
          participants: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          keyDecisions: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING },
                owner: { type: Type.STRING },
                deadline: { type: Type.STRING }
              }
            }
          },
          transcript: { type: Type.STRING, description: "录音的全文转录" }
        },
        required: ["title", "summary", "keyDecisions", "actionItems", "transcript"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as MeetingMinutes;
  } catch (e) {
    console.error("Failed to parse meeting minutes", e);
    throw new Error("会议纪要生成失败");
  }
}

export async function chatWithAI(messages: ChatMessage[], context?: string): Promise<string> {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: `你是一个资深的一级市场投资专家。${context ? `当前正在讨论的背景信息如下: ${context}` : ""}`
    }
  });

  const lastMessage = messages[messages.length - 1];
  const response = await chat.sendMessage({ message: lastMessage.text });
  return response.text || "抱歉，我无法回答这个问题。";
}

export async function analyzeInvestmentDocument(content: string, fileName: string): Promise<InvestmentAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          { text: `你是一个资深的国资背景风险投资（VC）分析师和招商引资专家。请分析以下商业计划书（BP）或相关文档的内容，并从“财务投资”和“产业招商”双重维度提取结构化信息。
          
          特别关注：
          1. 产业链匹配：该项目如何补齐当地产业链？
          2. 落地意愿：文档中是否有新建厂房、扩张产能、寻找地方政府支持的信号？
          3. 社会效益：预计带来的税收、就业和产值拉动。
          4. 投前初筛材料：请严格按照以下模板生成“投前初筛材料”：
             一、企业团队介绍
             - 核心管理层概览：明确核心岗位、姓名及核心定位。
             - 关键人物详情：逐一说明行业经验年限、过往核心履历、核心成就、专业资质。
             - 团队优势总结：提炼团队整体竞争力。
             二、行业分析
             - 行业产业链拆解：按“上游-中游-下游”分层说明。
             - 各环节竞争格局：分析市场竞争特点、头部玩家及话语权。
             - 行业发展趋势：总结核心发展方向。
             三、竞争分析
             - 行业竞争态势总述：竞争激烈程度、核心维度。
             - 核心竞争对手分析：主要对手优势、布局及差距。
             - 目标企业竞争优势/劣势：核心竞争力及短板。
             - 竞争壁垒总结：进入壁垒及企业构建情况。
             四、投资风险
             - 行业层面风险：共性风险。
             - 企业层面风险：特异性风险。
             - 资本市场层面风险：上市、估值、流动性风险。
             - 风险影响程度及提示：明确潜在影响（短期/长期、轻度/重度），给出决策提示。

          文档名称: ${fileName}\n\n内容: ${content.substring(0, 30000)}` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          onePageTeaser: { type: Type.STRING, description: "一页纸项目简介" },
          founderBackground: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                education: { type: Type.STRING },
                experience: { type: Type.STRING },
                keyStrength: { type: Type.STRING }
              },
              required: ["name", "experience"]
            }
          },
          marketAnalysis: {
            type: Type.OBJECT,
            properties: {
              size: { type: Type.STRING },
              growth: { type: Type.STRING },
              competitors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    advantage: { type: Type.STRING },
                    disadvantage: { type: Type.STRING }
                  }
                }
              }
            }
          },
          financials: {
            type: Type.OBJECT,
            properties: {
              revenue: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    year: { type: Type.STRING },
                    amount: { type: Type.NUMBER }
                  }
                }
              },
              burnRate: { type: Type.STRING },
              valuationExpectation: { type: Type.STRING }
            }
          },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
          industrialPromotion: {
            type: Type.OBJECT,
            properties: {
              fitScore: { type: Type.NUMBER, description: "本地产业契合度评分 (0-100)" },
              fitReasoning: { type: Type.STRING, description: "补链延链逻辑分析" },
              relocationSignal: {
                type: Type.OBJECT,
                properties: {
                  intensity: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendation: { type: Type.STRING }
                }
              },
              policyMatching: {
                type: Type.OBJECT,
                properties: {
                  qualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                  matchedPolicies: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        benefit: { type: Type.STRING }
                      }
                    }
                  },
                  negotiationChips: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              roiPrediction: {
                type: Type.OBJECT,
                properties: {
                  taxRevenue: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        year: { type: Type.STRING },
                        amount: { type: Type.NUMBER }
                      }
                    }
                  },
                  employment: { type: Type.NUMBER },
                  industrialOutput: { type: Type.STRING }
                }
              }
            }
          },
          preliminaryScreening: {
            type: Type.OBJECT,
            properties: {
              team: {
                type: Type.OBJECT,
                properties: {
                  managementOverview: { type: Type.STRING },
                  keyPersonnel: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        experience: { type: Type.STRING },
                        background: { type: Type.STRING },
                        achievements: { type: Type.STRING },
                        qualifications: { type: Type.STRING }
                      }
                    }
                  },
                  teamAdvantages: { type: Type.STRING }
                }
              },
              industry: {
                type: Type.OBJECT,
                properties: {
                  chainAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                      upstream: { type: Type.STRING },
                      midstream: { type: Type.STRING },
                      downstream: { type: Type.STRING }
                    }
                  },
                  competitionLandscape: {
                    type: Type.OBJECT,
                    properties: {
                      upstream: { type: Type.STRING },
                      midstream: { type: Type.STRING },
                      downstream: { type: Type.STRING }
                    }
                  },
                  trends: { type: Type.STRING }
                }
              },
              competition: {
                type: Type.OBJECT,
                properties: {
                  overallStatus: { type: Type.STRING },
                  competitors: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        advantages: { type: Type.STRING },
                        layout: { type: Type.STRING },
                        gap: { type: Type.STRING }
                      }
                    }
                  },
                  targetAdvantages: { type: Type.STRING },
                  targetDisadvantages: { type: Type.STRING },
                  barriers: { type: Type.STRING }
                }
              },
              risks: {
                type: Type.OBJECT,
                properties: {
                  industryRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  enterpriseRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  capitalMarketRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  impactAndTips: {
                    type: Type.OBJECT,
                    properties: {
                      longTerm: { type: Type.STRING },
                      midTerm: { type: Type.STRING },
                      shortTerm: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        },
        required: ["companyName", "onePageTeaser", "founderBackground", "marketAnalysis", "financials", "risks", "highlights", "industrialPromotion", "preliminaryScreening"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as InvestmentAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("AI分析结果解析失败");
  }
}
