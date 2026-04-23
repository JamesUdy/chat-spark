import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BroadcastChat from './features/broadcast/BroadcastChat'
import PeerChat from './features/peer/PeerChat'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/broadcast" element={<BroadcastChat />} />
      <Route path="/peer" element={<PeerChat />} />
    </Routes>
  )
}

export default App
