import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { SimulationForm } from './pages/SimulationForm';
import { Result } from './pages/Result';
import { History } from './pages/History';
import { Chat } from './pages/Chat';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simular" element={<SimulationForm />} />
            <Route path="/resultado/:id" element={<Result />} />
            <Route path="/historico" element={<History />} />
            <Route path="/chat/:id" element={<Chat />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
