import User from "../../models/User";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { joinService } from "../../services/auth.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import "./Join.css"

const Join = () => {
    const [user, setUser] = useState({ name: '', username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const currentUser = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser?.id) {
            navigate('/profile');
        }
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!user.username || !user.password || !user.name) {
            return;
        }

        setLoading(true);

        joinService(user)
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
                if (error?.response?.status === 409) {
                    setErrorMessage("아이디가 중복되었습니다.");
                } else {
                    setErrorMessage("예상치 못한 에러가 발생했습니다.");
                }
                setLoading(false);
            });
    };

    return (
        <div className="container mt-5">
            <h4>회원가입</h4>
            <div className="ms-auto me-auto p-3">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            </div>
            <form onSubmit={handleRegister} noValidate className={submitted ? 'was-validated' : ''}>
                <div className="form-group mb-2">
                    <label htmlFor="name">이름</label>
                    <input
                        type='text'
                        name='name'
                        className="form-control"
                        placeholder="name"
                        value={user.name}
                        onChange={handleChange}
                        required
                    />
                    <div className="invalid-feedback">이름을 입력해주세요</div>
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="username">아이디</label>
                    <input
                        type='text'
                        name='username'
                        className="form-control"
                        placeholder="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                    />
                    <div className="invalid-feedback">아이디를 입력해주세요</div>
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="password">패스워드</label>
                    <input
                        type='password'
                        name='password'
                        className="form-control"
                        placeholder="password"
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                    <div className="invalid-feedback">패스워드를 입력해주세요</div>
                </div>
                <button className="btn btn-info text-white w-100 mt-3" disabled={loading}>가입하기</button>
            </form>
        </div>
    );
};

export default Join;
