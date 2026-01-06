<script lang="ts">
  import Sheet from "../components/Sheet.svelte";
  import { onMount } from "svelte";
  import { p2pServices } from "../services.svelte";
  import { P2PInfo } from "../store.svelte";

  let { visible = $bindable(false), info = { create: true, roomId: "" } } =
    $props();

  let form = $state({
    username: "",
    sessionName: "",
    warning: "",
  });

  let msgsDiv: HTMLDivElement | undefined = $state(undefined);

  // auto-scroll to bottom of chat
  $effect(() => {
    P2PInfo.room.messages;
    msgsDiv?.scrollTo({
      top: msgsDiv.scrollHeight,
      behavior: "smooth",
    });
  });

  $effect(() => {
    if (visible && !P2PInfo.initialized) {
      if (info.create) {
        p2pServices.init(true);
      } else {
        p2pServices.init(false, { id: info.roomId });
      }
      P2PInfo.peer?.on("error", (err) => {
        console.error("PeerJS error:", err);
        P2PInfo.room.messages = [
          ...P2PInfo.room.messages,
          {
            username: "server",
            content: `Error: ${err.type}`,
            time: String(Date.now() / 1000),
          },
        ];
      });
    }
  });

  onMount(() => {
    // // prettier-ignore
    // room = JSON.parse(` {"connected":true,"activity":"(1/1)","id":"9801ad8f-46df-4a21-b7e1-b4c2a75e2967","name":"reold's Music Session is the best in the world","messages":[{"type":"msg","username":"reold","content":"Hell owordl","time":"1745439165.127"},{"type":"msg","username":"reold","content":"my name is aadhi","time":"1745439168.261"},{"type":"msg","username":"reold","content":"wow","time":"1745439168.831"},{"type":"msg","username":"reold","content":"nice ","time":"1745439170.461"},{"type":"msg","username":"reold","content":"indigo","time":"1745439172.156"}]}`);
    // return;

    return () => {
      p2pServices.close();
    };
  });

  const handleCreate = () => {
    form.username = form.username.trim();
    if (form.username.length < 4) {
      form.warning = "username must be more than 3 characters in length";
      return;
    }

    if (form.sessionName.length == 0) {
      form.sessionName = `${form.username}'s session`;
    }

    P2PInfo.user.name = form.username;
    p2pServices.create(form.sessionName);
  };

  const handleJoin = () => {
    if (!info.roomId) {
      form.warning = "room id is required";
      return;
    }

    form.username = form.username.trim();
    if (form.username.length < 4) {
      form.warning = "username must be more than 3 characters in length";
      return;
    }

    if (!info.roomId || !P2PInfo.initialized) {
      form.warning =
        "Invalid room ID or peer not initialized. Please try again.";
      return;
    }

    P2PInfo.user.name = form.username;
    console.log("joining room", info.roomId);
    p2pServices.join();
  };

  const handleSendMessage = () => {
    if (!messageContent.length) return;

    p2pServices.chat.send(messageContent);

    messageContent = "";
    // console.log(JSON.stringify(room));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.host + window.location.pathname}#join${P2PInfo.room.id}`
    );
    P2PInfo.room.messages = [
      ...P2PInfo.room.messages,
      {
        username: "svara",
        content: `invite link copied to clipboard`,
        time: String(Date.now() / 1000),
      },
    ];
  };

  let messageContent = $state("");
</script>

<Sheet bind:visible>
  {#snippet title()}
    <h1 class="text-black dark:text-white select-none truncate max-w-[80dvw]">
      {#if !P2PInfo.connected}
        <span class="text-black/50 dark:text-white/50">
          {!info.create ? "Join:" : "Create:"}
        </span>
        JAM Session
      {:else}
        <span class="text-black/50 dark:text-white/50 text-sm">
          {P2PInfo.room.activity}
        </span>
        {P2PInfo.room.name}
      {/if}
    </h1>
  {/snippet}
  {#snippet body()}
    {#if !P2PInfo.connected}
      <p class="text-black dark:text-white text-sm select-none">
        JAM Sessions let you and your friends enjoy music together, no matter
        where you are in the world. <span
          class=" text-black/50 dark:text-white/50"
        >
          Your client ID is unique to your browser. If you switch browsers,
          you'll need to start a new session, as your previous one cannot be
          resumed.
        </span>
      </p>
      <div class="flex flex-col space-y-2 w-[95dvw] mt-[5dvh]">
        <p class="text-red-500 text-xs">
          {form.warning}
        </p>
        <div
          class="text-white flex flex-row items-center bg-white/5 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-[1.2em] ml-2"
          >
            <path
              fill-rule="evenodd"
              d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z"
              clip-rule="evenodd"
            />
          </svg>

          <input
            type="text"
            name="username"
            id="username"
            bind:value={form.username}
            placeholder="Username"
            class="bg-transparent ring-0 focus:outline-hidden w-full py-1 pr-2"
            autocomplete="username"
          />
        </div>
        {#if info.create}
          <input
            type="text"
            name="room title"
            id="room title"
            bind:value={form.sessionName}
            placeholder="Session Name, e.g., Varun's Party Music"
            class="bg-white/5 ring-0 focus:outline-hidden rounded-md py-1 px-2 text-white"
            autocomplete="off"
          />
        {/if}
        <p
          class="text-zinc-500 flex flex-row items-center space-x-2 h-[2ch] overflow-hidden"
        >
          <span class="text-xs">room-id: </span>
          <span
            class="truncate w-[75dvw] inline-block text-xs whitespace-nowrap"
            >{P2PInfo.room.id}</span
          >
        </p>
        <button
          class="text-white bg-purple-500 rounded-md font-bold select-none"
          onclick={() => {
            if (info.create) {
              handleCreate();
            } else {
              handleJoin();
            }
          }}
          aria-label="{info.create ? 'create' : 'join'} jam session"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-[1em] inline"
          >
            <path
              fill-rule="evenodd"
              d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
              clip-rule="evenodd"
            />
          </svg>
          {info.create ? "create" : "join"}</button
        >
      </div>
    {:else}
      <div
        class="w-dvw h-[80dvh] max-h-[70dvh] overflow-y-scroll overflow-x-hidden text-white ring-1 ring-white/5 mb-2"
        bind:this={msgsDiv}
      >
        <div
          class="sticky top-0 flex flex-row justify-end border-b-0 w-dvw h-[5dvh]"
        >
          <button
            aria-label="copy session invite link"
            class="w-[15%] flex flex-col items-center justify-center rounded-bl-md overflow-hidden p-0 m-0 max-h-[3em] select-none bg-linear-to-b from-black/10 dark:from-white/10 to-black/5 dark:to-white/5 backdrop-blur-3xl"
            onclick={() => handleShare()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="text-violet-500 aspect-square p-[0.1em] h-[2em] inline-block"
            >
              <path
                fill-rule="evenodd"
                d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                clip-rule="evenodd"
              />
            </svg></button
          >
        </div>
        {#each P2PInfo.room.messages as msg, mi}
          <div
            class="{msg.username == P2PInfo.user.name
              ? 'ml-auto rounded-br-none mr-1'
              : 'rounded-bl-none ml-1'} {mi - 1 !== -1 &&
            P2PInfo.room.messages[mi - 1]['username'] === msg['username']
              ? 'mt-[0.25em]'
              : 'mt-[0.5em]'} rounded-lg p-1 bg-white/5 flex flex-col items-start justify-center w-fit min-w-[20dvw] max-w-[80dvw]"
          >
            {#if P2PInfo.room.messages[mi - 1]?.username !== msg.username}
              <p
                class="{['server', 'svara'].includes(msg.username)
                  ? 'text-red-400'
                  : 'text-purple-400'} text-lg font-medium px-0.5 rounded-r-md inline-block max-w-[95%] truncate"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-[0.8em] inline -mr-1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
                {msg.username}
              </p>
            {/if}

            <p class="px-2 text-white -mt-[0.2em] text-base">{msg.content}</p>
            {#if msg.time}
              <p class="text-xs ml-auto">
                {new Date(Number(msg.time) * 1000).toLocaleTimeString(
                  undefined,
                  {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </p>
            {/if}
          </div>
        {/each}
      </div>
      <div
        class="text-white flex flex-row items-center bg-white/5 rounded-md w-[95dvw] bg-red-500"
      >
        <input
          type="text"
          name="message"
          id="message"
          placeholder="send a message"
          autocomplete="off"
          bind:value={messageContent}
          class="bg-transparent ring-0 focus:outline-hidden w-full py-1 pl-2"
          onkeyup={(e: KeyboardEvent) => {
            if (e.key == "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          class="p-0 m-0 select-none"
          aria-label="send message"
          onclick={() => handleSendMessage()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-[1.2em] mr-2"
          >
            <path
              d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
            />
          </svg>
        </button>
      </div>
    {/if}
  {/snippet}
</Sheet>
