import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Canvas from "./pages/auth/canvas";
import "./App.scss";

function App() {
  const isLoggedIn = true;
  return (
    <>
      <BrowserRouter>
        <Routes>
          {isLoggedIn && (
            <>
              <Route path="/" element={<Navigate to={`/room/${uuidV4()}`} />}></Route>
              <Route path="/room/:id" element={<Canvas />} />

              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
          {!isLoggedIn && <></>}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/"} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
