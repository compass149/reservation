import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/user/Login';
import Join from './pages/user/Join';
import NotFound from './pages/not_found/NotFound';
import UnAuthorized from './unauthorized/UnAuthorized';
import Profile from './pages/user/Profile';
import AuthGuard from './guards/AuthGuard';
import { Role } from './models/Role';
import Admin from './pages/admin/Admin';
import RoomSelection from './pages/RoomSelection';
import Payment from "./pages/Payment";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/join' element={<Join />}></Route>
          <Route path="/roomSelection" element={<RoomSelection />} />
          <Route path="/payment" element={<Payment />} />
          <Route path='/admin' element={
            <AuthGuard roles={[Role.ADMIN]}>
              <Admin />
            </AuthGuard>}></Route>
          <Route path='/profile' element={
            <AuthGuard roles={[Role.ADMIN, Role.USER]}>
              <Profile />
            </AuthGuard>
            }></Route>
          <Route path='/404' element={<NotFound />}></Route>
          <Route path='/401' element={<UnAuthorized />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}
export default App;