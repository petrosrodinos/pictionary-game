import { FC, useState, useEffect } from "react";
import RoomActions from "./RoomActions";
import LeaderBoard from "./LeaderBoard";
import Modal from "../../components/ui/Modal";
import JoinRoom from "./JoinRoom";
import { useNavigate, useSearchParams } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import Container from "../../components/Container";
import "./style.scss";

export type ModalType = "join" | "create" | "waiting-room" | "";

const Home: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState<ModalType>("");
  const navigate = useNavigate();

  //useEffect detects for searchParams change and sets the activeModal to waiting-room so as for the waiting-room modal appears
  useEffect(() => {
    const waitingRoom = searchParams.get("waitingRoom");
    if (waitingRoom) {
      setActiveModal("waiting-room");
    }
  }, [searchParams]);

  //setting modal type for opening specific modal depending on the action
  const handleActionClick = (action: ModalType) => {
    setActiveModal(action);
  };

  //when code is entered we are adding search params in the url
  //the search param is ?waitingRoom=code
  //the useEffect detects when search params are changing and if exists it will change the activeModal state
  //so as to open the waiting room modal
  const handleJoinRoom = (code: string) => {
    if (!code) return;
    //search if game exists then
    setActiveModal("");
    setSearchParams({
      waitingRoom: code,
    });
  };

  //when user leaves the waiting room
  //for now i am using it as a way to start a game to navigate to room page
  const handleLeave = () => {
    console.log("asd", searchParams.get("waitingRoom"));
    navigate(`/room/${searchParams.get("waitingRoom")}`);
    // setActiveModal("");
  };

  const ModalComponents: any = {
    ["join"]: <JoinRoom onJoinRoom={handleJoinRoom} />,
    ["create"]: <JoinRoom onJoinRoom={handleJoinRoom} />,
    ["waiting-room"]: <WaitingRoom onLeave={handleLeave} />,
  };

  return (
    <Container className="home-page-container">
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal("")}>
        {ModalComponents?.[activeModal]}
      </Modal>
      <div className="first-row">
        <RoomActions onActionClick={handleActionClick} />
        <LeaderBoard />
      </div>
      {/* <RecentGames/> component goes here */}
    </Container>
  );
};

export default Home;
