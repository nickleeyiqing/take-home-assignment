"use client";

type NodeType = "type1" | "type2" | "type3";

type Node = {
  id: string;
  name: string;
  type: NodeType;
};

type NodeTableProps = {
  nodes: Node[];
  onAdd: () => void;
  onUpdate: (id: string, field: "name" | "type", value: string) => void;
  onRemove: (id: string) => void;
};

export default function NodeTable({
  nodes,
  onAdd,
  onUpdate,
  onRemove,
}: NodeTableProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <h2 className="font-semibold">Node Table</h2>
        <button
          onClick={onAdd}
          className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium hover:bg-emerald-500"
        >
          + Add Node
        </button>
      </div>

      <table className="min-w-full border-collapse text-left">
        <thead className="bg-slate-800">
          <tr>
            <th className="px-4 py-2 border border-slate-700">Name</th>
            <th className="px-4 py-2 border border-slate-700">Type</th>
            <th className="px-4 py-2 border border-slate-700 w-24">Actions</th>
          </tr>
        </thead>

        <tbody>
          {nodes.map((node) => (
            <tr key={node.id} className="border border-slate-700">
           
              <td className="px-4 py-2">
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                  value={node.name}
                  onChange={(e) =>
                    onUpdate(node.id, "name", e.target.value)
                  }
                  placeholder="Node name"
                />
              </td>

     
              <td className="px-4 py-2">
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                  value={node.type}
                  onChange={(e) =>
                    onUpdate(node.id, "type", e.target.value)
                  }
                >
                  <option value="type1">type1</option>
                  <option value="type2">type2</option>
                  <option value="type3">type3</option>
                </select>
              </td>

     
              <td className="px-4 py-2">
                <button
                  onClick={() => onRemove(node.id)}
                  className="rounded bg-red-600 px-2 py-1 text-xs font-medium hover:bg-red-500"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {nodes.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-4 text-center text-sm text-slate-400"
              >
                No nodes yet. Click &quot;Add Node&quot; to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
