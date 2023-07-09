import { FC } from "react";
import RoomActions from "./RoomActions";
import LeaderBoard from "./LeaderBoard";
import "./style.scss";

const Home: FC = () => {
  const handleActionClick = (action: string) => {
    console.log(action);
  };

  return (
    <div className="home-page-container">
      <div className="first-row">
        <RoomActions onActionClick={handleActionClick} />
        <LeaderBoard />
      </div>
      {/* recent games component goes here */}
    </div>
  );
};

export default Home;
