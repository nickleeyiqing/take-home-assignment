"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300 justify-end mt-2">
      <span className="text-slate-400">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-2 py-1 rounded bg-slate-800 border border-slate-600 disabled:opacity-40 hover:bg-slate-700"
      >
        Prev
      </button>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-2 py-1 rounded bg-slate-800 border border-slate-600 disabled:opacity-40 hover:bg-slate-700"
      >
        Next
      </button>
    </div>
  );
}
