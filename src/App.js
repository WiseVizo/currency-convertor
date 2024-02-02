// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
import { useEffect, useState } from "react";
import "./style.css";

export default function App() {
  const [amount, setAmount] = useState("");
  const [output, setOutput] = useState(null);
  const [base, setBase] = useState("EUR");
  const [convertTo, setConvertTo] = useState("USD");
  function handleInput(e) {
    setAmount(() => e.target.value);
  }
  useEffect(() => {
    const controller = new AbortController();
    if (!amount) return;
    if (base === convertTo) {
      setOutput(() => amount);
      return;
    }
    async function getData() {
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${base}&to=${convertTo}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        console.log(data);
        setOutput(() => {
          if (!data.rates) return;
          const op = data.rates;
          return op[convertTo];
        });
      } catch (err) {
        if (err.name === "AbortError") {
          console.log(err.name);
        }
      }
    }

    getData();
    return function () {
      controller.abort();
    };
  }, [amount, base, convertTo]);

  function handleBaseChange(e) {
    setBase(() => e.target.value);
  }
  function handleConvertToChange(e) {
    setConvertTo(() => e.target.value);
  }
  return (
    <div className="App">
      <input
        type="text"
        value={amount}
        onChange={(e) => {
          handleInput(e);
        }}
      />
      <select value={base} onChange={handleBaseChange}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={convertTo} onChange={handleConvertToChange}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{output}</p>
    </div>
  );
}
