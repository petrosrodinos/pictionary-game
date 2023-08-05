import { FC, useEffect, useState } from "react";
import Canvas from "./Canvas";
import { authStore } from "../../store/authStore";
import Info from "./Info";
import Modal from "../../components/ui/Modal";
import WaitingWord from "./WaitingWord";
import ChoosingWord from "./ChoosingWord";
import GameFinished from "./GameFinished";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/socket";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import Container from "../../components/Container";
import NoRoom from "./NoRoom";
import { WORDS } from "../../constants/game";
import "./style.scss";

const Room: FC = () => {
  const { id: roomId } = useParams();
  const { username, userId } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({} as RoomInfo);
  const [activeModal, setActiveModal] = useState<keyof typeof ModalComponents | "">();
  const [message, setMessage] = useState<{
    usersMessage: string;
    artistMessage: string;
    data: any;
  } | null>();
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    socket?.emit("join-room", roomId, userId);

    socket?.on("send-info", (roomInfo: RoomInfo) => {
      if (!roomInfo) return;
      console.log("get-info", roomInfo);
      setRoomData(roomInfo);
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
    });

    return () => {
      socket?.off("send-info");
    };
  }, [socket, roomId]);

  useEffect(() => {
    socket?.on("word-changed", (roomInfo: RoomInfo) => {
      console.log("word-changed", roomInfo);
      setRoomInfo(roomInfo);
      setMessage(null);
      setActiveModal("");
    });

    return () => {
      socket?.off("word-changed");
    };
  }, [socket, roomId]);

  useEffect(() => {
    socket?.on("round-finished", (roomInfo: RoomInfo) => {
      console.log("round-finished", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
    });

    return () => {
      socket?.off("time-finished");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("choosing-word-time-finished", (roomInfo: RoomInfo) => {
      console.log("choosing-word-time-finished", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
      setMessage({
        usersMessage: "didn't choose a word,the new artist is",
        artistMessage: "lost his turn",
        data: roomInfo.currentArtist.username,
      });
    });

    return () => {
      socket?.off("choosing-word-time-finished");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("artist-left", (roomInfo: RoomInfo) => {
      console.log("artist-left", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
      setMessage({
        usersMessage: "left the room,the new artist is",
        artistMessage: "left the room",
        data: roomInfo.currentArtist.username,
      });
    });

    return () => {
      socket?.off("artist-left");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("game-finished", (roomInfo: RoomInfo) => {
      console.log("game-finished", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal("game-finished");
    });

    return () => {
      socket?.off("game-finished");
    };
  }, [socket, roomId]);

  const setRoomData = (roomInfo: RoomInfo) => {
    if (!roomInfo) return;
    setRoomInfo(roomInfo);
    setActiveModal(chooseOption(roomInfo.currentArtist.username));
  };

  const handleWordSelected = (word: string) => {
    socket?.emit("word-selected", roomId, word);
  };

  const handleExit = () => {
    navigate("/home");
  };

  const ModalComponents = {
    "choosing-word": (
      <ChoosingWord
        time={roomInfo.choosingWordTime}
        onWordSelected={handleWordSelected}
        players={roomInfo.players}
        category={roomInfo.category as keyof typeof WORDS}
        message={message}
      />
    ),
    "waiting-word": (
      <WaitingWord
        message={message}
        time={roomInfo.choosingWordTime}
        artist={roomInfo.currentArtist}
        players={roomInfo?.players}
      />
    ),
    "game-finished": <GameFinished onExit={handleExit} players={roomInfo?.players} />,
  };

  function chooseTitle(): string {
    if (roomInfo.round >= roomInfo?.players?.length && activeModal === "game-finished")
      return "GAME FINISHED";
    return `ROUND ${roomInfo?.round}/${roomInfo?.players?.length} IS STARTING`;
  }

  function chooseOption(player: string): keyof typeof ModalComponents {
    return player === username ? "choosing-word" : "waiting-word";
  }

  const takeTime = () => {
    return roomInfo?.status === "playing" ? roomInfo?.roundTime : 0;
  };

  window.onbeforeunload = function () {
    if (activeModal === "choosing-word") {
      socket?.emit("leave-choosing-word", roomId, userId);
    }
  };

  return (
    <>
      {Object.keys(roomInfo).length != 0 ? (
        <>
          <Modal title={chooseTitle()} isOpen={!!activeModal}>
            {ModalComponents[activeModal || "choosing-word"]}
          </Modal>
          <Container className="room-page-container">
            <Info timer={takeTime()} artist={roomInfo?.currentArtist?.username || ""} />
            <div className="canvas-chat-container">
              <Canvas
                canvasData={roomInfo?.drawings}
                socket={socket}
                word={roomInfo?.word}
                currentUserIsPlaying={username === roomInfo?.currentArtist?.username}
              />
              <Chat />
            </div>
          </Container>
        </>
      ) : (
        <Modal title={"NO ROOM FOUND OR IT IS FULL"} isOpen={true}>
          <NoRoom />
        </Modal>
      )}
    </>
  );
};

export default Room;
