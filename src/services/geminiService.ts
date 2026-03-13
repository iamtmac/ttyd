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
          }
        },
        required: ["companyName", "onePageTeaser", "founderBackground", "marketAnalysis", "financials", "risks", "highlights", "industrialPromotion"]
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
