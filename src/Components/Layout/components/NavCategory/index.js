import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';
import { logOut } from "../../../../redux/apiRequest";
import { createAxios } from "../../../../createInstance";
import { logoutSuccess } from "../../../../redux/authSlice";
import styles from './Nav.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Nav() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const accessToken = user?.accessToken;
    const id = user?._id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(user, dispatch, logoutSuccess);
    const handleLogout = () => {
        logOut(dispatch, id, navigate, accessToken, axiosJWT)
    }

    //Show-hidden dropdown
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

    const handleUserClick = () => {
        setUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleOutsideClick = () => {
        setUserDropdownOpen(false);
    };
    return (
        <div>
            <div className={cx('nav')}>
                <div className={cx('user-info')}>
                    <div className={cx('user-info-icon')} onClick={handleUserClick}>
                        <i className="fa-regular fa-circle-user"><span>{user.fullname}</span></i>
                    </div>
                </div>
                {(isUserDropdownOpen) && (
                    <div className={cx('outside')} onClick={handleOutsideClick}></div>
                )}
            </div>
            {isUserDropdownOpen && (
                <ul className={cx('dropdown')}>
                    <li>
                        <Link to={'/historylogin'} onClick={handleOutsideClick}>
                            <i className={"fa-solid fa-users"}></i>Lịch sử đăng nhập
                        </Link>
                    </li>
                    <li>
                        <Link to={'/user'} onClick={handleOutsideClick}>
                            <i className={"fa-solid fa-people-roof"}></i>Quản lý tài khoản
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={handleLogout}>
                            <i className={"fa-solid fa-right-from-bracket"}></i>Đăng xuất
                        </a>
                    </li>
                </ul>
            )}
        </div>


    );
}

export default Nav;
