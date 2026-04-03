import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AuctionDetail from './pages/AuctionDetail.jsx'
import CreateAuction from './pages/CreateAuction.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditAuction from './pages/EditAuction.jsx'
import './index.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auction/:id/edit" element={<EditAuction />} />
      </Routes>
    </Router>
  )
}

export default App