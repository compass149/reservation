import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import User from "../../models/User";
import { loginService } from "../../services/auth.service";
import { setCurrentUser } from "../../store/actions/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const Login=()=>{
    const [user, setUser] = useState(new User('', '', ''));
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const currentUser = useSelector((state) => state.user);
    const dispatch = useDispatch(); // 디스패치 객체 생성
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser?.id) navigate('/profile');
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setUser((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setSubmitted(true);
    
        if (!user.username || !user.password) {
          return;
        }
    
        setLoading(true);
    
        loginService(user)
          .then((response) => {
            //setCurrentUser로 만든 액션을 유저 리듀서에 전달
            dispatch(setCurrentUser(response.data));
            navigate('/profile');
          })
          .catch((error) => {
            console.log(error);
            setErrorMessage('유저네임 또는 패스워드가 틀립니다.');
            setLoading(false);
          });
    
        setLoading(false);
    };

    
    return (
        <div className="container mt-5">
          <div className="card ms-auto me-auto p-3 shadow-lg custom-card">
            <FontAwesomeIcon icon={faUserCircle} className="ms-auto me-auto user-icon" />
    
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    
            <form onSubmit={handleLogin} noValidate className={submitted ? 'was-validated' : ''}>
              <div className="form-group my-2">
                <label htmlFor="username">아이디</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">아이디를 입력해주세요</div>
              </div>
    
              <div className="form-group my-2">
                <label htmlFor="password">패스워드</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">패스워드를 입력해주세요</div>
              </div>
    
              <button className="btn btn-info text-white w-100 mt-3" disabled={loading}>
                로그인
              </button>
            </form>
    
            <Link to="/join" className="btn btn-link" style={{ color: 'darkgray', backgroundColor:"transparent" }}>
              새 계정 만들기
            </Link>
          </div>
        </div>
      );
}
export default Login;