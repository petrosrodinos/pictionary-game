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
import "./style.scss";
import NoRoom from "./NoRoom";

const Room: FC = () => {
  const { id: roomId } = useParams();
  const { username } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({} as RoomInfo);
  const [activeModal, setActiveModal] = useState<keyof typeof ModalComponents | "">();
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", roomId);

    socket.on("send-info", (roomInfo: RoomInfo) => {
      if (!roomInfo) return;
      console.log("get-info", roomInfo);
      setRoomData(roomInfo);
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
    });

    return () => {
      socket.off("send-info");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("word-changed", (roomInfo: RoomInfo) => {
      console.log("word-changed", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal("");
    });

    return () => {
      socket.off("word-changed");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("time-finished", (roomInfo: RoomInfo) => {
      console.log("time-finished", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
    });

    return () => {
      socket.off("time-finished");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("game-finished", (roomInfo: RoomInfo) => {
      console.log("game-finished", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal("game-finished");
    });

    return () => {
      socket.off("game-finished");
    };
  }, [socket, roomId]);

  const setRoomData = (roomInfo: RoomInfo) => {
    if (!roomInfo) return;
    setRoomInfo(roomInfo);
    setActiveModal(chooseOption(roomInfo.currentArtist.username));
  };

  const handleWordSelected = (word: string) => {
    if (!socket) return;
    socket.emit("word-selected", roomId, word);
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
      />
    ),
    "waiting-word": (
      <WaitingWord
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

  return (
    <>
      {Object.keys(roomInfo).length != 0 ? (
        <>
          <Modal title={chooseTitle()} isOpen={!!activeModal}>
            {ModalComponents[activeModal || "choosing-word"]}
          </Modal>
          <Container className="room-page-container">
            {JSON.stringify(roomInfo)}
            <Info timer={takeTime()} artist={roomInfo?.currentArtist?.username || ""} />
            <div className="canvas-chat-container">
              <Canvas
                socket={socket}
                word={roomInfo?.word}
                currentUserIsPlaying={username === roomInfo?.currentArtist?.username}
              />
              <Chat />
            </div>
          </Container>
        </>
      ) : (
        <Modal title={"NO ROOM FOUND"} isOpen={true}>
          <NoRoom />
        </Modal>
      )}
    </>
  );
};

export default Room;
