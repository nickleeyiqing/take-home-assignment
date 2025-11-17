"use client";

import { useState } from "react";
import Table from "../components/table";
import NodeTable from "../components/nodeTable";
import EdgeTable from "../components/EdgeTable";
import ProcessCanvas from "../components/ProcessCanvas";
import ProcessFlowEditor from "../components/ProcessFlowEditor";
import ReportGen from "../components/ReportGen";
import Charts from "../components/Charts";
type NodeType = "type1" | "type2" | "type3";

type Node = {
  id: string;
  name: string;
  type: NodeType;
};

type Edge = {
  id: string;
  upstreamId: string;
  downstreamId: string;
};

const columns = ["ID", "Name", "Age"];

const data = [
  { ID: 1, Name: "John Doe", Age: 28 },
  { ID: 2, Name: "Jane Smith", Age: 34 },
  { ID: 3, Name: "Alice Johnson", Age: 45 },
  { ID: 4, Name: "Bob Tan", Age: 29 },
  { ID: 5, Name: "Clarke Dent", Age: 28 },
  { ID: 6, Name: "Dent Vers", Age: 22 },
  { ID: 7, Name: "Eason Fin", Age: 21 },
  { ID: 8, Name: "Frank Mull", Age: 54 },
];

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white flex justify-center py-10">
      <main className="w-full max-w-4xl space-y-8">
        <section className="space-y-2">
          <h1 className="text-xl font-semibold">AIO Paginated Table (Task 1)</h1>
          <Table columns={columns} data={data} rowsPerPage={4} />
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Process Flow Editor (Task 2)</h2>
         <ProcessFlowEditor />
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Experiment Report (Task 3)</h2>
          <ReportGen />
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Analytics Dashboard (Task 4)</h2>
          <Charts />
        </section>
      </main>
    </div>
  );
}
