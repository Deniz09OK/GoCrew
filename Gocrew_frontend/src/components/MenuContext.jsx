import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const MenuContext = createContext({
    isMenuOpen: true,
    setIsMenuOpen: () => {},
});


export const MenuProvider = ({children}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

MenuProvider.propTypes = {
    children: PropTypes.node.isRequired,
};