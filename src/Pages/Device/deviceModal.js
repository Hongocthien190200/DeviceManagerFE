import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllEmloyee, postNewDevice } from "../../redux/apiRequest";

import styles from './Devices.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function DeviceModal({ setIsNotiSucces, setIsModalOpen, handleCloseModal, statuses, categories, locations, getAllDevice, user, axiosJWT, departments, units }) {
    const dispatch = useDispatch();
    const [newDeviceData, setNewDeviceData] = useState({
        deviceName: '',
        deviceCode: '',
        deviceImg: '',
        maintenanceSchedule: '',
        lastMaintenanceDate: '',
        depreciation: '',
        emloyeE: '',
        modelSeri: '',
        yearofMn: '',
        yearofUse: '',
        desCription: '',
        note: '',
        price: '',
        unitId: '',
        departmentId: '',
        locationId: '',
        statusId: '',
        categoryId: '',
    });
    // Hàm xử lý khi người dùng thay đổi giá trị trong modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericValue = ["maintenanceSchedule"].includes(name) ? parseFloat(value) : value;
        setNewDeviceData({
            ...newDeviceData,
            [name]: numericValue
        });
    }
    // Hàm xử lý khi người dùng ấn nút "Thêm"
    const errCallback = () => {
        const errors = { deviceCode: 'Mã thiết bị đã tồn tại!' }
        setFormErrors(errors)
    }
    const successCallback = async () => {
        setIsModalOpen(false);
        setIsNotiSucces(true);
    }
    const handleAddDevice = async () => {
        console.log(newDeviceData)
        if (validateForm()) {
            console.log(newDeviceData)
            await postNewDevice(newDeviceData, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
            await getAllDevice(user?.accessToken, dispatch, axiosJWT);
        }
    }

    //Thêm State thông báo trạng thái lỗi
    const isDateValid = (dateString) => {
        const selectedDate = new Date(dateString);
        const currentDate = new Date();
        return selectedDate <= currentDate;
    };

    const [formErrors, setFormErrors] = useState({
        deviceName: '',
        deviceCode: '',
        deviceImg: '',
        maintenanceSchedule: '',
        lastMaintenanceDate: '',
        depreciation: '',
        locationId: '',
        statusId: '',
        categoryId: '',
    });

    //Hàm xử lý validation Form
    const validateForm = () => {
        const errors = {
            deviceName: '',
            deviceCode: '',
            deviceImg: '',
            maintenanceSchedule: '',
            lastMaintenanceDate: '',
            depreciation: '',
            locationId: '',
            statusId: '',
            categoryId: '',
        };

        let hasErrors = false;

        // Kiểm tra các trường bắt buộc
        if (!newDeviceData.deviceName) {
            errors.deviceName = 'Bạn vui lòng không để trống trường này';
            hasErrors = true;
        }
        if (!newDeviceData.deviceCode) {
            errors.deviceCode = 'Bạn vui lòng không để trống trường này';
            hasErrors = true;
        }
        if (newDeviceData.maintenanceSchedule < 0) {
            errors.maintenanceSchedule = 'Bạn vui lòng nhập số ngày lớn hơn 0';
            hasErrors = true;
        }
        if (!isDateValid(newDeviceData.lastMaintenanceDate) && newDeviceData.lastMaintenanceDate !== "") {
            errors.lastMaintenanceDate = 'Thời gian bạn chọn đã quá thời gian hiện tại';
            hasErrors = true;
        }
        if (newDeviceData.locationId === '') {
            errors.locationId = 'Bạn vui lòng chọn một vị trí';
            hasErrors = true;
        }
        if (newDeviceData.statusId === '') {
            errors.statusId = 'Bạn vui lòng chọn một trạng thái';
            hasErrors = true;
        }
        if (newDeviceData.categoryId === '') {
            errors.categoryId = 'Bạn vui lòng chọn một phân loại';
            hasErrors = true;
        }
        setFormErrors(errors);
        return !hasErrors;
    };
    return (
        <div className={cx('modal-container')}>
            <div className={cx('modal')}>
                <div className={cx('modal-content')}>
                    <h2>THÊM MỚI THIẾT BỊ</h2>
                    <button className={cx('close-button')} onClick={handleCloseModal}>
                        <i className={cx('fa-solid fa-times')} />
                    </button>
                    <form>
                        <div className={cx('input-group')}>
                            <label>Phân loại</label>
                            <select
                                name="categoryId"
                                value={newDeviceData.categoryId}
                                onChange={handleInputChange}
                            >
                                <option value="">--- Chọn loại thiết bị ---</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category._id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                            <div className={cx('error-message')}>{formErrors.categoryId}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Mã thiết bị</label>
                            <input
                                type="text"
                                name="deviceCode"
                                value={newDeviceData.deviceCode}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.deviceCode}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Tên thiết bị</label>
                            <input
                                type="text"
                                name="deviceName"
                                value={newDeviceData.deviceName}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.deviceName}</div>
                        </div>

                        <div className={cx('input-group')}>
                            <label>Đơn vị tính</label>
                            <select
                                name="unitId"
                                value={newDeviceData.unitId}
                                onChange={handleInputChange}
                            >
                                <option value="">--- Chọn ĐVT ---</option>
                                {units.map((unit, index) => (
                                    <option key={index} value={unit._id}>
                                        {unit.unitName}
                                    </option>
                                ))}
                            </select>
                            <div className={cx('error-message')}>{formErrors.categoryId}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Nhân viên sử dụng</label>
                            <input
                                type="text"
                                name="emloyeE"
                                value={newDeviceData.emloyeE}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Model/Seri</label>
                            <input
                                type="text"
                                name="modelSeri"
                                value={newDeviceData.modelSeri}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Link hình ảnh</label>
                            <input
                                type="text"
                                name="deviceImg"
                                value={newDeviceData.deviceImg}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Vị trí</label>
                            <select
                                name="locationId"
                                value={newDeviceData.locationId}
                                onChange={handleInputChange}
                            >
                                <option value="">--- Chọn vị trí ---</option>
                                {locations.map((location, index) => (
                                    <option key={index} value={location._id}>
                                        {location.locationName}
                                    </option>
                                ))}
                            </select>
                            <div className={cx('error-message')}>{formErrors.locationId}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Nơi sử dụng</label>
                            <select
                                name="departmentId"
                                value={newDeviceData.departmentId}
                                onChange={handleInputChange}
                            >
                                <option value="">--- Chọn vị trí sử dụng ---</option>
                                {departments.map((department, index) => (
                                    <option key={index} value={department._id}>
                                        {department.departmentName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Năm sản xuất</label>
                            <input
                                type="text"
                                name="yearofMn"
                                value={newDeviceData.yearofMn}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Năm sử dụng</label>
                            <input
                                type="text"
                                name="yearofUse"
                                value={newDeviceData.yearofUse}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.deviceImg}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Ghi chú</label>
                            <input
                                type="text"
                                name="note"
                                value={newDeviceData.note}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.deviceImg}</div>
                        </div>

                        <div className={cx('input-group')}>
                            <label>Khoảng thời gian khấu hao</label>
                            <input
                                type="text"
                                name="depreciation"
                                value={newDeviceData.depreciation}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.depreciation}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Giá mua</label>
                            <input
                                type="text"
                                name="price"
                                value={newDeviceData.price}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.deviceImg}</div>
                        </div>
                        {/* Kỳ bảo dưỡng tiếp theo */}
                        <div className={cx('input-group')}>
                            <label>Chu kỳ bảo dưỡng (Nhập số ngày)</label>
                            <input
                                type="number"
                                name="maintenanceSchedule"
                                value={newDeviceData.maintenanceSchedule}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.maintenanceSchedule}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Lần cuối bảo dưỡng</label>
                            <input
                                type="date"
                                name="lastMaintenanceDate"
                                value={newDeviceData.lastMaintenanceDate}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.lastMaintenanceDate}</div>
                        </div>
                        {/* LocationId */}

                        <div className={cx('input-group')}>
                            <label>Trạng thái</label>
                            <select
                                name="statusId"
                                value={newDeviceData.statusId}
                                onChange={handleInputChange}
                            >
                                <option value="">--- Chọn trạng thái ---</option>
                                {statuses.map((status, index) => (
                                    <option key={index} value={status._id}>
                                        {status.statusName}
                                    </option>
                                ))}
                            </select>
                            <div className={cx('error-message')}>{formErrors.statusId}</div>
                        </div>


                    </form>
                    <div className={cx('button-group')}>
                        <div className={cx('input-group')}>
                            <button onClick={handleAddDevice}>Thêm</button>
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

export default DeviceModal;
