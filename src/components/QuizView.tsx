import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Printer,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { QuizQuestion, SafetyCampaign } from "../types";

interface QuizViewProps {
  campaign: SafetyCampaign;
}

export const QuizView: React.FC<QuizViewProps> = ({ campaign }) => {
  const quiz: QuizQuestion[] = campaign.knowledgeQuiz || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [workerName, setWorkerName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score === quiz.length) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const score = calculateScore();
  const percentage = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;
  const isPassed = percentage >= 70;

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Knowledge Assessment &bull; Retention Benchmark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
            {campaign.campaignTitle} Quiz
          </h2>
          <p className="text-xs text-[#1C1C1C]/60 font-serif italic mt-0.5">
            Scenario-grounded assessment to ensure critical life-saving lessons are retained.
          </p>
        </div>

        {isSubmitted && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-sm bg-white hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 self-start transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.map((q, qIdx) => {
          const userAnswer = selectedAnswers[qIdx];
          const isAnswered = userAnswer !== undefined;

          return (
            <div
              key={qIdx}
              className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-4"
            >
              <div className="flex items-start space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs font-serif font-bold italic shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <h3 className="text-base sm:text-lg font-serif text-[#1C1C1C] leading-relaxed">
                  {q.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-10">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isCorrect = q.correctIndex === optIdx;

                  let optClass = "bg-[#F9F8F6] border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30 text-[#1C1C1C] cursor-pointer";
                  if (isSubmitted) {
                    if (isCorrect) {
                      optClass = "bg-[#F0FDF4] border-emerald-500/50 text-emerald-950 font-medium";
                    } else if (isSelected && !isCorrect) {
                      optClass = "bg-[#FEF2F2] border-red-500/50 text-red-950 font-medium";
                    } else {
                      optClass = "bg-[#F9F8F6]/40 border-[#1C1C1C]/5 text-[#1C1C1C]/40 opacity-50";
                    }
                  } else if (isSelected) {
                    optClass = "bg-[#FFF9F5] border-[#FF5F1F] text-[#1C1C1C] font-semibold";
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`p-3.5 rounded-sm border text-xs sm:text-sm font-serif transition-all flex items-center justify-between ${optClass}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-5 h-5 rounded-full bg-[#EAE7E1] text-[#1C1C1C] flex items-center justify-center text-[10px] font-sans font-bold">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSubmitted && (
                        <div>
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation (Revealed after submit) */}
              {isSubmitted && (
                <div className="p-4 rounded-sm bg-[#FFF9F5] border-l-4 border-[#FF5F1F] text-xs font-serif text-[#1C1C1C] leading-relaxed ml-10 space-y-1">
                  <span className="font-sans font-bold text-[#FF5F1F] uppercase text-[10px] tracking-widest block not-italic">
                    Safety Principle & Rationale
                  </span>
                  <p className="italic">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isSubmitted ? (
        <div className="text-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < quiz.length}
            className="px-8 py-3.5 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] disabled:bg-[#EAE7E1] disabled:text-[#1C1C1C]/40 text-white font-bold text-xs uppercase tracking-widest shadow-sm transition cursor-pointer"
          >
            Submit Quiz & Benchmark Score
          </button>
        </div>
      ) : (
        /* Certificate & Score Banner */
        <div className="p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
              Quiz Benchmark: {score} / {quiz.length} ({percentage}%)
            </h3>
            <p className="text-xs font-serif italic text-[#1C1C1C]/70">
              {isPassed
                ? "Congratulations! You have successfully mastered this safety campaign curriculum."
                : "Review the safety principles above and retake the quiz to achieve certified mastery."}
            </p>
          </div>

          {/* Certificate Card */}
          {isPassed && (
            <div className="p-6 sm:p-8 rounded-sm bg-[#FFF9F5] border-2 border-[#1C1C1C] max-w-xl mx-auto space-y-4 text-center shadow-md">
              <div className="inline-flex p-3 rounded-sm bg-white text-[#FF5F1F] border border-[#1C1C1C]/10">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] block">
                Certificate of Safety Mastery
              </span>
              <h4 className="text-2xl font-serif italic text-[#1C1C1C]">
                {campaign.campaignTitle}
              </h4>
              <p className="text-xs font-serif italic text-[#1C1C1C]/70">
                Demonstrated thorough understanding of zero-harm protocols and behavioral safety tenets.
              </p>

              <div className="pt-4 border-t border-[#1C1C1C]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[10px] text-[#1C1C1C]/50 uppercase tracking-wider block">Certified Date</span>
                  <span className="text-xs font-serif font-bold text-[#1C1C1C]">{new Date().toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white text-[11px] font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
