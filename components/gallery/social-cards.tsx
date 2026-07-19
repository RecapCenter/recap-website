"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
  width?: number;
  height?: number;
}

interface SocialCardsProps {
  cards: CardItem[];
  /** Show pagination dots + prev/next arrows. Off for the homepage preview. */
  showControls?: boolean;
  /** Automatically cycle the focused card. Off by default (Gallery page). */
  autoRotate?: boolean;
  /** Interval between auto-rotate steps, in ms. */
  autoRotateInterval?: number;
  /** Let mouse wheel / trackpad / touch scroll cycle the focused card. */
  enableWheelNavigation?: boolean;
}

const MAX_VISIBLE = 7;
const HALF = 3;
const DEFAULT_AUTO_ROTATE_INTERVAL = 2800;
const WHEEL_COOLDOWN_MS = 600;
const WHEEL_THRESHOLD = 12;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
  { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
  { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
  { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
];

const REM_PX = 16;
const BASE_MAX_X_REM = 30; // widest x-offset in FAN_POSITIONS
const FIT_SAFETY_PX = 8;
const MIN_FIT_MULTIPLIER = 0.05;

/**
 * Scales the fan's x-offsets so the outermost cards always fit inside the
 * *actual* container — measured directly, rather than assumed from the
 * viewport. A fixed viewport-width breakpoint (the original approach) works
 * for a full-width page section, but overflows as soon as this component is
 * embedded in a narrower column (e.g. the homepage's 67% split), since the
 * fan spread wouldn't know to shrink further for that context.
 */
function getFitMultiplier(containerWidth: number, cardHalfWidthPx: number) {
  const maxAllowedX = containerWidth / 2 - cardHalfWidthPx - FIT_SAFETY_PX;
  const raw = maxAllowedX / (BASE_MAX_X_REM * REM_PX);
  return Math.max(MIN_FIT_MULTIPLIER, Math.min(1, raw));
}

/**
 * Returns a multiplier (0..1] that scales y-offsets and entry animation
 * distances when the viewport is too short for the ideal layout height.
 */
function getHeightMultiplier(width: number) {
  // Ideal layout heights (in px at 16px root) matching the CSS breakpoints
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;       // 352px
  else if (width < 640) idealPx = 26 * 16;  // 416px
  else if (width < 768) idealPx = 28 * 16;  // 448px
  else if (width < 1024) idealPx = 34 * 16; // 544px
  else idealPx = 38 * 16;                    // 608px

  const available = window.innerHeight * 0.7; // 70vh budget
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-ink/10 bg-ink/5 backdrop-blur-[16px] text-ink/40 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(23,20,15,0.1)] hover:border-ink/25 hover:text-ink/70 active:opacity-70 transition-colors duration-300 before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:border before:border-ink/[0.04] before:pointer-events-none";

/**
 * Animated fan-of-cards, shared between the interactive Gallery page (full
 * pagination/arrows, click-to-open) and the Homepage preview (auto-rotating,
 * no manual controls). Configuration is prop-driven — see SocialCardsProps —
 * so both consumers share this one implementation.
 */
export default function SocialCards({
  cards,
  showControls = true,
  autoRotate = false,
  autoRotateInterval = DEFAULT_AUTO_ROTATE_INTERVAL,
  enableWheelNavigation = false,
}: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());
  const pausedByHoverRef = useRef(false);

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const cardHalfWidthPx = (cardElements[0].getBoundingClientRect().width || 176) / 2;
    const multiplier = getFitMultiplier(container.getBoundingClientRect().width, cardHalfWidthPx);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Hover interactions
    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    /**
     * `gentle` skips the neighbor-push spread used for mouse hover: it only
     * lifts/scales the focused card in place. The full push reads well for
     * a transient, user-driven hover, but repeatedly pushing neighbors apart
     * on every auto-rotate tick reads as a jarring gap opening and closing —
     * not the "calm, premium" motion auto-rotate calls for.
     */
    const updateHoverLayout = (hoveredSlot: number | null, gentle = false) => {
      const liveCardHalfWidthPx = (cardElements[0].getBoundingClientRect().width || 176) / 2;
      const mult = getFitMultiplier(container.getBoundingClientRect().width, liveCardHalfWidthPx);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else if (!gentle) {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale,
          duration: 0.5, delay, ease: "elastic.out(1,.75)", overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        pausedByHoverRef.current = true;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      pausedByHoverRef.current = false;
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => { if (!isAnimating.current) updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    // --- Auto-rotate ---------------------------------------------------
    // For small card counts (no pagination), "next" means shifting which
    // slot is emphasized, reusing the exact hover-focus GSAP animation
    // above. For large sets (pagination), "next" brings a new card into
    // view via the existing cycle() mechanism.
    let autoRotateTimer: ReturnType<typeof setInterval> | null = null;
    let focusedSlot = centerSlot;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (autoRotate && !prefersReducedMotion && visibleEntries.length > 1) {
      autoRotateTimer = setInterval(() => {
        if (pausedByHoverRef.current || document.hidden || isAnimating.current) return;
        if (needsPagination) {
          cycle("right");
        } else {
          focusedSlot = (focusedSlot + 1) % visibleEntries.length;
          activeSlot = focusedSlot;
          updateHoverLayout(focusedSlot, true);
        }
      }, autoRotateInterval);
    }

    // --- Wheel navigation ------------------------------------------------
    let lastWheelAt = 0;
    const onWheel = (e: WheelEvent) => {
      if (!enableWheelNavigation) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      const now = Date.now();
      if (now - lastWheelAt < WHEEL_COOLDOWN_MS) {
        e.preventDefault();
        return;
      }
      lastWheelAt = now;
      e.preventDefault();

      if (needsPagination) {
        cycle(e.deltaY > 0 ? "right" : "left");
      } else if (visibleEntries.length > 1) {
        focusedSlot =
          (focusedSlot + (e.deltaY > 0 ? 1 : -1) + visibleEntries.length) % visibleEntries.length;
        activeSlot = focusedSlot;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        updateHoverLayout(focusedSlot, true);
      }
    };
    if (enableWheelNavigation) {
      container.addEventListener("wheel", onWheel, { passive: false });
    }

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (enableWheelNavigation) container.removeEventListener("wheel", onWheel);
      if (leaveTimer) clearTimeout(leaveTimer);
      if (autoRotateTimer) clearInterval(autoRotateTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, autoRotate, autoRotateInterval, enableWheelNavigation, cycle]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg className="relative z-[2] w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className="flex flex-col items-center w-full py-4 lg:py-8 px-4 md:px-8 relative z-20">
      <div className="flex items-center justify-center w-full max-w-[90rem]">
        <div
          ref={containerRef}
          className="fan-layout flex relative justify-center items-center w-full max-w-[80rem] h-[22rem] min-[480px]:h-[26rem] min-[640px]:h-[28rem] min-[768px]:h-[34rem] min-[1024px]:h-[38rem]"
        >
          {cards.map((card, index) => {
            const image = (
              <div className="relative w-44 h-56 min-[640px]:w-48 min-[640px]:h-60 min-[1024px]:w-52 min-[1024px]:h-64 overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(23,20,15,0.15)]">
                <Image
                  src={card.imgUrl}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 13rem, (min-width: 640px) 12rem, 11rem"
                  alt={card.alt || `Gallery photo ${index + 1}`}
                  className="object-cover"
                />
              </div>
            );
            return card.linkUrl ? (
              <a
                key={index}
                href={card.linkUrl}
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="fan-card absolute top-1/2 left-1/2 -ml-22 -mt-28 block cursor-pointer min-[640px]:-ml-24 min-[640px]:-mt-30 min-[1024px]:-ml-26 min-[1024px]:-mt-32"
              >
                {image}
              </a>
            ) : (
              <div
                key={index}
                className="fan-card absolute top-1/2 left-1/2 -ml-22 -mt-28 min-[640px]:-ml-24 min-[640px]:-mt-30 min-[1024px]:-ml-26 min-[1024px]:-mt-32"
              >
                {image}
              </div>
            );
          })}
        </div>
      </div>

      {showControls && needsPagination && (
        <div className="flex items-center justify-center gap-4 mt-4 md:mt-6 z-30">
          <button className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`} onClick={() => cycle("left")} aria-label="Previous">
            {chevron("left")}
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === centerIndex ? "bg-ink/70 scale-[1.3]" : "bg-ink/15"}`} />
            ))}
          </div>
          <button className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`} onClick={() => cycle("right")} aria-label="Next">
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}
