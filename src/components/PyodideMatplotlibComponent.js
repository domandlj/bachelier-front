import React, { useEffect, useState } from 'react';

const PyodideMatplotlibComponent = ({ pythonCode, plot }) => {
  const [pyodide, setPyodide] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const initializePyodide = async () => {
      const pyodideInstance = await window.loadPyodide();
      await pyodideInstance.loadPackage('plotly');
      await pyodideInstance.loadPackage('kaleido');

      setPyodide(pyodideInstance);
    };
    initializePyodide();
  }, []);

  useEffect(() => {
    const executePythonPlot = async () => {
      if (pyodide) {
        setLoading(true); // Set loading to true when starting
        try {
          const code = `
import plotly.express as px
import plotly.io as pio
import io
import base64

# Clear the current figure to avoid memory bloat
pio.kaleido.scope.default_format = "png"

# Create your plotly figure
fig = px.bar(x=["a", "b", "c"], y=[1, 3, 2])

# Save the figure to a BytesIO buffer
buf = io.BytesIO()
pio.write_image(fig, file=buf, format='png')

# Reset the buffer position to the beginning
buf.seek(0)

# Encode the image to base64
img_str = "data:image/png;base64," + base64.b64encode(buf.read()).decode('utf-8')

# Close the buffer
buf.close()

img_str
          `;

          const result = await pyodide.runPythonAsync(code);
          setOutput(result);
        } catch (error) {
          console.error(error);
          setOutput('Error executing Python code');
        } finally {
          setLoading(false); // Set loading to false when done
        }
      }
    };

    const executePython = async () => {
      if (pyodide) {
        setLoading(true); // Set loading to true when starting
        try {
          const result = await pyodide.runPythonAsync(pythonCode);
          setOutput(result);
        } catch (error) {
          console.error(error);
          setOutput('Error executing Python code');
        } finally {
          setLoading(false); // Set loading to false when done
        }
      }
    };

    if (plot) {
      executePythonPlot();
    } else {
      executePython();
    }
  }, [pyodide, pythonCode, plot]);

  return (
    <div style={{ backgroundColor: '#1e1e1e', color: '#dcdcdc', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
      <br />
      {loading && <div>Loading...</div>} {/* Display loading message */}
      {!loading && output && plot && (
        <img
          style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
          src={output}
          alt="Python output"
        />
      )}

      {!loading && output && !plot && <div>{output}</div>}
    </div>
  );
};

export default PyodideMatplotlibComponent;