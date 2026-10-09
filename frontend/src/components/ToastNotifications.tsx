"use client";
import { useEffect, useState } from "react";
import { CheckCircleIcon, XIcon } from "@phosphor-icons/react";
import { iconButton } from "@/lib/styles";

export interface ToastMessage {
  id: number;
  message: string;
}

function SuccessToast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (hovered || focused || hidden) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), 5000);
    return () => window.clearTimeout(timer);
  }, [toast.id, hovered, focused, hidden, onDismiss]);
  return (
    <div
      role="status"
      aria-atomic="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      className="pointer-events-auto flex items-start gap-3 rounded-xl border border-success-border bg-success-surface py-3 pr-2 pl-4 text-sm text-brand shadow-card transition-[opacity,transform] duration-200 starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
    >
      <CheckCircleIcon
        size={20}
        weight="fill"
        className="mt-3 shrink-0"
        aria-hidden="true"
      />
      <p className="min-w-0 flex-1 py-3 font-medium wrap-anywhere">
        {toast.message}
      </p>
      <button
        className={iconButton}
        aria-label={`Dismiss notification: ${toast.message}`}
        onClick={() => {
          if (focused) document.getElementById("schedule-operation")?.focus();
          onDismiss(toast.id);
        }}
      >
        <XIcon size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastNotifications({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <section
      aria-label="Notifications"
      className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-3"
    >
      {toasts.map((toast) => (
        <SuccessToast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </section>
  );
}
