<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import JamEntry from "../JAMEntry.svelte";

  import { onMount } from "svelte";
  import { usePlayer } from "../../player.svelte";
  import SelectPlaylist from "./SelectPlaylist.svelte";
  import TrackActions from "./TrackActions.svelte";

  import { ViewInfo, TabEnum } from "../../store.svelte";
  import { stringHelpers } from "../../utils.svelte";
  import Lyrics from "./Lyrics.svelte";

  let { jamInfo = { create: true } } = $props();

  let dragProg = $state({
    initial: 0,
    current: 0,
    is: false,
    startX: 0,
    clientWidth: 0,
  });

  onMount(() => {
    // mazhaneer thullikal
    // prettier-ignore
    // selection = {"show":{"moreActions":true,"selectPlaylist":true,"track":false},"track":{"id":"BNepbzkO","title":"Mazhaneer Thullikal (Male)","subtitle":"Ratheesh Vegha - Beautiful","header_desc":"","type":"song","perma_url":"https://www.jiosaavn.com/song/mazhaneer-thullikal-male/MiYOQRZKXHw","image":"https://c.saavncdn.com/661/Beautiful-Malayalam-2011-150x150.jpg","language":"malayalam","year":"2011","play_count":"508674","explicit_content":"0","list_count":"0","list_type":"","list":"","more_info":{"music":"Ratheesh Vegha","album_id":"2270793","album":"Beautiful","label":"Manorama Music","label_id":null,"origin":"search","is_dolby_content":false,"320kbps":"true","encrypted_media_url":"ID2ieOjCrwfgWvL5sXl4B1ImC5QfbsDyzLkRhUCnyMSrd5OfE6i+F59yE/IAvdChVkbfMMRFGCriXn+o5YqnqBw7tS9a8Gtq","encrypted_cache_url":"","encrypted_drm_cache_url":"","encrypted_drm_media_url":"ID2ieOjCrwdjlkMElYlzWCptgNdUpWD88vPsJDa+oT1pyi9JlQyJCRMAqF0yPkq68khkXJqRi68G9fbMcilAto92mytrdt3FDnQW0nglPS4=","album_url":"https://www.jiosaavn.com/album/beautiful/cF7W1d7pSPQ_","duration":"252","rights":{"code":"0","cacheable":"true","delete_cached_object":"false","reason":""},"cache_state":"false","has_lyrics":"false","lyrics_snippet":"","starred":"false","copyright_text":"©  2011 Manorama Music","artistMap":{"primary_artists":[{"id":"642572","name":"Ratheesh Vegha","role":"primary_artists","image":"https://c.saavncdn.com/722/Thrissur-Pooram-Malayalam-2019-20191204104536-150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/ratheesh-vegha-songs/Lh9gmDkAId8_"}],"featured_artists":[],"artists":[{"id":"642572","name":"Ratheesh Vegha","role":"music","image":"https://c.saavncdn.com/722/Thrissur-Pooram-Malayalam-2019-20191204104536-150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/ratheesh-vegha-songs/Lh9gmDkAId8_"},{"id":"455279","name":"Unni Menon","role":"singer","image":"https://c.saavncdn.com/artists/Unni_Menon_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/unni-menon-songs/8a4GOKXGRG0_"},{"id":"546982","name":"Anoop Menon","role":"lyricist","image":"https://c.saavncdn.com/artists/Anoop_Menon_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/anoop-menon-songs/loudek4uw6c_"},{"id":"546982","name":"Anoop Menon","role":"starring","image":"https://c.saavncdn.com/artists/Anoop_Menon_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/anoop-menon-songs/loudek4uw6c_"},{"id":"466229","name":"Jayasurya","role":"starring","image":"https://c.saavncdn.com/artists/Jayasurya_004_20230810075306_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/jayasurya-songs/ClaxT,LdtOg_"},{"id":"546983","name":"Meghana Raj","role":"starring","image":"https://c.saavncdn.com/artists/Meghana_Raj_002_20230810075626_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/meghana-raj-songs/2reQlxATfqE_"}]},"release_date":null,"label_url":"/label/manorama-music-albums/","vcode":"010910860812344","vlink":"https://jiotunepreview.jio.com/content/Converted/010910860768868.mp3","triller_available":false,"request_jiotune_flag":false,"webp":"false"},"button_tooltip_info":[]}}
    // chandhanamani
    // prettier-ignore
    // selection = {"show":{"moreActions":true,"selectPlaylist":true,"track":false},"track":{"id":"V-6VQHsD","title":"Chandhanamani","subtitle":"M.G. Radhakrishnan - Praja (Original Motion Picture Soundtrack)","header_desc":"","type":"song","perma_url":"https://www.jiosaavn.com/song/chandhanamani/JkVdZyV4RHc","image":"https://c.saavncdn.com/479/Praja-Original-Motion-Picture-Soundtrack-Malayalam-2001-20240621154349-150x150.jpg","language":"malayalam","year":"2001","play_count":"382514","explicit_content":"0","list_count":"0","list_type":"","list":"","more_info":{"music":"M.G. Radhakrishnan","album_id":"55455636","album":"Praja (Original Motion Picture Soundtrack)","label":"Satyam Audios","label_id":null,"origin":"search","is_dolby_content":false,"320kbps":"true","encrypted_media_url":"ID2ieOjCrwfgWvL5sXl4B1ImC5QfbsDyErKzmZFBZk9d1dfZV1MN/PTkSazNnAvUSvjZpqWHIhELUQ5/nj93Qhw7tS9a8Gtq","encrypted_cache_url":"","encrypted_drm_cache_url":"","encrypted_drm_media_url":"ID2ieOjCrwdjlkMElYlzWCptgNdUpWD8e6IydqwAjaM08x2sHzg6Z89KnXRFxH6KO3RXG2ttrmkiocWbDOwL/o92mytrdt3FDnQW0nglPS4=","album_url":"https://www.jiosaavn.com/album/praja-original-motion-picture-soundtrack/LVzjTAFYr90_","duration":"328","rights":{"code":"0","cacheable":"true","delete_cached_object":"false","reason":""},"cache_state":"false","has_lyrics":"false","lyrics_snippet":"","starred":"false","copyright_text":"(P) 2001 Sony Music Entertainment India Pvt. Ltd. Under Exclusive Distribution For Satyam Audios","artistMap":{"primary_artists":[{"id":"491876","name":"M.G. Radhakrishnan","role":"primary_artists","image":"https://c.saavncdn.com/artists/M_G_Radhakrishnan_001_20201212113203_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/m.g.-radhakrishnan-songs/aS8gwHoxDCs_"}],"featured_artists":[],"artists":[{"id":"491876","name":"M.G. Radhakrishnan","role":"music","image":"https://c.saavncdn.com/artists/M_G_Radhakrishnan_001_20201212113203_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/m.g.-radhakrishnan-songs/aS8gwHoxDCs_"},{"id":"491876","name":"M.G. Radhakrishnan","role":"singer","image":"https://c.saavncdn.com/artists/M_G_Radhakrishnan_001_20201212113203_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/m.g.-radhakrishnan-songs/aS8gwHoxDCs_"},{"id":"491878","name":"M.G. Sreekumar","role":"singer","image":"https://c.saavncdn.com/artists/M_G_Sreekumar_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/m.g.-sreekumar-songs/Cw59Aq6xqlA_"},{"id":"546329","name":"Gireesh Puthenchery","role":"lyricist","image":"https://c.saavncdn.com/artists/Gireesh_Puthenchery_000_20230217092415_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/gireesh-puthenchery-songs/dLfixABGlzA_"},{"id":"467088","name":"Mohanlal","role":"starring","image":"https://c.saavncdn.com/artists/Mohanlal_004_20180706155810_150x150.jpg","type":"artist","perma_url":"https://www.jiosaavn.com/artist/mohanlal-songs/L23yyTucAW4_"},{"id":"666494","name":"Aiswaraya","role":"starring","image":"","type":"artist","perma_url":"https://www.jiosaavn.com/artist/aiswaraya-songs/SCi-,dG2buI_"}]},"release_date":null,"label_url":"/label/satyam-audios-albums/","vcode":"010910090266099","vlink":"https://jiotunepreview.jio.com/content/Converted/010910090278730.mp3","triller_available":false,"request_jiotune_flag":false,"webp":"true"},"button_tooltip_info":[]}}
    switchView(TabEnum.search);
  });

  // $effect(() => console.log(JSON.stringify(selection)));
  const switchView = async (name: TabEnum) => {
    if (!(name in tab.views)) return;

    if (!tab.views[name].component) {
      tab.loading = true;
      tab.views[name].component = await tab.views[name].loader();
      // tab.views[name].component = await import(tab.views[name].url);
      tab.loading = false;
    }

    $ViewInfo.tab = name;
  };

  let tab = $state({
    loading: false,
    views: {
      [TabEnum.search]: {
        loader: () => import("./Search.svelte"),
        path: {
          default: `<path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
`,
          selected: `<path
              d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z"
            />
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
              clip-rule="evenodd"
            />`,
        },
      },

      [TabEnum.library]: {
        loader: () => import("./Library.svelte"),
        path: {
          default: `
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
`,
          selected: `<path
            d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"
          />`,
        },
      },
      [TabEnum.settings]: {
        loader: () => import("./Settings.svelte"),
        path: {
          default: `
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
`,
          selected: `<path
            fill-rule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
            clip-rule="evenodd"
          />`,
        },
      },
    } as {
      [key: string]: {
        loader: () => any;
        path: { default: string; selected: string };
        component?: any;
      };
    },
  });

  onMount(() => {
    const now = Date.now();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("cache-search-")) {
        const value = JSON.parse(localStorage.getItem(key) as string);
        if (value.expiry < now) {
          localStorage.removeItem(key);
        }
      }
    });
  });
</script>

<svelte:head>
  <meta property="theme-color" content="#000" />
  <title>{stringHelpers.capitalize($ViewInfo.tab)} - Svara</title>
</svelte:head>
<div class="w-[100dwv] h-dvh bg-white dark:bg-black text-black dark:text-white">
  <!-- {#await tab.views[$ViewInfo.tab].component()} -->
  {#each Object.keys(tab.views) as viewItem}
    {#if tab.views[viewItem].component}
      {@const Component = tab.views[viewItem].component}
      <Component.default />
    {/if}
  {/each}

  {#if tab.loading}
    <div
      class="backdrop-blur-lg backdrop-brightness-40 absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center"
      transition:fade={{ duration: 150, delay: 100 }}
    >
      <h1 class="text-2xl font-medium text-center mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-[1em] mr-2 animate-spin inline"
          style="animation-duration: 750ms;"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>Loading...
      </h1>
      <p
        class="text-black/80 dark:text-white/50 text-center text-sm max-w-[75%]"
      >
        Svara loads pages on-demand, so you only get what you need
      </p>
    </div>
  {/if}
  <!-- {:then Component}
    <Component.default />
  {/await} -->
  <!-- bottom transition gradient -->
  <div
    class="absolute h-[15dvh] -bottom-[0dvh] w-screen bg-linear-to-b from-white/0 dark:from-black/0 to-40% to-white dark:to-black"
  ></div>
  <div
    transition:fly={{ duration: 250, y: 100 }}
    class="absolute max-h-[19dvh] space-y-[1dvh] w-screen -bottom-[0dvh] flex flex-col items-center"
  >
    {#if usePlayer.info.init}
      <div
        class="h-[8dvh] w-[95dvw] ring-1 ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/5 rounded-md backdrop-brightness-80 dark:backdrop-brightness-20 backdrop-blur-lg flex flex-row items-center px-[0.5dvh] pt-[0.5dvh] border-t border-white/5 dark:border-white/5 overflow-hidden"
      >
        <div
          class="h-[2px] inset-0 w-full bg-black/5 dark:bg-white/5 absolute top-0 rounded-full overflow-hidden"
          transition:fade={{ duration: 250 }}
        >
          {#if usePlayer.info.fetch != 0}
            <div
              class="h-full bg-black/20 dark:bg-white/20 absolute"
              style="width: {usePlayer.info.fetch}%;"
            ></div>
          {/if}
          <div
            class="h-full bg-red-500 dark:bg-red-900 absolute z-10"
            style="width: {(usePlayer.info.t / usePlayer.info.dur) * 100}%;"
          ></div>
        </div>

        {#if !$ViewInfo.sheets.track}
          <img
            src={usePlayer.info.meta.img}
            alt="song thumbnail"
            id="player-thumbnail"
            class="h-[6dvh] aspect-square rounded-md col-span-2 text-xs"
            style="view-transition-name: player-thumbnail;"
          />
        {/if}
        <div class="grid grid-cols-10">
          {#if !$ViewInfo.sheets.track}
            <button
              class="p-0 m-0 col-span-8 pl-2"
              onclick={() => {
                if (!document.startViewTransition)
                  $ViewInfo.sheets.track = true;
                else
                  document.startViewTransition(
                    () => ($ViewInfo.sheets.track = true)
                  );
              }}
            >
              <p
                class="font-medium text-md text-left truncate"
                style="view-transition-name: player-title;"
              >
                {@html usePlayer.info.meta.title}
                <span
                  class="font-normal text-sm text-black/80 dark:text-white/80 block"
                  style="view-transition-name: player-artist"
                  >{@html usePlayer.info.meta.artist}</span
                >
              </p></button
            >
          {/if}

          <!-- <button
          onclick={() => (showJAM = true)}
          aria-label="start jam session"
          class="p-0 m-0 col-span-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-full"
          >
            <path
              fill-rule="evenodd"
              d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
              clip-rule="evenodd"
            />
          </svg>
        </button> -->
          <button
            class="p-0 m-0 col-span-1"
            onclick={() => {
              if (usePlayer.info.playing) usePlayer.playback.pause();
              else usePlayer.playback.resume();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-full mr-[1ch]"
            >
              {#if usePlayer.info.playing}
                <path
                  transition:fade={{ duration: 150 }}
                  fill-rule="evenodd"
                  d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                  clip-rule="evenodd"
                />
              {:else}
                <path
                  transition:fade={{ duration: 150 }}
                  fill-rule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clip-rule="evenodd"
                />
              {/if}
            </svg></button
          >
          <button
            class="p-0 m-0 col-span-1 disabled:text-black/25 dark:disabled:text-white/25"
            disabled={usePlayer.info.queue.length - 1 <= usePlayer.info.qi}
            onclick={() => {
              usePlayer.playback.next();
            }}
            aria-label="next song"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-full mr-[1ch]"
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    {/if}
    <div
      class="h-[10dvh] text-xs w-dvw bg-black/5 dark:bg-white/5 rounded-t-md backdrop-brightness-80 dark:backdrop-brightness-20 backdrop-blur-lg flex flex-row items-start justify-center overflow-hidden"
      transition:fly={{ duration: 500, y: 100 }}
    >
      <!-- <div
        class="absolute left-0 top-0 w-1/3 h-3/4 z-0 bg-black/5 dark:bg-white/5 rounded-md text-xs"
      ></div> -->
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
  </div>
  {#if $ViewInfo.sheets.track}
    <div
      in:fly={{ duration: 500, y: 750 }}
      out:fly={{ duration: 500, y: 750 }}
      class="absolute top-0 left-0 w-dvw h-dvh bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md overflow-y-scroll no-scrollbar"
    >
      <div class="w-full flex flex-col items-center relative">
        <div
          class="flex flex-row justify-between w-full py-[2.5dvw] px-[2.5dvw] sticky top-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md z-10"
        >
          <button
            onclick={() => ($ViewInfo.sheets.track = false)}
            aria-label="close sheet"
            class="p-0 m-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-7 dark:fill-white/50 fill-black/50"
            >
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button><button
            onclick={() => {
              $ViewInfo.sheets.actions = true;
            }}
            aria-label="close sheet"
            class="p-0 m-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-7 dark:fill-white/50 fill-black/50"
            >
              <path
                fill-rule="evenodd"
                d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <!-- <img
          src={usePlayer.info.meta.img}
          alt="song thumbnail"
          class="w-[80dvw] max-h-[50dvh] object-contain rounded-md mt-[2.5dvh] rounded-md"
          style="view-transition-name: player-thumbnail;"
        /> -->
        <div
          class="w-[80dvw] max-w-[500px] max-h-[70dvh] rounded-md mt-[10dvh] overflow-hidden flex items-center justify-center"
        >
          <img
            style="view-transition-name: player-thumbnail;"
            src={usePlayer.info.meta.img}
            alt="song thumbnail"
            class="w-full h-full object-contain rounded-md shadow-white dark:shadow-black shadow-xs"
          />
        </div>
        <div class="-space-y-1 mt-4 px-[2.5dvw] flex flex-col items-center">
          <h1 class="text-2xl font-bold line-clamp-1">
            {@html usePlayer.info.meta.title}
          </h1>
          <p style="view-transition-name: player-artist">
            <span class="text-black/50 dark:text-white/50">by</span>
            {@html usePlayer.info.meta.artist}
          </p>
        </div>

        <div class="mt-12">
          <div
            class="h-10 flex flex-col justify-center w-min -my-3"
            onpointerdown={(e) => {
              dragProg.is = true;
              dragProg.startX = e.clientX;
              dragProg.initial = usePlayer.info.t / usePlayer.info.dur;
            }}
            onpointermove={(e) => {
              if (!dragProg.is) return;

              const dx = e.clientX - dragProg.startX;
              dragProg.current = Math.min(
                Math.max(dragProg.initial + dx / dragProg.clientWidth, 0),
                1
              );
            }}
            onpointerup={(e) => {
              dragProg.is = false;
              usePlayer.playback.seekTo(dragProg.current * usePlayer.info.dur);
            }}
            role="progressbar"
          >
            <div
              class="{dragProg.is
                ? 'h-[10px]'
                : 'min-h-[5px]'} w-[95dvw] bg-black/5 dark:bg-white/5 rounded-full overflow-hidden relative transition-transform duration-200"
              bind:clientWidth={dragProg.clientWidth}
            >
              {#if usePlayer.info.fetch != 0}
                <div
                  class="h-full bg-black/20 dark:bg-white/20 absolute"
                  style="width: {usePlayer.info.fetch}%;"
                ></div>
              {/if}
              <div
                class="h-full bg-red-500 dark:bg-red-900 absolute"
                style="width: {dragProg.is
                  ? dragProg.current * 100
                  : (usePlayer.info.t / usePlayer.info.dur) * 100}%;"
              ></div>
            </div>
          </div>

          <div class="flex flex-row justify-between items-center text-sm">
            <p>
              {new Date(
                dragProg.is
                  ? dragProg.current * usePlayer.info.dur * 1000
                  : usePlayer.info.t * 1000
              )
                .toISOString()
                .slice(14, 19)}
            </p>
            <p>
              {new Date(usePlayer.info.dur * 1000).toISOString().slice(14, 19)}
            </p>
          </div>
        </div>
        <div class="flex flex-row items-center justify-evenly w-[95dvw] mt-4">
          <!-- shuffle -->
          <button
            class="p-0 m-0 w-6 {usePlayer.info.controls.shuffle
              ? 'text-violet-500 dark:text-violet-600'
              : ''}"
            aria-label="next song"
            onclick={() => {
              usePlayer.info.controls.shuffle =
                !usePlayer.info.controls.shuffle;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
              class="size-full"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </button>

          <!-- previous -->
          <button
            class="p-0 m-0 w-8 disabled:text-black/25 dark:disabled:text-white/25"
            aria-label="previous song"
            disabled={usePlayer.info.qi < 1}
            onclick={() => {
              usePlayer.playback.previous();
            }}
          >
            <!-- disabled={usePlayer.info.queue.length - 1 <= usePlayer.info.qi} -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-full"
            >
              <path
                fill-rule="evenodd"
                d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <!-- pause/play -->
          <button
            class="p-0 m-0 w-12"
            onclick={() => {
              if (usePlayer.info.playing) usePlayer.playback.pause();
              else usePlayer.playback.resume();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-full"
            >
              {#if usePlayer.info.playing}
                <path
                  transition:fade={{ duration: 150 }}
                  fill-rule="evenodd"
                  d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                  clip-rule="evenodd"
                />
              {:else}
                <path
                  transition:fade={{ duration: 150 }}
                  fill-rule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clip-rule="evenodd"
                />
              {/if}
            </svg></button
          >
          <!-- next -->
          <button
            class="p-0 m-0 w-8 disabled:text-black/25 dark:disabled:text-white/25"
            aria-label="next song"
            disabled={usePlayer.info.queue.length - 1 <= usePlayer.info.qi}
            onclick={() => {
              usePlayer.playback.next();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-full"
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <!-- loop -->
          <button
            class="p-0 m-0 w-6 {usePlayer.info.controls.loop
              ? 'text-violet-500 dark:text-violet-600'
              : ''}"
            aria-label="next song"
            onclick={() => {
              usePlayer.info.controls.loop = !usePlayer.info.controls.loop;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              class="size-full"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
              />
            </svg>
          </button>
        </div>
        <!-- <div class="w-[90dvw] h-[5px] bg-red-500">
        <div></div>
      </div> -->

        {#if usePlayer.info.meta.lyrics}
          <Lyrics
            color={usePlayer.info.meta.color}
            content={usePlayer.info.meta.lyrics.content}
            bind:time={usePlayer.info.t}
            handleSeek={(time: number) => {
              usePlayer.info.audioElm.currentTime = time;
            }}
          />
        {/if}
      </div>
    </div>
  {/if}
  <!-- <Sheet bind:visible={$ViewInfo.sheets.track}>
    {#snippet title()}
      <h1
        class=" truncate max-w-[80%]"
        style="view-transition-name: player-title;"
      >
        {@html usePlayer.info.meta.title}
      </h1>
    {/snippet}
    {#snippet body()}
      <div class="overflow-y-scroll">
        <div class="flex flex-col items-center justify-center">
          <img
            src={usePlayer.info.meta.img}
            alt="song thumbnail"
            class="w-[50dvw] rounded-md shadow-white dark:shadow-black shadow-xl"
            style="view-transition-name: player-thumbnail;"
          />
          <p
            class=" mt-[5dvh]"
            style="view-transition-name: player-artist"
          >
            by <b>{@html usePlayer.info.meta.artist}</b>
          </p>
          <p class="text-black/50 dark:text-white/50 italic">
            @{usePlayer.info.t}s for id:{usePlayer.info.meta.id}
          </p>
        </div>
        {#if usePlayer.info.meta.lyrics}
          <div
            class="bg-black/5 dark:bg-white/5  w-[95dvw] h-fit p-2 rounded-t-md overflow-hidden"
          >
            <h3 class="text-xl">
              Lyrics <span
                class="text-[8px] text-black/80 dark:text-white/80 bg-black/5 dark:bg-white/5 p-0.5 rounded-xs"
                >Powered by LRCLIB</span
              >
            </h3>
            <ul class="max-h-full px-2 text-md space-y-2">
              {#each usePlayer.info.meta.lyrics.content as block}
                <li
                  class={usePlayer.info.t >= block.time
                    ? ""
                    : "text-black/80 dark:text-white/50"}
                >
                  <button
                    class="m-0 p-0 text-left text-current"
                    onclick={() => {
                      usePlayer.info.audioElm.currentTime = block.time;
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
          </div>
        {/if}
      </div>
    {/snippet}
  </Sheet> -->
  {#if $ViewInfo.sheets.actions || $ViewInfo.sheets.selectPlaylist}
    <div
      in:fade={{ duration: 250 }}
      out:fade={{ duration: 250, delay: 100 }}
      class="absolute top-0 h-dvh w-dvw backdrop-brightness-15 bg-transparent"
    >
      {#if $ViewInfo.sheets.selectPlaylist}
        <SelectPlaylist />
      {:else if $ViewInfo.sheets.actions}
        <TrackActions />
      {/if}
    </div>
  {/if}

  <JamEntry bind:visible={$ViewInfo.sheets.jam} info={jamInfo} />
</div>
