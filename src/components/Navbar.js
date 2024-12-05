import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentUser } from '../store/actions/user';
import { Role } from '../models/Role';

const Navbar = () => {
    const currentUser=useSelector((state) => state.user);
    const dispatch=useDispatch();
    const naviget=useNavigate();

    const logout=() =>{
        dispatch(clearCurrentUser());
        naviget("/login")
    }
    return(
        <nav className='navbar navbar-expand navbar-dark bg-dark'>
            <div className='container'>
                <div className='navbar-nav me-auto'>
                    {currentUser?.role===Role.ADMIN &&
                        <li className='nav-item'>
                            <NavLink to="/admin" href='##' className='nav-link'>관리자</NavLink>
                        </li>
                    }
                    <li className='nav-item'>
                        <NavLink to="/home" href='##' className='nav-link'>홈페이지</NavLink>
                    </li>
                </div>
                {!currentUser && (
                    <div className='navbar-nav ms-auto me-5'>
                        <li className='nav-item'>
                            <NavLink to="/login" href="##" className='nav-link'>로그인</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to="/join" href="##" className='nav-link'>가입하기</NavLink>
                        </li>
                    
                    </div>
                )}
                {currentUser && (
                    <div className='navbar-nav ms-auto me-5'>
                        <li className='nav-item'>
                            <NavLink to="/profile" href="##" className='nav-link'>{currentUser.name}</NavLink>
                        </li>
                        <li className='nav-item'>
                            <a href="##" className='nav-link' onClick={logout}>로그아웃</a>
                        </li>
                    
                    </div>
                )}
            </div>
        </nav>
    );
};
export default Navbar;