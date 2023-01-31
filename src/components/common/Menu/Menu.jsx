import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Close as CloseIcon, Menu as MenuIcon } from "@material-ui/icons";
import StyledSwitch from "../Switch/StyledSwitch";
import parseQueryVariables from "../../../helpers/queryParser";
import styles from "./styles.module.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#1a1c2b",
    color: "white",
    width: "60%",
    overflowX: "hidden",
    justifyContent: "space-between",
    [theme.breakpoints.up("lg")]: { width: "20%" },
    [theme.breakpoints.only("md")]: { width: "30%" },
    [theme.breakpoints.only("sm")]: { width: "40%" },
    [theme.breakpoints.only("xs")]: { width: "80%" },
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
  coordBtn: {
    alignSelf: "flex-end",
    marginRight: "20px",
    backgroundColor: "#2fc1c1",
    color: "white",
  },
}));

export default function Menu({ accessGps, showPosition, coordinate }) {
  const [open, setState] = useState(false);
  const [longitude, setLongitude] = useState(coordinate.lon);
  const [latitude, setLatitude] = useState(coordinate.lat);
  const [isManual, setSwitchState] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (!isManual) {
      setLongitude(coordinate.lon);
      setLatitude(coordinate.lat);
    }
  }, [isManual, coordinate]);

  useEffect(() => {
    const params = parseQueryVariables(window.location.search);
    if (Object.keys(params).length === 2) {
      setSwitchState(true);
      setLatitude(params.latitude);
      setLongitude(params.longitude);

      const position = {
        coords: {
          latitude: Number(params.latitude),
          longitude: Number(params.longitude),
        },
      };
      showPosition(position);
    } else {
      accessGps();
    }
  }, []);

  const toggleDrawer = (open) => {
    setState(open);
  };

  const handleChange = (checked) => {
    setSwitchState(checked);
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
    <div style={{ position: "fixed", right: 0 }}>
      <Container maxWidth="lg" disableGutters={true}>
        <Toolbar>
          <IconButton
            disableRipple
            aria-label="open drawer"
            onClick={() => toggleDrawer(true)}
            style={{ color: "white", marginTop: 6}}
          >
            <MenuIcon fontSize="large" />
          </IconButton>

          <Drawer anchor="right" open={open} classes={{ paper: classes.paper }}>
            <Box>
              <Box
                display="flex"
                style={{
                  paddingBottom: "30px",
                }}
              >
                <Typography
                  variant="h5"
                  style={{ display: "flex", margin: "15px" }}
                >
                  <span>Spatial Browser</span>
                  <span style={{ alignSelf: "flex-start", fontSize: "0.6rem" }}>
                    ALPHA
                  </span>
                </Typography>
                <IconButton
                  onClick={() => toggleDrawer(false)}
                  style={{ color: "white", marginLeft: "auto" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Grid
                component="label"
                container
                alignItems="center"
                justifyContent="center"
                spacing={5}
              >
                <Grid item>
                  <Typography>GPS</Typography>
                </Grid>
                <Grid item>
                  <StyledSwitch
                    checked={isManual}
                    onChange={(event) => handleChange(event.target.checked)}
                  />
                </Grid>
                <Grid item>
                  <Typography>Manual</Typography>
                </Grid>
              </Grid>

              <div className={styles["flexcolumn"]}>
                <div className={styles["flexrow"]}>
                  <Typography className={styles["coord-label"]}>
                    Latitude:
                  </Typography>
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
                      disableUnderline: true,
                    }}
                  />
                </div>
                <div className={styles["flexrow"]}>
                  <Typography className={styles["coord-label"]}>
                    Longitude:
                  </Typography>
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
                      disableUnderline: true,
                    }}
                  />
                </div>
                {isManual ? (
                  <Button
                    onClick={() => handleManualSubmit()}
                    className={classes.coordBtn}
                    variant="contained"
                  >
                    Go
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRefreshGPS()}
                    className={classes.coordBtn}
                    variant="contained"
                  >
                    Refresh
                  </Button>
                )}
              </div>
            </Box>
            <div className={styles["social"]}>
              <a
                href="https://geoweb.network/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/assets/web.svg" alt="Web" style={{ width: 30 }} />
              </a>
              <a
                href="https://discord.com/invite/reXgPru7ck"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/assets/discord.svg"
                  alt="Discord"
                  style={{ width: 30 }}
                />
              </a>
              <a
                href="https://twitter.com/thegeoweb"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/assets/twitter.svg"
                  alt="Twitter"
                  style={{ width: 30 }}
                />
              </a>
            </div>
          </Drawer>
        </Toolbar>
      </Container>
    </div>
  );
}
