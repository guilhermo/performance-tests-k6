import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { CONFIG } from '../utils/config.js';
import { SCENARIOS } from '../support/scenarios.js';

const testType = __ENV.TEST_TYPE || 'load';
export const options = SCENARIOS[testType];

const pizzaData = new SharedArray('pizzas preferences', () => {
  return JSON.parse(open('../support/pizzas.json')).configs;
});

export default function () {
  group(`Fluxo: ${testType.toUpperCase()} - Recomendação de Pizza`, function () {
    const config = pizzaData[Math.floor(Math.random() * pizzaData.length)];
    
    const payload = JSON.stringify({
      maxCaloriesPerSlice: config.maxCalories,
      mustBeVegetarian: config.isVegetarian,
      excludedIngredients: [],
      excludedTools: [],
      customName: `Demarco - ${testType}`,
      maxNumberOfToppings: config.toppings,
      minNumberOfToppings: 2
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CONFIG.TOKEN,
      },
    };

    const res = http.post(`${CONFIG.BASE_URL}/pizza`, payload, params);

    check(res, {
      'status is 200': (r) => r.status === 200,
      'pizza validada': (r) => {
        try {
          return r.json().pizza.name.length > 0;
        } catch (e) {
          return false;
        }
      },
    });

    sleep(1);
  });
}

export function handleSummary(data) {
  const reportPath = `reports/${testType}_report.html`;
  return {
    [reportPath]: htmlReport(data),
  };
}