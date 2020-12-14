import React from "react";
import { NavLink } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import BusinessIcon from "@material-ui/icons/Business";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Divider from "@material-ui/core/Divider";
// css
import "./Dashboard.scss";

const MainListItems = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(logout());
  };
  return (
    <>
      <div>
        <NavLink to="/company" className="admin__links">
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </NavLink>
        <NavLink to="/company/events" className="admin__links">
          <ListItem button>
            <ListItemIcon>
              <EmojiEventsIcon className="color--white" />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
        </NavLink>
        <NavLink to="/company/createevent" className="admin__links">
          <ListItem button>
            <ListItemIcon>
              <BusinessIcon className="color--white" />
            </ListItemIcon>
            <ListItemText primary="Create an Event" />
          </ListItem>
        </NavLink>
        <Divider style={{ backgroundColor: "#fff" }} />
      </div>
      <div>
        <ListSubheader inset style={{ color: "#fff" }}>
          Events Information
        </ListSubheader>
        <NavLink to="/company/currentRequests" className="admin__links">
          <ListItem button>
            <ListItemIcon>
              <AssignmentIcon className="color--white" />
            </ListItemIcon>
            <ListItemText primary="Current requests" />
          </ListItem>
        </NavLink>
        <NavLink to="/company/approvedRequests" className="admin__links">
          <ListItem button>
            <ListItemIcon>
              <CheckCircleIcon className="color--white" />
            </ListItemIcon>
            <ListItemText primary="Approved Requests" />
          </ListItem>
        </NavLink>
        <Divider style={{ backgroundColor: "#fff" }} />
        <ListSubheader inset style={{ color: "#fff" }}>
          Profile
        </ListSubheader>
        <NavLink
          to={`/company/editprofile/${currentUser.user._id}`}
          className="admin__links"
        >
          <ListItem button>
            <ListItemIcon>
              <AccountBoxIcon className="color--white" />
            </ListItemIcon>
            <ListItemText primary="Edit Profile" />
          </ListItem>
        </NavLink>
        <NavLink to="/login" className="admin__links" onClick={logOut}>
          <ListItem button>
            <ListItemIcon>
              <ExitToAppIcon className="color--white" />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        </NavLink>
      </div>
    </>
  );
};

export default MainListItems;
