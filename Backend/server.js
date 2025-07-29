import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

const History = [];
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

function sum({ num1, num2 }) {
  return num1 + num2;
}

function prime({ num }) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}


async function getCryptoPrice({ coin }) {
  const coinId = coin.toLowerCase();

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch crypto price");
    }

    const data = await response.json();

    if (!data[coinId] || !data[coinId].usd) {
      return `❌ Could not find price for "${coin}"`;
    }

    const price = parseFloat(data[coinId].usd).toFixed(2);
    return `💰 Current price of ${coin} is $${price} USD`;

  } catch (err) {
    return `⚠️ Error fetching price for "${coin}": ${err.message}`;
  }
}


const sumDeclaration = {
  name: 'sum',
  description: "Get the sum of two numbers",
  parameters: {
    type: 'OBJECT',
    properties: {
      num1: { type: 'NUMBER', description: 'First number' },
      num2: { type: 'NUMBER', description: 'Second number' }
    },
    required: ['num1', 'num2']
  }
};

const primeDeclaration = {
  name: 'prime',
  description: "Check if a number is prime",
  parameters: {
    type: 'OBJECT',
    properties: {
      num: { type: 'NUMBER', description: 'Number to check' }
    },
    required: ['num']
  }
};

const cryptoDeclaration = {
  name: 'getCryptoPrice',
  description: "Get the current price of a cryptocurrency",
  parameters: {
    type: 'OBJECT',
    properties: {
      coin: { type: 'STRING', description: 'Name of the coin like bitcoin' }
    },
    required: ['coin']
  }
};

const availableTools = {
  sum,
  prime,
  getCryptoPrice
};

app.post('/ask', async (req, res) => {
  const userProblem = req.body.message;

  History.push({ role: 'user', parts: [{ text: userProblem }] });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: History,
      config: {
        systemInstruction: `You are an AI Agent, You have access of 3 available tools like to to find sum of 2 number, get crypto price of any currency and find a number is prime or not Use these tools whenever required to confirm user query.If user ask general question you can answer it directly if you don't need help of these three tools. Give the answer in the detailed way.`,
        tools: [{ functionDeclarations: [sumDeclaration, primeDeclaration, cryptoDeclaration] }]
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const { name, args } = response.functionCalls[0];
      const toolFunc = availableTools[name];
      const result = await toolFunc(args);

      const functionResponsePart = {
        name,
        response: { result }
      };

      History.push({
        role: "model",
        parts: [{ functionCall: response.functionCalls[0] }]
      });

      History.push({
        role: "user",
        parts: [{ functionResponse: functionResponsePart }]
      });

    } else {
      History.push({
        role: 'model',
        parts: [{ text: response.text }]
      });

      return res.json({ reply: response.text });
    }
  }
});

app.listen(3001, () => {
  console.log("AI Agent server running at http://localhost:3001");
});