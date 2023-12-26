import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import styles from './DevicesByIdModal.module.scss';
import classNames from 'classnames/bind';

import { getAllDepartment, getAllStatus, getAllLocation, updateDevice } from "../../../../redux/apiRequest";

const cx = classNames.bind(styles);

function DeviceByIdModal({ device, setIsNotiSucces, setIsModalOpen, setIsNotiFailed, handleCloseModal, getDeviceById, user, axiosJWT }) {
    const dispatch = useDispatch();
    let stateLocations = useSelector((state) => state.locations.location);
    let statesTatuses = useSelector((state) => state.statuses.status);
    let stateDepartment = useSelector((state) => state.departments.department);
    const [newDeviceData, setNewDeviceData] = useState({
        deviceName: device.deviceName,//Tên
        deviceCode: device.deviceCode,//Mã
        deviceImg: device.deviceImg,//Hình
        emloyeE: device.emloyeE,//người sử dụng
        locationId: device.locationId,//khu vực
        departmentId: device.departmentId,//phòng ban Nơi sử dụng
        maintenanceSchedule: device.maintenanceSchedule,//định kỳ bảo dưỡng
        statusId: device.statusId,/// trạng thái 
        note: device.note,//Ghi chú
        desCription: device.desCription,//mô tả/bảo hành
    });

    let locations = [];
    if (stateLocations && stateLocations.listlocations) {
        locations = stateLocations.listlocations;
    }
    let statuses = [];
    if (statesTatuses && statesTatuses.liststatuses) {
        statuses = statesTatuses.liststatuses;
    }
    let departments = [];
    if (stateDepartment && stateDepartment.listdepartments) {
        departments = stateDepartment.listdepartments;
    }
    // Hàm xử lý khi người dùng thay đổi giá trị trong modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericValue = ["maintenanceSchedule"].includes(name) ? parseFloat(value) : value;
        setNewDeviceData({
            ...newDeviceData,
            [name]: numericValue
        });

    }
    //  Các hàm xử lý khi người dùng ấn nút "Thêm"
    const errCallback = () => {
        setIsModalOpen(false);
        setIsNotiFailed(true);
    }

    const successCallback = async () => {
        setIsModalOpen(false);
        setIsNotiSucces(true);
    }

    const handleUpdateDevice = async () => {
        if (validateForm()) {
            const changedFields = getChangedFields();
            if (Object.keys(changedFields).length > 0) {
                await updateDevice(device.id, changedFields, dispatch, successCallback, user?.accessToken, axiosJWT);
                await getDeviceById(device.id, dispatch, user?.accessToken, axiosJWT);
            }
            else {
                errCallback();
            }
        }

    }
    //hàm kiểm tra giá trị thay đổi
    const getChangedFields = () => {
        const changedFields = {};

        for (const key in newDeviceData) {
            // So sánh giá trị mới với giá trị ban đầu
            if (newDeviceData[key] !== device[key]) {
                changedFields[key] = newDeviceData[key];
            }
        }

        return changedFields;
    };

    const [formErrors, setFormErrors] = useState({
        deviceName: '',
        deviceCode: '',
        deviceImg: '',
        maintenanceSchedule: '',
        locationId: '',
        statusId: '',
    });
    const validateForm = () => {
        const errors = {
            deviceName: '',
            deviceCode: '',
            deviceImg: '',
            maintenanceSchedule: '',
            locationId: '',
            statusId: '',
        };

        let hasErrors = false;

        // Kiểm tra các trường bắt buộc
        if (newDeviceData.deviceName === "") {
            errors.deviceName = 'Bạn vui lòng không để trống trường này';
            hasErrors = true;
        }
        if (newDeviceData.deviceCode === "") {
            errors.deviceCode = 'Bạn vui lòng không để trống trường này';
            hasErrors = true;
        }
        if (newDeviceData.deviceImg === "") {
            errors.deviceImg = 'Bạn vui lòng không để trống trường này';
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
        setFormErrors(errors);
        return !hasErrors;
    };
    useEffect(() => {
        getAllDepartment(user?.accessToken, dispatch, axiosJWT);
        getAllStatus(user?.accessToken, dispatch, axiosJWT);
        getAllLocation(user?.accessToken, dispatch, axiosJWT);
    }, [])

    return (
        <div className={cx('modal-container')}>
            <div className={cx('modal')}>
                <div className={cx('modal-content')}>
                    <h2>Chỉnh sửa thông tin tài sản</h2>
                    <button className={cx('close-button')} onClick={handleCloseModal}>
                        <i className={cx('fa-solid fa-times')} />
                    </button>
                    <form>
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
                            <label>Link hình ảnh</label>
                            <input
                                type="text"
                                name="deviceImg"
                                value={newDeviceData.deviceImg}
                                onChange={handleInputChange}
                            />
                            <div className={cx('error-message')}>{formErrors.deviceImg}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Người sử dụng</label>
                            <input
                                type="text"
                                name="emloyeE"
                                value={newDeviceData.emloyeE}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Khu vực</label>
                            <select
                                name="locationId"
                                value={newDeviceData.locationId}
                                onChange={handleInputChange}
                            >
                                {locations.map((location, index) => (
                                    <option key={index} value={location._id}>
                                        {location.locationName}
                                    </option>
                                ))}
                            </select>
                            <div className={cx('error-message')}>{formErrors.locationId}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Phòng ban/Nơi sử dụng</label>
                            <select
                                name="departmentId"
                                value={newDeviceData.departmentId}
                                onChange={handleInputChange}
                            >
                                {departments.map((department, index) => (
                                    <option key={index} value={department._id}>
                                        {department.departmentName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Chu kỳ bảo dưỡng (Nhập số ngày)</label>
                            <input
                                type="number"
                                name="maintenanceSchedule"
                                value={newDeviceData.maintenanceSchedule}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Trạng thái</label>
                            <select
                                name="statusId"
                                value={newDeviceData.statusId}
                                onChange={handleInputChange}
                            >
                                {statuses.map((status, index) => (
                                    <option key={index} value={status._id}>
                                        {status.statusName}
                                    </option>
                                ))}
                            </select>
                            <div className={cx('error-message')}>{formErrors.statusId}</div>
                        </div>
                        <div className={cx('input-group')}>
                            <label>Ghi chú</label>
                            <textarea
                                className={cx('input-group-textarea')}
                                type="text"
                                name="note"
                                value={newDeviceData.note}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Mô tả/Bảo hành</label>
                            <textarea
                                className={cx('input-group-textarea')}
                                type="text"
                                name="desCription"
                                value={newDeviceData.desCription}
                                onChange={handleInputChange}
                            />
                        </div>

                    </form>
                    <div className={cx('button-group')}>
                        <div className={cx('input-group')}>
                            <button onClick={handleUpdateDevice}>Sửa</button>
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

export default DeviceByIdModal;
