"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);


ChartJS.defaults.color = "#e5e7eb"; 
ChartJS.defaults.borderColor = "rgba(255,255,255,0.1)"; 
ChartJS.defaults.plugins.legend.labels.color = "#e5e7eb";
ChartJS.defaults.plugins.tooltip.titleColor = "#fff";
ChartJS.defaults.plugins.tooltip.bodyColor = "#fff";
ChartJS.defaults.plugins.tooltip.backgroundColor = "rgba(0,0,0,0.7)";


type SimVariable = {
  name: string;
  type: string;
  value: number;
  unit: string;
};

type EquipmentSpec = {
  equipment: string;
  variables: SimVariable[];
};

type SimulatedEntry = {
  scenario: string;
  equipment_specification: EquipmentSpec[];
  kpi: string;
  kpi_value: number;
};

type MockResults = {
  simulated_summary?: {
    simulated_data?: SimulatedEntry[];
  };
};

export default function Charts() {
  const [data, setData] = useState<MockResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/mock_results.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load mock_results.json for charts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-400">
        Loading charts…
      </div>
    );
  }

  if (error || !data?.simulated_summary?.simulated_data) {
    return (
      <div className="bg-slate-900 border border-red-700 rounded-lg p-4 text-sm text-red-400">
        {error ?? "No simulation data available for charts."}
      </div>
    );
  }

  const sims = data.simulated_summary.simulated_data;

  const scenarioLabels = sims.map((s) => s.scenario);
  const kpiValues = sims.map((s) => s.kpi_value);

  const kpiLineData = {
  labels: scenarioLabels,
  datasets: [
    {
      label: "Heater Outlet Temperature (KPI)",
      data: kpiValues,
      borderColor: "#38bdf8", 
      backgroundColor: "rgba(56,189,248,0.3)",
      pointBackgroundColor: "#38bdf8",
      pointBorderColor: "#38bdf8",
      borderWidth: 2,
      pointRadius: 1,
    },
  ],
};


  const kpiLineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Scenario" } },
      y: { title: { display: true, text: "KPI value" } },
    },
  };

  const fuelScatterPoints: { x: number; y: number }[] = [];

  sims.forEach((s) => {
    const fuel = s.equipment_specification.find(
      (eq) => eq.equipment === "Fuel"
    );
    const fuelTemp = fuel?.variables.find(
      (v) => v.name === "Fuel - temperature"
    );
    if (fuelTemp && typeof fuelTemp.value === "number") {
      fuelScatterPoints.push({
        x: fuelTemp.value,
        y: s.kpi_value,
      });
    }
  });

 const fuelScatterData = {
  datasets: [
    {
      label: "Fuel temperature vs KPI",
      data: fuelScatterPoints,
      pointRadius: 4,
      pointBackgroundColor: "#facc15",
      pointBorderColor: "#facc15",
    },
  ],
};


  const fuelScatterOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: "nearest" as const, intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Fuel temperature (K)" } },
      y: { title: { display: true, text: "Heater Outlet Temperature (KPI)" } },
    },
  };

  type Acc = { sum: number; count: number };
  const agg: Record<"Fuel" | "Air" | "Cold Fluid", Acc> = {
    Fuel: { sum: 0, count: 0 },
    Air: { sum: 0, count: 0 },
    "Cold Fluid": { sum: 0, count: 0 },
  };

  sims.forEach((s) => {
    s.equipment_specification.forEach((eq) => {
      if (eq.equipment === "Fuel") {
        const v = eq.variables.find(
          (vv) => vv.name === "Fuel - temperature"
        );
        if (v) {
          agg.Fuel.sum += v.value;
          agg.Fuel.count += 1;
        }
      }
      if (eq.equipment === "Air") {
        const v = eq.variables.find((vv) => vv.name === "temperature");
        if (v) {
          agg.Air.sum += v.value;
          agg.Air.count += 1;
        }
      }
      if (eq.equipment === "HEX-100") {
        const v = eq.variables.find(
          (vv) => vv.name === "cold_fluid_temperature"
        );
        if (v) {
          agg["Cold Fluid"].sum += v.value;
          agg["Cold Fluid"].count += 1;
        }
      }
    });
  });

  const avg = (a: Acc) => (a.count > 0 ? a.sum / a.count : 0);

  const barData = {
  labels: ["Fuel", "Air", "Cold Fluid"],
  datasets: [
    {
      label: "Average temperature (K)",
      data: [avg(agg.Fuel), avg(agg.Air), avg(agg["Cold Fluid"])],
      backgroundColor: ["#fb7185", "#34d399", "#60a5fa"],
    },
  ],
};


  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { title: { display: true, text: "Equipment" } },
      y: { title: { display: true, text: "Average temperature (K)" } },
    },
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-6">
      <h2 className="font-semibold mb-2">Charts</h2>

      <div className="space-y-1 text-xs text-slate-400">
        <p>
          These charts are built from the raw <code>mock_results.json</code>{" "}
          data and highlight KPI behaviour and key temperature variables.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-slate-950 border border-slate-800 rounded-md p-3">
          <h3 className="text-sm font-semibold mb-2">
            KPI across scenarios (line)
          </h3>
          <Line data={kpiLineData} options={kpiLineOptions} />
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-md p-3">
          <h3 className="text-sm font-semibold mb-2">
            Fuel temperature vs KPI (scatter)
          </h3>
          <Scatter data={fuelScatterData} options={fuelScatterOptions} />
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-md p-3">
        <h3 className="text-sm font-semibold mb-2">
          Average temperature by equipment (bar)
        </h3>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
}
