import React, { useState } from 'react';
import styles from './Notification.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function NotiSuccess(props) {
    return(
        <div className={cx('success-modal')}>
        <div className={cx('success-modal-content')}>
            <div className={cx('icon-success')}><i className={cx("fa-regular fa-circle-check")}></i></div>
            <h2>SUCCESS!</h2>
            <button className={cx('close-button')} onClick={props.handleCloseSuccessModal}>
                <i className={cx('fa-solid fa-times')} />
            </button>
        </div>
    </div>
    )
}

export default NotiSuccess;