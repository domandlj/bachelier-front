import React from 'react';
import './App.css'; // You can include your CSS styles here
import Header from './components/Header';
//import BlogPost from './components/BlogPost';
import "@fontsource/montserrat"; // Import Montserrat font
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { Container, Box} from '@mui/material'; // Import Material-UI components
import World from './components/World'; // Import World component


function App() {
  return (
    <div>  
      <Header option={"Main"}/>
      <div className="App">
        <Container>
          <main className="blog-container">
            {/* Centered Image */}
            <Box 
              sx={{ 
                mb: 4 // Margin bottom
              }}
            >      
            <World/>
            </Box>
          </main>
        </Container>
      </div>
    </div>
  );
}

export default App;