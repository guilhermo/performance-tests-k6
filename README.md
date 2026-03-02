# 🏎️ K6 Performance - Quick Pizza API

Este projeto implementa uma infraestrutura de testes de performance para a API Quick Pizza (Grafana). O framework utiliza uma arquitetura modular que permite alternar entre diferentes estratégias de carga (Smoke, Load, Spike) de forma dinâmica.

---

## 🏗️ Arquitetura Modular

Diferente de scripts isolados, este projeto abstrai a lógica de carga da lógica de negócio para garantir manutenção e flexibilidade:

* `src/support/scenarios.js:` Centraliza as configurações de VUs, estágios e SLAs (Thresholds) para cada tipo de teste.

* `src/utils/config.js:` Gerencia constantes globais, como URLs de base e Tokens de autenticação.

* `src/support/pizzas.json:` Dataset utilizado via SharedArray para testes orientados a dados (Data-Driven).

* `reports/:` Repositório de evidências com relatórios HTML gerados dinamicamente por tipo de execução.

```text
.
├── src/
│   ├── tests/            # Scripts de execução dos testes
│   │   └── main-test.js  # Script dinâmico (Smoke, Load, Spike)
│   ├── support/          # Massa de dados e definições de carga
│   │   ├── pizzas.json   # Datasets para testes Data-Driven
│   │   └── scenarios.js  # Configurações de VUs e Thresholds
│   └── utils/            # Utilitários e configurações globais
│       └── config.js     # URLs Base e Tokens de Autorização
├── reports/              # Evidências (Relatórios HTML gerados)
└── README.md             # Documentação
```

---

# 🛠️ Configuração e Execução Dinâmica

## Instalação do k6
**Para instalar na WSL2 / Linux:**
```sh
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```
## Clonando o repositório:
```sh
git clone https://github.com/seu-usuario/performance-tests-k6.git
cd performance-tests-k6
```

   
O projeto permite executar diferentes cenários apenas alterando a variável de ambiente TEST_TYPE, facilitando a integração com pipelines de CI/CD:
```sh
# Executar teste de carga (Load) - Cenário do Desafio
k6 run -e TEST_TYPE=load src/tests/main-test.js

# Executar validação rápida (Smoke)
k6 run -e TEST_TYPE=smoke src/tests/main-test.js

# Executar teste de pico repentino (Spike)
k6 run -e TEST_TYPE=spike src/tests/main-test.js
```
---
# 📊 Análise de Resultados (Load Test)

O teste de carga principal (load) atingiu os seguintes resultados:
### 📑 Resultados Consolidados do Load Test (500 VUs)

| Métrica | Meta (SLA) | Resultado Obtido | Status |
| :--- | :--- | :--- | :---: |
| **Tempo de Resposta P(95)** | < 2000ms | **243.27 ms** | ✅ |
| **Taxa de Erro** | < 1% | **0.00%** | ✅ |
| **Requisições Totais** | N/A | **89.420** | ✅ |
| **Vazão (Throughput)** | N/A | **222.38/s** | ✅ |
| **Dados Recebidos (Total)** | N/A | **94.55 MB** | ✅ |
| **Dados Enviados (Total)** | N/A | **22.51 MB** | ✅ |

---

Relatórios gerados pelo k6-reporter:

<img width="2456" height="950" alt="image" src="https://github.com/user-attachments/assets/ef81d934-ce03-4ecb-a37a-a8a2e60d447e" />

--- 
# Conclusão:

**1. Confiabilidade e Integridade do Sistema**
* **Taxa de Sucesso boa:** _Foram processadas 89.420 requisições com 0.00% de erro. Em alta concorrência, o servidor não apresentou falhas de conexão ou erros de timeout._

* **Validação de Negócio:** _O grupo Fluxo: LOAD - Recomendação de Pizza manteve 100% dos checks, garantindo que o payload de resposta permaneceu válido durante todo o período de estresse._

**2. Análise de Latência e Experiência do Usuário**
* **Performance Predictability:** _O tempo médio de resposta foi de 205.44 ms. A métrica de P(95) fixou-se em 243.27 ms._

* **Delta de Estabilidade:** _A pequena diferença (aproximadamente 38 ms) entre a média e o percentil p(95) demonstra uma baixa variação, significa que a experiência de quase todos os usuários é "uniforme"._

**3. Capacidade de Escala e Eficiência de Rede** 
* **Vazão (Throughput):**  _A API sustentou uma vazão média de 222.38 requisições por segundo (req/s)._

* **Eficiência de Tráfego:**  _O teste registrou um volume de 94.55 MB recebidos contra apenas 22.51 MB enviados. Essa diferença mostra que as requisições estão bem leves e otimizadas._
