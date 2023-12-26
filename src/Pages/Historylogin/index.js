import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAlllistLogin } from "../../redux/apiRequest";
import Blockuser from '../../Components/Layout/components/Block';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';

import styles from './Historylogin.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Historylogin() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let state = useSelector((state) => state.auth.alllogin);

    let alllogin = [];
    if (state && state.listlogin) {
        alllogin = state.listlogin;
    }

    useEffect(() => {
        if (user?.accessToken) {
            getAlllistLogin(user?.accessToken,dispatch, axiosJWT);
        }
    }, []);

    return (
        user.admin?(
        <>
            <div className={cx('repairer-container')}>
                <div className={cx('repairer-wrap')}>
                    <h1>Lịch sử đăng nhập</h1>
                    <div className={cx('repairer-list')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>Tên tài khoản</th>
                                    <th>Thời gian đăng nhập</th>
                                    <th>Vĩ độ</th>
                                    <th>Kinh độ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alllogin.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.userName}</td>
                                        <td>{user.loginInfo.timestamp}</td>
                                        <td>{user.loginInfo.location[0]}</td>
                                        <td>{user.loginInfo.location[1]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
        ):(
            <Blockuser/>
        )
    );
}

export default Historylogin;
