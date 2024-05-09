import React from "react";
import NavBar from "./components/server/NavBar";
import Hero from "./components/client/Hero";

const Home: React.FC = () => {
  return (
    <main>
      <NavBar />
      <Hero />
    </main>
  );
};

export default Home;
