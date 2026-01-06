import crypto from "node-forge";
// @ts-ignore
import ColorThief from "colorthief";
import { colorHelpers } from "./utils.svelte";

const colorThief = new ColorThief();

interface MetaT {
  id: string;
  title: string;
  img: string;
  artist: string;
  album: string;
  color: string;
  lyrics?: {
    type: "plain" | "synced";
    content: { time: number; text: string }[];
    id: number;
  };
}

export interface TrackT {
  url: string;
  meta: MetaT;
}

const PlayerInfo = $state({
  init: false as Boolean,
  queue: [] as TrackT[],
  qi: 0,
  playing: false,
  controls: {
    loop: false,
    shuffle: false,
  },
  fetch: 0,
  t: 0,
  dur: 0,
  audioElm: new Audio(),
  meta: {
    id: "",
    title: "Nothing playing",
    img: "",
    artist: "",
    album: "",
    color: "#7008e7",
    lyrics: {
      type: "plain",
      content: [],
      id: 0,
    },
  } as MetaT,
});

export const usePlayer = {
  get info() {
    return PlayerInfo;
  },

  meta: {
    init: () => {
      if (!("mediaSession" in navigator)) return;

      navigator.mediaSession.setActionHandler("play", () => {
        usePlayer.playback.resume();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        usePlayer.playback.pause();
      });
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        PlayerInfo.audioElm.currentTime -= 10;
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        PlayerInfo.audioElm.currentTime += 10;
      });

      navigator.mediaSession.setActionHandler(
        "previoustrack",
        usePlayer.playback.previous
      );
      navigator.mediaSession.setActionHandler(
        "nexttrack",
        usePlayer.playback.next
      );

      navigator.mediaSession.setActionHandler("stop", () => {
        PlayerInfo.audioElm.pause();
        usePlayer.info.playing = false;
      });
    },
    sync: () => {
      if (!("mediaSession" in navigator)) return;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: PlayerInfo.meta.title,
        artist: PlayerInfo.meta.artist,
        album: PlayerInfo.meta.album,
        artwork: [
          {
            src: PlayerInfo.meta.img,
            sizes: "150x150",
            type: "image/png",
          },
        ],
      });
    },
  },

  playback: {
    play: async (meta: MetaT, url: string, immediate: boolean = true) => {
      if (PlayerInfo.init === false) {
        PlayerInfo.init = true;
        usePlayer.meta.init();
      }

      if (immediate) {
        PlayerInfo.queue = [...PlayerInfo.queue, { url, meta }];
        PlayerInfo.qi = PlayerInfo.queue.length - 1;
      }

      url = url.replace("http://", "https://");

      PlayerInfo.meta = { ...PlayerInfo.meta, ...meta };

      // set color meta
      {
        const img = new Image();

        img.addEventListener("load", function () {
          const RGB: [number, number, number] = colorThief.getColor(img);
          let HSL = colorHelpers.rgb.toHsl(...RGB);
          HSL[2] = 0.3;
          // const darkHSL = colorHelpers.hsl.darken(HSL, 0.1);
          const HEX = colorHelpers.hsl.toHex(...HSL);
          PlayerInfo.meta.color = HEX;
        });

        img.crossOrigin = "Anonymous";
        img.src = PlayerInfo.meta.img;
      }

      // Reset audio element
      PlayerInfo.audioElm.load();
      PlayerInfo.audioElm.pause();
      PlayerInfo.audioElm.src = url;
      PlayerInfo.audioElm.controls = true;
      PlayerInfo.fetch = 0; // Reset fetch progress
      PlayerInfo.dur = 0; // Reset duration
      PlayerInfo.t = 0; // Reset time

      // Add metadata handler
      PlayerInfo.audioElm.onloadedmetadata = () => {
        PlayerInfo.dur = PlayerInfo.audioElm.duration;
        // load lyrics after meta
        usePlayer.playback.loadLyrics();
      };

      // Enable progressive playback
      PlayerInfo.audioElm
        .play()
        .catch((err) => console.error("Playback failed:", err));
      PlayerInfo.audioElm.currentTime = 0;

      // Progress tracking
      PlayerInfo.audioElm.ontimeupdate = () => {
        PlayerInfo.t = PlayerInfo.audioElm.currentTime;
      };

      PlayerInfo.audioElm.onprogress = () => {
        const buffered = PlayerInfo.audioElm.buffered;
        const duration = PlayerInfo.audioElm.duration;

        if (buffered.length > 0 && duration > 0) {
          // Get latest buffered end point
          const bufferedEnd = buffered.end(buffered.length - 1);
          PlayerInfo.fetch = (bufferedEnd / duration) * 100;
        }
      };

      PlayerInfo.audioElm.onended = () => {
        usePlayer.playback.next();
      };

      usePlayer.info.playing = true;
      usePlayer.meta.sync();
    },

    seekTo: (time: number) => {
      if (time < 0) time = 0;
      if (time > PlayerInfo.dur) time = PlayerInfo.dur;
      PlayerInfo.audioElm.currentTime = time;
      PlayerInfo.t = time;
    },

    appendQueue: async (
      meta: {
        id: string;
        title: string;
        img: string;
        artist: string;
        album: string;
      },
      url: string
    ) => {
      url = url.replace("http://", "https://");
      PlayerInfo.queue = [...PlayerInfo.queue, { url, meta }];
    },

    loadLyrics: () => {
      // `https://lrclib.net/api/search?track_name=${PlayerInfo.meta.title}&album_name=${PlayerInfo.meta.album}`
      //&album_name=${PlayerInfo.meta.album}&artist_name=${PlayerInfo.meta.artist}
      const metaTitle = PlayerInfo.meta.title
        ? PlayerInfo.meta.title.trim().toLowerCase()
        : "";
      const metaAlbum = PlayerInfo.meta.album
        ? PlayerInfo.meta.album.trim().toLowerCase()
        : "";
      const metaArtist = PlayerInfo.meta.artist
        ? PlayerInfo.meta.artist.trim().toLowerCase()
        : "";

      fetch(
        `https://lrclib.net/api/search?track_name=${encodeURIComponent(
          PlayerInfo.meta.title
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data) || data.length === 0) {
            console.warn("No lyrics found.");
            return;
          }

          // Filter out candidates that don't have synced lyrics.
          const validCandidates = data.filter(
            (candidate) =>
              candidate.syncedLyrics && candidate.syncedLyrics.trim() !== ""
          );
          if (validCandidates.length === 0) {
            console.warn("No candidates with synced lyrics found.");
            return;
          }

          // Try to filter for candidates that exactly match title, album, and artist.
          const exactCandidates = validCandidates.filter((candidate) => {
            const candidateTitle = (
              candidate.title ||
              candidate.name ||
              candidate.trackName ||
              ""
            )
              .trim()
              .toLowerCase();
            const candidateAlbum = (
              candidate.album ||
              candidate.albumName ||
              ""
            )
              .trim()
              .toLowerCase();
            let candidateArtist = "";
            if (candidate.artist) {
              candidateArtist = candidate.artist.trim().toLowerCase();
            } else if (candidate.artistName) {
              candidateArtist = candidate.artistName.trim().toLowerCase();
            } else if (
              candidate.artistMap &&
              candidate.artistMap.primary_artists &&
              candidate.artistMap.primary_artists.length
            ) {
              candidateArtist = candidate.artistMap.primary_artists[0].name
                .trim()
                .toLowerCase();
            }
            return (
              candidateTitle === metaTitle &&
              candidateAlbum === metaAlbum &&
              candidateArtist === metaArtist
            );
          });

          let bestCandidate;
          if (exactCandidates.length > 0) {
            // From the exact matches, choose the one with the closest duration.
            bestCandidate = exactCandidates.reduce((best, candidate) =>
              Math.abs(candidate.duration - PlayerInfo.dur) <
              Math.abs(best.duration - PlayerInfo.dur)
                ? candidate
                : best
            );
          } else {
            // Fallback: use a weighted scoring system among valid candidates.
            const DURATION_WEIGHT = 1;
            const ALBUM_PENALTY = 20; // Strong penalty if album doesn't match
            const ARTIST_PENALTY = 20; // Strong penalty for artist mismatch
            const TITLE_PENALTY = 20; // Strong penalty for title mismatch

            const scoredCandidates = validCandidates.map((candidate) => {
              let score =
                Math.abs(candidate.duration - PlayerInfo.dur) * DURATION_WEIGHT;
              const candidateTitle = (
                candidate.title ||
                candidate.name ||
                candidate.trackName ||
                ""
              )
                .trim()
                .toLowerCase();
              const candidateAlbum = (
                candidate.album ||
                candidate.albumName ||
                ""
              )
                .trim()
                .toLowerCase();
              let candidateArtist = "";
              if (candidate.artist) {
                candidateArtist = candidate.artist.trim().toLowerCase();
              } else if (candidate.artistName) {
                candidateArtist = candidate.artistName.trim().toLowerCase();
              } else if (
                candidate.artistMap &&
                candidate.artistMap.primary_artists &&
                candidate.artistMap.primary_artists.length
              ) {
                candidateArtist = candidate.artistMap.primary_artists[0].name
                  .trim()
                  .toLowerCase();
              }
              if (metaAlbum && candidateAlbum !== metaAlbum) {
                score += ALBUM_PENALTY;
              }
              if (metaArtist && candidateArtist !== metaArtist) {
                score += ARTIST_PENALTY;
              }
              if (metaTitle && candidateTitle !== metaTitle) {
                score += TITLE_PENALTY;
              }
              return { candidate, score };
            });
            bestCandidate = scoredCandidates.reduce((best, curr) =>
              curr.score < best.score ? curr : best
            ).candidate;
          }

          // Process the synced lyrics of the best candidate.
          const lyricsContent = bestCandidate.syncedLyrics
            .split("\n")
            .map((line: string) => {
              const match = /^\[(\d{2}):(\d{2}\.\d{2})\]\s*(.*)$/.exec(line);
              if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseFloat(match[2]);
                return { time: minutes * 60 + seconds, text: match[3] };
              }
              // Fallback: if the line doesn't match the expected timestamp format.
              return { time: 0, text: line };
            })
            .filter(
              (entry: { text: string }) =>
                entry.text && entry.text.trim() !== ""
            );

          PlayerInfo.meta.lyrics = {
            type: "synced",
            content: lyricsContent,
            id: bestCandidate.id,
          };
        })
        .catch((err) => console.error("Lyrics fetch failed:", err));
    },

    pause: () => {
      PlayerInfo.audioElm.pause();
      usePlayer.info.playing = false;
    },

    resume: () => {
      PlayerInfo.audioElm
        .play()
        .catch((err) => console.error("Resume failed:", err));
      usePlayer.info.playing = true;
    },

    next: () => {
      if (PlayerInfo.qi < PlayerInfo.queue.length - 1) {
        PlayerInfo.qi++;
        usePlayer.playback.play(
          PlayerInfo.queue[PlayerInfo.qi].meta,
          PlayerInfo.queue[PlayerInfo.qi].url,
          false
        );
      } else if (PlayerInfo.controls.loop) {
        PlayerInfo.qi = 0;
        usePlayer.playback.play(
          PlayerInfo.queue[PlayerInfo.qi].meta,
          PlayerInfo.queue[PlayerInfo.qi].url,
          false
        );
      }
    },
    previous: () => {
      if (PlayerInfo.qi > 0) {
        PlayerInfo.qi--;
        usePlayer.playback.play(
          PlayerInfo.queue[PlayerInfo.qi].meta,
          PlayerInfo.queue[PlayerInfo.qi].url,
          false
        );
      }
    },
  },

  helpers: {
    decryptURL: (encryptedMediaUrl: string) => {
      if (!encryptedMediaUrl) return [];

      const key = "38346591";
      const iv = "00000000";
      const encrypted = crypto.util.decode64(encryptedMediaUrl);
      const decipher = crypto.cipher.createDecipher(
        "DES-ECB",
        crypto.util.createBuffer(key)
      );

      decipher.start({ iv: crypto.util.createBuffer(iv) });
      decipher.update(crypto.util.createBuffer(encrypted));
      decipher.finish();

      const decryptedLink = decipher.output.getBytes();
      return [
        { quality: "12kbps", url: decryptedLink.replace("_96", "_12") },
        { quality: "48kbps", url: decryptedLink.replace("_96", "_48") },
        { quality: "96kbps", url: decryptedLink },
        { quality: "160kbps", url: decryptedLink.replace("_96", "_160") },
        { quality: "320kbps", url: decryptedLink.replace("_96", "_320") },
      ];
    },
  },
};
