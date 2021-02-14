import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Menu, MenuItemProps, Placeholder, Segment } from "semantic-ui-react";
import { AuthContext } from "../context/authContext";

function MenuBar() {
  const pathname = window.location.pathname;
  let path = pathname.substr(1);
  if (pathname === "/") path = "home";
  if (pathname.substr(1, 7) === "profile") path = "profile";

  const authContext = useContext(AuthContext);

  const history = useHistory();

  const [activeItem, setActiveItem] = useState<string | undefined>(path);

  const handleItemClick = (_: any, { name }: MenuItemProps) =>
    setActiveItem(name);

  const handleLogout = async (_: any, { name }: MenuItemProps) => {
    setActiveItem(name);
    await authContext.logout();
    history.push("/login");
  };

  useEffect(() => {
    setActiveItem(path);
  }, [path]);

  return (
    <div>
      <Menu pointing secondary size="huge">
        <Menu.Item
          name="home"
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to="/"
        />
        <Menu.Menu position="right">
          {authContext.me ? (
            <>
              <Menu.Item
                name={authContext.me.fullName}
                active={activeItem === "profile"}
                onClick={handleItemClick}
                as={Link}
                to={`/profile/${authContext.me.handle}`}
              />
              <Menu.Item
                name="logout"
                active={activeItem === "logout"}
                onClick={handleLogout}
              />
            </>
          ) : (
            <>
              <Menu.Item
                name="login"
                active={activeItem === "login"}
                onClick={handleItemClick}
                as={Link}
                to="/login"
              />
              <Menu.Item
                name="register"
                active={activeItem === "register"}
                onClick={handleItemClick}
                as={Link}
                to="/register"
              />
            </>
          )}
        </Menu.Menu>
      </Menu>
    </div>
  );
}

export default MenuBar;
