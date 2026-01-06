<script lang="ts">
  let {
    content,
    color,
    time = $bindable(0),
    handleSeek,
  }: {
    content: { time: number; text: string }[];
    time: number;
    color: string;
    handleSeek: (time: number) => void;
  } = $props();

  let previousLyricEle = $state();
  let container = $state({} as HTMLUListElement);

  $effect(() => {
    time;
    const lyricEle = document.getElementById("current-lyric");

    if (previousLyricEle == lyricEle) return;
    if (!lyricEle) return;

    // console.table({
    //   sY: lyricEle.clientTop,
    //   // y: lyricEle.getBoundingClientRect().,
    //   top: container.clientTop,
    //   mid: container.clientHeight / 2,
    // });

    if (
      Math.abs(
        lyricEle.getBoundingClientRect().y -
          container.clientTop -
          container.clientHeight / 2
      ) < 250
    ) {
      // console.info("focusing");
      lyricEle.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    previousLyricEle = lyricEle;
  });

  // console.log(color);
</script>

<div
  class="relative w-[95dvw] h-fit p-2 pb-0 rounded-t-md overflow-hidden mt-5"
  style="background-color: {color};"
>
  <h3 class="text-xl">
    Lyrics <span
      class="text-[8px] text-black/80 dark:text-white/80 bg-black/5 dark:bg-white/5 p-0.5 rounded-xs"
      >Powered by LRCLIB</span
    >
  </h3>

  <div
    class="absolute w-full h-[20px] left-0"
    style="background: linear-gradient(to bottom, {color}, {color}00);"
  ></div>
  <ul
    class="max-h-[75dvh] px-2 space-y-2 overflow-y-scroll py-[20px]"
    bind:this={container}
  >
    {#each content as block, bi}
      {@const isCurrent =
        (time >= block.time && time < content[bi + 1]?.time) || 0}
      <li class={isCurrent ? "" : "text-black/50 dark:text-white/30"}>
        <button
          class="m-0 p-0 text-left text-current leading-[25px] text-[20px] font-semibold"
          id={isCurrent ? "current-lyric" : ""}
          onclick={() => {
            handleSeek(block.time);
          }}>{block.text}</button
        >
      </li>
    {:else}
      <li class="dark:text-white/50 text-black/80">
        Currently not available. You can contribute lyrics through <a
          class="dark:text-blue-400 text-blue-600 after:content-['_↗']"
          href="https://lrclib.net/"
          target="_blank">LRCLIB</a
        >
      </li>
    {/each}
  </ul>
  <div
    class="absolute w-full h-[20px] bottom-0 left-0"
    style="background: linear-gradient(to top, {color}, {color}00);"
  ></div>
</div>
