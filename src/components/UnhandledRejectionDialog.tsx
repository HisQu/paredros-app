import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from "./ui/dialog"; // adjust the path to wherever your dialog.tsx lives

/**
 * `UnhandledRejectionDialog` listens for the global `unhandledrejection` event and
 * surfaces each error in a modal dialog.
 */
const UnhandledRejectionDialog: React.FC = () => {
  interface RejectionInfo {
    id: number;
    message: string;
    stack?: string;
  }

  const [queue, setQueue] = useState<RejectionInfo[]>([]);

  // Attach a single global listener at mount
  useEffect(() => {
    function handler(event: PromiseRejectionEvent) {
      /* Log to the console so dev tools still show the original error */
      console.error(
          "Unhandled promise rejection captured by <UnhandledRejectionDialog />:",
          event.reason,
      );

      // Most JS runtimes expose `.message` + `.stack` on `Error` objects,
      // but the rejection could be *anything*, so defensively coerce.
      const reason = event.reason ?? "Unknown rejection";
      const message = typeof reason === "object" && "message" in reason ? (reason as any).message : String(reason);
      const stack = typeof reason === "object" && "stack" in reason ? (reason as any).stack : undefined;

      setQueue((prev) => [
        ...prev,
        {
          id: Date.now(),
          message,
          stack,
        },
      ]);
    }

    // Do *not* call event.preventDefault(); we still want the console trace.
    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);

  // Show the first error in the queue (FIFO)
  const current = queue[0] ?? null;
  const dismissCurrent = () => setQueue(([, ...rest]) => rest);

  if (!current) return null; // Nothing to show

  return (
      <Dialog open onClose={dismissCurrent} size="lg">
        <DialogTitle>Something went wrong</DialogTitle>
        <DialogDescription>An unhandled promise rejection occurred.</DialogDescription>

        <DialogBody>
        <pre className="whitespace-pre-wrap break-words font-mono text-xs text-zinc-800 dark:text-zinc-200">
          {current.message}
          {current.stack ? "\n\n" + current.stack : ""}
        </pre>
        </DialogBody>

        <DialogActions>
          <button
              onClick={dismissCurrent}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
  );
};

export default UnhandledRejectionDialog;
