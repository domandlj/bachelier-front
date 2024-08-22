import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Function to generate a random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Plot = ({ title, datasets, logarithmicY, xName, yName }) => {
  // Transform datasets into a format suitable for Recharts
  const transformedData = datasets[0].dataX.map((xValue, index) => {
    const dataPoint = { x: xValue };
    datasets.forEach((dataset) => {
      dataPoint[dataset.name] = dataset.dataY[index];
    });
    return dataPoint;
  });

  // Generate a random color for each dataset
  const colors = datasets.map(() => getRandomColor());

  return (
    <div>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="x" 
            label={{ 
              value: xName, 
            }} 
          />
          <YAxis 
            scale={logarithmicY ? "log" : "linear"} 
            type={"number"} 
            label={{ 
              value: yName, 
              angle: -90, 
              position: 'insideLeft', 
              style: { textAnchor: 'middle' }, 
            }} 
          />
          <Tooltip />
          <Legend />
          {datasets.map((dataset, index) => (
            <Line
              key={dataset.name}
              type="monotone"
              dataKey={dataset.name}
              stroke={colors[index]} // Use randomly generated color
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Plot;

