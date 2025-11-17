"use client";

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

type Props = {
  nodes: Node[];
  edges: Edge[];
};

export default function ProcessCanvas({ nodes, edges }: Props) {
  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <h2 className="font-semibold">Process Canvas</h2>
        <span className="text-xs text-slate-400">
          {nodes.length} nodes · {edges.length} edges
        </span>
      </div>

      {edges.length === 0 ? (
        <div className="px-4 py-6 text-sm text-slate-400">
          No edges defined yet. Add edges in the Edge Table to see the flow here.
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {edges.map((edge) => {
            const upstream = getNode(edge.upstreamId);
            const downstream = getNode(edge.downstreamId);
            if (!upstream || !downstream) return null;

            return (
              <div
                key={edge.id}
                className="flex items-center gap-4"
              >
                <div className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 min-w-[140px]">
                  <div className="text-xs text-slate-400">Upstream</div>
                  <div className="font-semibold">
                    {upstream.name || "(unnamed)"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {upstream.type}
                  </div>
                </div>

                <div className="text-xl text-slate-300">➜</div>

                <div className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 min-w-[140px]">
                  <div className="text-xs text-slate-400">Downstream</div>
                  <div className="font-semibold">
                    {downstream.name || "(unnamed)"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {downstream.type}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
