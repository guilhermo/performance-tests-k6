export const SCENARIOS = {
    smoke: {
        vus: 3,
        duration: '30s',
        thresholds: { http_req_duration: ['p(95)<1500'] }
    },
    load: {
        stages: [
            { duration: '1m', target: 100 },
            { duration: '5m', target: 500 },
            { duration: '1m', target: 0 },
        ],
        thresholds: { http_req_duration: ['p(95)<2500'] }
    },
    spike: {
        stages: [
            { duration: '10s', target: 10 },
            { duration: '1m', target: 500 },
            { duration: '10s', target: 10 },
        ],
        thresholds: { http_req_duration: ['p(95)<3000'] }
    }
};