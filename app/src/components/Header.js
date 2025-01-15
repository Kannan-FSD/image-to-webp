import React from "react";
import '../styles/Header.css'
import logo from '../assets/logo.png'

const Header = () => {
  return (
    <header className="header">
      <img  src={logo} alt="logo" width="40rem" />
    </header>
  );
};

export default Header;
