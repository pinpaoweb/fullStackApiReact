import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Base de datos de percentiles OMS para pediatría
const percentilesOMS = {
  "masculino": {
    "5": { "p5": 13.5, "p50": 15.1, "p85": 16.3, "p95": 17.4 },
    "6": { "p5": 13.3, "p50": 15.1, "p85": 16.5, "p95": 17.8 },
    "7": { "p5": 13.3, "p50": 15.2, "p85": 16.9, "p95": 18.4 },
    "8": { "p5": 13.3, "p50": 15.4, "p85": 17.3, "p95": 19.1 },
    "9": { "p5": 13.5, "p50": 15.7, "p85": 17.8, "p95": 19.8 },
    "10": { "p5": 13.7, "p50": 16.1, "p85": 18.4, "p95": 20.6 }
  },
  "femenino": {
    "5": { "p5": 13.4, "p50": 15.0, "p85": 16.2, "p95": 17.3 },
    "6": { "p5": 13.2, "p50": 15.0, "p85": 16.4, "p95": 17.7 },
    "7": { "p5": 13.2, "p50": 15.0, "p85": 16.7, "p95": 18.2 },
    "8": { "p5": 13.2, "p50": 15.2, "p85": 17.1, "p95": 18.9 },
    "9": { "p5": 13.4, "p50": 15.5, "p85": 17.6, "p95": 19.6 },
    "10": { "p5": 13.6, "p50": 15.9, "p85": 18.2, "p95": 20.4 }
  }
};

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : window.location.hostname === '192.168.1.40'
    ? 'http://192.168.1.40:5000'
    : 'https://react1api.vercel.app';
    
function CalculadoraIMC() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("masculino");
  const [cintura, setCintura] = useState(""); 
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState("");
  const [riesgoCintura, setRiesgoCintura] = useState(""); 
  const [recomendacion, setRecomendacion] = useState(""); 
  const [historial, setHistorial] = useState([]);
  const navigate = useNavigate();

  const clasificarIMCInfantil = (imc, edad, sexo) => {
    if (!percentilesOMS[sexo] || !percentilesOMS[sexo][edad]) {
      return "Evaluación en proceso de análisis";
    }
    const ref = percentilesOMS[sexo][edad];
    if (imc < ref.p5) return "Peso por debajo de lo esperado para su edad";
    if (imc < ref.p85) return "Peso saludable para su edad";
    if (imc < ref.p95) return "Peso por encima del promedio, sugerimos revisión médica";
    return "Peso en rango de obesidad, requiere consulta con pediatra";
  };

  const evaluarCintura = (valorCintura, genero) => {
    const c = parseFloat(valorCintura);
    if (!c || isNaN(c)) return "";

    if (genero === "masculino") {
      if (c < 94) return "Bajo riesgo cardiovascular";
      if (c <= 102) return "Riesgo cardiovascular aumentado";
      return "Riesgo cardiovascular alto";
    } else {
      if (c < 80) return "Bajo riesgo cardiovascular";
      if (c <= 88) return "Riesgo cardiovascular aumentado";
      return "Riesgo cardiovascular alto";
    }
  };

  const obtenerHistorial = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE}/api/imc/mis-calculos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistorial(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    obtenerHistorial();
  }, []);

  const calcularIMC = async () => {
    if (!peso || !altura || !edad) {
        alert("Por favor, completa los campos obligatorios (peso, altura, edad).");
        return;
    }

    const p = parseFloat(String(peso).replace(',', '.'));
    const a = parseFloat(String(altura).replace(',', '.'));
    const edadNum = parseInt(edad);
    const alturaEnMetros = a > 3 ? a / 100 : a;

    if (edadNum < 2 || edadNum > 120) {
        alert("Por favor, ingresa una edad válida entre 2 y 120 años.");
        return;
    }

    const pesoMinimoPermitido = edadNum < 18 ? 5 : 30; 
    const alturaMinimaPermitida = edadNum < 18 ? 0.5 : 1.0; 

    if (p < pesoMinimoPermitido || p > 300 || alturaEnMetros < alturaMinimaPermitida || alturaEnMetros > 2.5) {
      alert("Por favor, ingresa datos de peso y altura realistas para la edad indicada.");
      return;
    }

    const imcCalculado = parseFloat((p / (alturaEnMetros * alturaEnMetros)).toFixed(2));
    const pesoMinimo = (18.5 * (alturaEnMetros * alturaEnMetros)).toFixed(1);
    const pesoMaximo = (24.9 * (alturaEnMetros * alturaEnMetros)).toFixed(1);
    const rangoPeso = ` Tu peso saludable estimado debería estar entre ${pesoMinimo} kg y ${pesoMaximo} kg.`;
    
    setResultado(imcCalculado);

    let estadoCalculado = "";
    let rec = "";

    // 1. Lógica menores de 18 años
    if (edadNum < 18) {
        if (edadNum >= 5 && edadNum <= 10) {
            estadoCalculado = clasificarIMCInfantil(imcCalculado, edadNum, sexo);
            rec = `Basado en tablas OMS para ${edadNum} años (${sexo}): ${estadoCalculado}.`;
        } else {
            estadoCalculado = "Evaluación pediátrica requerida";
            rec = "El cálculo requiere una curva de crecimiento específica para tu edad exacta.";
        }
    } 
    // 2. Lógica adultos mayores (65+ años) - ESCALA AJUSTADA
    else if (edadNum >= 65) {
        if (imcCalculado < 23) {
            estadoCalculado = "Bajo peso (ajustado por edad)";
            rec = "Atención: En el adulto mayor, un IMC menor a 23 puede indicar riesgo de desnutrición o pérdida de masa muscular. Se recomienda valoración nutricional." + rangoPeso;
        } else if (imcCalculado <= 28) {
            estadoCalculado = "Peso saludable (ajustado por edad)";
            rec = "¡Excelente! Para tu grupo etario, este rango (23 - 28) es considerado un factor protector y saludable." + rangoPeso;
        } else {
            estadoCalculado = "Sobrepeso (ajustado por edad)";
            rec = "Se sugiere supervisión médica para evaluar el control de peso y el bienestar cardiovascular en esta etapa." + rangoPeso;
        }
    } 
    // 3. Lógica adultos (18-64 años)
    else {
        if (imcCalculado < 18.5) {
            estadoCalculado = "Bajo peso";
            rec = "Consulta con un nutricionista para un plan saludable." + rangoPeso;
        } else if (imcCalculado <= 24.9) {
            estadoCalculado = "Normal";
            rec = "¡Excelente! Mantén tu dieta equilibrada." + rangoPeso;
        } else if (imcCalculado <= 29.9) {
            estadoCalculado = "Sobrepeso";
            rec = "Aumenta el consumo de vegetales y realiza actividad física." + rangoPeso;
        } else {
            estadoCalculado = "Obesidad (Grado I-III)";
            rec = "Es recomendable buscar asesoría profesional para un plan de salud integral." + rangoPeso;
        }
    }

    // Evaluar la cintura si el usuario es adulto y rellenó el campo
    let evaluacionCinturaTexto = "";
    if (edadNum >= 18 && cintura) {
      evaluacionCinturaTexto = evaluarCintura(cintura, sexo);
      setRiesgoCintura(evaluacionCinturaTexto);
      rec += ` Perímetro de cintura (${cintura} cm): ${evaluacionCinturaTexto}.`;
    } else {
      setRiesgoCintura("");
    }

    setEstado(estadoCalculado);
    setRecomendacion(rec);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/imc`, { 
        peso: p, altura: a, edad: edadNum, imc: imcCalculado, estado: estadoCalculado, cintura: cintura ? parseFloat(cintura) : null, riesgoCintura: evaluacionCinturaTexto 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerHistorial();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <div className="imc-container">
      <h2>Calculadora de IMC y Riesgo Abdominal</h2>
      <div className="imc-form">
        <input type="number" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} />
        <input type="number" placeholder="Altura (ej: 1.65 o 165)" value={altura} onChange={(e) => setAltura(e.target.value)} />
        <input type="number" placeholder="Edad (años)" value={edad} onChange={(e) => setEdad(e.target.value)} />
        <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
        </select>
        <input type="number" placeholder="Cintura en cm (opcional, adultos)" value={cintura} onChange={(e) => setCintura(e.target.value)} />
        
        <button className="btn-primary" onClick={calcularIMC}>Calcular</button>
      </div>

      {resultado && (
        <div className="imc-result">
          <h3>Tu IMC es: {resultado}</h3>
          <p>Estado: <strong>{estado}</strong></p>
          {riesgoCintura && <p>Riesgo Abdominal: <strong>{riesgoCintura}</strong></p>}
          <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
            <strong>Recomendación:</strong> {recomendacion}
          </div>
        </div>
      )}

      <button className="btn-secondary" onClick={() => navigate("/")}>⬅ Volver al Inicio</button>

      <div className="imc-reporte">
        <h3>Tu Historial de IMC</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>IMC</th>
              <th>Estado</th>
              <th>Cintura</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.imc}</td>
                <td>{item.estado}</td>
                <td>{item.cintura ? `${item.cintura} cm` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CalculadoraIMC;