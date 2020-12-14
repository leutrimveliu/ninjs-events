import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "20px auto",
    width: 400,
    elevation: 3,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const Cards = ({ id, image, title, location, date, price, view }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container xs={12}>
        <Paper className={classes.paper} elevation={6}>
          <Grid container spacing={2}>
            <Grid item>
              <Link to={`/event/${id}`}>
                <ButtonBase className={classes.image}>
                  <img className={classes.img} alt="complex" src={image} />
                </ButtonBase>
              </Link>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    {title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {date.split("T")[0]}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  {price === 0 ? "Free" : price + " $"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
};

export default Cards;
