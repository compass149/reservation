import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import Payment from './pages/payment/Payment';
import RoomInfo from './pages/RoomInfo'; // 추가
import KakaoPaySuccess from './pages/payment/KakaoPaySuccess';
import ApprovalResult from './components/ApprovalResult';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/roomSelection" element={<RoomSelection />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/kakaoPaySuccess" element={<KakaoPaySuccess />} />
            <Route path="/approve-result" element={<ApprovalResult />} /> {/* ApprovalResult 경로 추가 */}
            <Route
              path="/admin"
              element={
                <AuthGuard roles={[Role.ADMIN]}>
                  <Admin />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard roles={[Role.ADMIN, Role.USER]}>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route path="/roominfo/:id" element={<RoomInfo />} /> {/* 방 상세 페이지 추가 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/401" element={<UnAuthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;