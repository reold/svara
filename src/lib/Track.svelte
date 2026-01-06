<script lang="ts">
  import { fade } from "svelte/transition";

  const {
    track,
    playing = false,
    onPlay,
    onMoreActions,
  }: {
    track: { title: string; subtitle: string; image: string };
    playing?: boolean;
    onPlay?: () => void;
    onMoreActions?: () => void;
  } = $props();

  let touch = $state({
    held: false,
    originX: 0,
    originY: 0,
    completed: false,
  });

  const swipeController = {
    start: ({ clientX: x, clientY: y }: PointerEvent) => {
      touch.held = true;
      touch.originX = x;
      touch.originY = y;
      focused = true;

      window.addEventListener("pointerup", swipeController.end);
      window.addEventListener("pointermove", swipeController.move);
    },
    move: ({ clientX: x, clientY: y }: PointerEvent) => {
      if (!touch.held) return;
      const dX = x - touch.originX;
      const dY = y - touch.originY;

      if (Math.abs(dY) > 50) {
        touch.held = false;
        focused = false;
      }
    },
    end: () => {
      touch.held = false;
      touch.completed = true;
      focused = false;

      window.removeEventListener("pointermove", swipeController.move);
      window.removeEventListener("pointerup", swipeController.end);
    },
  };
  let focused = $state(false);
</script>

<div
  transition:fade={{ duration: 200 }}
  class="w-full h-[calc(var(--spacing)*18)] pl-1.5 ring-zinc-500 text-black dark:text-white overflow-hidden flex flex-row border-b-0 border-black/5 dark:border-white/5 select-none transition-colors duration-100 {focused
    ? 'bg-black/5 dark:bg-white/5'
    : 'bg-transparent'}"
  onpointerdown={swipeController.start}
  onpointerup={swipeController.end}
  onpointercancel={swipeController.end}
  role="button"
>
  <button
    class="p-0 m-0 h-12 min-w-12 my-auto transition-transform duration-200 rounded-lg overflow-hidden {focused
      ? 'scale-105'
      : ''}"
    onclick={(e) => {
      if (!playing && onPlay) {
        onPlay();
      }
    }}
  >
    {#if track.image}
      <img src={track.image} alt="cover art" class="h-full" loading="lazy" />
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="mx-auto h-10 stroke-violet-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
        />
      </svg>
    {/if}
  </button>
  <button
    class="flex flex-col overflow-x-hidden -space-y-0 justify-center text-left w-full"
    onclick={(e) => {
      if (!playing && onPlay) {
        onPlay();
      }
    }}
  >
    <h2
      class="font-medium text-md max-w-full truncate {playing
        ? 'text-violet-600 dark:text-violet-500'
        : ''}"
    >
      {@html track.title}
    </h2>
    <span
      class="font-light text-[0.7em] text-black/80 dark:text-white/80 pl-2 truncate max-w-full"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-[0.7em] inline"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"
        />
      </svg>
      {@html track.subtitle}</span
    >
  </button>

  <button
    class="p-0 text-black dark:text-white w-16 flex flex-col items-center justify-center"
    aria-label="visit source link"
    onclick={onMoreActions}
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      class="size-[1.3em] dark:stroke-white/50 stroke-black/50"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
      />
    </svg>
  </button>
</div>
