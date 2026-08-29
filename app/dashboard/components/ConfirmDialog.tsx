"use client";

import { useState } from "react";

export function useConfirmDialog() {
  const [state, setState] = useState<{
    message: string;
    resolve?: (value: boolean) => void;
  } | null>(null);

  function confirm(message: string) {
    return new Promise<boolean>((resolve) => {
      setState({ message, resolve });
    });
  }

  function close(result: boolean) {
    state?.resolve?.(result);
    setState(null);
  }

  const Dialog = () =>
    state ? (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-5 w-80 space-y-4 shadow-lg">
          <p className="text-sm">{state.message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => close(false)}
              className="px-3 py-1 text-sm border rounded"
            >
              Cancel
            </button>

            <button
              onClick={() => close(true)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return { confirm, Dialog };
}
