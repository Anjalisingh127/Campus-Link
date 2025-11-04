import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage'; // Import Pages
import HackathonsPage from './pages/HackathonsPage';
import InternshipsPage from './pages/InternshipsPage';
import './App.css';

function App() {

  return (
    // We use a React Fragment <> to wrap multiple components
    <>
      <Header />
      
      <main className="main-content">
        {/* We've replaced the single EventList with our new Router setup */}
        <Routes> 
          <Route path="/" element={<HomePage />} />
          <Route path="/hackathons" element={<HackathonsPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App