import { FC, useState } from "react";
import RoomActions from "./RoomActions";
import LeaderBoard from "./LeaderBoard";
import Modal from "../../components/ui/Modal";
import JoinRoom from "./JoinRoom";
import "./style.scss";

const Home: FC = () => {
  const [activeModal, setActiveModal] = useState<string>("");
  const handleActionClick = (action: string) => {
    setActiveModal(action);
  };

  const handleJoinRoom = (code: string) => {
    console.log("join room", code);
  };

  return (
    <div className="home-page-container">
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal("")}>
        {activeModal === "join" ? (
          <JoinRoom onJoinRoom={handleJoinRoom} />
        ) : (
          <div>create room component</div>
        )}
      </Modal>
      <div className="first-row">
        <RoomActions onActionClick={handleActionClick} />
        <LeaderBoard />
      </div>
      {/* <RecentGames/> component goes here */}
    </div>
  );
};

export default Home;
