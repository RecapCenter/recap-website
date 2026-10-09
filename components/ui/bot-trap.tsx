"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  type BotTrapValues,
} from "@/lib/bot-trap";

/**
 * Client half of lib/bot-trap.ts. Render `<BotTrapField inputRef={…} />`
 * inside the form and spread `values()` into the request body.
 */
export function useBotTrap() {
  const inputRef = useRef<HTMLInputElement>(null);
  const openedAt = useRef<number | null>(null);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const values = useCallback(
    (): BotTrapValues => ({
      [HONEYPOT_FIELD]: inputRef.current?.value ?? "",
      [ELAPSED_FIELD]:
        openedAt.current === null ? 0 : Date.now() - openedAt.current,
    }),
    [],
  );

  return { inputRef, values };
}

/**
 * Off-screen rather than display:none (which some bots skip), and hidden
 * from assistive tech and the tab order so no person ever reaches it.
 */
export function BotTrapField({
  inputRef,
}: {
  inputRef: React.Ref<HTMLInputElement>;
}) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input
          ref={inputRef}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
