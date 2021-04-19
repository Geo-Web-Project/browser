import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './styles.css';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '60px',
    background: '#4B5588',
    color: 'white'
  },
  expanded: {
    height: '145px',
    background: '#4B5588',
    color: 'white'
  },
  heading: {
    //fontSize: theme.typography.pxToRem(15),
    //fontWeight: theme.typography.fontWeightRegular,
    
    fontFamily: 'Abel',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '32px',
    lineHeight: '45px',
    /* or 141% */

    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',

    color: '#FFFFFF',
  },
  typography: {
    fontFamily: 'Abel',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '24px',
    /* identical to box height, or 133% */

    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',

    color: '#ffffff',
  }
}));



export default function GWInfo() {

  const classes = useStyles();

  return (
    
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.root}
        >
          <Typography className={classes.heading}>
            [Parcel Name]
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.expanded}>
          <Typography className={classes.expanded}>
            <p key={'key1'}>{'Parcel ID: ' + 0}</p>
            <p key={'key2'}>{'License: ' + 0}</p>
            <p key={'key3'}>{'For Sale Price: ' + 0}</p>
            <p key={'key4'}>{'Expiration: ' + 0}</p>
            <p key={'key5'}>{'Fee Balance: ' + 0}</p>
            <p key={'key6'}>{'Linked CID: ' + 0}</p>
          </Typography>
        </AccordionDetails>
      </Accordion>
  );
}
