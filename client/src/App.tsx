import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import AuthPage from "./pages/auth";
import Home from "./pages/home";
import Room from "./pages/room";
import { authStore } from "./store/authStore";
import "./App.scss";
import Footer from "./components/Footer";

function App() {
  const { isLoggedIn } = authStore((state) => state);
  return (
    <BrowserRouter>
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />}></Route>
          {isLoggedIn && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/room/:id" element={<Room />} />
            </>
          )}
          {!isLoggedIn && (
            <Route path="/" element={<AuthLayout />}>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const AuthLayout = () => {
  return (
    <AuthPage>
      <Outlet />
    </AuthPage>
  );
};

export default App;
