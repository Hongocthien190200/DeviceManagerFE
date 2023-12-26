import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import styles from './MnModal.module.scss';
import classNames from 'classnames/bind';
import { updateMnHisById } from "../../../../redux/apiRequest";

const cx = classNames.bind(styles);

function EditMnModal({ maintenance, handleCloseModal, setIsNotiSucces, setIsNotiFailed, setisEditMnOpen, getMnHisById, deviceId, user, axiosJWT }) {
    const dispatch = useDispatch();

    const [newMnHisData, setNewMnHisData] = useState({
        reasonMaintenance: maintenance.reasonMaintenance,
        decriptionMaintenance: maintenance.decriptionMaintenance,
        maintenancePrice: maintenance.maintenancePrice
    });
    // Hàm xử lý khi người dùng thay đổi giá trị trong modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericValue = ["maintenancePrice"].includes(name) ? parseFloat(value) : value;
        setNewMnHisData({
            ...newMnHisData,
            [name]: numericValue
        });
    }
    // Các hàm xử lý khi người dùng ấn nút Lưu
    const errCallback = () => {
        setisEditMnOpen(false);
        setIsNotiFailed(true);
    }

    const successCallback = async () => {
        setisEditMnOpen(false);
        setIsNotiSucces(true);
    }
    const handleSaveMnHis = async () => {
        if (validateForm()) {
            const changedFields = getChangedFields();
            if (Object.keys(changedFields).length > 0) {
                await updateMnHisById(maintenance._id, changedFields, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
                await getMnHisById(deviceId, dispatch, user?.accessToken, axiosJWT);
            }
        }
    }
    //hàm kiểm tra giá trị thay đổi
    const getChangedFields = () => {
        const changedFields = {};

        for (const key in newMnHisData) {
            // So sánh giá trị mới với giá trị ban đầu
            if (newMnHisData[key] !== maintenance[key]) {
                changedFields[key] = newMnHisData[key];
            }
        }

        return changedFields;
    };
    //Thêm State thông báo trạng thái lỗi
    const [formErrors, setFormErrors] = useState({
        reasonMaintenance: '',
        decriptionMaintenance: '',
        maintenancePrice: '',
    });

    //Hàm xử lý validation Form
    const validateForm = () => {
        const errors = {
            reasonMaintenance: '',
            decriptionMaintenance: '',
            maintenancePrice: '',
        };

        let hasErrors = false;

        // Kiểm tra các trường bắt buộc
        if (!newMnHisData.reasonMaintenance) {
            errors.reasonMaintenance = 'Bạn vui lòng không để trống trường này';
            hasErrors = true;
        }
        if (!newMnHisData.decriptionMaintenance) {
            errors.decriptionMaintenance = 'Bạn vui lòng không để trống trường này';
            hasErrors = true;
        }
        if (newMnHisData.maintenancePrice <= 0) {
            errors.maintenancePrice = 'Vui lòng nhập phí bảo dưỡng';
            hasErrors = true;
        }
        setFormErrors(errors);
        return !hasErrors;
    };
    return (
        <div className={cx('modal-container')}>
            <div className={cx('modal')}>
                <div className={cx('modal-content')}>
                    <h2>CHỈNH SỬA PHIẾU BẢO DƯỠNG</h2>
                    <button className={cx('close-button')} onClick={handleCloseModal}>
                        <i className={cx('fa-solid fa-times')} />
                    </button>
                    <form>
                        <div className={cx('group-left')}>
                            <div className={cx('input-group')}>
                                <label>Yêu cầu bảo dưỡng</label>
                                <input
                                    type="text"
                                    name="reasonMaintenance"
                                    value={newMnHisData.reasonMaintenance}
                                    onChange={handleInputChange}
                                />
                                <div className={cx('error-message')}>{formErrors.reasonMaintenance}</div>
                            </div>
                            <div className={cx('input-group')}>
                                <label>Chi phí bảo dưỡng</label>
                                <input
                                    type="number"
                                    name="maintenancePrice"
                                    value={newMnHisData.maintenancePrice}
                                    onChange={handleInputChange}
                                />
                                <div className={cx('error-message')}>{formErrors.maintenancePrice}</div>
                            </div>
                        </div>
                        <div className={cx('group-right')}>
                            <div className={cx('input-group')}>
                                <label>Mô tả</label>
                                <textarea
                                    className={cx('input-group-textarea')}
                                    type="text"
                                    name="decriptionMaintenance"
                                    value={newMnHisData.decriptionMaintenance}
                                    onChange={handleInputChange}
                                />
                                <div className={cx('error-message')}>{formErrors.decriptionMaintenance}</div>
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
