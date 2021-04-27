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
    
    fontFamily: 'Abel',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '32px',
    lineHeight: '45px',

    alignItems: 'center',
    textAlign: 'center',

    color: '#FFFFFF',
  },
  typography: {
    fontFamily: 'Abel',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '6px',

    alignItems: 'left',
    textAlign: 'left',

    color: '#ffffff',
  }
}));


export default function GWInfo(props) {

  const classes = useStyles();

  const gwInfo = props.gwInfo;

  //Info Schema
  let _gwInfoSchemaMap = {
    'Parcel ID: ' : 'id',
    'Licensee: ' : 'licensee',
    'For Sale Price: ': 'value',
    'Expiration: ': 'expiry',
    'Fee Balance: ': 'balance',
    //'Linked CID: ': 'ceramicId', 
  }

  const InfoList = () => {
    
    //Check if Info is available
    if(gwInfo !== null)
    { 
      //Iterate over all Keys in Info Object
      return <Typography className={classes.typography}>

        {Object.keys(_gwInfoSchemaMap).map((key) => 
          <p key={key}>{key + gwInfo[_gwInfoSchemaMap[key]]}</p>
        )}
        
        <p key={'Linked CID: '}>
          {'Linked CID: '}
          <a href={`https://gateway-clay.ceramic.network/api/v0/documents/${gwInfo['ceramicUri']}`}
            target="_blank" rel="noreferrer" className={classes.typography}>
              {gwInfo['ceramicId']}
          </a>
        </p>

        </Typography>
    }
    else
      return <div />
    
    }
  
    return (
      
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.root}
          >
            <Typography className={classes.heading}>
              The Dal Lake
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.expanded}>
              <InfoList />
          </AccordionDetails>
        </Accordion>
    );
}
