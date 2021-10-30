import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export interface NavigationProps {
  activeItem: "home" | "stats";
}

const Navigation: React.VFC<NavigationProps> = ({ activeItem }) => {
  return (
    <Menu secondary>
      <Link to="/">
        <Menu.Item name="home" active={activeItem === "home"} />
      </Link>
      <Link to="/stats">
        <Menu.Item name="stats" active={activeItem === "stats"} />
      </Link>
    </Menu>
  );
};

export default Navigation;
