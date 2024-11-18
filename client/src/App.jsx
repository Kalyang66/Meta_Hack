// App.jsx
import React, { useState, useEffect } from 'react';
import { Card, Container, Table, Row, Col, Spinner } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [healthData, setHealthData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);

  const services = ['Facebook', 'Instagram', 'WhatsApp', 'Messenger', 'Workplace', 'Quest Store'];
  const regions = ['NA-East', 'NA-West', 'EU-Central', 'EU-West', 'APAC', 'LATAM'];

  // Generate mock traffic data
  const generateTrafficData = () => {
    const times = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    return {
      labels: times,
      datasets: [
        {
          label: 'Network Traffic (Gbps)',
          data: times.map(() => Math.random() * 1000 + 500),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.4
        },
        {
          label: 'Latency (ms)',
          data: times.map(() => Math.random() * 50 + 20),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.4
        },
        {
          label: 'Error Rate (%)',
          data: times.map(() => Math.random() * 2),
          borderColor: 'rgb(255, 205, 86)',
          tension: 0.4
        }
      ]
    };
  };

  // Generate health data
  const generateHealthData = () => {
    const data = {};
    services.forEach(service => {
      data[service] = {};
      regions.forEach(region => {
        data[service][region] = 85 + Math.random() * 15;
      });
    });
    return data;
  };

  useEffect(() => {
    const fetchData = () => {
      setHealthData(generateHealthData());
      setTrafficData(generateTrafficData());
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (score) => {
    if (score >= 95) return 'success';
    if (score >= 90) return 'info';
    if (score >= 85) return 'warning';
    return 'danger';
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '24-Hour Network Performance'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Meta Network Monitor</h2>
        </Col>
      </Row>

      {/* Network Traffic Analysis */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Network Traffic Analysis</h5>
            </Card.Header>
            <Card.Body>
              <Line options={chartOptions} data={trafficData} height={80} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Network Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-primary">789.5 Gbps</h3>
              <Card.Text>Current Traffic</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-success">35ms</h3>
              <Card.Text>Average Latency</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-warning">0.8%</h3>
              <Card.Text>Error Rate</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-info">156/175</h3>
              <Card.Text>Active Nodes</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Services Health */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Services Health Status</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th></th>
                    {regions.map(region => (
                      <th key={region} className="text-center">
                        {region}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service}>
                      <td className="fw-bold">{service}</td>
                      {regions.map(region => {
                        const score = healthData[service]?.[region] || 0;
                        return (
                          <td key={region} className="text-center">
                            <span className={`badge bg-${getHealthColor(score)}`} style={{ width: '4rem' }}>
                              {score.toFixed(1)}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Infrastructure & Security */}
      <Row>
        <Col md={6} className="mb-3">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Infrastructure Status</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={6}>
                  <div className="mb-3">
                    <div className="text-muted">Total Edge Locations</div>
                    <div className="h5">175</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted">Active CDN Nodes</div>
                    <div className="h5">156/175</div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="mb-3">
                    <div className="text-muted">Global Health Score</div>
                    <div className="h5">94.8%</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted">Network Utilization</div>
                    <div className="h5">78.5%</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Security Status</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={6}>
                  <div className="mb-3">
                    <div className="text-muted">DDoS Protection</div>
                    <div className="h5 text-success">Active</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted">SSL/TLS Status</div>
                    <div className="h5 text-success">Optimal</div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="mb-3">
                    <div className="text-muted">Threat Level</div>
                    <div className="h5 text-success">Low</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted">Failed Login Attempts</div>
                    <div className="h5">23 <small className="text-muted">/hr</small></div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;