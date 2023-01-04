import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import styles from "./styles.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#4B5588",
    color: "white",
  },
  expanded: {
    background: "#4B5588",
    color: "white",
    flexDirection: "column",
  },
  heading: {
    fontFamily: "Abel",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "2rem",
    alignItems: "center",
    textAlign: "center",
    color: "white",
  },
  typography: {
    fontFamily: "Abel",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "1.3rem",
    color: "white",
    textAlign: "left",
  },
  link: {
    color: "white",
    textDecorationThickness: "0.1rem",
  },
}));

export default function GWInfo({ gwInfo, gwContentName }) {
  const classes = useStyles();

  return (
    <Accordion className={classes.root} disabled={!gwInfo}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>{gwContentName}</Typography>
      </AccordionSummary>
      {gwInfo && (
        <AccordionDetails className={classes.expanded}>
          <Typography noWrap className={classes.typography}>
            Parcel ID: {gwInfo.id}
          </Typography>
          <Typography noWrap className={classes.typography}>
            Licensee: {gwInfo.licensee}
          </Typography>
          <Typography noWrap className={classes.typography}>
            For Sale Price: {gwInfo.value}
          </Typography>
          <Typography noWrap className={classes.typography}>
            {"Root CID: "}
            <a
              className={classes.link}
              href={`https://explore.ipld.io/#/explore/${gwInfo["rootCid"]}`}
              target="_blank"
              rel="noreferrer"
            >
              {gwInfo["rootCid"]}
            </a>
          </Typography>
        </AccordionDetails>
      )}
    </Accordion>
  );
}
