import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styles from './MnModal.module.scss';
import classNames from 'classnames/bind';
import { getAllRepairer, postNewMnHis } from "../../../../redux/apiRequest";

const cx = classNames.bind(styles);

function CreateMnModal({ deviceId, getMnHisById, handleCloseModal, setIsNotiSucces, setIsNotiFailed, setIsModalOpen, getDeviceById, user, axiosJWT }) {
    let state = useSelector((state) => state.repairers.repairer)
    const dispatch = useDispatch();
    let repairers = [];
    if (state && state.listrepairers
    ) {
        repairers = state.listrepairers;
    }
    const [newMnHisData, setNewMnHisData] = useState({
        reasonMaintenance: '',
        decriptionMaintenance: '',
        maintenancePrice: 0,
        repairerId: '',
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
    // Hàm xử lý khi người dùng ấn nút "Thêm"
    const successCallback = async () => {
        await getDeviceById(deviceId, dispatch, user?.accessToken, axiosJWT);
        await getMnHisById(deviceId, dispatch, user?.accessToken, axiosJWT);
        await setIsModalOpen(false);
        await setIsNotiSucces(true);
    }
    const errCallback = () => {
        setIsModalOpen(false);
        setIsNotiFailed(true);
    }
    const handleAddMnHis = async () => {
        if (validateForm()) {
            await postNewMnHis(deviceId, newMnHisData, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
        }
    }

    //Thêm State thông báo trạng thái lỗi
    const [formErrors, setFormErrors] = useState({
        reasonMaintenance: '',
        decriptionMaintenance: '',
        maintenancePrice: '',
        repairerId: '',
    });

    //Hàm xử lý validation Form
    const validateForm = () => {
        const errors = {
            reasonMaintenance: '',
            decriptionMaintenance: '',
            maintenancePrice: '',
            repairerId: '',
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
        if (newMnHisData.repairerId === '') {
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
                    <h2>THÊM MỚI PHIẾU BẢO DƯỠNG</h2>
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

                            <div className={cx('input-group')}>
                                <label>Đơn vị bảo dưỡng</label>
                                <select
                                    name="repairerId"
                                    value={newMnHisData.repairerId}
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
                        <div className={cx('group-left')}>
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
                            <button onClick={handleAddMnHis}>Thêm</button>
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
