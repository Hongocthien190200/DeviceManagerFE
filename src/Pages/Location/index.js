import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllLocation, updateLocation, postNewLocation } from "../../redux/apiRequest";
import NotiSucces from '../../Components/Notification/notisuccess';
import NotiFailed from '../../Components/Notification/notifailed';
import Blockuser from '../../Components/Layout/components/Block';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';

import styles from './Location.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Location() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let state = useSelector((state) => state.locations.location);

    let locations = [];
    if (state && state.listlocations) {
        locations = state.listlocations;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLocationName, setNewLocationName] = useState("");
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [validationError, setValidationError] = useState("");

    // Hàm xử lý khi người dùng mở modal thêm mới
    const handleOpenModal = () => {
        setIsModalOpen(true);
        setNewLocationName("");
        setSelectedLocationId(null);
    }

    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setValidationError("");
    }

    // Hàm xử lý khi người dùng ấn nút "Sửa"
    const handleOpenUpdateModal = (locationId, locationName) => {
        setSelectedLocationId(locationId);
        setNewLocationName(locationName);
        setIsModalOpen(true);
    }

    // Hàm xử lý khi người dùng ấn nút "Lưu"
    const handleSaveLocation = async () => {
        if (!newLocationName) {
            setValidationError("*Vui lòng không bỏ trống");
            return;
        }

        if (selectedLocationId) {
            // Kiểm tra xem giá trị đã thay đổi so với ban đầu
            const originalLocation = locations.find(location => location._id === selectedLocationId);
            if (originalLocation && originalLocation.locationName === newLocationName) {
                setIsModalOpen(false);
                errCallback();
                setValidationError("");
                return;
            }
            // Gọi hàm updateLocation khi cần cập nhật vị trí
            const newData = { locationName: newLocationName };
            await updateLocation(selectedLocationId, newData, dispatch, successCallback, errCallback,user?.accessToken, axiosJWT);
        } else {
            // Gọi hàm postNewLocation khi cần thêm mới vị trí
            const newData = { locationName: newLocationName };
            await postNewLocation(newData, dispatch, successCallback, errCallback,user?.accessToken, axiosJWT);
        }
        setNewLocationName("");
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
        await getAllLocation(user?.accessToken,dispatch, axiosJWT);
        setIsModalOpen(false);
        setIsNotiSucces(true);
    }
    const errCallback = () => {
        setIsModalOpen(false);
        setIsNotiFailed(true);
    }

    useEffect(() => {
        if (user?.accessToken&&user.admin) {
            getAllLocation(user?.accessToken,dispatch, axiosJWT);
        }
    }, []);

    return (
        user.admin ? (
            <>
                <div className={cx('location-container')}>
                    <div className={cx('location-wrap')}>
                        <h1>Danh sách vị trí tài sản nội bộ</h1>
                        <button className={cx('add-button')} onClick={handleOpenModal}>Thêm mới</button>
                        <div className={cx('location-list')}>
                            {locations.map(location => (
                                <div key={location._id} className={cx('location-item')}>
                                    <span>{location.locationName}</span>
                                    <button
                                        className={cx('edit-button')}
                                        onClick={() => handleOpenUpdateModal(location._id, location.locationName)}
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
                                <h2>{selectedLocationId ? "Sửa vị trí" : "Tạo mới vị trí"}</h2>
                                <input
                                    type="text"
                                    value={newLocationName}
                                    onChange={(e) => setNewLocationName(e.target.value)}
                                    placeholder="Nhập tên vị trí"
                                />
                                <span className={cx('validation-error')}>{validationError}</span>
                                <div className={cx('group-button')}>
                                    <button className={cx('cancel-button')} onClick={handleCloseModal}>
                                        Hủy
                                    </button>
                                    <button className={cx('create-button')} onClick={handleSaveLocation}>
                                        {selectedLocationId ? "Lưu" : "Thêm"}
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

export default Location;
