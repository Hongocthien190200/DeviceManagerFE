import React, { useState } from 'react';

import { useDispatch } from "react-redux";

import styles from './rpModal.module.scss';
import classNames from 'classnames/bind';

import { updateRpHisById } from "../../../../redux/apiRequest";

const cx = classNames.bind(styles);

function EditMnModal({ repairdata, handleCloseModal, setIsNotiSucces, setIsNotiFailed, setisEditRpOpen, getRpHisById, deviceId, user, axiosJWT }) {
    const dispatch = useDispatch();

    const [newRpHisData, setNewRpHisData] = useState({
        reasonRepair: repairdata.reasonRepair,
        decriptionRepair: repairdata.decriptionRepair,
        repairPrice: repairdata.repairPrice,
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
    // Các hàm xử lý khi người dùng ấn nút Lưu
    const errCallback = () => {
        setisEditRpOpen(false);
        setIsNotiFailed(true);
    }

    const successCallback = async () => {
        setisEditRpOpen(false);
        setIsNotiSucces(true);
    }
    const handleSaveMnHis = async () => {
        if (validateForm()) {
            const changedFields = getChangedFields();
            if (Object.keys(changedFields).length > 0) {
                await updateRpHisById(repairdata._id, changedFields, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
                await getRpHisById(deviceId, dispatch, user?.accessToken, axiosJWT);
            }
        }
    }
    //hàm kiểm tra giá trị thay đổi
    const getChangedFields = () => {
        const changedFields = {};

        for (const key in newRpHisData) {
            // So sánh giá trị mới với giá trị ban đầu
            if (newRpHisData[key] !== repairdata[key]) {
                changedFields[key] = newRpHisData[key];
            }
        }

        return changedFields;
    };
    //Thêm State thông báo trạng thái lỗi
    const [formErrors, setFormErrors] = useState({
        reasonRepair: '',
        decriptionRepair: '',
        repairPrice: '',
    });

    //Hàm xử lý validation Form
    const validateForm = () => {
        const errors = {
            reasonRepair: '',
            decriptionRepair: '',
            repairPrice: '',
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
        setFormErrors(errors);
        return !hasErrors;
    };
    return (
        <div className={cx('modal-container')}>
            <div className={cx('modal')}>
                <div className={cx('modal-content')}>
                    <h2>CHỈNH SỬA PHIẾU SỬA CHỮA</h2>
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
                            <button onClick={handleSaveMnHis}>Lưu</button>
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

export default EditMnModal;
