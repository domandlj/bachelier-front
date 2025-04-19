import React, { useState, useEffect } from 'react';
import './Bio.css';
import Header from './Header';
import "@fontsource/montserrat";
import {
  ComposedChart,
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Line,
  Text,
  ReferenceLine
} from 'recharts';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

const BACK_URL = process.env.REACT_APP_BACK_URL;
/*
 {
    "ticker": "S28A5",
    "fechaVencim": "28/04/2025",
    "liqui_secu": "21/4",
    "dias": 7,
    "Meses": 0.233,
    "precio": 130.06,
    "total": 130.81,
    "tna": 0.3019,
    "tem": 0.025,
    "tea": 0.35119999999999996
  }
*/
const dataMock = [
  { ticker: 'S16A5', fechaVencim: '16/04/2025', dias: 5, precio: 130.450, total: 131.21, tem: 3.55, temLicitada: 0 },
  { ticker: 'S28A5', fechaVencim: '28/04/2025', dias: 14, precio: 128.700, total: 130.81, tem: 3.55, temLicitada: 0 },
  { ticker: 'S16Y5', fechaVencim: '16/05/2025', dias: 32, precio: 132.222, total: 136.86, tem: 3.29, temLicitada: 0 },
  { ticker: 'S30Y5', fechaVencim: '30/05/2025', dias: 53, precio: 129.450, total: 136.33, tem: 2.97, temLicitada: 0 },
  { ticker: 'S18J5', fechaVencim: '18/06/2025', dias: 69, precio: 136.900, total: 147.70, tem: 3.41, temLicitada: 0 },
  { ticker: 'S30J5', fechaVencim: '30/06/2025', dias: 84, precio: 135.750, total: 146.61, tem: 2.82, temLicitada: 0 },
  { ticker: 'S31L5', fechaVencim: '31/07/2025', dias: 115, precio: 132.520, total: 147.74, tem: 2.90, temLicitada: 0 },
  { ticker: 'S15G5', fechaVencim: '15/08/2025', dias: 126, precio: 127.000, total: 146.79, tem: 3.57, temLicitada: 0 },
  { ticker: 'S29G5', fechaVencim: '29/08/2025', dias: 144, precio: 137.000, total: 157.70, tem: 3.02, temLicitada: 0 },
  { ticker: 'S12S5', fechaVencim: '12/09/2025', dias: 158, precio: 134.900, total: 158.98, tem: 3.23, temLicitada: 0 },
  { ticker: 'S30S5', fechaVencim: '30/09/2025', dias: 176, precio: 133.000, total: 159.73, tem: 3.23, temLicitada: 0 },
  { ticker: 'T17O5', fechaVencim: '15/10/2025', dias: 191, precio: 127.800, total: 158.47, tem: 3.49, temLicitada: 0 },
  { ticker: 'S31O5', fechaVencim: '31/10/2025', dias: 207, precio: 105.510, total: 132.82, tem: 3.44, temLicitada: 0 },
  { ticker: 'S10N5', fechaVencim: '10/11/2025', dias: 217, precio: 96.900, total: 122.25, tem: 3.33, temLicitada: 0 },
  { ticker: 'S28N5', fechaVencim: '28/11/2025', dias: 235, precio: 97.300, total: 123.56, tem: 3.15, temLicitada: 0 },
  { ticker: 'T15D5', fechaVencim: '15/12/2025', dias: 252, precio: 129.500, total: 170.84, tem: 3.41, temLicitada: 0 },
  { ticker: 'T30E6', fechaVencim: '30/01/2026', dias: 298, precio: 103.000, total: 142.22, tem: 3.36, temLicitada: 0 },
  { ticker: 'T13F6', fechaVencim: '13/02/2026', dias: 311, precio: 103.400, total: 144.97, tem: 3.38, temLicitada: 0 },
  { ticker: 'T30J6', fechaVencim: '30/06/2026', dias: 449, precio: 90.150, total: 144.90, tem: 3.27, temLicitada: 0 },
  { ticker: 'T15E7', fechaVencim: '15/01/2027', dias: 647, precio: 82.550, total: 161.10, tem: 3.20, temLicitada: 0 }
];

dataMock.sort((a, b) => a.dias - b.dias);
dataMock.map(item => {item["breakeven"]= item.total*1230/item.precio})
dataMock.map(item => {item["sup"]= (1400 * (1 + 0.01)**(item.dias / 30))})

const lecapsTable =(data) =>
  <>
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
      <thead>
        <tr>
          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Ticker</th>
          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Precio</th>
          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Días al Vencimiento</th>
          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Total</th>
          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>TEM</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            style={{
              backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#333',
              borderRadius: '8px',
            }}
          >
            <td style={{ padding: '12px', textAlign: 'left' }}>{item["ticker"]}</td>
            <td style={{ padding: '12px', textAlign: 'left' }}>{item["precio"]}</td>
            <td style={{ padding: '12px', textAlign: 'left' }}>{item["dias"]}</td>
            <td style={{ padding: '12px', textAlign: 'left' }}>${item["total"].toLocaleString()}</td>
            <td style={{ padding: '12px', textAlign: 'left' }}>{item["tem"]}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
const calculateTrendLine = (data) => {
  if (!data || data.length === 0) return [];
  const points = data.map(d => [d.dias, d.tem]);
  const regression = linearRegression(points);
  const lineFunction = linearRegressionLine(regression);
  
  const diasValues = data.map(d => d.dias);
  const minDias = Math.min(...diasValues);
  const maxDias = Math.max(...diasValues);
  
  return [
    { dias: minDias, tem: lineFunction(minDias) },
    { dias: maxDias, tem: lineFunction(maxDias) },
  ];
};


const trendData = calculateTrendLine(dataMock);


// Convert to function component to use proper data flow
const lecapsChart = (data,trend=[])=>
    <>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Relación Días al Vencimiento vs TEM
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{ top: 20, right: 30, left: 30, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            dataKey="dias"
            name="Días al Vencimiento"
            domain={['auto', 'auto']}
            stroke="white"
            tick={{ fill: '#ffffff' }}
            label={{
              value: 'Días al Vencimiento',
              position: 'insideBottom',
              offset: -10,
              fill: '#ffffff',
            }}
          />
          <YAxis
            type="number"
            dataKey="tem"
            name="TEM"
            domain={['auto', 'auto']}
            stroke="white"
            tick={{ fill: '#ffffff' }}
            label={{
              value: 'TEM (%)',
              angle: -90,
              position: 'insideLeft',
              fill: '#ffffff',
            }}
          />
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const { ticker, dias, tem } = payload[0].payload;
                return (
                  <div style={{ 
                    backgroundColor: '#1a1a1a',
                    padding: '10px',
                    border: '1px solid #333',
                    borderRadius: '4px'
                  }}>
                    <p><strong>{ticker}</strong></p>
                    <p>Días: {dias}</p>
                    <p>TEM: {tem.toFixed(2)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          {/* Scatter points */}
          <Scatter
            name="LECAPS"
            data={data.filter(item=> item['tem'] > 0)}
            fill="#00ff88"
            shape={({ cx, cy, payload }) => (
              <g>
                <circle cx={cx} cy={cy} r={6} fill="#00ff88" stroke="#000" strokeWidth={1} />
                <Text
                  x={cx}
                  y={cy + 15}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={12}
                >
                  {payload.ticker}
                </Text>
              </g>
            )}
          />
          {/* Trend line fixes */}
          <Line
            type="linear"
            dataKey="tem"
            data={data.filter(item=> item['tem'] > 0)}
            stroke="#ff7300"
            strokeWidth={2} // Added explicit width
            strokeDasharray="5 5"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            name="Tendencia"
          />
          {/* Optional: Add regression equation annotation */}
          {trend.length === 2 && (
            <ReferenceLine
              segment={[
                { x: trend[0].dias, y: trend[0].tem },
                { x: trend[1].dias, y: trend[1].tem },
              ]}
              stroke="#ff7300"
              strokeDasharray="5 5"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </>
const lecapsBreakEvenChart = (data,dolar) =>(
  <>
    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
      Dólar Breakeven (Dólar ofical hoy {dolar?.venta} $)
    </h2>
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 100 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis
          type="number"
          dataKey="dias"
          name="Días al Vencimiento"
          domain={['auto', 'auto']}
          stroke="white"
          tick={{ fill: '#ffffff' }}
          label={{
            value: 'Días al Vencimiento',
            position: 'insideBottom',
            offset: -10,
            fill: '#ffffff',
          }}
        />
        <YAxis
          type="number"
          dataKey="breakeven"
          name="USD Breakeven"
          domain={['auto', 'auto']}
          stroke="white"
          tick={{ fill: '#ffffff' }}
          label={{
            value: '$ (ARSp/USD)',
            angle: -90,
            position: 'insideLeft',
            fill: '#ffffff',
          }}
        />
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length) {
              const { ticker, dias, breakeven, sup } = payload[0].payload;
              return (
                <div
                  style={{
                    backgroundColor: '#1a1a1a',
                    padding: '10px',
                    border: '1px solid #333',
                    borderRadius: '4px'
                  }}
                >
                  <p><strong>{ticker}</strong></p>
                  <p>Días: {dias}</p>
                  <p>Breakeven: {breakeven.toFixed(2)}</p>
                  <p>Banda superior: {sup?.toFixed(2) || 'N/A'}</p>
                </div>
              );
            }
            return null;
          }}
        />
        {/* Scatter points */}
        <Scatter
          name="LECAPS"
          data={data}
          dataKey="breakeven"

          fill="#00ff88"
          shape={({ cx, cy, payload }) => (
            <g>
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="#00ff88"
                stroke="#000"
                strokeWidth={1}
              />
              <Text
                x={cx}
                y={cy + 15}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={12}
              >
                {payload.ticker}
              </Text>
            </g>
          )}
        />
        {/* Curve overlaying the scatter, using the 'sup' values */}
        <Line
          type="monotone"
          dataKey="sup"
          stroke="#ff7300"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </>
);


function Report({ data, dolar, trend, title, table = lecapsTable, charts = lecapsChart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerColor, setHeaderColor] = useState('#ffffff');

  const toggleReport = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      style={{
        marginBottom: '40px',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: headerColor,
          transition: 'color 0.3s ease',
        }}
        onClick={toggleReport}
        onMouseEnter={() => setHeaderColor('#e0e0e0')}
        onMouseLeave={() => setHeaderColor('#ffffff')}
      >
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </h1>

      <div
        className="report-content"
        style={{
          overflowY: isOpen ? 'auto' : 'hidden',
          transition: 'max-height 0.5s ease, opacity 0.5s ease',
          maxHeight: isOpen ? '600px' : '0',
          opacity: isOpen ? 1 : 0,
          paddingRight: '10px',
        }}
      >
        {/* Data Table */}
        <div style={{ marginBottom: '40px' }}>
          {table(data)}
        </div>

        {/* Chart */}
        <div
          style={{
            height: '500px',
            backgroundColor: '#222',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          {charts(data,trend)}
        </div>
        <div
          style={{
            height: '500px',
            backgroundColor: '#222',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          {lecapsBreakEvenChart(data, dolar)}
        </div>
      </div>
    
    </div>
  );
}

function Reports() {
  const [reportData, setReportData] = useState([]);
  const [trendDataS, setTrendDataS] = useState([]);
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dolar, setDolar] = useState({});

  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/oficial')
      .then(response => response.json())
      .then(data => setDolar(data))
      .catch(error => console.error('Error al obtener el dólar:', error));
  }, []);

  useEffect(() => {
    fetch(`${BACK_URL}/securities/fixed/lecaps`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        data.sort((a, b) => a["dias"] - b["dias"]);
        data.map(item => {item["breakeven"]= item["total"]*dolar.venta/item["precio"]})
        data.map(item => {item["sup"]= (1400 * (1 + 0.01)**(item["dias"] / 30))})
        data.map(item => {item["tem"]= item["tem"]*100})
        setTrendDataS( calculateTrendLine(data.filter(item=> item['tem'] > 0)));
        setReportData(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setReportData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  console.log(reportData);
  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', padding: '20px' }}>
      <Header option={'Reports'} />
      <div className="reports-container">
        <Report data={reportData} dolar={dolar} trend={trendDataS}  title={"Pesos Tasa Fija: LECAPs y BONCAPs"} />
        <Report data={dataMock}  title={"Bonos CER"} />
        <Report data={dataMock}  title={"Bonos Dollar-Linked"} />
        <Report data={dataMock} title={"Bonos Hard Dollar : Bonaeres y Globales"} />
      </div>
    </div>
  );
}

export default Reports;































