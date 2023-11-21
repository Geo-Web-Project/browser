import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    background: "#202333",
    color: "white",
    boxShadow: "none",
    border: 0,
    overflow: "hidden",
    "&.Mui-disabled": {
      backgroundColor: "#202333",
    },
    "&.Mui-expanded": {
      zIndex: 1003,
    },
  },
  expanded: {
    background: "#202333",
    color: "white",
    flexDirection: "column",
  },
  content: {
    overflow: "hidden",
  },
  heading: {
    fontFamily: "Abel",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "2rem",
    alignItems: "center",
    color: "white",
    maxWidth: "95%",
  },
  subHeading: {
    fontFamily: "Abel",
    fontStyle: "normal",
    fontSize: "1.7rem",
    textAlign: "left",
    color: "white",
  },
  typography: {
    fontFamily: "Abel",
    fontStyle: "normal",
    fontSize: "1.3rem",
    color: "white",
    textAlign: "left",
  },
  link: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      textDecorationThickness: "0.1rem",
    },
  },
}));

export default function GWInfo({ gwInfo, gwContentName, gwContentUrl }: any) {
  const classes = useStyles();

  return (
    <Accordion className={classes.root} disabled={!gwInfo}>
      <AccordionSummary
        classes={{ content: classes.content }}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography noWrap className={classes.heading}>
          {gwContentName}
        </Typography>
      </AccordionSummary>
      {gwInfo && (
        <AccordionDetails className={classes.expanded}>
          <Typography noWrap className={classes.subHeading}>
            {gwContentUrl && (
              <a
                className={classes.link}
                href={gwContentUrl}
                target="_blank"
                rel="noreferrer"
              >
                {gwContentUrl}
              </a>
            )}
          </Typography>
          <Typography noWrap className={classes.typography}>
            Parcel ID: {gwInfo.id}
          </Typography>
          <Typography noWrap className={classes.typography}>
            Licensee: {gwInfo.licensee}
          </Typography>
          <Typography noWrap className={classes.typography}>
            For Sale Price: {gwInfo.value}
          </Typography>
        </AccordionDetails>
      )}
    </Accordion>
  );
}
