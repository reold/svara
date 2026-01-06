import Peer from "peerjs";
import type { DataConnection } from "peerjs";

import { P2PInfo } from "./store.svelte";

export const PROXY_URL = "https://vercel-cors-anywhere-one.vercel.app/api?url=";

export const dataFetch = async (
  endpoint: string,
  body: BodyInit | null = null
) => {
  let resp = await fetch(
    endpoint,
    body ? { body, method: "POST" } : { method: "GET" }
  );
  let data = await resp.json();

  if (resp.status != 200) throw Error("something went wrong");

  return data;
};

export const helpers = {
  cookieExtractor: (cookieHeader: string, cookie: string): string | null => {
    if (!cookieHeader) return null;

    // Handle multiple cookies with same name
    const cookies = cookieHeader.split(/,(?=\s*\w+=)/);

    const target = cookies
      .reverse() // Get last occurrence
      .find((c) => c.trim().startsWith(`${cookie}=`));

    return target?.split(";")[0]?.split("=")[1]?.trim() || null;
  },
};

export const masterServices = {
  proxy: PROXY_URL,
  host: "",
  headers: {
    Host: "www.saavn.com",
    Accept: "*/*",
    "User-Agent": "Saavn/9.16.1 (iPhone; iOS 18.4; Scale/3.00)",
    "Accept-Language": "en-IN;q=1.0, ml-IN;q=0.9, hi-IN;q=0.8",
    "Accept-Encoding": "br;q=1.0, gzip;q=0.9, deflate;q=0.8",
    Connection: "keep-alive",
    Cookie:
      "ssid=did_v1_79D9162F-4F77-4B42-8D86-5EC214467860.1741341828.67317; _pl=iphoneapp-",
    // "ssid=did_v1_79D9162F-4F77-4B42-8D86-5EC214467860.1741341828.673173; _pl=iphoneapp-",
  },

  auth: {
    validateEmail: async (email: string) => {
      let data = await dataFetch(
        `${masterServices.host}${encodeURIComponent(
          `?_format=json&ctx=iphoneapp&api_version=4&__call=user.isRegisteredEmail&email=${email}`
        )}`,
        JSON.stringify({ headers: masterServices.headers, method: "GET" })
      );

      return data.status;
    },
    requestOTP: async (email: string, password: string) => {
      let data = await dataFetch(
        `${masterServices.host}${encodeURIComponent(
          `?app_version=9.16.1&v=1003&device_type=iPhone_15&_marker=false&_format=json&ctx=iphoneapp&api_version=4&dolby_support=true&is_jio_user=false&r_device=false&network_type=WIFI&network_subtype=wifi&cc=91&__call=user.login`
        )}`,

        JSON.stringify({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...masterServices.headers,
          },
          method: "POST",
          body: new URLSearchParams({
            username: email,
            password: password,
            user_exist: "True",
          }).toString(),
        })
      );

      return data.status && data.status == "success";
    },
    validateOTP: async (email: string, otp: string) => {
      let resp = await fetch(
        `${masterServices.host}${encodeURIComponent(
          `?app_version=9.16.1&v=1003&device_type=iPhone_15&_marker=false&_format=json&ctx=iphoneapp&api_version=4&dolby_support=true&is_jio_user=false&r_device=false&network_type=WIFI&network_subtype=wifi&cc=91&__call=user.validateOTP`
        )}`,
        {
          method: "POST",
          body: JSON.stringify({
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              ...masterServices.headers,
            },
            method: "POST",
            body: new URLSearchParams({
              username: email,
              otp: otp,
            }).toString(),
          }),
        }
      );

      let data = await resp.json();
      let sessionToken = helpers.cookieExtractor(
        resp.headers.get("x-sscookies") as string,
        "I"
      );

      return {
        ...data,
        sessionToken: sessionToken ? decodeURIComponent(sessionToken) : null,
      };
    },
  },
};

masterServices.host = `${masterServices.proxy}${encodeURIComponent(
  "https://www.jiosaavn.com/api.php"
)}`;

const _roomServices = {
  host: import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://carter-65v1.onrender.com",
  api: { room: "" },

  createRoom: async (id: string, username: string, roomName: string) => {
    let data = await dataFetch(
      `${_roomServices.api.room}/new?id=${id}&username=${username}&room_name=${roomName}`
    );

    return data;
  },

  joinRoom: async (id: string, roomId: string, username: string) => {
    let data = await dataFetch(
      `${_roomServices.api.room}/join?id=${id}&room_id=${roomId}&username=${username}`
    );
    return data;
  },

  infoRoom: async (roomId: string) => {
    let data = await dataFetch(
      `${_roomServices.api.room}/info?room_id=${roomId}`
    );
    return data;
  },

  listenRoom: async (
    id: string,
    onmessage: (ev: MessageEvent) => void,
    onerror: (ev: Event) => void
  ) => {
    const source = new EventSource(`${_roomServices.api.room}/listen?id=${id}`);
    source.onmessage = onmessage;
    source.onerror = onerror;
  },

  broadcastRoom: async (id: string, roomId: string, msg: string) => {
    let data = await dataFetch(
      `${_roomServices.api.room}/broadcast?id=${id}&room_id=${roomId}&msg=${msg}`
    );
    return data;
  },
};

export const p2pServices = {
  init: (
    initiator: boolean = false,
    invitation: { id: string } | undefined = undefined
  ) => {
    P2PInfo.initiator = initiator;

    console.info("creating a new peer");
    P2PInfo.peer = new Peer({
      config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
    });
    //{
    //   config: {
    //     iceServers: [
    //       { urls: "stun:stun.l.google.com:19302" },
    //       { urls: "stun:stun.l.google.com:5349" },
    //       { urls: "stun:stun1.l.google.com:3478" },
    //       { urls: "stun:stun1.l.google.com:5349" },
    //       { urls: "stun:stun2.l.google.com:19302" },
    //       { urls: "stun:stun2.l.google.com:5349" },
    //       { urls: "stun:stun3.l.google.com:3478" },
    //       { urls: "stun:stun3.l.google.com:5349" },
    //       { urls: "stun:stun4.l.google.com:19302" },
    //       { urls: "stun:stun4.l.google.com:5349" },
    //       // {
    //       //   urls: ["stun:ss-turn2.xirsys.com"],
    //       // },
    //       // {
    //       //   urls: "turn:relay1.expressturn.com:3478",
    //       //   username: "efG8ZXKOVDKSBH25BV",
    //       //   credential: "fUVWlxQchGeBwb4J",
    //       // },
    //       // {
    //       //   username:
    //       //     "d9fPe2Cl9DFs27gi7id9HNck5xmC1pLKGXpp-vypkRfk77tRTDG1a4xGuQw3GUkFAAAAAGgbdWpyZW9sZA==",
    //       //   credential: "ef4dd680-2b53-11f0-b8c2-0242ac140004",
    //       //   urls: [
    //       //     "turn:ss-turn2.xirsys.com:80?transport=udp",
    //       //     "turn:ss-turn2.xirsys.com:3478?transport=udp",
    //       //     "turn:ss-turn2.xirsys.com:80?transport=tcp",
    //       //     "turn:ss-turn2.xirsys.com:3478?transport=tcp",
    //       //     "turns:ss-turn2.xirsys.com:443?transport=tcp",
    //       //     "turns:ss-turn2.xirsys.com:5349?transport=tcp",
    //       //   ],
    //       // },
    //     ],
    //   },
    // }

    P2PInfo.peer.on("open", (id) => {
      P2PInfo.user.id = id;

      // set room id for the session
      if (P2PInfo.initiator) {
        P2PInfo.room.id = id;
      } else {
        if (!invitation) {
          throw new Error("Invitation is required");
        }
        P2PInfo.room.id = invitation?.id;
      }
    });

    P2PInfo.peer.on("connection", p2pServices.handleConnection);
    P2PInfo.initialized = true;
  },

  close: () => {
    P2PInfo.connections.forEach((conn) => conn.close());
    P2PInfo.peer?.destroy();
    P2PInfo.initialized = false;
  },

  create: (name: string) => {
    P2PInfo.room.name = name;
    P2PInfo.connected = true;

    p2pServices.updateActivity();

    P2PInfo.room.messages = [
      ...P2PInfo.room.messages,
      {
        username: "svara",
        content: "created session successfully, invite your friends",
        time: String(Date.now() / 1000),
      },
    ];
  },

  join: () => {
    if (!P2PInfo.room.id) throw new Error("Room ID is required");

    const conn = P2PInfo.peer?.connect(P2PInfo.room.id, {
      metadata: { username: P2PInfo.user.name },
    });
    if (!conn) throw new Error("Connection to Peer failed");

    conn.on("open", () => {
      console.log("handling ocnnection");
      p2pServices.handleConnection(conn);

      console.log("Connected to peer", conn.peer);
      P2PInfo.connected = true;
      P2PInfo.room.name = "Untitled Session";
      p2pServices.updateActivity();

      P2PInfo.room.messages = [
        ...P2PInfo.room.messages,
        {
          username: "svara",
          content: "joined session successfully, invite your friends",
          time: String(Date.now() / 1000),
        },
      ];
    });
  },

  chat: {
    send: (content: string) => {
      const messageData = {
        type: "msg",
        username: P2PInfo.user.name,
        content,
        time: String(Date.now() / 1000),
      };

      // Add own message to chat
      P2PInfo.room.messages = [...P2PInfo.room.messages, messageData];

      // Broadcast to all peers
      P2PInfo.connections.forEach((conn) => {
        conn.send(messageData);
      });
    },
  },

  handleConnection: (conn: DataConnection) => {
    P2PInfo.connections.add(conn);

    console.log("handling connection", conn.peer);

    // broadcast room name
    if (P2PInfo.initiator) {
      console.log("sending room name", P2PInfo.room.name);
      conn.on("open", () => {
        conn.send({
          type: "meta",
          roomname: P2PInfo.room.name,
        });
      });
    }

    // add client connection message
    P2PInfo.room.messages = [
      ...P2PInfo.room.messages,
      {
        username: "server",
        content: `${conn.metadata?.username || "A user"} has connected`,
        time: String(Date.now() / 1000),
      },
    ];

    p2pServices.updateActivity();

    conn.on("data", (data: any) => {
      if (data.type === "msg") {
        P2PInfo.room.messages = [
          ...P2PInfo.room.messages,
          {
            username: data.username,
            content: data.content,
            time: String(Date.now() / 1000),
          },
        ];
      }

      if (data.type == "meta") {
        P2PInfo.room.name = data.roomname;
      }
    });

    conn.on("close", () => {
      P2PInfo.connections.delete(conn);
      P2PInfo.room.messages = [
        ...P2PInfo.room.messages,
        {
          username: "server",
          content: `${conn.metadata?.username || "A user"} has disconnected`,
          time: String(Date.now() / 1000),
        },
      ];
      p2pServices.updateActivity();
    });
  },
  updateActivity: () => {
    P2PInfo.room.activity = `(${P2PInfo.connections.size + 1})`;
  },
};

_roomServices.api.room = `${_roomServices.host}/room`;

export type RoomServices = typeof _roomServices;
export const roomServices: RoomServices = _roomServices;
