
export const modelClass = `
  from abc import ABC, abstractmethod

  class Model(ABC):
      def __init__(self, **parameters):
          self.parameters = parameters
      
      @abstractmethod
      def results(self):
          pass
      
      @abstractmethod
      def plot(self):
          pass
  
  import json

  def plt(title, data_sets, log=False, x_name='x val', y_name='y val'):
    # Structure the data into a dictionary
    plot_data = {
        "title": title,
        "logarithmicY": log,
        "datasets": data_sets,
        "xName": x_name,
        "yName": y_name
    } 

    # Convert the dictionary to a JSON string
    return json.dumps(plot_data, indent=4)
    
`;



export const boxDescription = `
# New Box

## Edit markdown description.
Edit the description of the code in \`markdown\` format, you can write \`latex\` equations like $\\sum_{t=1}^n\\frac{C}{(1+i)^t}$. As convention, it is recommended to:
* Describe what the model in the box does.
* Describe the input parameters.
* Describe the output.

## Implement the model code.
You need to follow the naming convention:
* A \`class\` called what your model is called.
* A \`results()\` method in your \`class\` for outputting the results.
* A \`plot()\` method in the \`class\` for plotting if you would like to display some graphs.

Follow this template:
\`\`\`python
class MyModel:
    def __init__(self):
        pass

    def results(self):
        pass

    def plot(self):
        pass
\`\`\`

## Set the parameters.
Set the number of parameters that your model uses; you can name them afterward.

## Installing libraries.
For installing libraries, Pyodide allows writing \`await micropip.install('lib name')\`. Most libraries like \`numpy\`, \`scipy\`, \`scikitlearn\`, \`pandas\`, etc. are supported. Check the Pyodide documentation.

## Plotting.
Currently, \`matplotlib\` isn't supported, but you can plot with the following methods:

### Plot curves
\`\`\`python
plt(
    title,
    data_sets, 
    log=False, 
    x_name='x val', 
    y_name='y val'
 )
\`\`\`
where
* \`title\` is the name title
* \`data_sets\` is a list of the shape:
\`\`\`
datasets = [
    {
     'name': 'Dataset 1', 
     'dataX': [1, 2, 3,4], 
     'dataY': [1, 2, 3,10]
    },

    {
     'name': 'Dataset 2', 
     'dataX': [1, 2, 3,4], 
     'dataY': [1, 2.2, 3,5]
    }
]
\`\`\`
* \`log\` is a boolean parameter for setting if the scale is linear or logarithmic.
* \`x_name\`, \`y_name\` are the names of the x and y axes.

### More graphs to plot.
In the future, more plotting functions are going to be added.

## Saving box to local database.
When you press the play button, if your model runs, then it's stored in the \`indexeddb\` of your browser, and you can later download it.
`;

export const newModelCode = `
class MyModel:
    def __init__(self):
        """
        Initialize the Model.
        """
        pass

    
    def results(self):
        """
        Implement here the output results.
        """
        pass
    
    def plot(self):
        """
        Implement here the plotting function.
        """
        pass


`;