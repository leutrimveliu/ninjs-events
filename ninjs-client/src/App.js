import React, { useState } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

// Components
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";
import Login from "./components/Login/Login";
import SearchPage from "./components/SearchPage/SearchPage";
import CreateEvent from "./components/CompanyDashboard/Tables/CreateEventDash";
import Checkout from "./components/Payment/CreatePayment";
import Register from "./components/Register/Register";
import Event from "./components/EventSingle/index";
import SingleEvent from "./components/Dashboard/Tables/EventSingleDash";
import EditEvent from "./components/CompanyDashboard/Tables/EditEventDash";
import Dashboard from "./components/Dashboard/Dashboard";
import CompanyDashboard from "./components/CompanyDashboard/CompanyDashboard";
import UserTable from "./components/Dashboard/Tables/UserTable";
import Profile from "./components/Profile/Profile";
import CompanyEventsTable from "./components/CompanyDashboard/Tables/CompanyEventsTable";
import EditProfile from "./components/EditProfile/EditProfile";
import AdminEditProfile from "./components/Dashboard/Tables/AdminEditProfile";
import CompanyEditProfile from "./components/CompanyDashboard/Tables/CompanyEditProfile";

const App = () => {
  // States
  const [filterChange, setFilterChange] = useState(null);
  const [searchValue, setSearchValue] = useState(null);

  const filterRequest = (value) => {
    setFilterChange(value);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            component={() => <Home filterChanged={filterRequest} />}
          />
          <Route
            path="/contact"
            component={() => <Contact filterChanged={filterRequest} />}
          />
          <Route path="/login" component={() => <Login />} />
          <Route
            path="/about"
            component={() => <About filterChanged={filterRequest} />}
          />
          <Route
            path="/company/createEvent"
            component={() => <CreateEvent />}
          />
          <Route path="/createPayment/:id" component={() => <Checkout />} />
          <Route path="/Register" component={() => <Register />} />
          <Route path="/admin/event/:id" component={() => <SingleEvent />} />
          <Route
            path="/Event/:id"
            component={() => <Event filterChanged={filterRequest} />}
          />
          <Route
            path="/company/EditEvent/:id"
            component={() => <EditEvent />}
          />
          <Route
            path="/admin/editprofile/:id"
            component={() => <AdminEditProfile />}
          />
          <Route
            path="/company/editprofile/:id"
            component={() => <CompanyEditProfile />}
          />

          <Route path="/company" component={() => <CompanyDashboard />} />
          <Route
            path="/company/events"
            component={() => <CompanyEventsTable />}
          />
          <Route path="/admin" component={() => <Dashboard />} />
          <Route path="/admin/users" component={() => <UserTable />} />
          <Route path="/admin/companies" component={() => <Dashboard />} />
          <Route path="/admin/categories" component={() => <Dashboard />} />
          <Route
            path="/profile/:id"
            component={() => <Profile filterChanged={filterRequest} />}
          />
          <Route path="/editprofile/:id" component={() => <EditProfile />} />
          <Route
            path="/search"
            component={() => <SearchPage filterChanged={filterRequest} />}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
