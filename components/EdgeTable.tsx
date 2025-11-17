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

type EdgeTableProps = {
  nodes: Node[];
  edges: Edge[];
  onAdd: () => void;
  onUpdate: (
    id: string,
    field: "upstreamId" | "downstreamId",
    value: string
  ) => void;
  onRemove: (id: string) => void;
};

export default function EdgeTable({
  nodes,
  edges,
  onAdd,
  onUpdate,
  onRemove,
}: EdgeTableProps) {
  const hasEnoughNodes = nodes.length >= 2;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <h2 className="font-semibold">Edge Table</h2>

        <button
          onClick={onAdd}
          className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium hover:bg-emerald-500 disabled:opacity-40"
          disabled={!hasEnoughNodes}
        >
          + Add Edge
        </button>
      </div>

      {!hasEnoughNodes && (
        <div className="px-4 py-2 text-xs text-amber-300 border-b border-slate-700">
          You need at least two nodes to create an edge.
        </div>
      )}

      <table className="min-w-full border-collapse text-left">
        <thead className="bg-slate-800">
          <tr>
            <th className="px-4 py-2 border border-slate-700">Upstream node</th>
            <th className="px-4 py-2 border border-slate-700">Downstream node</th>
            <th className="px-4 py-2 border border-slate-700 w-24">Actions</th>
          </tr>
        </thead>

        <tbody>
          {edges.map((edge) => (
            <tr key={edge.id} className="border border-slate-700">

              <td className="px-4 py-2">
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                  value={edge.upstreamId}
                  onChange={(e) =>
                    onUpdate(edge.id, "upstreamId", e.target.value)
                  }
                >
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name || "(unnamed)"}
                    </option>
                  ))}
                </select>
              </td>

              <td className="px-4 py-2">
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                  value={edge.downstreamId}
                  onChange={(e) =>
                    onUpdate(edge.id, "downstreamId", e.target.value)
                  }
                >
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name || "(unnamed)"}
                    </option>
                  ))}
                </select>
              </td>

              <td className="px-4 py-2">
                <button
                  onClick={() => onRemove(edge.id)}
                  className="rounded bg-red-600 px-2 py-1 text-xs font-medium hover:bg-red-500"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {edges.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-4 text-center text-sm text-slate-400"
              >
                No edges yet. Click &quot;Add Edge&quot; to connect nodes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
