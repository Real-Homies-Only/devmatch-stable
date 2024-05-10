import React from "react";
import NavBar from "./components/server/NavBar";
import Hero from "./components/client/Hero";
import CategoriesCarousel from "./components/client/CategoriesCarousel";
import Footer from "./components/client/Footer";

const Home: React.FC = () => {
  return (
    <main>
      <NavBar />
      <Hero />
      <CategoriesCarousel />
      <Footer />
    </main>
  );
};

export default Home;
