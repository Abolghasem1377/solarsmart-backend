import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Calculator() {
  // 🔢 مراحل
  const [step, setStep] = useState(0);

  // 📍 متغیرها
  const [location, setLocation] = useState("");
  const [efficiency, setEfficiency] = useState(null);
  const [brand, setBrand] = useState("");
  const [panel, setPanel] = useState(null);
  const [inverterBrand, setInverterBrand] = useState("");
  const [inverter, setInverter] = useState(null);
  const [targetPower, setTargetPower] = useState("");
  const [result, setResult] = useState(null);
  const [roiResult, setRoiResult] = useState(null);

  // 🌤 داده راندمان سالانه (تقریبی بر اساس شهر)
  const solarData = {
    Bucharest: 1400,
    Tehran: 1800,
    Dubai: 2100,
    Berlin: 1200,
    Rome: 1600,
    Madrid: 1900,
  };

  // ⚡ داده اقتصادی (قیمت برق و رشد سالانه)
  const electricityData = {
    Bucharest: { price: 0.18, increase: 4 },
    Tehran: { price: 0.03, increase: 6 },
    Dubai: { price: 0.1, increase: 3 },
    Berlin: { price: 0.3, increase: 2 },
    Rome: { price: 0.28, increase: 3 },
    Madrid: { price: 0.25, increase: 2.5 },
  };

  // 🌞 دیتابیس پنل‌ها
  const solarPanels = {
    "Jinko Solar": [
      { model: "Tiger Neo 575W", power: 575, price: 185 },
      { model: "JKM550M-72HL4-V", power: 550, price: 160 },
    ],
    "Longi Solar": [
      { model: "LR5-54HIH-440M", power: 440, price: 145 },
      { model: "LR5-72HBD-555M", power: 555, price: 170 },
    ],
    "Trina Solar": [
      { model: "Vertex 550W", power: 550, price: 165 },
      { model: "Vertex S+ 450W", power: 450, price: 150 },
    ],
    "Canadian Solar": [
      { model: "HiKu6 500W", power: 500, price: 150 },
      { model: "BiHiKu7 590W", power: 590, price: 190 },
    ],
  };

  // ⚙️ دیتابیس اینورترها
  const inverters = {
    Growatt: [
      { model: "MIN 5000TL-X", capacity: 5000, price: 800 },
      { model: "MOD 8000TL3-X", capacity: 8000, price: 1100 },
    ],
    Huawei: [
      { model: "SUN2000-5KTL-M1", capacity: 5000, price: 1000 },
      { model: "SUN2000-10KTL-M1", capacity: 10000, price: 1600 },
    ],
    SMA: [
      { model: "Sunny Boy 6.0", capacity: 6000, price: 1100 },
      { model: "Tripower 10.0", capacity: 10000, price: 1600 },
    ],
  };

  // ➕ رفتن به مرحله بعد / قبل
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // ⚙️ محاسبه سیستم
  const calculateSystem = () => {
    if (!panel || !inverter || !targetPower) return;
    const targetKW = parseFloat(targetPower);
    const panelKW = panel.power / 1000;
    const inverterKW = inverter.capacity / 1000;

    const numPanels = Math.ceil(targetKW / panelKW);
    const numInverters = Math.max(1, Math.ceil(targetKW / inverterKW));
    const totalCost = numPanels * panel.price + numInverters * inverter.price;

    setResult({ targetKW, numPanels, numInverters, totalCost });
    nextStep();
  };

  // 💰 محاسبه ROI خودکار
  useEffect(() => {
    if (step === 7 && result && location) {
      const data = electricityData[location] || { price: 0.15, increase: 3 };
      const { price, increase } = data;
      const annualEnergy = result.targetKW * (efficiency || 1500);
      let annualSaving = annualEnergy * price;
      const totalCost = result.totalCost;
      let cumulative = 0;
      let year = 0;
      const chart = [];

      while (cumulative < totalCost && year < 30) {
        cumulative += annualSaving;
        chart.push({ year, cumulative, cost: totalCost });
        annualSaving *= 1 + increase / 100;
        year++;
      }

      const payback = (totalCost / (annualEnergy * price)).toFixed(1);
      setRoiResult({ payback, chart, price, increase });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, result, location, efficiency]);

  // خلاصه انتخاب‌ها
  const Summary = () => (
    <div className="mb-6 text-sm text-gray-700 bg-white/80 rounded-xl p-4 shadow-inner border border-green-100 text-left">
      {location && (
        <p>
          📍 <b>Location:</b> {location} ({efficiency} kWh/kW/year)
        </p>
      )}
      {brand && (
        <p>
          🌞 <b>Panel Brand:</b> {brand}
        </p>
      )}
      {panel && (
        <p>
          🔋 <b>Panel Model:</b> {panel.model} ({panel.power} W)
        </p>
      )}
      {inverterBrand && (
        <p>
          ⚙️ <b>Inverter Brand:</b> {inverterBrand}
        </p>
      )}
      {inverter && (
        <p>
          🔌 <b>Inverter:</b> {inverter.model} ({inverter.capacity / 1000} kW)
        </p>
      )}
    </div>
  );

  return (
    <div
  className="min-h-screen flex flex-col items-center justify-center font-[Poppins] px-4 py-8 bg-fixed bg-cover bg-center"
  style={{
    backgroundImage: "url('/solar-bg.jpg')",
    backgroundBlendMode: "lighten",
  }}
>


      <motion.div
        className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/40 w-full max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div
              key={num}
              className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                step >= num ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* مرحله ۰ */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                Step 0️⃣ — Choose Your Location
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.keys(solarData).map((city) => (
                  <motion.div
                    key={city}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setLocation(city);
                      setEfficiency(solarData[city]);
                      nextStep();
                    }}
                    className={`cursor-pointer p-5 rounded-2xl border text-center font-semibold ${
                      location === city
                        ? "bg-green-600 text-white"
                        : "bg-white hover:bg-green-100"
                    }`}
                  >
                    {city}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* مرحله ۱: برند پنل */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                Step 1️⃣ — Select Solar Panel Brand
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.keys(solarPanels).map((b) => (
                  <motion.div
                    key={b}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setBrand(b);
                      nextStep();
                    }}
                    className={`cursor-pointer p-5 rounded-2xl border text-center font-semibold ${
                      brand === b
                        ? "bg-green-600 text-white"
                        : "bg-white hover:bg-green-100"
                    }`}
                  >
                    {b}
                  </motion.div>
                ))}
              </div>
              <button
                onClick={prevStep}
                className="mt-5 text-gray-600 underline text-sm block mx-auto"
              >
                Back
              </button>
            </motion.div>
          )}

          {/* مرحله ۲: مدل پنل */}
          {step === 2 && brand && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Summary />
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                Step 2️⃣ — Choose Panel Model
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {solarPanels[brand].map((p) => (
                  <motion.div
                    key={p.model}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setPanel(p);
                      nextStep();
                    }}
                    className={`cursor-pointer p-5 rounded-2xl border text-center ${
                      panel?.model === p.model
                        ? "bg-green-600 text-white"
                        : "bg-white hover:bg-green-100"
                    }`}
                  >
                    <p className="font-bold">{p.model}</p>
                    <p>{p.power} W</p>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={prevStep}
                className="mt-5 text-gray-600 underline text-sm block mx-auto"
              >
                Back
              </button>
            </motion.div>
          )}

          {/* مرحله ۳: برند اینورتر */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Summary />
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                Step 3️⃣ — Select Inverter Brand
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.keys(inverters).map((b) => (
                  <motion.div
                    key={b}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setInverterBrand(b);
                      nextStep();
                    }}
                    className={`cursor-pointer p-5 rounded-2xl border text-center ${
                      inverterBrand === b
                        ? "bg-green-600 text-white"
                        : "bg-white hover:bg-green-100"
                    }`}
                  >
                    {b}
                  </motion.div>
                ))}
              </div>
              <button
                onClick={prevStep}
                className="mt-5 text-gray-600 underline text-sm block mx-auto"
              >
                Back
              </button>
            </motion.div>
          )}

          {/* مرحله ۴: مدل اینورتر */}
          {step === 4 && inverterBrand && (
            <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Summary />
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                Step 4️⃣ — Choose Inverter Model
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inverters[inverterBrand].map((inv) => (
                  <motion.div
                    key={inv.model}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setInverter(inv);
                      nextStep();
                    }}
                    className={`cursor-pointer p-5 rounded-2xl border text-center ${
                      inverter?.model === inv.model
                        ? "bg-green-600 text-white"
                        : "bg-white hover:bg-green-100"
                    }`}
                  >
                    <p className="font-bold">{inv.model}</p>
                    <p>{inv.capacity / 1000} kW</p>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={prevStep}
                className="mt-5 text-gray-600 underline text-sm block mx-auto"
              >
                Back
              </button>
            </motion.div>
          )}

          {/* مرحله ۵: توان هدف */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Summary />
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                Step 5️⃣ — Enter Target Output Power
              </h2>
              <input
                type="number"
                placeholder="Enter desired output (kW)"
                value={targetPower}
                onChange={(e) => setTargetPower(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full mb-6 text-center focus:ring-2 focus:ring-green-400 bg-white"
              />
              <motion.button
                onClick={calculateSystem}
                whileHover={{ scale: 1.05 }}
                className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg"
              >
                Calculate System
              </motion.button>
              <button
                onClick={prevStep}
                className="mt-5 text-gray-600 underline text-sm block mx-auto"
              >
                Back
              </button>
            </motion.div>
          )}

          {/* مرحله ۶: خلاصه سیستم */}
          {step === 6 && result && (
            <motion.div key="step6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Summary />
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                ✅ Your Solar System Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="bg-white rounded-2xl p-5 shadow-md border border-green-100">
                  <h3 className="font-bold text-green-700 mb-2">⚡ System Specs</h3>
                  <p>🌞 Target Output: <b>{result.targetKW} kW</b></p>
                  <p>🔋 Panels Needed: <b>{result.numPanels}</b></p>
                  <p>⚙️ Inverters Needed: <b>{result.numInverters}</b></p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-md border border-green-100">
                  <h3 className="font-bold text-green-700 mb-2">💰 Cost Estimation</h3>
                  <p>Panel Cost: €{(panel.price * result.numPanels).toLocaleString()}</p>
                  <p>Inverter Cost: €{(inverter.price * result.numInverters).toLocaleString()}</p>
                  <p className="text-lg font-bold text-green-700 mt-2">
                    Total: €{result.totalCost.toLocaleString()}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={nextStep}
                whileHover={{ scale: 1.05 }}
                className="mt-8 bg-emerald-600 text-white px-8 py-3 rounded-full shadow-lg block mx-auto"
              >
                🤖 Calculate ROI (AI)
              </motion.button>
            </motion.div>
          )}

                  {/* مرحله ۷: ROI هوشمند */}
          {step === 7 && result && (
            <motion.div key="step7" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                💰 Smart ROI Calculator (AI)
              </h2>

              {!roiResult ? (
                <p className="text-center text-gray-600 animate-pulse">
                  Calculating automatically based on your location...
                </p>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    ⚡ Electricity Price: €{roiResult.price.toFixed(2)} /kWh
                  </h3>
                  <h3 className="text-md text-gray-600 mb-4">
                    Yearly price increase: {roiResult.increase}%
                  </h3>

                  <p className="text-lg text-gray-700 mb-2">
                    Your system will generate approximately{" "}
                    <b>{(result.targetKW * (efficiency || 1500)).toLocaleString()}</b> kWh/year
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Estimated payback time: <b>{roiResult.payback} years</b>
                  </p>

                  <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-green-100">
                    <h3 className="font-bold text-green-700 mb-4 text-center">
                      📈 Annual ROI Growth
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={roiResult.chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="cumulative" stroke="#16a34a" />
                        <Line type="monotone" dataKey="cost" stroke="#dc2626" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <button
                onClick={() => window.location.reload()}
                className="mt-8 bg-green-600 text-white px-8 py-3 rounded-full shadow-lg"
              >
                🔁 Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
