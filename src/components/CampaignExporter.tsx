import React from "react";
import { Download, FileCode, Printer, Check, X, FileText } from "lucide-react";
import { SafetyCampaign } from "../types";

interface CampaignExporterProps {
  campaign: SafetyCampaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CampaignExporter: React.FC<CampaignExporterProps> = ({
  campaign,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !campaign) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(campaign, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SafetyStory_${campaign.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadHTMLDossier = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SafetyStory AI - ${campaign.campaignTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: "Plus Jakarta Sans", -apple-system, sans-serif; line-height: 1.6; color: #1C1C1C; background-color: #F9F8F6; max-width: 900px; margin: 40px auto; padding: 0 24px; }
    h1, h2, h3, h4 { font-family: "Newsreader", Georgia, serif; font-style: italic; }
    h1 { color: #1C1C1C; font-size: 2.5rem; margin-bottom: 0.2rem; }
    .slogan { font-family: "Newsreader", Georgia, serif; font-style: italic; font-size: 1.3rem; font-weight: 600; color: #FF5F1F; margin-bottom: 1.5rem; }
    .card { background: #FFFFFF; border: 1px solid rgba(28, 28, 28, 0.1); border-radius: 2px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .tag { display: inline-block; background: #FFF9F5; color: #FF5F1F; border: 1px solid rgba(255, 95, 31, 0.2); padding: 4px 12px; border-radius: 2px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    h2 { font-size: 1.6rem; color: #1C1C1C; border-bottom: 1px solid rgba(28, 28, 28, 0.15); padding-bottom: 8px; margin-top: 36px; }
    .storyboard-scene { background: #FFFFFF; border: 1px solid rgba(28, 28, 28, 0.1); border-radius: 2px; padding: 18px; margin-bottom: 16px; }
    .dialogue { font-family: "Newsreader", Georgia, serif; font-style: italic; color: #1C1C1C; border-left: 3px solid #FF5F1F; padding-left: 12px; margin: 10px 0; background: #FFF9F5; padding: 8px 12px; }
    .checklist-item { margin-bottom: 8px; font-family: "Newsreader", serif; font-size: 0.95rem; }
    .footer { font-size: 0.75rem; color: rgba(28, 28, 28, 0.5); text-align: center; margin-top: 60px; border-top: 1px solid rgba(28, 28, 28, 0.1); padding-top: 24px; }
    @media print { body { max-width: 100%; margin: 0; padding: 10px; background: white; } }
  </style>
</head>
<body>
  <span class="tag">${campaign.industry} &bull; ${campaign.archetype}</span>
  <h1>${campaign.campaignTitle}</h1>
  <div class="slogan">&ldquo;${campaign.slogan}&rdquo;</div>

  <div class="card">
    <p><strong>Emotional Hook:</strong> ${campaign.emotionalHook}</p>
    <p style="margin-top: 10px;"><strong>Core Life-Saving Rule:</strong> ${campaign.coreRuleSummary}</p>
  </div>

  <h2>1. The Safety Narrative: ${campaign.narrative.title || campaign.campaignTitle}</h2>
  <p><strong>Protagonist:</strong> ${campaign.narrative.character || "Frontline Team"}</p>
  <p><strong>Setting:</strong> ${campaign.narrative.setting || "Operational Site"}</p>
  <p><strong>The Initial Situation:</strong> ${campaign.narrative.initialSituation || campaign.narrative.incitingIncident || "Operations in progress"}</p>
  <p><strong>Rising Conflict & Risk:</strong> ${campaign.narrative.conflictOrRisk || campaign.narrative.conflict || "Hazard variance detected"}</p>
  <p><strong>Critical Decision Point:</strong> ${campaign.narrative.criticalDecision || campaign.narrative.turningPoint || "Crew halts to inspect and apply controls"}</p>
  <p><strong>The Consequence / Outcome:</strong> ${campaign.narrative.consequence || "Near-miss avoided through proactive intervention"}</p>
  <p><strong>Resolution:</strong> ${campaign.narrative.interventionOrResolution || campaign.narrative.resolution || "System brought to verified zero-harm state"}</p>
  <p><strong>Core Life-Saving Lesson:</strong> ${campaign.narrative.keyLesson || campaign.narrative.lessonTakeaway || campaign.coreRuleSummary}</p>

  <h2>2. 5-Scene Visual Storyboard</h2>
  ${campaign.storyboard
    .map(
      (s) => `
    <div class="storyboard-scene">
      <strong>Scene ${s.sceneNumber}: ${s.caption}</strong> (${s.cameraAngle})
      <p style="margin-top: 6px;">${s.visualDescription}</p>
      ${s.dialogue ? `<div class="dialogue">${s.dialogue}</div>` : ""}
    </div>
  `
    )
    .join("")}

  <h2>3. Supervisor 4-Minute Toolbox Talk</h2>
  <p><strong>Opening Hook:</strong> &ldquo;${campaign.toolboxTalk.openingHook}&rdquo;</p>
  <h4 style="margin-top: 16px; margin-bottom: 8px;">Discussion Questions:</h4>
  <ul>
    ${campaign.toolboxTalk.discussionPoints.map((p) => `<li>${p}</li>`).join("")}
  </ul>
  <h4 style="margin-top: 16px; margin-bottom: 8px;">Hands-On Physical Inspection:</h4>
  <ul style="list-style: none; padding-left: 0;">
    ${campaign.toolboxTalk.handsOnChecklist.map((c) => `<li class="checklist-item">[ ] ${c}</li>`).join("")}
  </ul>
  <p style="margin-top: 16px;"><strong>Crew Pledge:</strong> <em>&ldquo;${campaign.toolboxTalk.crewPledge}&rdquo;</em></p>

  <div class="footer">
    SafetyStory AI &bull; &ldquo;One safety idea. An entire creative campaign.&rdquo; &bull; ${new Date().toLocaleDateString()}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `SafetyStory_${campaign.id}_Dossier.html`;
    downloadAnchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1C1C]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#1C1C1C]/10 rounded-sm p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif italic text-[#1C1C1C]">
              Export Campaign Dossier
            </h3>
            <p className="text-xs text-[#1C1C1C]/60 font-serif italic">
              {campaign.campaignTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm bg-[#F9F8F6] hover:bg-[#1C1C1C] text-[#1C1C1C] hover:text-white border border-[#1C1C1C]/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownloadHTMLDossier}
            className="w-full p-4 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 hover:border-[#FF5F1F] flex items-center justify-between text-left transition group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-sm bg-[#FFF9F5] text-[#FF5F1F] border border-[#FF5F1F]/20">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-serif font-bold text-[#1C1C1C] block group-hover:text-[#FF5F1F]">
                  Standalone HTML Campaign Dossier
                </span>
                <span className="text-xs text-[#1C1C1C]/60 font-serif">
                  Self-contained web dossier with narrative, storyboard, & talk guide
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#1C1C1C]/40 group-hover:text-[#FF5F1F]" />
          </button>

          <button
            onClick={() => window.print()}
            className="w-full p-4 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 hover:border-[#FF5F1F] flex items-center justify-between text-left transition group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-sm bg-[#FFF9F5] text-[#FF5F1F] border border-[#FF5F1F]/20">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-serif font-bold text-[#1C1C1C] block group-hover:text-[#FF5F1F]">
                  Print Toolbox Handout Sheet
                </span>
                <span className="text-xs text-[#1C1C1C]/60 font-serif">
                  Direct printable format for site meeting clipboards
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#1C1C1C]/40 group-hover:text-[#FF5F1F]" />
          </button>

          <button
            onClick={handleDownloadJSON}
            className="w-full p-4 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 hover:border-[#FF5F1F] flex items-center justify-between text-left transition group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-sm bg-[#FFF9F5] text-[#FF5F1F] border border-[#FF5F1F]/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-serif font-bold text-[#1C1C1C] block group-hover:text-[#FF5F1F]">
                  Raw Campaign JSON Data
                </span>
                <span className="text-xs text-[#1C1C1C]/60 font-serif">
                  Backup or integrate with LMS / safety management systems
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#1C1C1C]/40 group-hover:text-[#FF5F1F]" />
          </button>
        </div>
      </div>
    </div>
  );
};
