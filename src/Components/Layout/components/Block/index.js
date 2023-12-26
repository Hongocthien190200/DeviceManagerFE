import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styles from './Block.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Blockuser() {
    return (
        <>
            <div className={cx('block-container')}>
                <div className={cx('block-wrap')}>
                    <h1>Bạn không có quyền truy cập vào trang này!!!</h1>
                </div>
            </div>
        </>
    );
}

export default Blockuser;
