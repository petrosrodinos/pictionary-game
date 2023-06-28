import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { v4 as uuidV4 } from "uuid";
import Canvas from "./pages/auth/canvas";
import { trpc } from "./lib/trpc";
import { useState } from "react";
import "./App.scss";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Users from "./pages/users";

function App() {
  const isLoggedIn = true;

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:5000/trpc",
        }),
      ],
    });
  });

  return (
    <>
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Link to="/login">login</Link>
            <br />
            <Link to="/register">register</Link>
            <br />
            <Link to="/users">users</Link>
            <Routes>
              {isLoggedIn && (
                <>
                  <Route path="/" element={<Navigate to={`/room/${uuidV4()}`} />}></Route>
                  <Route path="/room/:id" element={<Canvas />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/users" element={<Users />} />

                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
              {!isLoggedIn && <></>}
              <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/"} />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}

export default App;
