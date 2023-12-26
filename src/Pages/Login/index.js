import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import logo from '../../assets/Logologin.jpg';
import styles from './Login.module.scss'; // Import SCSS module
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Login = () => {
    const currentUser = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();

    const [username, setUsename] = useState("");
    const [password, setPassword] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const handleLogin = (e) => {
        e.preventDefault();
        const newUser = {
            username: username,
            password: password,
            userLocation: [latitude, longitude]
        };
        if (!username.trim() || !password.trim()) {
            setErrors({ message: 'Vui lòng điền đầy đủ thông tin.' });
            return;
        } else if (latitude === "" || longitude === "") {
            setErrors({ message: 'Vui lòng cho phép truy cập vị trí' });
            return;
        }
        loginUser(newUser, dispatch, navigate, handleLoginError);
    };
    const handleLoginError = (error) => {
        setErrors({ message: error.message });
    };

    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (!currentUser) {
            // Nếu chưa đăng nhập, thì mới yêu cầu vị trí
            requestLocation();
        }
        else {
            navigate("/");
        }
    }, [currentUser]);

    const requestLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
            },
            (error) => {
                console.error('Lỗi khi lấy vị trí:', error.message);
                // Xử lý lỗi nếu người dùng từ chối chia sẻ vị trí hoặc có lỗi khác
            }
        );
    };

    return (
        <section className={cx('login-section')}>
            <div className={cx('login-container')}>
                <img src={logo} />
                <div className={cx('login-title')}>WELCOME!</div>
                <form onSubmit={handleLogin}>
                    <div className={cx('input-box')}>
                        <i className={cx("fa-solid fa-user")} />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={(e) => setUsename(e.target.value)}
                            placeholder="Username"
                        />
                    </div>
                    <div className={cx('input-box')}>
                        <i className={cx("fa-solid fa-lock")} />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <span className={cx('login-error')}>{errors?.message}</span>
                    <button type="submit">LOG IN</button>
                </form>
            </div>
        </section>
    );
};

export default Login;
