import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  AppBar,
  Toolbar,
  Drawer,
  Divider,
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

const useStyles = makeStyles({
  paper: {
    backgroundColor: "#202333",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    color: "#202333",
  },
});

const Menu = (props) => {
  const classes = useStyles();
  const accessGps = props.accessGps;
  const showPosition = props.showPosition;
  const [open, setState] = useState(false);
  const [longitude, setLongitude] = useState(props.coordinate.lon);
  const [latitude, setLatitude] = useState(props.coordinate.lat);
  const toggleDrawer = (open) => (event) => {
    setState(open);
  };
  const [isManual, setStateSwitch] = useState(false);
  useEffect(() => {
    if (!isManual) {
      setLongitude(props.coordinate.lon);
      setLatitude(props.coordinate.lat);
    }
  }, [isManual, props.coordinate]);

  const handleChange = () => (event) => {
    setStateSwitch(event.target.checked);
    if (!event.target.checked) {
      accessGps();
    }
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
              <IconButton
                sx={{ mb: 2 }}
                onClick={toggleDrawer(false)}
                style={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
              <Box>
                <Typography> Settings</Typography>
                <Grid
                  component="label"
                  container
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>GPS</Grid>
                  <Grid item>
                    <StyledSwitch
                      checked={isManual}
                      onChange={handleChange()}
                    />
                  </Grid>
                  <Grid item>Manual</Grid>
                </Grid>

                <Divider sx={{ mb: 2 }} />
                <div className="flexcolumn">
                  <div className="flexrow">
                    <Typography>Latitude</Typography>
                    <TextField
                      type="number"
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
                    <Typography>Longitude</Typography>
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
                </div>
                <Button onClick={() => handleManualSubmit()}>Go</Button>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Menu;
