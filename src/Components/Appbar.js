import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';


const Appbar = () => {
  return (

    <AppBar position="static" style={{backgroundColor:"#008080"}}>
      <Container maxWidth="xl" >
        <Toolbar disableGutters >
          <Typography
            variant="h6"
            component="div"
            color="#ADD8E6"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          > <Link to='/' style={{ color: '#FFF', textDecoration: 'none' }}> TRADE </Link></Typography>

          <Typography
            variant="h6"
            color="inherit"

            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Link to='/about' style={{ color: '#FFF', textDecoration: 'none' }} >ABOUT</Link>
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Link to='/faq' underline='none' style={{ color: '#FFF', textDecoration: 'none' }} >FAQs</Link>

          </Typography>
          <div  style={{marginLeft: 'auto'}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Link to='/upload' underline='none' style={{ color: '#FFF', textDecoration: 'none' }} >Upload</Link>

          </Typography>
 
         </div>
        </Toolbar>
      </Container>
    </AppBar>

  );
};
export default Appbar;
