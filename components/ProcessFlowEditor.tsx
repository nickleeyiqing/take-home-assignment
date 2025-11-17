"use client";

import { useState } from "react";
import NodeTable from "./nodeTable";
import EdgeTable from "./EdgeTable";
import ProcessCanvas from "./ProcessCanvas";

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

export default function ProcessFlowEditor() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "n1", name: "Tank A", type: "type1" },
    { id: "n2", name: "Pump B", type: "type2" },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const addNode = () => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      name: "",
      type: "type1",
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const updateNode = (id: string, field: "name" | "type", value: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, [field]: value } : node
      )
    );
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) =>
      prev.filter(
        (edge) => edge.upstreamId !== id && edge.downstreamId !== id
      )
    );
  };

  const addEdge = () => {
    if (nodes.length < 2) return;

    const newEdge: Edge = {
      id: crypto.randomUUID(),
      upstreamId: nodes[0].id,
      downstreamId: nodes[1].id,
    };

    setEdges((prev) => [...prev, newEdge]);
  };

  const updateEdge = (
    id: string,
    field: "upstreamId" | "downstreamId",
    value: string
  ) => {
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === id ? { ...edge, [field]: value } : edge
      )
    );
  };

  const removeEdge = (id: string) => {
    setEdges((prev) => prev.filter((edge) => edge.id !== id));
  };

  return (
    <section className="space-y-4">

      <NodeTable
        nodes={nodes}
        onAdd={addNode}
        onUpdate={updateNode}
        onRemove={removeNode}
      />

      <EdgeTable
        nodes={nodes}
        edges={edges}
        onAdd={addEdge}
        onUpdate={updateEdge}
        onRemove={removeEdge}
      />

      <ProcessCanvas nodes={nodes} edges={edges} />
    </section>
  );
}
