import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllStatus, updateStatus, postNewStatus } from "../../redux/apiRequest";
import NotiSucces from '../../Components/Notification/notisuccess';
import NotiFailed from '../../Components/Notification/notifailed';
import Blockuser from '../../Components/Layout/components/Block';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';

import styles from './Status.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Status() {
    const dispatch = useDispatch();
    let state = useSelector((state) => state.statuses.status);
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let statuses = [];
    if (state && state.liststatuses) {
        statuses = state.liststatuses;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatusName, setNewStatusName] = useState("");
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [validationError, setValidationError] = useState("");

    // Hàm xử lý khi người dùng mở modal thêm mới
    const handleOpenModal = () => {
        setIsModalOpen(true);
        setNewStatusName("");
        setSelectedStatusId(null);
    }

    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setValidationError("");
    }

    // Hàm xử lý khi người dùng ấn nút "Sửa"
    const handleOpenUpdateModal = (statusId, statusName) => {
        setSelectedStatusId(statusId);
        setNewStatusName(statusName);
        setIsModalOpen(true);
    }

    // Hàm xử lý khi người dùng ấn nút "Lưu"
    const handleSaveStatus = async () => {
        if (!newStatusName) {
            setValidationError("*Vui lòng không bỏ trống");
            return;
        }

        if (selectedStatusId) {
            // Kiểm tra xem giá trị đã thay đổi so với ban đầu
            const originalStatus = statuses.find(status => status._id === selectedStatusId);
            if (originalStatus && originalStatus.statusName === newStatusName) {
                setIsModalOpen(false);
                errCallback();
                setValidationError("");
                return;
            }
            // Gọi hàm updateStatus khi cần cập nhật trạng thái
            const newData = { statusName: newStatusName };
            await updateStatus(selectedStatusId, newData, dispatch, successCallback, errCallback,user?.accessToken, axiosJWT);
        } else {
            // Gọi hàm postNewStatus khi cần thêm mới trạng thái
            const newData = { statusName: newStatusName };
            await postNewStatus(newData, dispatch, successCallback, errCallback,user?.accessToken, axiosJWT);
        }
        setNewStatusName("");
        setValidationError("");
    }
    //xử lý modal sửa thành công
    const handleCloseSuccessModal = () => {
        setIsNotiSucces(false);
    }
    const [isNotiSucces, setIsNotiSucces] = useState(false);
    //xử lý modal sửa thất bại
    const handleCloseFailedModal = () => {
        setIsNotiFailed(false);
    }
    const [isNotiFailed, setIsNotiFailed] = useState(false);

    const successCallback = async () => {
        await getAllStatus(user?.accessToken,dispatch, axiosJWT);
        setIsModalOpen(false);
        setIsNotiSucces(true);
    }
    const errCallback = () => {
        setIsModalOpen(false);
        setIsNotiFailed(true);
    }

    useEffect(() => {
        if (user?.accessToken&&user.admin) {
            getAllStatus(user?.accessToken,dispatch, axiosJWT);
        }
    }, []);

    return (
        user.admin ? (
            <>
                <div className={cx('status-container')}>
                    <div className={cx('status-wrap')}>
                        <h1>Danh sách trạng thái tài sản nội bộ</h1>
                        <button className={cx('add-button')} onClick={handleOpenModal}>Thêm mới</button>
                        <div className={cx('status-list')}>
                            {statuses.map(status => (
                                <div key={status._id} className={cx('status-item')}>
                                    <span>{status.statusName}</span>
                                    <button
                                        className={cx('edit-button')}
                                        onClick={() => handleOpenUpdateModal(status._id, status.statusName)}
                                    >
                                        Sửa
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isModalOpen && (
                        <div className={cx('modal-overlay')}>
                            <div className={cx('modal-create')}>
                                <button className={cx('close-button')} onClick={handleCloseModal}>
                                    <i className={cx("fa-solid fa-times")} />
                                </button>
                                <h2>{selectedStatusId ? "Sửa trạng thái" : "Tạo mới trạng thái"}</h2>
                                <input
                                    type="text"
                                    value={newStatusName}
                                    onChange={(e) => setNewStatusName(e.target.value)}
                                    placeholder="Nhập tên trạng thái"
                                />
                                <span className={cx('validation-error')}>{validationError}</span>
                                <div className={cx('group-button')}>
                                    <button className={cx('cancel-button')} onClick={handleCloseModal}>
                                        Hủy
                                    </button>
                                    <button className={cx('create-button')} onClick={handleSaveStatus}>
                                        {selectedStatusId ? "Lưu" : "Thêm"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {isNotiSucces && (<NotiSucces handleCloseSuccessModal={handleCloseSuccessModal} />)
                }
                {isNotiFailed && (<NotiFailed handleCloseFailedModal={handleCloseFailedModal} />)
                }
            </>
        ) : (
            <Blockuser />
        )
    );
}

export default Status;
