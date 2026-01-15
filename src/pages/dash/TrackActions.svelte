<script lang="ts">
  import { ViewInfo } from "../../store.svelte";
  import { JioSaavnSource } from "../../source.svelte";
  import { usePlayer } from "../../player.svelte";

  const handleAddToQueue = async () => {
    const mediaURLs = await JioSaavnSource.getDownloadableURLs(
      $ViewInfo.select.track
    );

    if (mediaURLs.length == 0) {
      console.error("no media url found for track");
      return;
    }
    const highestQURL = mediaURLs.at(-1)?.url;
    usePlayer.playback.appendQueue(
      {
        id: $ViewInfo.select.track.id,
        title: $ViewInfo.select.track.title,
        img: $ViewInfo.select.track.image,
        artist:
          $ViewInfo.select.track.more_info.artistMap.primary_artists[0].name ||
          "",
        album: $ViewInfo.select.track.more_info.album || "",
      },
      highestQURL
    );

    $ViewInfo.sheets.actions = false;
  };
</script>

<button
  aria-label="close sheet"
  class="w-screen h-[70dvh] bottom-[30dvh]"
  onclick={(e) => {
    if (e.target == e?.currentTarget) $ViewInfo.sheets.actions = false;
  }}
></button>
<div
  class="absolute -bottom-[0px] left-1/2 -translate-x-1/2 h-[30dvh] w-[95dvw] bg-gray-200 dark:bg-zinc-900 rounded-t-lg text-md"
>
  <p
    class="w-full text-center text-lg font-medium text-black dark:text-white py-1 border-b-1 border-black/20 dark:border-white/20"
  >
    Actions
  </p>
  <button
    class="bottom-[calc(30dvh-1.725rem)] p-0 absolute right-[1ch]"
    aria-label="close sheet"
    onclick={(e) => {
      $ViewInfo.sheets.actions = false;
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="size-6 dark:fill-white fill-black"
    >
      <path
        fill-rule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
  <ul class="more-actions-sheet-ul text-black dark:text-white">
    <li class="">
      <button class="w-full text-left" onclick={() => handleAddToQueue()}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-[1.2em] inline mr-2 ml-4"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clip-rule="evenodd"
          />
        </svg>
        Add to queue</button
      >
    </li>
    <li class="">
      <button
        class="w-full text-left"
        onclick={() => ($ViewInfo.sheets.selectPlaylist = true)}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-[1.2em] inline mr-2 ml-4"
        >
          <path
            fill-rule="evenodd"
            d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V10.5Z"
            clip-rule="evenodd"
          />
        </svg>
        Add to playlist</button
      >
    </li>

    <li class="">
      <button class="w-full text-left"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-[1.2em] inline mr-2 ml-4"
        >
          <path
            fill-rule="evenodd"
            d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
            clip-rule="evenodd"
          />
        </svg>
        Share</button
      >
    </li>
    <li class="">
      <button
        class="w-full text-left text-blue-500 dark:text-blue-400"
        onclick={() => {
          window.open($ViewInfo.select.track.perma_url, "_blank");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-[1.2em] inline mr-2 ml-4"
        >
          <path
            fill-rule="evenodd"
            d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
            clip-rule="evenodd"
          />
        </svg>

        Open song source</button
      >
    </li>
  </ul>
</div>

<style>
  .more-actions-sheet-ul > li {
    @apply border-b-2 border-black/20 dark:border-white/20;
  }
</style>
