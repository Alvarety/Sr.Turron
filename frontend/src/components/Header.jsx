import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  return (
    <header className="custom-header">
      
      <Link className="navbar-brand custom-logo" to="/">
      <img
          src="/senor-turron.png"
          alt="Señor Turrón"
          width="40" height="40"
          className="logo-img"
        /> 
        Señor Turrón
      </Link>
    </header>
  );
};

export default Header;