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
  ReferenceLine,
  BarChart,
  Bar,
  Legend
} from 'recharts';


import { linearRegression, linearRegressionLine } from 'simple-statistics';
import { Tab } from '@mui/material';

const BACK_URL = process.env.REACT_APP_BACK_URL;

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

const ResponsiveText = ({ children, ...props }) => (
  <Text {...props} style={{ fontSize: 'clamp(8px, 2.5vw, 12px)', ...props.style }}>
    {children}
  </Text>
);

const lecapsTable = (data) => (
  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
    <table style={{ 
      minWidth: '600px',
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 8px',
      fontSize: 'clamp(12px, 3vw, 14px)'
    }}>
      <thead>
        <tr>
          {["Ticker", "Precio","Precio % Día","Precio % ytd " ,"Días al Vencimiento", "Total", "TEM"].map((header, i) => (
            <th key={i} style={{ 
              padding: '8px 12px',
              textAlign: 'left',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            style={{
              backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#333',
            }}
          >
            <td style={{ padding: '8px 12px', textAlign: 'left' }}>{item.ticker}</td>
            <td style={{ padding: '8px 12px', textAlign: 'left' }}>{item.precio}</td>
            <td style={{ 
              padding: '8px 12px', 
              textAlign: 'left', 
              color: item["price day %"] >= 0 ? '#16c784' : '#ea3943' 
            }}>
              {item["price day %"] >= 0 ? '▲' : '▼'} {item["price day %"]}%
            </td>

            <td style={{ 
              padding: '8px 12px', 
              textAlign: 'left', 
              color: item["price ytd %"] >= 0 ? '#16c784' : '#ea3943' 
            }}>
              {item["price ytd %"] >= 0 ? '▲' : '▼'} {item["price ytd %"]}%
            </td>


            <td style={{ padding: '8px 12px', textAlign: 'left' }}>{item.dias}</td>
            <td style={{ padding: '8px 12px', textAlign: 'left' }}>${item.total.toLocaleString()}</td>
            <td style={{ padding: '8px 12px', textAlign: 'left' }}>{item.tem}%</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/*{
  "ticker": "AL41D",
  "price": 64,
  "YTM": 11.007377173558176,
  "MD": 6.384453875453048,
  "Parity": 63.32279785625945,
  "price day %": -0.005050505050504861,
  "price ytd %": 0.04656250000000006
}
*/






// This is your original table, refactored to accept an onRowClick
const BonaresTableView = ({ data, onRowClick }) => (
  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
    <table style={{ 
      minWidth: '600px',
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 8px',
      fontSize: 'clamp(12px, 3vw, 14px)'
    }}>
      <thead>
        <tr>
          {["Ticker", "Precio","Precio % Día","Precio % YTD ", "YTM", "MD", "Paridad"].map((header, i) => (
            <th key={i} style={{ 
              padding: '8px 12px',
              textAlign: 'left',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.ticker}
            onClick={() => onRowClick(item)}
            style={{
              cursor: 'pointer',
              backgroundColor: item.ticker.charCodeAt(0) % 2 === 0 ? '#2a2a2a' : '#333'
            }}
          >
            <td style={{ padding: '8px 12px' }}>{item.ticker}</td>
            <td style={{ padding: '8px 12px' }}>{item.price} USD</td>
            <td style={{ 
              padding: '8px 12px', 
              color: item["price day %"] >= 0 ? '#16c784' : '#ea3943' 
            }}>
              {item["price day %"] >= 0 ? '▲' : '▼'} {item["price day %"]}%
            </td>
            <td style={{ 
              padding: '8px 12px', 
              color: item["price ytd %"] >= 0 ? '#16c784' : '#ea3943' 
            }}>
              {item["price ytd %"]>= 0 ? '▲' : '▼'} {item["price ytd %"]}%
            </td>
            <td style={{ padding: '8px 12px' }}>{item.YTM}%</td>
            <td style={{ padding: '8px 12px' }}>{item.MD}</td>
            <td style={{ padding: '8px 12px' }}>{item.Parity}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const AmortizationChart = ({ data }) => {
  const chartData = data.map(row => ({
    date: row.date,
    Interest: row.I.toFixed(3),
    Amortization: row.A.toFixed(3),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#fff', fontSize: 12 }} 
          axisLine={{ stroke: '#555' }} 
          tickLine={{ stroke: '#555' }}
        />
        <YAxis 
          tick={{ fill: '#fff', fontSize: 12 }} 
          axisLine={{ stroke: '#555' }} 
          tickLine={{ stroke: '#555' }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#222', borderColor: '#555' }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#aaa' }}
        />
        <Legend 
          verticalAlign="top" 
          wrapperStyle={{ color: '#fff' }}
        />

        {/* Colores adaptados a fondo negro */}
        <Bar 
          dataKey="Interest" 
          stackId="a" 
          name="Cupón Interés" 
          fill="#16c784" 
        />
        <Bar 
          dataKey="Amortization" 
          stackId="a" 
          name="Pago de Amortización" 
          fill="#ea3943" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const TickerDetail = ({ ticker, cfs, onBack }) => {
  const rows = cfs[ticker] || [];

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: 20,
          width: "100px",
          height: "30px",
          background: "transparent",
          borderRadius: "5px",
          border: "1px solid green",
          color: "green",
          cursor: "pointer",
        }}
      >
        ◄
      </button>
      <h2>Detalles {ticker}</h2>

      {/* Gráfico de amortización */}
      {rows.length > 0 && <AmortizationChart data={rows} />}

      {/* Aquí seguiría tu tabla como la tienes */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginTop: 20 }}>
        <table
          style={{
            minWidth: "600px",
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 8px",
            fontSize: "clamp(12px, 3vw, 14px)",
          }}
        >
          <thead>
            <tr>
              {["Fecha", "TNA", "Tasa de Amortización", "Amortización", "Valor Residual", "Cupón Interés", "CF"].map(hdr => (
                <th
                  key={hdr}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {hdr}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{ backgroundColor: i % 2 === 0 ? "#2a2a2a" : "#333" }}
              >
                <td style={{ padding: "8px 12px" }}>{row.date}</td>
                <td style={{ padding: "8px 12px" }}>{(row.interest * 100).toFixed(2)}%</td>
                <td style={{ padding: "8px 12px" }}>{(row.amort * 100).toFixed(2)}%</td>
                <td style={{ padding: "8px 12px" }}>${row.A.toFixed(2)}</td>
                <td style={{ padding: "8px 12px" }}>${row.RV.toFixed(2)}</td>
                <td style={{ padding: "8px 12px" }}>${row.I.toFixed(2)}</td>
                <td style={{ padding: "8px 12px" }}>${row.CF.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



// The “container” component that holds the state and switches views
function BonosHDTable({ data, cfs }) {
  const [selected, setSelected] = useState(null);

  // If something’s selected, show the detail pane
  if (selected) {
    return (
      <TickerDetail
        ticker={selected['ticker']}
        cfs={cfs}
        onBack={() => setSelected(null)}
      />
    );
  }

  // Otherwise show the table view
  return (
    <BonaresTableView
      data={data}
      onRowClick={item => setSelected(item)}
    />
  );
}



















const lecapsChart = (data, trend = []) => (
  <>
    <h2 style={{ textAlign: 'center', margin: '10px 0', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>
      Relación Días al Vencimiento vs TEM
    </h2>
    <div style={{ position: 'relative', width: '100%', height: 'clamp(300px, 60vh, 400px)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            dataKey="dias"
            name="Días"
            tick={{ fill: '#fff', fontSize: 'clamp(8px, 2.5vw, 12px)' }}
            label={{
              value: 'Días al Vencimiento',
              position: 'bottom',
              offset: 30,
              fill: '#fff',
              style: { fontSize: 'clamp(10px, 3vw, 14px)' }
            }}
          />
          <YAxis
            type="number"
            dataKey="tem"
            name="TEM"
            domain={[0, 4]}  // Set axis range from 0 to 8

            tick={{ fill: '#fff', fontSize: 'clamp(8px, 2.5vw, 12px)' }}
            label={{
              value: 'TEM (%)',
              angle: -90,
              position: 'left',
              fill: '#fff',
              style: { fontSize: 'clamp(10px, 3vw, 14px)' }
            }}
          />
          <Tooltip
            content={({ payload }) => (
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '8px',
                border: '1px solid #333',
                borderRadius: '4px',
                fontSize: 'clamp(12px, 3vw, 14px)'
              }}>
                {payload?.[0]?.payload && (
                  <>
                    <p><strong>{payload[0].payload.ticker}</strong></p>
                    <p>Días: {payload[0].payload.dias}</p>
                    <p>TEM: {payload[0].payload.tem.toFixed(2)}%</p>
                  </>
                )}
              </div>
            )}
          />
          <Scatter
            name="LECAPS"
            data={data.filter(item => item.tem > 0)}
            fill="#00ff88"
            shape={({ cx, cy, payload }) => (
              <g>
                <circle cx={cx} cy={cy} r={4} fill="#00ff88" stroke="#000" />
                <ResponsiveText
                  x={cx}
                  y={cy + 15}
                  textAnchor="middle"
                  fill="#fff"
                >
                  {payload.ticker}
                </ResponsiveText>
              </g>
            )}
          />
          <Line
            data={trend}
            dataKey="tem"
            stroke="#ff7300"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
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
    </div>
  </>
);

const lecapsBreakEvenChart = (data, dolar) => (
  <>
    <h2 style={{ textAlign: 'center', margin: '10px 0', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>
      Dólar Breakeven (Oficial hoy {dolar?.venta} $)
    </h2>
    <div style={{ position: 'relative', width: '100%', height: 'clamp(300px, 60vh, 400px)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="dias"
            name="Días"
            tick={{ fill: '#fff', fontSize: 'clamp(8px, 2.5vw, 12px)' }}
            label={{
              value: 'Días al Vencimiento',
              position: 'bottom',
              offset: 30,
              fill: '#fff',
              style: { fontSize: 'clamp(10px, 3vw, 14px)' }
            }}
          />
          <YAxis
            dataKey="breakeven"
            name="USD"
            tick={{ fill: '#fff', fontSize: 'clamp(8px, 2.5vw, 12px)' }}
            label={{
              value: '$ (ARSp/USD)',
              angle: -90,
              position: 'left',
              fill: '#fff',
              style: { fontSize: 'clamp(10px, 3vw, 14px)' }
            }}
          />
          <Tooltip
            content={({ payload }) => (
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '8px',
                border: '1px solid #333',
                borderRadius: '4px',
                fontSize: 'clamp(12px, 3vw, 14px)'
              }}>
                {payload?.[0]?.payload && (
                  <>
                    <p><strong>{payload[0].payload.ticker}</strong></p>
                    <p>Días: {payload[0].payload.dias}</p>
                    <p>Breakeven: {payload[0].payload.breakeven.toFixed(2)}</p>
                    {payload[0].payload.sup && (
                      <p>Sup: {payload[0].payload.sup.toFixed(2)}</p>
                    )}
                  </>
                )}
              </div>
            )}
          />
          <Scatter
            data={data}
            fill="#00ff88"
            shape={({ cx, cy, payload }) => (
              <g>
                <circle cx={cx} cy={cy} r={4} fill="#00ff88" stroke="#000" />
                <ResponsiveText
                  x={cx}
                  y={cy + 15}
                  textAnchor="middle"
                  fill="#fff"
                >
                  {payload.ticker}
                </ResponsiveText>
              </g>
            )}
          />
          <Line
            type="monotone"
            dataKey="sup"
            stroke="#ff7300"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        padding: '20px',
        borderRadius: '5px',
        border: '1px solid rgba(171, 168, 168, 0.3)',
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
          borderColor:'white',
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
            backgroundColor: "black", 
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
            backgroundColor: "black", 
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          {lecapsBreakEvenChart(data, dolar)}
        </div>
      </div>
    </div>
  );
}


function ReportHardDollar({ data, dolar, title }) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerColor, setHeaderColor] = useState('#ffffff');

  const toggleReport = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      style={{
        marginBottom: '40px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        padding: '20px',
        borderRadius: '5px',
        border: '1px solid rgba(171, 168, 168, 0.3)',
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
          borderColor:'white',
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
          <h3>Bonares (Ley AR)</h3>
          <BonosHDTable data={data["bonares"]||[]} cfs={data["bonares_cf"]||[]}/>
        </div>
          <div style={{ marginBottom: '40px' }}>
          <h3>Globales (Ley NY)</h3>
          <BonosHDTable data={data["globales"]||[]} cfs={data["globales_cf"]||[]}/>
        </div>

      </div>
    </div>
  );
}

function cleanReport(report){
  report.map(item => {item["price day %"]= (item["price day %"]*100).toFixed(2)})
  report.map(item => {item["price ytd %"]= (item["price ytd %"]*100).toFixed(2)})
  report.map(item => {item["YTM"]= (item["YTM"]).toFixed(3)})
  report.map(item => {item["MD"]= (item["MD"]).toFixed(3)})
  report.map(item => {item["Parity"]= (item["Parity"]).toFixed(2)})
}

function Reports() {
  const [reportData, setReportData] = useState([]);
  const [trendDataS, setTrendDataS] = useState([]);
  const [reportDate, setReportDate] = useState("");
  const [bonosHD, setBonosHD] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dolar, setDolar] = useState({});

  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setDolar(data);
      } catch (error) {
        setError(error.message); // Update error state
        console.error('Error al obtener el dólar:', error);
      }
    };
  
    fetchDolar();
  }, []); 

  useEffect(() => {
    fetch(`${BACK_URL}/report`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setReportDate(data["date"]);
       
        let bonaresReport = data["bonares"]["report"];
        let globalesReport = data["globales"]["report"];
        cleanReport(bonaresReport);
        cleanReport(globalesReport);





        
        setBonosHD({
          bonares : bonaresReport,
          bonares_cf : data["bonares"]["cf"],
          globales : globalesReport,
          globales_cf : data["globales"]["cf"],

        });

        data = data["lecaps"];
        data.sort((a, b) => a["dias"] - b["dias"]);
        data.map(item => {item["breakeven"]= item["total"]*dolar["venta"]/item["precio"]})
        data.map(item => {item["sup"]= (1400 * (1 + 0.01)**(item["dias"] / 30))})
        data.map(item => {item["tem"]= item["tem"]*100})
        data.map(item => {item["price day %"]= (item["price day %"]*100).toFixed(2)})
        data.map(item => {item["price ytd %"]= (item["price ytd %"]*100).toFixed(2)})

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
  }, [dolar.venta]);

  console.log(reportData);
  return (
    <div style={{ padding: '20px' }}>
      <Header option={'Reports'} />
      {loading && <p style={{ color: '#fff' }}>Cargando...</p>}
      <div className="reports-container">
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '5px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: "white",
          transition: 'color 0.3s ease',
        }}
      >
        Reporte de 🇦🇷 ({reportDate}) </h1>
        <Report data={reportData||[]} dolar={dolar} trend={trendDataS}  title={"Letras Tasa Fija Pesos: LECAPs y BONCAPs"} />
        <ReportHardDollar data={bonosHD||{}} dolar={dolar}  title={"Bonos Hard Dollar: Bonares y Globales"} />

      </div>
    </div>
  );
}

export default Reports;































