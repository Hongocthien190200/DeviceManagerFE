import React, { useState } from 'react';
import styles from './Notification.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function NotiFailed(props) {
    return (
        <div className={cx('success-modal')}>
            <div className={cx('success-modal-content')}>
                <div className={cx('icon-failed')}><i className={cx("fa-regular fa-circle-check")}></i></div>
                <h2>OOP!!! Hãy thử lại.</h2>
                <button className={cx('close-button')} onClick={props.handleCloseFailedModal}>
                    <i className={cx('fa-solid fa-times')} />
                </button>
            </div>
        </div>
    )

}
export default NotiFailed;