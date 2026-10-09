"use client";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";

// Native dialogs provide focus containment and make the background inert.
export function Modal({
  children,
  labelledBy,
  describedBy,
  busy = false,
  onClose,
  compact = false,
  alert = false,
  returnFocusRef,
}: {
  children: ReactNode;
  labelledBy: string;
  describedBy?: string;
  busy?: boolean;
  onClose: () => void;
  compact?: boolean;
  alert?: boolean;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = ref.current;
    const wasLocked = document.body.classList.contains("overflow-hidden");
    document.body.classList.add("overflow-hidden");
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (!wasLocked) document.body.classList.remove("overflow-hidden");
      const target = returnFocusRef?.current ?? trigger;
      if (target?.isConnected && !target.hasAttribute("disabled"))
        target.focus();
      else document.getElementById("schedule-operation")?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      role={alert ? "alertdialog" : "dialog"}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-busy={busy}
      className={`m-auto open:flex open:flex-col max-h-[calc(100dvh-32px)] max-w-[calc(100vw-32px)] overflow-auto overscroll-contain rounded-2xl border border-border bg-surface p-0 text-text-primary shadow-modal transition-[opacity,transform] duration-200 starting:open:translate-y-2 starting:open:opacity-0 motion-reduce:transition-none backdrop:bg-backdrop backdrop:backdrop-blur-sm max-sm:max-h-[calc(100dvh-16px)] max-sm:max-w-[calc(100vw-16px)] ${compact ? "w-[28rem]" : "w-[44rem]"}`}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const controls = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (!first) {
          e.preventDefault();
          e.currentTarget.focus();
        } else if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === e.currentTarget)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }}
      onClick={(e) => {
        if (alert || busy || e.target !== ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        )
          onClose();
      }}
    >
      {children}
    </dialog>
  );
}
