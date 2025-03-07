import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainNavbar from "./components/MainNavbar";

// Lazy-loaded pages for better performance
const Welcome = lazy(() => import("./pages/Welcome"));
const CreateWallet = lazy(() => import("./pages/CreateWallet"));
const CreateProfile = lazy(() => import("./pages/CreateProfile"));
const Home = lazy(() => import("./pages/Home"));
const Swap = lazy(() => import("./pages/Swap"));
const Liquidity = lazy(() => import("./pages/Liquidity"));
const Farming = lazy(() => import("./pages/Farming"));
const CreateTokenPage = lazy(() => import("./pages/CreateTokenPage"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Tokens = lazy(() => import("./pages/Tokens"));

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/PiMemes' : '';

  return (
    <Router basename={basename}>
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#e5e7eb' }}>
        <MainNavbar />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/create-wallet" element={<CreateWallet />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/liquidity" element={<Liquidity />} />
            <Route path="/farming" element={<Farming />} />
            <Route path="/create-token" element={<CreateTokenPage />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/tokens" element={<Tokens />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

// Loading screen component
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000'
    }}>
      <div style={{
        color: '#FFD700',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        Loading...
      </div>
    </div>
  );
}

export default App;
