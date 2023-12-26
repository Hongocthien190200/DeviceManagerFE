import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from "react-redux";

import styles from './rpModal.module.scss';
import classNames from 'classnames/bind';

import { getAllRepairer, postNewRpHis } from "../../../../redux/apiRequest";

const cx = classNames.bind(styles);

function CreateMnModal({ deviceId, getRpHisById, handleCloseModal, setIsNotiSucces, setIsNotiFailed, setIsModalOpen, user, axiosJWT }) {
    let state = useSelector((state) => state.repairers.repairer)
    const dispatch = useDispatch();
    let repairers = [];
    if (state && state.listrepairers) {
        repairers = state.listrepairers;
    }
    const [newRpHisData, setNewRpHisData] = useState({
        reasonRepair: '',
        decriptionRepair: '',
        repairPrice: 0,
        repairerId: '',
    });

    // Hàm xử lý khi người dùng thay đổi giá trị trong modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericValue = ["repairPrice"].includes(name) ? parseFloat(value) : value;
        setNewRpHisData({
            ...newRpHisData,
            [name]: numericValue
        });
    }
    // Hàm xử lý khi người dùng ấn nút "Thêm"
    const successCallback = async () => {
        await getRpHisById(deviceId, dispatch, user?.accessToken, axiosJWT);
        await setIsModalOpen(false);
        await setIsNotiSucces(true);
    }
    const errCallback = () => {
        setIsModalOpen(false);
        setIsNotiFailed(true);
    }
    const handleAddRpHis = async () => {

        if (validateForm()) {
            await postNewRpHis(deviceId, newRpHisData, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
        }
    }

    //Thêm State thông báo trạng thái lỗi
    const [formErrors, setFormErrors] = useState({
        reasonRepair: '',
        decriptionRepair: '',
        repairPrice: '',
        repairerId: '',
    });

    //Hàm xử lý validation Form
    const validateForm = () => {
        const errors = {
            reasonRepair: '',
            decriptionRepair: '',
            repairPrice: '',
            repairerId: '',
        };

        let hasErrors = false;

        // Kiểm tra các trường bắt buộc
        if (!newRpHisData.reasonRepair) {
            errors.reasonRepair = 'Bạn vui lòng không để trống trường này';
            hasErrors = true;
        }
        if (!newRpHisData.decriptionRepair) {
            errors.decriptionRepair = 'Bạn vui lòng không để trống trường này';
            hasErrors = true;
        }
        if (newRpHisData.repairPrice <= 0) {
            errors.repairPrice = 'Vui lòng nhập phí sửa chữa';
            hasErrors = true;
        }
        if (newRpHisData.repairerId === '') {
            errors.repairerId = 'Bạn vui lòng chọn một vị trí';
            hasErrors = true;
        }
        setFormErrors(errors);
        return !hasErrors;
    };
    useEffect(() => {
        if (user?.accessToken) {
            getAllRepairer(dispatch, user?.accessToken, axiosJWT)
        }
    }, [])
    return (
        <div className={cx('modal-container')}>
            <div className={cx('modal')}>
                <div className={cx('modal-content')}>
                    <h2>THÊM MỚI PHIẾU SỬA CHỮA</h2>
                    <button className={cx('close-button')} onClick={handleCloseModal}>
                        <i className={cx('fa-solid fa-times')} />
                    </button>
                    <form>
                        <div className={cx('group-left')}>
                            <div className={cx('input-group')}>
                                <label>Yêu cầu sửa chữa</label>
                                <input
                                    type="text"
                                    name="reasonRepair"
                                    value={newRpHisData.reasonRepair}
                                    onChange={handleInputChange}
                                />
                                <div className={cx('error-message')}>{formErrors.reasonRepair}</div>
                            </div>
                            <div className={cx('input-group')}>
                                <label>Chi phí sửa chữa</label>
                                <input
                                    type="number"
                                    name="repairPrice"
                                    value={newRpHisData.repairPrice}
                                    onChange={handleInputChange}
                                />
                                <div className={cx('error-message')}>{formErrors.repairPrice}</div>
                            </div>

                            <div className={cx('input-group')}>
                                <label>Đơn vị sửa chữa</label>
                                <select
                                    name="repairerId"
                                    value={newRpHisData.repairerId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">--- Chọn vị trí ---</option>
                                    {repairers.map((repairer, index) => (
                                        <option key={index} value={repairer._id}>
                                            {repairer.repairerName}
                                        </option>
                                    ))}
                                </select>
                                <div className={cx('error-message')}>{formErrors.repairerId}</div>
                            </div>
                        </div>
                        <div className={cx('group-right')}>
                            <div className={cx('input-group')}>
                                <label>Mô tả</label>
                                <textarea
                                    className={cx('input-group-textarea')}
                                    type="text"
                                    name="decriptionRepair"
                                    value={newRpHisData.decriptionRepair}
                                    onChange={handleInputChange}
                                />
                                <div className={cx('error-message')}>{formErrors.decriptionRepair}</div>
                            </div>
                        </div>
                    </form>
                    <div className={cx('button-group')}>
                        <div className={cx('input-group')}>
                            <button onClick={handleAddRpHis}>Thêm</button>
                        </div>
                        <div className={cx('input-group')}>
                            <button onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default CreateMnModal;
