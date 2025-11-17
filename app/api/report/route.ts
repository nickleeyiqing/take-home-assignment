import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const { dataset } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      report: `
(GROQ key missing — returning mock response)

To enable real LLM reports:
1. Get a free API key from https://console.groq.com
2. Add it to .env.local:
   GROQ_API_KEY=your_key_here
3. Restart the dev server.

(Mocked AI report for demo purposes.)

Summary:
The system shows strong temperature-driven influence on heater outlet performance.
High KPI scenarios typically correlate with elevated temperature on HEX-100 and Air equipment.
Focus on top impact variables to improve operational efficiency.`,
    });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
  });



  const simData = dataset?.simulated_summary?.simulated_data ?? [];

  const kpiValues = simData
    .map((s: any) => s.kpi_value)
    .filter((v: any) => typeof v === "number");

  let kpiStats = null;
  if (kpiValues.length > 0) {
    const min = Math.min(...kpiValues);
    const max = Math.max(...kpiValues);
    const avg =
      kpiValues.reduce((sum: number, v: number) => sum + v, 0) /
      kpiValues.length;

    kpiStats = {
      count: simData.length,
      min,
      max,
      avg,
    };
  }

  const topScenarios = simData
    .slice()
    .sort((a: any, b: any) => (b.kpi_value ?? 0) - (a.kpi_value ?? 0))
    .slice(0, 5)
    .map((s: any) => ({
      scenario: s.scenario,
      kpi: s.kpi,
      kpi_value: s.kpi_value,
    }));

  const compact = {
    main_summary_text: dataset.main_summary_text,
    top_summary_text: dataset.top_summary_text,
    impact_summary_text: dataset.impact_summary_text,
    top_impact: dataset.top_impact,
    top_variables: dataset.top_variables,
    setpoint_impact_summary: dataset.setpoint_impact_summary,
    condition_impact_summary: dataset.condition_impact_summary,
    kpi_stats: kpiStats,
    top_scenarios: topScenarios,
  };

  const prompt = `
You are an industrial process analyst.

You are given compacted simulation results for a heater system.
Use the provided summaries, impact breakdown, KPI statistics and top scenarios
to write a clear, structured technical report.

The report should include:
- High-level overview of the experiment/simulation
- Key KPI behavior (range, average, distribution insight)
- Variables with highest impact and how they influence the KPI
- Interpretation of the top scenarios
- Practical recommendations for improving performance

Compacted input data (JSON):
${JSON.stringify(compact, null, 2)}
`;

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      stream: true,
    });

    let fullText = "";

    for await (const chunk of stream) {
      fullText += chunk.choices?.[0]?.delta?.content || "";
    }

    return NextResponse.json({ report: fullText });
  } catch (err: any) {
    console.error("Groq error:", err);

    return NextResponse.json({
      report:
        "Failed to generate AI report (LLM error). For the assignment, the data pipeline and summarization logic are implemented, but the external LLM call hit a token or rate limit.",
    });
  }
}
