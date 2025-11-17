"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

type SimulatedEntry = {
  scenario: string;
  kpi: string;
  kpi_value: number;
};

type MockResults = {
  main_summary_text?: string;
  top_summary_text?: string;
  impact_summary_text?: string;
  simulated_summary?: {
    simulated_data?: SimulatedEntry[];
  };
};

export default function ReportGen() {
  const [data, setData] = useState<MockResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/mock_results.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.data); 
      } catch (err: any) {
        console.error(err);
        setError("Failed to load mock_results.json");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleGenerateReport = async () => {
    if (!data) return;

    setAiSummary("Generating report…");

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset: data }),
      });

      const json = await res.json();
      setAiSummary(json.report);
    } catch (err) {
      console.error(err);
      setAiSummary("Failed to generate report.");
    }
  };

  const handleExportPdf = () => {
    if (!data) return;

    const doc = new jsPDF();
    let y = 10;

    const addWrappedText = (label: string, text?: string) => {
      if (!text) return;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(label, 10, y);
      y += 6;
      doc.setFont("helvetica", "normal");

      const lines = doc.splitTextToSize(text, 180);
      lines.forEach((line: string) => {
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 10, y);
        y += 5;
      });

      y += 4;
    };

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Experiment Report", 10, y);
    y += 10;

    addWrappedText("Main Summary:", data.main_summary_text);
    addWrappedText("Top Summary:", data.top_summary_text);
    addWrappedText("Impact Summary:", data.impact_summary_text);

    if (aiSummary) {
      addWrappedText("AI-Generated Report:", aiSummary);
    }

    if (y > 270) {
      doc.addPage();
      y = 10;
    }
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Exported from Report Generator UI", 10, 290);

    doc.save("experiment_report.pdf");
  };

  const scenarios = data?.simulated_summary?.simulated_data ?? [];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <h2 className="font-semibold">Report Generator</h2>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateReport}
            className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium hover:bg-emerald-500 disabled:opacity-40"
            disabled={loading || !!error || !data}
          >
            Generate AI Report
          </button>
          <button
            onClick={handleExportPdf}
            className="rounded bg-slate-700 px-3 py-1 text-sm font-medium hover:bg-slate-600 disabled:opacity-40"
            disabled={!data}
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3 text-sm">
        {loading && <div className="text-slate-400">Loading dataset…</div>}

        {error && <div className="text-red-400">{error}</div>}

        {!loading && !error && data && (
          <>
            {data.main_summary_text && (
              <div>
                <div className="text-xs uppercase text-slate-400 mb-1">
                  Main Summary
                </div>
                <p className="text-slate-200">{data.main_summary_text}</p>
              </div>
            )}

            {data.top_summary_text && (
              <div>
                <div className="text-xs uppercase text-slate-400 mb-1">
                  Top Summary
                </div>
                <p className="text-slate-200">{data.top_summary_text}</p>
              </div>
            )}

            <div>
              <div className="text-xs uppercase text-slate-400 mb-1">
                Simulation Overview
              </div>
              <p className="text-slate-200">
                Total scenarios:{" "}
                <span className="font-semibold">{scenarios.length}</span>
              </p>
            </div>

            {scenarios.length > 0 && (
              <div>
                <div className="text-xs uppercase text-slate-400 mb-1">
                  Sample KPI results
                </div>
                <div className="space-y-1">
                  {scenarios.slice(0, 5).map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded border border-slate-700 px-3 py-1.5"
                    >
                      <span className="text-slate-200 text-xs">
                        {s.scenario}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {s.kpi}:{" "}
                        <span className="text-slate-100 font-semibold">
                          {s.kpi_value}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiSummary && (
              <div className="mt-3 border-t border-slate-700 pt-3">
                <div className="text-xs uppercase text-slate-400 mb-1">
                  AI-Generated Report
                </div>
                <p className="text-slate-200 whitespace-pre-line">
                  {aiSummary}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
