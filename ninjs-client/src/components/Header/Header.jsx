import React, { useState, useEffect } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Nav } from "react-bootstrap";
import { logout } from "../../actions/auth";

// material ui imports
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
  Drawer,
  MenuItem,
  useScrollTrigger,
  Slide,
  Menu,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { AccountCircle } from "@material-ui/icons";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

// logo
import ninjsLogo from "../../images/white_ninja.png";

// css
import "./header.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiPaper-root": {
      backgroundColor: "#333",
    },
  },
  header: {
    backgroundColor: "#444",
    padding: "10px",
  },
  logo: {
    fontWeight: 800,
    color: "#fffefe",
  },
  menuButton: {
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 700,
    size: "18px",
    marginLeft: "38px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerContainer: {
    fontWeight: "bold",
    padding: "20px 30px",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  IconSearch: {
    color: "white",
    maxHeight: "36px",
    maxWidth: "36px",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    minWidth: "220px",
    paddingLeft: "12px",
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = ({ filterChanged, props }) => {
  const history = useHistory();
  const classes = useStyles();

  // states
  const [createEvent, setCreateEvent] = useState(false);
  const [adminDash, setAdminDash] = useState(false);
  const [companyDash, setCompanyDash] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const open = Boolean(anchorEl);
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    if (currentUser) {
      setCreateEvent(currentUser.role.includes("company"));
      setAdminDash(currentUser.role.includes("admin"));
      setCompanyDash(currentUser.role.includes("company"));
    }

    // resonsive navbar on mobile
    const setResponsiveness = () => {
      return window.innerWidth < 970
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, [currentUser]);

  const logOut = () => {
    setCreateEvent(false);
    setAdminDash(false);
    setCompanyDash(false);
    dispatch(logout());
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    history.push({
      pathname: "/search",
      search: `?title=${searchValue}`,
    });
    filterChanged(`${searchValue}`);
  };

  const displayDesktop = () => {
    return (
      <Toolbar className={classes.toolbar}>
        <NavLink to="/" className="header__logo" onClick={filterChanged}>
          <img src={ninjsLogo} alt="ninjs logo" width="45" height="45" />
          <Typography variant="h6" component="h1" className={classes.logo}>
            ninJS Events
          </Typography>
        </NavLink>

        <Nav className="header__links">
          <form className={classes.search} onSubmit={() => handleSubmit()}>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <IconButton
              className={classes.IconSearch}
              aria-label="search"
              component="span"
              onClick={() => handleSubmit()}>
              <SearchIcon />
            </IconButton>
          </form>

          {companyDash ? (
            <NavLink to={"/company"} className="header__option">
              Dashboard
            </NavLink>
          ) : (
            ""
          )}
          {createEvent ? (
            <NavLink to={"/createevent"} className="header__option">
              Create Event
            </NavLink>
          ) : (
            ""
          )}
          {adminDash ? (
            <NavLink to={"/admin"} className="header__option">
              Dashboard
            </NavLink>
          ) : (
            ""
          )}

          <NavLink to="/contact" className="header__option">
            Contact
          </NavLink>
          <NavLink to="/about" className="header__option">
            About
          </NavLink>
          {currentUser ? (
            <>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                className={classes.root}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}>
                {!adminDash && !companyDash ? (
                  <div className="options">
                    <MenuItem onClick={handleClose}>
                      <NavLink
                        to={`/editprofile/${currentUser.user._id}`}
                        className="header__option">
                        Edit Profile
                      </NavLink>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <NavLink
                        to={`/profile/${currentUser.user._id}?date=present`}
                        className="header__option">
                        My Events
                      </NavLink>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <NavLink
                        to="/login"
                        className="header__option"
                        onClick={logOut}>
                        Log Out
                      </NavLink>
                    </MenuItem>
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    className="header__option"
                    onClick={logOut}>
                    Log Out
                  </NavLink>
                )}
              </Menu>
            </>
          ) : (
            <>
              <NavLink to={"/login"} className="logged__out">
                Log In
              </NavLink>

              <NavLink to={"/register"} className="logged__out--signup">
                Sign Up
              </NavLink>
            </>
          )}
        </Nav>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar className="mobile__responsive">
        <NavLink to="/" className="header__logo" onClick={filterChanged}>
          <img src={ninjsLogo} alt="ninjs logo" width="45" height="45" />
        </NavLink>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}>
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
          className={classes.root}>
          <div className={classes.drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return (
      <Nav className="nav__mobile">
        <form className={classes.search} onSubmit={() => handleSubmit()}>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <IconButton
            className={classes.IconSearch}
            aria-label="search"
            component="span"
            onClick={() => handleSubmit()}>
            <SearchIcon />
          </IconButton>
        </form>
        {companyDash ? (
          <NavLink to={"/company"} className="header__option">
            Dashboard
          </NavLink>
        ) : (
          ""
        )}
        {createEvent ? (
          <NavLink to={"/createevent"} className="header__option">
            Create Event
          </NavLink>
        ) : (
          ""
        )}
        {adminDash ? (
          <NavLink to={"/admin"} className="header__option">
            Dashboard
          </NavLink>
        ) : (
          ""
        )}

        <NavLink to="/contact" className="header__option">
          Contact
        </NavLink>
        <NavLink to="/about" className="header__option">
          About
        </NavLink>
        {currentUser ? (
          <>
            {!adminDash && !companyDash ? (
              <>
                <NavLink
                  to={`/editprofile/${currentUser.user._id}`}
                  className="header__option">
                  Edit Profile
                </NavLink>

                <NavLink
                  to={`/profile/${currentUser.user._id}?date=present`}
                  className="header__option">
                  My Events
                </NavLink>
                <NavLink
                  to="/login"
                  className="header__option"
                  onClick={logOut}>
                  LogOut
                </NavLink>
              </>
            ) : (
              <NavLink to="/login" className="header__option" onClick={logOut}>
                LogOut
              </NavLink>
            )}
          </>
        ) : (
          <>
            <NavLink to={"/login"} className="header__option">
              LogIn
            </NavLink>
            <NavLink to="/register" className="header__option">
              SignUp
            </NavLink>
          </>
        )}
      </Nav>
    );
  };

  return (
    <>
      <header className="main__header">
        <React.Fragment>
          <HideOnScroll {...props}>
            <AppBar className={classes.header}>
              {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
          </HideOnScroll>
        </React.Fragment>
      </header>
    </>
  );
};

export default Header;
