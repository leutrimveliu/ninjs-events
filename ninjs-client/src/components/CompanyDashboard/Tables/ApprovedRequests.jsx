import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import { deleteEvent } from "../../../api/editEvent";
import { getCategories } from "../../../api/filter";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCompanyEvents } from "../../../api/payment";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "eventPhoto",
    numeric: false,
    disablePadding: false,
    label: "Event Photo",
  },
  {
    id: "eventTitle",
    numeric: false,
    disablePadding: false,
    label: "Event Title",
  },
  {
    id: "eventCategory",
    numeric: false,
    disablePadding: false,
    label: "Categroy",
  },
  //   { id: "eventDescription", numeric: true, disablePadding: false, label: "Event Description" },
  // {
  //   id: "eventOrganizer",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Organizer",
  // },
  {
    id: "eventLocation",
    numeric: false,
    disablePadding: false,
    label: "Event Location",
  },
  {
    id: "startDate",
    numeric: false,
    disablePadding: false,
    label: "Start Date",
  },
  { id: "endDate", numeric: false, disablePadding: false, label: "End Date" },
  {
    id: "eventTicket",
    numeric: false,
    disablePadding: false,
    label: "Event Ticket",
  },
  {
    id: "booking",
    numeric: false,
    disablePadding: false,
    label: "Number Of Bookings",
  },

  { id: "edit", numeric: true, disablePadding: false, label: "Edit" },
  { id: "delete", numeric: false, disablePadding: false, label: "Delete" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}>
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div">
          Requested Events
        </Typography>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },

  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function CompanyTable() {
  const classes = useStyles();
  const history = useHistory();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [events, setEvents] = React.useState([]);
  const [searchCategories, setSearchCategories] = React.useState([]);

  const getEventsList = async () => {
    const response = await getCompanyEvents(currentUser.user._id);
    console.log(response);
    const filteredEvents = response.filter(
      (approved) => approved.isApproved === true
    );

    setEvents(filteredEvents);
  };

  const getCategoriesList = async () => {
    const response = await getCategories();
    setSearchCategories(response);
  };

  useEffect(() => {
    getEventsList();
    getCategoriesList();
  }, []);

  const handleDeleteSubmit = async (id) => {
    const deleteuser = {
      user_id: currentUser.user._id,
    };
    try {
      await deleteEvent(id, deleteuser);

      console.log("Event has been deleted!");
      setTimeout(() => {
        // history.push("/company/events");
        history.go("/company/events");
      }, 1000);
    } catch (e) {}
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = events.map((n) => n.eventPhoto);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, events.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="enhanced table">
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={events.length}
          />
          <TableBody>
            {stableSort(events, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event, index) => {
                const isItemSelected = isSelected(event.eventPhoto);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(e) => handleClick(e, event.eventPhoto)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={event.id}
                    selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none">
                      <img
                        style={{
                          width: "200px",
                          height: "150px",
                          margin: "20px 0",
                        }}
                        src={`http://localhost:4000/assets/uploads/${event.eventPhoto}`}
                        alt="approved event"
                      />
                    </TableCell>
                    <TableCell align="left">{event.eventTitle}</TableCell>
                    {searchCategories.map((category) =>
                      event.eventCategory === category._id ? (
                        <TableCell align="left">
                          {category.eventCategory}
                        </TableCell>
                      ) : null
                    )}
                    {/* <TableCell align="left">{event.eventDescription}</TableCell> */}
                    {/* <TableCell align="left">{event.eventOrganizer}</TableCell> */}
                    <TableCell align="left">{event.eventLocation}</TableCell>
                    <TableCell align="left">
                      {event.startDate.split("T")[0]}
                    </TableCell>
                    <TableCell align="left">
                      {event.endDate.split("T")[0]}
                    </TableCell>
                    <TableCell align="center">{event.eventTickets}</TableCell>
                    {/* <TableCell align="right">{paymentVal[index]}</TableCell> */}
                    <TableCell align="center">{event.booking}</TableCell>
                    {/* ))} */}
                    <TableCell align="right">
                      <Link to={`/company/EditEvent/${event._id}`}>
                        <IconButton aria-label="delete" className="edit_button">
                          <EditIcon className="edit_icon" />
                        </IconButton>
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      <IconButton
                        onClick={() => {
                          if (window.confirm("Delete the event?")) {
                            handleDeleteSubmit(event._id);
                          }
                        }}
                        className="delete_button"
                        aria-label="delete">
                        <DeleteIcon className="delete_icon" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={events.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
