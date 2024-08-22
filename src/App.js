import React from 'react';
import './App.css'; // You can include your CSS styles here
import Header from './components/Header';
import BlogPost from './components/BlogPost';
import "@fontsource/montserrat"; // Import Montserrat font
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { Typography, Container, Box, Fade } from '@mui/material'; // Import Material-UI components

const blogData = null;

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
              <img 
                src="https://i.giphy.com/aIB5j2IeCuXmg.webp" 
                alt="" 
                style={{ borderRadius: '10px',maxWidth: '95%' }} 
              />
            </Box>

            {/* Presentation Section */}
            <section className="presentation">
              <Fade in={true} timeout={1000}>
                <Box
                  sx={{
                    maxWidth: '80vw', // Max width of 80% of viewport width
                    mx: 'auto', // Center the content horizontally
                  }}
                >
                   <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#fff', 
                      textTransform: 'uppercase', 
                      letterSpacing: '4px', 
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                      mb: 2,
                      fontSize: {
                        xs: '2.5rem', // Extra small devices
                        sm: '3rem',   // Small devices
                        md: '3.5rem', // Medium devices
                        lg: '4rem',   // Large devices
                        xl: '4rem'    // Extra large devices
                      },
                      textAlign: 'center', // Center align headings
                      fontFamily: 'Montserrat, sans-serif' // Use Montserrat font
                    }}
                  >
                    What's Bachelier?
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      fontSize: '1.2rem', 
                      lineHeight: '1.8', 
                      color: '#ddd', 
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
                      mb: 4,
                      textAlign: 'justify', // Justify text
                      fontFamily: 'Montserrat, sans-serif' // Use Montserrat font
                    }}
                  >
                    This webapp is designed for data scientists, finance professionals, and enthusiasts alike. Here, you can create and explore a variety of financial models encapsulated in what we call "Boxes". Each Box contains Python code and a markdown description, abstracted as a black box where you, the user, can input parameters to get outputs based on the implemented models.

                  </Typography>
                  <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#fff', 
                      textTransform: 'uppercase', 
                      letterSpacing: '4px', 
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                      mb: 2,
                      textAlign: 'center', // Center align headings
                      fontFamily: 'Montserrat, sans-serif' // Use Montserrat font
                    }}
                  >
                    Boxes
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      fontSize: '1.2rem', 
                      lineHeight: '1.8', 
                      color: '#ddd', 
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
                      mb: 4,
                      textAlign: 'justify', // Justify text
                      fontFamily: 'Montserrat, sans-serif' // Use Montserrat font
                    }}
                  >
                    Each Box contains Python code and a markdown description, abstracted as a black box where you, the user, can input parameters to get outputs based on the implemented models. Create and explore financial models with ease.
                  </Typography>

                  <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#fff', 
                      textTransform: 'uppercase', 
                      letterSpacing: '4px', 
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                      mb: 2,
                      textAlign: 'center', // Center align headings
                      fontFamily: 'Montserrat, sans-serif' // Use Montserrat font
                    }}
                  >
                    Share
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      fontSize: '1.2rem', 
                      lineHeight: '1.8', 
                      color: '#ddd', 
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
                      mb: 4,
                      textAlign: 'justify', // Justify text
                      fontFamily: 'Montserrat, sans-serif' // Use Montserrat font
                    }}
                  >
                    Share your Boxes across the web, allowing others to interact with your models, tweak parameters, and explore different scenarios. It's a collaborative environment for advanced financial calculations and model exploration.
                    Also you can load or store your boxes to your local storage.
                  </Typography>

                  {/* Pyodide Section */}
                  <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#fff', 
                      textTransform: 'uppercase', 
                      letterSpacing: '4px', 
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                      mb: 2,
                      textAlign: 'center', // Center align headings
                      fontFamily: 'Montserrat, sans-serif' // Use Montserrat font
                    }}
                  >
                    Python with Pyodide
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      fontSize: '1.2rem', 
                      lineHeight: '1.8', 
                      color: '#ddd', 
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
                      mb: 4,
                      textAlign: 'justify', // Justify text
                      fontFamily: 'Montserrat, sans-serif' // Use Montserrat font
                    }}
                  >
                    Our platform leverages Pyodide, a powerful tool that brings the full Python environment to your browser. With Pyodide, you can execute Python code directly in your browser, enabling real-time interaction with financial models and data. This allows for a seamless integration of Python’s computational capabilities into our web application, making it easy to run and test complex algorithms without any server-side processing.
                  </Typography>
                </Box>
              </Fade>
            </section>

            {/* Blog Posts */}
            {blogData && blogData.map((post, index) => (
              <BlogPost
                key={index}
                title={post.title}
                content={post.content}
                date={post.date}
              />
            ))}
          </main>
        </Container>
      </div>
    </div>
  );
}

export default App;

