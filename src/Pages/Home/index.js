import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { getCountAll } from "../../redux/apiRequest";
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    let countAll = [];
    let state = useSelector((state) => state.home.count)
    if (state && state.quantity) {
        countAll = state.quantity;
    }
    const cards = [
        { title: 'Danh sách tài sản', link: '/devices', color: '#FF8C00', count: countAll?.divices, icon: "fa-solid fa-list-check" },
        { title: 'Lịch sử bảo dưỡng', link: '/maintenance', color: '#32CD32', count: countAll?.maintenances, icon: "fa-solid fa-toolbox" },
        { title: 'Lịch sử sửa chữa', link: '/repair', color: '#6495ED', count: countAll?.repairerhises, icon: "fa-solid fa-screwdriver-wrench" },
        { title: 'Phân loại tài sản', link: '/category', color: '#FF4500', count: countAll?.categories, icon: "fa-solid fa-shapes" },
        { title: 'Đơn vị bảo dưỡng', link: '/fixer', color: '#9370DB', count: countAll?.repairers, icon: "fa-solid fa-user-nurse" },
        { title: 'Vị trí tài sản', link: '/location', color: '#1E90FF', count: countAll?.locations, icon: "fa-solid fa-magnifying-glass-location" },
        { title: 'Quản lý tài khoản', link: '/user', color: '#FF1493', count: countAll?.user, icon: "fa-solid fa-users" },
    ];
    useEffect(() => {
        if (user?.accessToken) {
            getCountAll(user?.accessToken, dispatch, axiosJWT)
        }
    }, [])
    return (
        <div className={cx('home')}>
            {cards.map((card, index) => (
                <Link to={card.link} key={index} className={cx('card')} style={{ backgroundColor: card.color }}>
                    <div className={cx('circle')}>
                        {card.count}
                    </div>
                    <div className={cx('title')}>
                        {card.title}
                        <i className={cx(card.icon, 'icon-title')} />
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default Home;
