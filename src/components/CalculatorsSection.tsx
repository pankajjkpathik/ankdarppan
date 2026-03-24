import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Hash, Compass, Calendar } from "lucide-react";

// Chaldean number mapping
const chaldeanMap: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:5,Y:1,Z:7,
};

const reduceToSingle = (n: number): number => {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
};

const BirthDestinyCalc = () => {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{ birth: number; destiny: number } | null>(null);

  const calculate = () => {
    if (!dob) return;
    const [y, m, d] = dob.split("-").map(Number);
    const birth = reduceToSingle(d);
    const destiny = reduceToSingle(d + m + y);
    setResult({ birth, destiny });
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="w-8 h-8 text-primary" />
        <h3 className="text-lg font-heading font-semibold">Birth & Destiny Calculator</h3>
      </div>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground mb-4"
      />
      <button onClick={calculate} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all">
        Calculate
      </button>
      {result && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground">Birth Number</p>
            <p className="text-3xl font-heading font-bold text-primary">{result.birth}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground">Destiny Number</p>
            <p className="text-3xl font-heading font-bold text-primary">{result.destiny}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const NameNumberCalc = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (!name.trim()) return;
    const sum = name.toUpperCase().split("").reduce((acc, ch) => acc + (chaldeanMap[ch] || 0), 0);
    setResult(reduceToSingle(sum));
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Hash className="w-8 h-8 text-primary" />
        <h3 className="text-lg font-heading font-semibold">Name Number Calculator</h3>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your full name"
        className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground mb-4"
      />
      <button onClick={calculate} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all">
        Calculate
      </button>
      {result !== null && (
        <div className="mt-4 text-center p-3 rounded-lg bg-secondary">
          <p className="text-xs text-muted-foreground">Your Name Number</p>
          <p className="text-3xl font-heading font-bold text-primary">{result}</p>
        </div>
      )}
    </div>
  );
};

const KuaNumberCalc = () => {
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("male");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (!year || year.length !== 4) return;
    const digits = year.split("").reduce((a, b) => a + parseInt(b), 0);
    let reduced = reduceToSingle(digits);
    let kua: number;
    if (gender === "male") {
      kua = 11 - reduced;
      if (kua > 9) kua = reduceToSingle(kua);
    } else {
      kua = reduced + 4;
      if (kua > 9) kua = reduceToSingle(kua);
    }
    if (kua === 5) kua = gender === "male" ? 2 : 8;
    setResult(kua);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Compass className="w-8 h-8 text-primary" />
        <h3 className="text-lg font-heading font-semibold">Kua Number Calculator</h3>
      </div>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year of Birth (YYYY)"
        className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground mb-3"
      />
      <div className="flex gap-3 mb-4">
        {["male", "female"].map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${gender === g ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground border border-border"}`}
          >
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>
      <button onClick={calculate} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all">
        Calculate
      </button>
      {result !== null && (
        <div className="mt-4 text-center p-3 rounded-lg bg-secondary">
          <p className="text-xs text-muted-foreground">Your Kua Number</p>
          <p className="text-3xl font-heading font-bold text-primary">{result}</p>
        </div>
      )}
    </div>
  );
};

const PersonalYearCalc = () => {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{ year: number; month: number } | null>(null);

  const calculate = () => {
    if (!dob) return;
    const [, m, d] = dob.split("-").map(Number);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const personalYear = reduceToSingle(d + m + currentYear);
    const personalMonth = reduceToSingle(personalYear + currentMonth);
    setResult({ year: personalYear, month: personalMonth });
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-8 h-8 text-primary" />
        <h3 className="text-lg font-heading font-semibold">Personal Year & Month</h3>
      </div>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground mb-4"
      />
      <button onClick={calculate} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all">
        Calculate
      </button>
      {result && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground">Personal Year</p>
            <p className="text-3xl font-heading font-bold text-primary">{result.year}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground">Personal Month</p>
            <p className="text-3xl font-heading font-bold text-primary">{result.month}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CalculatorsSection = () => (
  <section id="calculators" className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Know Your <span className="gold-text">Numbers</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Use our free numerology calculators to discover your core numbers and unlock cosmic insights.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <BirthDestinyCalc />
        <NameNumberCalc />
        <KuaNumberCalc />
        <PersonalYearCalc />
      </div>
    </div>
  </section>
);

export default CalculatorsSection;
