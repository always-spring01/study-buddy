import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <h1>Study Buddy</h1>
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/note/1">Note 1</Link>
      </nav>
    </header>
  );
}

export default Header;