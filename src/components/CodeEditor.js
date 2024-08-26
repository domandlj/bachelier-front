import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { TextField, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SquareButton from './SquareButton';
import { saveModel, getAllModels, deleteModel } from './indexedDBUtils';
import {modelClass, boxDescription, newModelCode} from './PythonModels';
import Spinner from './Spinner';
import { faDatabase, faNewspaper, faBoxesStacked,faBox, faChartLine, faFolderOpen,faFloppyDisk, faFile, faEdit, faPlay, faShareNodes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ParamNameModal from './ParamNameModal';
import UrlModal from './UrlModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Plot from './Plot';



const currentUrl = new URL(window.location.href).origin;
const BACK_URL = process.env.REACT_APP_BACK_URL;


const style = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
    '& input': {
      color: 'white', // Input text color
    },
    '& input::placeholder': {
      color: 'white', // Placeholder text color
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white', // Label text color
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white', // Label text color when focused
  },
};


const MarkdownSection = ({markdown, setMarkdown}) => {
  const [isMarkdownEditorVisible, setIsMarkdownEditorVisible] = useState(false);
  
  

  const handleEditMarkdown = () => {
    setIsMarkdownEditorVisible(!isMarkdownEditorVisible);
  };

  return(<div>
    {isMarkdownEditorVisible ? (
      <>
      <MonacoEditor
        height="300px"
        language="markdown"
        value={markdown}
        onChange={(value) => setMarkdown(value)}
        theme="vs-dark"
      />
      <SquareButton onClick={handleEditMarkdown} text="Render" />
      </>
    ) : (
    <>
      <div style={{
        margin: '20px auto',
        backgroundColor: '#1e1e1e',
        padding: '10px',
        borderRadius: '5px',
        width: '100%',
        maxWidth: '100%',  // Ensures the width is constrained on larger screens
        boxSizing: 'border-box',  // Includes padding in the element's width
        wordWrap: 'break-word'  // Ensures long words or URLs wrap to the next line

      }}>
        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {markdown}
        </Markdown>
      </div>
      <SquareButton onClick={handleEditMarkdown} icon={faEdit} />

      
    </>
  )}
  
  </div>
  );
};

const CodeSection = ({handlePlotModel, plotModel, setParamNames , output, 
    setOutput, pyodide, code, setCode, 
    modelName, setModelName, numParams, 
    setNumParams, setParameters, handleSaveModel, renderParameterInputs}) => {
  const [isCodeEditorVisible, setIsCodeEditorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveParamNames = (names) => {
    setParamNames(names);
  };

  const handleRunCode = async () => {
    if (pyodide) {
      setIsLoading(true);
      try {
        const result = await pyodide.runPythonAsync(code);
        console.log("handleRunCode: ", result);
        //setOutput(result);
      } catch (error) {
        console.error('Error executing code:', error);
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return(
  <div>
    {isCodeEditorVisible ? (
            <div>
              <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Model Code
        </Typography>
              <MonacoEditor
                height="400px"
                language="python"
                value={code}
                onChange={(value) => setCode(value)}
                theme="vs-dark"
              />
              <p></p>
            <div style={{ backgroundColor: '#1e1e1e', color: '#dcdcdc', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
              <strong>Output:</strong>
        <pre>{!isLoading&& !plotModel&& (output)}</pre>
            </div>
            {!isLoading&&output&&plotModel&&(<Plot
                title={JSON.parse(output)["title"]}
                datasets={JSON.parse(output)["datasets"]}
                logScaleY={JSON.parse(output)["logarithmicY"]} // Set to true to use logarithmic scale for y-axis
                xName={JSON.parse(output)["xName"]}
                yName={JSON.parse(output)["yName"]}

              />)}
            <p></p>
            {isLoading ? <Spinner /> : (
            <Box   
            display="flex"
            gap={1}
            p={1}>
              <SquareButton onClick={() => {handleRunCode(); handleSaveModel()}} icon={faPlay} />
              <SquareButton onClick={() => {handleRunCode(); handlePlotModel()}} icon={faChartLine} />
              <SquareButton onClick={() => setIsCodeEditorVisible(false)} text={"Hide"} />
            </Box>
          )}
          
              <TextField
                label="Model Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={modelName}
                sx={style}
                onChange={(e) => setModelName(e.target.value)}
              />
              <TextField
                inputProps={{ min: 0 }}
                label="Number of Parameters"
                type="number"
                variant="outlined"
                fullWidth
                sx={style}
                margin="normal"
                value={numParams}
                onChange={(e) => {setParameters({}); setNumParams(parseInt(e.target.value)||0 )}}
              />
              <Box>
                {renderParameterInputs()}
              </Box>
              <ParamNameModal
                open={isModalOpen}
                onClose={handleCloseModal}
                numParams={numParams}
                onSave={handleSaveParamNames}
              />
              <SquareButton icon={faEdit} onClick={handleOpenModal} text="" />
        
              
            </div>
          ) : (
            <div>
               <p></p>
      <div style={{ backgroundColor: '#1e1e1e', color: '#dcdcdc', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
        <strong>Output:</strong>
        <pre>{!isLoading && !plotModel &&(output)}</pre>
      </div> 
      {!isLoading&&output&&plotModel&&(<Plot
                title={JSON.parse(output)["title"]}
                datasets={JSON.parse(output)["datasets"]}
                logScaleY={JSON.parse(output)["logarithmicY"]} // Set to true to use logarithmic scale for y-axis
                xName={JSON.parse(output)["xName"]}
                yName={JSON.parse(output)["yName"]}
              />)}
            <p></p>
            {isLoading ? <Spinner /> : (
            <Box display="flex"
            gap={1}
            p={1}>
                 <SquareButton onClick={()=> {handleRunCode(); handleSaveModel()}} icon={faPlay}/>
                 <SquareButton onClick={() => {handleRunCode(); handlePlotModel()}} icon={faChartLine} />
                 <SquareButton onClick={() => setIsCodeEditorVisible(true)} text={"Code"}/>
            </Box>
          )}
         
              {numParams > 0 ? (<h3> {modelName}</h3>) : <p></p>}
              <Box>
                {renderParameterInputs()}
              </Box>
           
           
                
            </div>
          )}
       
  </div>
  );

};


const CodeEditor = ({id}) => {
  const [code, setCode] = useState('');
  const [modelName, setModelName] = useState('');
  const [numParams, setNumParams] = useState(0);
  const [markdown, setMarkdown] = useState('');
  const [parameters, setParameters] = useState({});
  const [paramNames, setParamNames] = useState([]);
  const [pyodide, setPyodide] = useState(null);
  const [output, setOutput] = useState('');
  const [models, setModels] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'create'
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Key for file input to reset it
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [plotModel,setPlotModel] = useState(false);
  const [boardLoading,setBoardLoading] = useState(false);

  useEffect(() => {
    const loadPyodide = async () => {
      const pyodideInstance = await window.loadPyodide();
      await pyodideInstance.loadPackage('micropip');
      await pyodideInstance.runPythonAsync(modelClass);
      setPyodide(pyodideInstance);
    };
    loadPyodide();
  }, []);

  useEffect(() => {
    const initializeDB = async () => {
      await loadModels();
    };
    initializeDB();
  }, []);

  const loadModels = async () => {
    try {
      const allModels = await getAllModels();
      setModels(allModels);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handlePlotModel = async () => {
    if (pyodide) {
      try {
        await pyodide.runPythonAsync(code);
        const paramsStr = Object.values(parameters).join(', ');
        const codeToRun = `${modelName}(${paramsStr})`;
        const instanceCode = `
          instance = ${codeToRun}
          instance.plot()
        `;
        const result = await pyodide.runPythonAsync(instanceCode);
        console.log("handleSaveModel", result);
        setOutput(result);
        setPlotModel(true);

        // Save model with markdown description
        await saveModel({ name: modelName, code, parameters, markdown, paramNames });
        await loadModels();
      } catch (error) {
        console.error('Error saving model:', error);
        setOutput(`Error: ${error.message}`);
      }
    }
  };

  const handleSaveModel = async () => {
    if (pyodide) {
      try {
        await pyodide.runPythonAsync(code);
        const paramsStr = Object.values(parameters).join(', ');
        const codeToRun = `${modelName}(${paramsStr})`;
        const instanceCode = `
          instance = ${codeToRun}
          instance.results()
        `;
        const result = await pyodide.runPythonAsync(instanceCode);
        console.log("handleSaveModel", result);
        setOutput(result);
        setPlotModel(false);


        // Save model with markdown description
        await saveModel({ name: modelName, code, parameters, markdown, paramNames });
        await loadModels();
      } catch (error) {
        console.error('Error saving model:', error);
        setOutput(`Error: ${error.message}`);
      }
    }
  };

  const handleCreateModel = () => {
    setView('create');
    setCode('');
    setParameters({});
    setNumParams(0);
    setOutput('');
    setMarkdown(boxDescription);
    setCode(newModelCode);
  }

  


  const handleLoadModel = async (modelName) => {
    try {
      const model = models.find(model => model.name === modelName);
      if (model) {
        setCode(model.code);
        setView('create');

        setModelName(model.name);
        setParameters(model.parameters);
        if(model.paramNames)
          setParamNames(model.paramNames);
        setOutput('');
        setMarkdown(model.markdown || ''); // Load markdown if available
        setNumParams(Object.keys(model.parameters).length || 0);
   
      } else {
        console.log('Model not found');
      }
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const handleDeleteModel = async (modelName) => {
    try {
      await deleteModel(modelName);
      await loadModels();
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  const handleExportModels = () => {
    const blob = new Blob([JSON.stringify(models, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'models.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportModels = (event) => {
    setFileInputKey(Date.now());
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target.result;
          const importedModels = JSON.parse(content);
          for (const model of importedModels) {
            await saveModel(model);
          }
          await loadModels();
        } catch (error) {
          console.error('Error importing models:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const response = await fetch(`${BACK_URL}/models/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        //modelName, code, parameters, markdown, paramNames
        if (data){
          setNumParams(Object.keys(data.parameters).length || 0);
          setModelName(data.name);
          setCode(data.code);
          setParameters(data.parameters);
          setParamNames(data.paramNames);
          setMarkdown(data.markdown);
          setView('create');
        }
      } catch (error) {
        console.log(error.message);
      } 
    };

    fetchModelData();
  }, [id]);


  const fetchModelBoard = async () => {
    setBoardLoading(true);
    try {
      const response = await fetch(`${BACK_URL}/models/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      //modelName, code, parameters, markdown, paramNames
      if (data){
        setModels(data);
      }
    } catch (error) {
      console.log(error.message);
    }
    setBoardLoading(false);
  };

  const handlePost = async () => {
    const modelData = { 
        name: modelName, 
        code, 
        parameters, 
        markdown, 
        paramNames };
    
    setIsUrlModalOpen(true);

    try {
      const response = await fetch(`${BACK_URL}/models/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelData),
      });

      if (response.ok) {
        const result = await response.json();
        setUrl(`${currentUrl}/#/models/${result.id}`);
        console.log('Model created successfully:', result);
      } else {
        console.error('Failed to create model:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const renderParameterInputs = () => {
    const inputs = [];
    for (let i = 0; i < numParams; i++) {
      inputs.push(
        <TextField
          key={i}
          label={paramNames[i]||`Parameter ${i + 1}`}
          variant="outlined"
          fullWidth
          margin="normal"
          value={parameters[`param${i + 1}`]}
          sx={style}
          onChange={(e) => setParameters({ ...parameters, [`param${i + 1}`]: e.target.value })}
        />
      );
    }
    return inputs;
  };


   
  

 

  return (
    <div>

      {view === 'create' && (
        <div>
          <Box   
            display="flex"
            gap={1}
            p={0}>
          <SquareButton icon={faArrowLeft} selected={view==="list"} onClick={() => setView('list')}  />
          <SquareButton onClick={handlePost} share icon={faShareNodes}/>
          </Box>
          <UrlModal isUrlModalOpen={isUrlModalOpen} setIsUrlModalOpen={setIsUrlModalOpen} url={url} />
          <Typography variant="h6" gutterBottom sx={{ marginTop:'10px', color: "white" }}>
          Model Description
        </Typography>
          <MarkdownSection markdown={markdown} setMarkdown={setMarkdown} />
          <CodeSection 
            handlePlotModel={handlePlotModel}
            plotModel={plotModel}
            paramNames={paramNames} 
            setParamNames={setParamNames}
            output={output} 
            setOutput={setOutput} 
            pyodide={pyodide} 
            code={code} 
            setParameters={setParameters}
            setCode={setCode} 
            modelName={modelName} 
            setModelName={setModelName} 
            numParams={numParams} 
            setNumParams={setNumParams} 
            handleSaveModel={handleSaveModel} 
            renderParameterInputs={renderParameterInputs} 
          />
        </div>
      )}

      {view === 'list' && (
        <div style={{  position: 'fixed', width:'95vw' ,overflow: 'hidden', overflowY: 'hidden' }} >
          <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
          <FontAwesomeIcon icon={faBoxesStacked} /> Boxes List
        </Typography>
          <Box display="flex" flexDirection="rows" gap={2}>
          <SquareButton share icon={faNewspaper} onClick={fetchModelBoard} />
          <SquareButton icon={faFile} onClick={handleCreateModel} />
          <SquareButton icon={faFloppyDisk} onClick={handleExportModels} text="" />
          <SquareButton icon={faFolderOpen}  onClick={() => document.getElementById('import-input').click()} text="" />


            <input
              id="import-input"
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              key={fileInputKey}
              onChange={handleImportModels}
            />
            </Box>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {boardLoading&&(<p> <FontAwesomeIcon icon={faDatabase}/> Talking with db...</p>)}    
      {models.map((model) => (
        <Card
          key={model.name}
          variant="outlined"
          sx={{
            marginRight: '8px',
            marginTop: '16px',
            marginBottom: '16px',
            bgcolor: 'black',
            color: 'white',
            borderColor: 'gray',
            '& .MuiTypography-root': {
              color: 'white',
            },
            '& .MuiCardContent-root': {
              color: 'white',
            },
            '& .MuiIconButton-root': {
              color: 'white',
            },
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faBox} style={{ marginRight: '8px', color: 'white' }} />
              <Typography variant="h6">{model.name}</Typography>
            </div>
            <div>
              <IconButton onClick={() => handleLoadModel(model.name)} style={{ marginRight: '8px' }}>
                Load
              </IconButton>
              <IconButton onClick={() => handleDeleteModel(model.name)} color="error">
                <DeleteIcon />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
        </div>
      )}
    </div>
  );

};

export default CodeEditor;