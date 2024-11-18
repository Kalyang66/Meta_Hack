import React, { useState, useEffect } from 'react';
import { Card, Container, Table, Row, Col, Spinner, Modal, Button, Form, Alert } from 'react-bootstrap';
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
  const [modalShow, setModalShow] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [hwAcceleration, setHwAcceleration] = useState({});
  const [qosOptimization, setQosOptimization] = useState({});
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const services = ['Facebook', 'Instagram', 'WhatsApp', 'Messenger', 'Workplace', 'Quest Store'];
  const regions = ['NA-East', 'NA-West', 'EU-Central', 'EU-West', 'APAC', 'LATAM'];

  // Rest of your existing data generation functions...
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

  const generateHealthData = () => {
    const data = {};
    const TARGET_TRAFFIC = 1500;
    const TARGET_LATENCY = 70;
    const TARGET_ERROR_RATE = 2;
    const TARGET_NODES = 175;

    services.forEach(service => {
      data[service] = {};
      regions.forEach(region => {
        const serviceKey = `${service}-${region}`;
        const accelerationFactor = hwAcceleration[serviceKey] ? 0.8 : 1;
        const qosFactor = qosOptimization[serviceKey] ? 0.9 : 1;

        const traffic = Math.random() * 1000 + 500;
        const latency = (Math.random() * 20 + 50) * accelerationFactor * qosFactor;
        const errorRate = (Math.random() * 1 + 1) * qosFactor;
        const activeNodes = Math.floor(Math.random() * 100 + 75);
        
        const trafficScore = Math.min(100, (traffic / TARGET_TRAFFIC) * 0.85861477);
        const latencyScore = Math.min(100, ((TARGET_LATENCY - latency) / TARGET_LATENCY) * 0.04006869);
        const errorScore = Math.min(100, ((TARGET_ERROR_RATE - errorRate) / TARGET_ERROR_RATE) * 0.00114482);
        const nodeScore = Math.min(100, (activeNodes / TARGET_NODES) * 0.10017172);
        
        const healthScore = Math.min(100, (
          trafficScore +
          latencyScore +
          errorScore +
          nodeScore
        ) * 100);

        data[service][region] = {
          healthScore,
          traffic,
          latency,
          errorRate,
          activeNodes
        };
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
  }, [hwAcceleration, qosOptimization]);

  const getHealthColor = (score) => {
    if (score >= 50) return 'success';
    if (score >= 40) return 'info';
    if (score >= 35) return 'warning';
    return 'danger';
  };

  const handleShowDetails = (service, region) => {
    setSelectedService({ service, region, ...healthData[service][region] });
    setModalShow(true);
  };

  const toggleHwAcceleration = () => {
    const serviceKey = `${selectedService.service}-${selectedService.region}`;
    setHwAcceleration(prev => ({
      ...prev,
      [serviceKey]: !prev[serviceKey]
    }));
    setStatusMessage({
      type: 'info',
      text: `Hardware acceleration ${!hwAcceleration[serviceKey] ? 'enabled' : 'disabled'} for ${selectedService.service} in ${selectedService.region}`
    });
  };

  const toggleQosOptimization = () => {
    const serviceKey = `${selectedService.service}-${selectedService.region}`;
    setQosOptimization(prev => ({
      ...prev,
      [serviceKey]: !prev[serviceKey]
    }));
    setStatusMessage({
      type: 'info',
      text: `QoS optimization ${!qosOptimization[serviceKey] ? 'enabled' : 'disabled'} for ${selectedService.service} in ${selectedService.region}`
    });
  };

  const handleResetNode = () => {
    setResetting(true);
    setStatusMessage({
      type: 'warning',
      text: `Resetting nodes for ${selectedService.service} in ${selectedService.region}...`
    });

    // Simulate node reset
    setTimeout(() => {
      setResetting(false);
      setStatusMessage({
        type: 'success',
        text: `Nodes successfully reset for ${selectedService.service} in ${selectedService.region}`
      });
    }, 3000);
  };

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
          {statusMessage && (
            <Alert variant={statusMessage.type} dismissible onClose={() => setStatusMessage(null)}>
              {statusMessage.text}
            </Alert>
          )}
        </Col>
      </Row>

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
                        const { healthScore } = healthData[service]?.[region] || {};
                        return (
                          <td key={region} className="text-center">
                            <span
                              className={`badge bg-${getHealthColor(healthScore)}`}
                              style={{ width: '4rem', cursor: 'pointer' }}
                              onClick={() => handleShowDetails(service, region)}
                            >
                              {healthScore ? healthScore.toFixed(1) : 'N/A'}%
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

      <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedService?.service} - {selectedService?.region}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h6>Performance Metrics</h6>
              <div><strong>Health Score:</strong> {selectedService?.healthScore?.toFixed(1)}%</div>
              <div><strong>Traffic:</strong> {selectedService?.traffic?.toFixed(1)} Gbps</div>
              <div><strong>Latency:</strong> {selectedService?.latency?.toFixed(1)} ms</div>
              <div><strong>Error Rate:</strong> {selectedService?.errorRate?.toFixed(1)}%</div>
              <div><strong>Active Nodes:</strong> {selectedService?.activeNodes}</div>
            </Col>
            <Col md={6}>
              <h6>Optimization Controls</h6>
              <Form>
                <Form.Check 
                  type="switch"
                  id="hw-acceleration"
                  label="Hardware Acceleration"
                  checked={hwAcceleration[`${selectedService?.service}-${selectedService?.region}`] || false}
                  onChange={toggleHwAcceleration}
                  className="mb-2"
                />
                <Form.Check 
                  type="switch"
                  id="qos-optimization"
                  label="QoS Optimization"
                  checked={qosOptimization[`${selectedService?.service}-${selectedService?.region}`] || false}
                  onChange={toggleQosOptimization}
                  className="mb-3"
                />
                <Button 
                  variant="warning"
                  onClick={handleResetNode}
                  disabled={resetting}
                >
                  {resetting ? 'Resetting Nodes...' : 'Reset Interactive Nodes'}
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;