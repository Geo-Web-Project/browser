import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  AppBar,
  Toolbar,
  Drawer,
  Container,
  IconButton,
  TextField,
  Typography,
  Box,
  makeStyles,
  Button,
  Grid,
} from "@material-ui/core";
import { Close as CloseIcon, Menu as MenuIcon } from "@material-ui/icons";
import StyledSwitch from "../Switch/StyledSwitch";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#1a1c2b",
    color: "white",
    width: "60%",
    [theme.breakpoints.up("lg")]: { width: "20%" },
    [theme.breakpoints.only("md")]: { width: "30%" },
    [theme.breakpoints.only("sm")]: { width: "40%" },
    [theme.breakpoints.only("xs")]: { width: "60%" },
  },
  input: {
    backgroundColor: "white",
    color: "#1a1c2b",
    borderRadius: "15px",
    padding: "9px",
    marginRight: "10%",
    marginTop: "1.5%",
    width: "100%",
  },
}));

const Menu = (props) => {
  const classes = useStyles();
  const accessGps = props.accessGps;
  const showPosition = props.showPosition;

  const [open, setState] = useState(false);
  const [longitude, setLongitude] = useState(props.coordinate.lon);
  const [latitude, setLatitude] = useState(props.coordinate.lat);
  const [isManual, setStateSwitch] = useState(false);

  useEffect(() => {
    if (!isManual) {
      setLongitude(props.coordinate.lon);
      setLatitude(props.coordinate.lat);
    }
  }, [isManual, props.coordinate]);

  const toggleDrawer = (open) => (event) => {
    setState(open);
  };

  const handleChange = () => (event) => {
    setStateSwitch(event.target.checked);
  };

  const handleLatChange = (event) => {
    setLatitude(event.target.value);
  };

  const handleLonChange = (event) => {
    setLongitude(event.target.value);
  };

  const handleManualSubmit = () => {
    const position = {
      coords: { latitude: Number(latitude), longitude: Number(longitude) },
    };
    showPosition(position);
  };

  const handleRefreshGPS = () => {
    accessGps();
  };

  return (
    <div className="menu">
      <AppBar position="static" style={{ background: "#202333" }}>
        <Container maxWidth="lg" disableGutters={true}>
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
              style={{ margin: "-17px", color: "white" }}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={open}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
              classes={{ paper: classes.paper }}
            >
              <Box>
                <Box display="flex" style={{ paddingBottom: "30px" }}>
                  <Typography variant="h5" style={{ margin: "15px" }}>
                    Settings
                  </Typography>
                  <IconButton
                    onClick={toggleDrawer(false)}
                    style={{ color: "white", marginLeft: "auto" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Grid
                  component="label"
                  container
                  alignItems="center"
                  justify="center"
                  spacing={5}
                >
                  <Grid item>
                    <Typography>GPS</Typography>
                  </Grid>
                  <Grid item>
                    <StyledSwitch
                      checked={isManual}
                      onChange={handleChange()}
                    />
                  </Grid>
                  <Grid item>
                    <Typography>Manual</Typography>
                  </Grid>
                </Grid>

                <div className="flexcolumn">
                  <div className="flexrow">
                    <Typography className="coord-label">Latitude:</Typography>
                    <TextField
                      type="number"
                      size="small"
                      disabled={!isManual}
                      id="filled-basic"
                      variant="filled"
                      value={latitude}
                      onChange={handleLatChange}
                      InputProps={{
                        classes: {
                          input: classes.input,
                        },
                      }}
                    />
                  </div>
                  <div className="flexrow">
                    <Typography className="coord-label">Longitude:</Typography>
                    <TextField
                      type="number"
                      disabled={!isManual}
                      id="filled-basic"
                      variant="filled"
                      value={longitude}
                      onChange={handleLonChange}
                      InputProps={{
                        classes: {
                          input: classes.input,
                        },
                      }}
                    />
                  </div>
                  <div className="buttonContainer">
                    {isManual ? (
                      <Button
                        onClick={() => handleManualSubmit()}
                        style={{
                          width: "30%",
                          marginRight: "10px",
                          backgroundColor: "#2fc1c1",
                          color: "white",
                        }}
                        variant="contained"
                      >
                        Go
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRefreshGPS()}
                        style={{
                          width: "auto",
                          marginRight: "10px",
                          backgroundColor: "#2fc1c1",
                          color: "white",
                        }}
                        variant="contained"
                      >
                        Refresh
                      </Button>
                    )}
                  </div>
                </div>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Menu;
