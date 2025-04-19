import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { CssBaseline } from '@mui/material';
import './NavBar.css';
import SquareButton from './SquareButton';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
});

function NavBar({ option }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const links = [
    { to: '/', optionKey: 'Main', text: 'Main' },
    { to: '/reports', optionKey: 'Reports', text: 'Reports' },
    { to: '/models', optionKey: 'Models', text: 'Boxes' },
    { to: '/bio', optionKey: 'whoami', text: 'About' },
  ];

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const desktopNav = (
    <nav className="navbar">
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>
              <SquareButton selected={option === link.optionKey} text={link.text} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  const mobileNav = (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(25, 25, 25, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(25, 25, 25, 0.9)',
          }
        }}
      >
        <MenuIcon style={{ color: '#fff' }} />
      </IconButton>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#000',
            color: '#fff',
          },
        }}
      >
        <Box
          component="nav"
          sx={{ 
            padding: 2,
            height: '100%',
            backgroundColor: '#000',
          }}
        >
          <ul style={{ 
            listStyleType: 'none', 
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {links.map((link) => (
              <li key={link.to} style={{ width: '100%' }}>
                <Link 
                  to={link.to} 
                  onClick={() => setIsDrawerOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <SquareButton 
                    selected={option === link.optionKey} 
                    text={link.text} 
                    fullWidth 
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Box>
      </Drawer>
    </>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {isMobile ? mobileNav : desktopNav}
    </ThemeProvider>
  );
}

export default NavBar;