import React, { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Square,
  MessageCircle,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  HelpCircle,
  Sparkles,
  Users,
  Award,
} from "lucide-react";
import { SafetyCampaign } from "../types";

interface ToolboxTalkViewProps {
  campaign: SafetyCampaign;
}

export const ToolboxTalkView: React.FC<ToolboxTalkViewProps> = ({ campaign }) => {
  const { toolboxTalk, campaignTitle, slogan, coreRuleSummary } = campaign;
  const [timeLeft, setTimeLeft] = useState((toolboxTalk.durationMinutes || 4) * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      // Play brief soft chime or alert
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const totalChecks = toolboxTalk.handsOnChecklist?.length || 0;
  const completedChecks = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0;

  const handleCopyTalk = () => {
    const talkText = `TOOLBOX SAFETY TALK: ${campaignTitle}
Slogan: ${slogan}
Duration: ${toolboxTalk.durationMinutes} Minutes

OPENING HOOK:
${toolboxTalk.openingHook}

DISCUSSION & DEBRIEF QUESTIONS:
${toolboxTalk.discussionPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

HANDS-ON INSPECTION CHECKLIST:
${toolboxTalk.handsOnChecklist.map((c, i) => `[ ] ${c}`).join("\n")}

CREW PLEDGE:
"${toolboxTalk.crewPledge}"
`;
    navigator.clipboard.writeText(talkText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Top Banner & Timer Bar */}
      <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Supervisor Toolbox Talk &bull; Shift Debrief Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
            {campaignTitle}
          </h2>
          <p className="text-xs text-[#1C1C1C]/60 font-serif italic mt-1 max-w-xl">
            {coreRuleSummary}
          </p>
        </div>

        {/* 4-Minute Interactive Shift Timer */}
        <div className="p-4 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 flex items-center space-x-4 shrink-0">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1C1C]/50 block">
              Shift Timer
            </span>
            <span className={`text-2xl font-bold font-serif ${timeLeft === 0 ? "text-red-600" : timeLeft < 60 ? "text-[#FF5F1F] animate-pulse" : "text-[#1C1C1C]"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`p-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                timerActive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white"
              }`}
              title={timerActive ? "Pause Timer" : "Start 4-Min Timer"}
            >
              {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={() => {
                setTimerActive(false);
                setTimeLeft((toolboxTalk.durationMinutes || 4) * 60);
              }}
              className="p-2.5 rounded-sm bg-white hover:bg-[#F0EFEC] text-[#1C1C1C] border border-[#1C1C1C]/10 transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C]/50">
          Toolbox Module
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyTalk}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Talk"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sign-Off Sheet</span>
          </button>
        </div>
      </div>

      {/* 1. The Opening Hook (Icebreaker) */}
      <div className="p-6 sm:p-8 rounded-sm bg-[#FFF9F5] border-l-4 border-[#FF5F1F] border-t border-r border-b border-[#1C1C1C]/10 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-[#FF5F1F] text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 01 &bull; 30-Second Crew Icebreaker</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif italic text-[#1C1C1C] leading-snug">
          &ldquo;{toolboxTalk.openingHook}&rdquo;
        </h3>
        <p className="text-xs text-[#1C1C1C]/60 font-serif italic">
          Supervisor tip: Pose this question directly to the crew. Pause for 5 seconds and invite responses before proceeding.
        </p>
      </div>

      {/* 2. Deep-Dive Discussion Points */}
      <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#1C1C1C]">
          <MessageCircle className="w-3.5 h-3.5 text-[#FF5F1F]" />
          <span>Stage 02 &bull; Discussion & Debrief Inquiries</span>
        </div>
        <p className="text-xs text-[#1C1C1C]/60 font-serif italic">
          Facilitate an active peer discussion using these targeted situational prompts.
        </p>

        <div className="space-y-3">
          {toolboxTalk.discussionPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-4 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 flex items-start space-x-3.5 hover:border-[#1C1C1C]/30 transition"
            >
              <div className="w-6 h-6 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs font-serif font-bold italic shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-serif text-[#1C1C1C] leading-relaxed">
                  {point}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Hands-On Physical Check Checklist */}
      <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#1C1C1C]">
            <CheckSquare className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Stage 03 &bull; Hands-On Physical Verification</span>
          </div>
          <span className="text-xs font-serif font-bold text-[#FF5F1F]">
            {completedChecks}/{totalChecks} Verified
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#F0EFEC] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#FF5F1F] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {toolboxTalk.handsOnChecklist.map((item, idx) => {
            const isChecked = Boolean(checkedItems[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`cursor-pointer p-4 rounded-sm border transition-all flex items-start space-x-3 ${
                  isChecked
                    ? "bg-[#F0FDF4] border-emerald-500/40 text-emerald-950"
                    : "bg-[#F9F8F6] border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#1C1C1C]/30"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-[#1C1C1C]/40" />
                  )}
                </div>
                <span className={`text-xs font-serif leading-relaxed ${isChecked ? "line-through text-[#1C1C1C]/40" : ""}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. The Worker Pledge Card */}
      <div className="p-6 sm:p-8 rounded-sm bg-[#1C1C1C] text-white border border-[#1C1C1C] shadow-md text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-white/10 text-[#FF5F1F] text-[10px] font-bold uppercase tracking-widest border border-white/10">
          <Award className="w-3.5 h-3.5 text-[#FF5F1F]" />
          <span>Stage 04 &bull; Shift Safety Pledge</span>
        </div>
        <blockquote className="text-lg sm:text-xl font-serif italic text-white max-w-2xl mx-auto leading-relaxed">
          &ldquo;{toolboxTalk.crewPledge}&rdquo;
        </blockquote>
        <p className="text-xs text-white/60 font-serif italic">
          Recite collectively as a crew prior to high-risk work release.
        </p>
      </div>
    </div>
  );
};
