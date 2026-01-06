<script lang="ts">
  import { fly } from "svelte/transition";
  import { ViewInfo, TabEnum } from "../../store.svelte";

  let { tab, switchView } = $props();
</script>

<div
  class="h-[10dvh] text-xs w-dvw bg-black/5 dark:bg-white/5 rounded-t-md backdrop-brightness-80 dark:backdrop-brightness-20 backdrop-blur-lg flex flex-row items-start justify-center overflow-hidden"
  transition:fly={{ duration: 500, y: 100 }}
>
  {#each Object.keys(tab.views) as item}
    <button
      class="w-full flex flex-col items-center justify-center {$ViewInfo.tab ==
      item
        ? 'text-violet-600 dark:text-violet-500 font-medium'
        : ''}"
      onclick={() => {
        switchView(item as TabEnum);
      }}
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="size-7 {$ViewInfo.tab == item
          ? 'fill-current'
          : `stroke-current stroke-[1.5px] fill-none`}"
      >
        {@html $ViewInfo.tab == item
          ? tab.views[item].path.selected
          : tab.views[item].path.default}
      </svg>
      {item}</button
    >
  {/each}
</div>
