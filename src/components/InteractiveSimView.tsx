import React, { useState } from "react";
import {
  Gamepad2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";
import { InteractiveStep, SafetyCampaign } from "../types";

interface InteractiveSimViewProps {
  campaign: SafetyCampaign;
}

export const InteractiveSimView: React.FC<InteractiveSimViewProps> = ({ campaign }) => {
  const scenario = campaign.interactiveScenario;
  const steps: InteractiveStep[] = scenario?.steps || [];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [riskScore, setRiskScore] = useState(20); // Baseline risk
  const [decisionHistory, setDecisionHistory] = useState<{ step: number; correct: boolean; choiceText: string }[]>([]);
  const [simCompleted, setSimCompleted] = useState(false);

  const currentStep = steps[currentStepIndex];

  const handleSelectChoice = (choiceIndex: number) => {
    if (selectedChoiceIndex !== null) return; // Prevent double click

    const choice = currentStep.choices[choiceIndex];
    setSelectedChoiceIndex(choiceIndex);

    const newRisk = Math.max(0, Math.min(100, riskScore + choice.riskDelta));
    setRiskScore(newRisk);

    const newHistory = [
      ...decisionHistory,
      { step: currentStepIndex + 1, correct: choice.correct, choiceText: choice.text },
    ];
    setDecisionHistory(newHistory);

    // If last step
    if (currentStepIndex === steps.length - 1) {
      if (choice.correct && newRisk <= 30) {
        // Trigger confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899"],
          });
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedChoiceIndex(null);
    } else {
      setSimCompleted(true);
    }
  };

  const handleResetSim = () => {
    setCurrentStepIndex(0);
    setSelectedChoiceIndex(null);
    setRiskScore(20);
    setDecisionHistory([]);
    setSimCompleted(false);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 35) return "text-emerald-400";
    if (risk < 70) return "text-amber-400";
    return "text-red-400";
  };

  const getRiskBarGradient = (risk: number) => {
    if (risk < 35) return "from-emerald-500 to-teal-400";
    if (risk < 70) return "from-amber-500 to-orange-400";
    return "from-red-500 to-rose-600";
  };

  if (!steps.length) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-3xl border border-slate-800">
        No interactive scenario defined for this campaign.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Header & Scenario Briefing */}
      <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F]">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Interactive Scenario Simulator &bull; Decision Crucible</span>
          </div>
          <button
            onClick={handleResetSim}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-[#F5F2ED] hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 self-start transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Simulator</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
          {scenario.title || "The Hazard Simulator"}
        </h2>
        <p className="text-sm text-[#1C1C1C]/80 font-serif italic leading-relaxed">
          {scenario.briefing}
        </p>

        {/* Live Hazard & Risk Level Gauge */}
        <div className="p-4 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center space-x-1.5 text-[#1C1C1C]/60">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>Real-Time Incident Risk Index</span>
            </span>
            <span className="font-serif font-bold text-sm text-[#1C1C1C]">
              {riskScore}% Risk Level
            </span>
          </div>

          <div className="w-full bg-[#EAE7E1] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                riskScore < 35 ? "bg-emerald-600" : riskScore < 70 ? "bg-[#FF5F1F]" : "bg-red-600"
              }`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step / Choice Display */}
      {!simCompleted ? (
        <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5F1F]">
              Dilemma {currentStepIndex + 1} of {steps.length}
            </span>
            <div className="flex space-x-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i === currentStepIndex
                      ? "bg-[#FF5F1F] ring-2 ring-[#FF5F1F]/30"
                      : i < currentStepIndex
                      ? "bg-[#1C1C1C]"
                      : "bg-[#EAE7E1]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Situation Context */}
          <div className="p-5 rounded-sm bg-[#FFF9F5] border-l-4 border-[#FF5F1F] text-[#1C1C1C] text-sm sm:text-base font-serif italic leading-relaxed">
            <span className="font-sans text-[10px] font-bold text-[#FF5F1F] uppercase tracking-widest block mb-1 not-italic">
              Current Situation
            </span>
            {currentStep.situation}
          </div>

          {/* Question Prompt */}
          <h3 className="text-lg sm:text-xl font-serif text-[#1C1C1C]">
            {currentStep.question}
          </h3>

          {/* Interactive Choices */}
          <div className="space-y-3">
            {currentStep.choices.map((choice, idx) => {
              const isSelected = selectedChoiceIndex === idx;
              const isRevealed = selectedChoiceIndex !== null;

              let cardStyle = "bg-[#F9F8F6] border-[#1C1C1C]/10 hover:border-[#1C1C1C]/40 text-[#1C1C1C] cursor-pointer";
              if (isRevealed) {
                if (choice.correct) {
                  cardStyle = "bg-[#F0FDF4] border-emerald-500/50 text-emerald-950";
                } else if (isSelected && !choice.correct) {
                  cardStyle = "bg-[#FEF2F2] border-red-500/50 text-red-950";
                } else {
                  cardStyle = "bg-[#F9F8F6]/50 border-[#1C1C1C]/5 text-[#1C1C1C]/40 opacity-50";
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectChoice(idx)}
                  className={`p-5 rounded-sm border transition-all space-y-3 ${cardStyle}`}
                >
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs font-serif font-bold italic shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <p className="text-sm font-serif leading-relaxed">
                        {choice.text}
                      </p>
                    </div>

                    {isRevealed && (
                      <div className="shrink-0">
                        {choice.correct ? (
                          <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Safe Call</span>
                          </span>
                        ) : isSelected ? (
                          <span className="flex items-center space-x-1 text-xs font-bold text-red-700 uppercase tracking-wider">
                            <XCircle className="w-4 h-4" />
                            <span>High Hazard</span>
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Consequence & Explanation reveal */}
                  {isRevealed && (isSelected || choice.correct) && (
                    <div className="p-3.5 rounded-sm bg-white border border-[#1C1C1C]/10 space-y-1 text-xs leading-relaxed">
                      <p className="font-bold text-[#1C1C1C]">
                        Consequence: <span className="font-normal font-serif text-[#1C1C1C]/80">{choice.consequence}</span>
                      </p>
                      <p className="text-[#1C1C1C]/70">
                        <strong className="text-[#FF5F1F] uppercase text-[10px] tracking-wider">Safety Principle:</strong> {choice.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          {selectedChoiceIndex !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextStep}
                className="flex items-center space-x-2 px-6 py-3 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white font-bold text-xs uppercase tracking-widest shadow-sm transition active:scale-95 cursor-pointer"
              >
                <span>
                  {currentStepIndex < steps.length - 1 ? "Next Decision" : "View Debrief Summary"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Debrief Summary Screen */
        <div className="p-8 rounded-sm bg-white border border-[#1C1C1C]/10 text-center space-y-6 shadow-sm">
          <div className="inline-flex p-4 rounded-sm bg-[#F5F2ED] text-[#FF5F1F] border border-[#1C1C1C]/10">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
              Simulation Complete!
            </h3>
            <p className="text-sm font-serif text-[#1C1C1C]/70 max-w-md mx-auto">
              Final Incident Risk Level:{" "}
              <strong className="text-[#1C1C1C] font-bold">{riskScore}%</strong>.
              {riskScore <= 30
                ? " Excellent situational awareness! You successfully prioritized life over shortcuts."
                : " Review the debrief below to reinforce the zero-harm protocols."}
            </p>
          </div>

          {/* Decision Timeline */}
          <div className="space-y-3 text-left max-w-lg mx-auto">
            {decisionHistory.map((d, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-sm border text-xs flex items-center justify-between ${
                  d.correct
                    ? "bg-[#F0FDF4] border-emerald-500/40 text-emerald-950"
                    : "bg-[#FEF2F2] border-red-500/40 text-red-950"
                }`}
              >
                <span className="font-serif">
                  <strong>Decision {d.step}:</strong> {d.choiceText.slice(0, 45)}...
                </span>
                <span className="font-bold uppercase text-[10px] tracking-wider">
                  {d.correct ? "Safe" : "Risky"}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleResetSim}
            className="px-6 py-3 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white font-bold text-xs uppercase tracking-widest transition cursor-pointer"
          >
            Replay Simulator
          </button>
        </div>
      )}
    </div>
  );
};
