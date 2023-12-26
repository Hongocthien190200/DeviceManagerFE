import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllRepairer, updateRepairer, postNewRepairer } from "../../redux/apiRequest";
import NotiSucces from '../../Components/Notification/notisuccess';
import NotiFailed from '../../Components/Notification/notifailed';
import Blockuser from '../../Components/Layout/components/Block';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';

import styles from './Repairer.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Repairer() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let state = useSelector((state) => state.repairers.repairer);

    let repairers = [];
    if (state && state.listrepairers) {
        repairers = state.listrepairers;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRepairerName, setNewRepairerName] = useState("");
    const [newRepairerDeputy, setNewRepairerDeputy] = useState("");
    const [newRepairerAddress, setNewRepairerAddress] = useState("");
    const [newRepairerPhone, setNewRepairerPhone] = useState("");
    const [selectedRepairerId, setSelectedRepairerId] = useState(null);
    const [validationError, setValidationError] = useState("");

    // Hàm xử lý khi người dùng mở modal thêm mới
    const handleOpenModal = () => {
        setIsModalOpen(true);
        setNewRepairerName("");
        setNewRepairerDeputy("");
        setNewRepairerAddress("");
        setNewRepairerPhone("");
        setSelectedRepairerId(null);
    }

    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setValidationError("");
    }

    // Hàm xử lý khi người dùng ấn nút "Sửa"
    const handleOpenUpdateModal = (repairerId, repairerName, repairerDeputy, repairerAddress, repairerPhone) => {
        setSelectedRepairerId(repairerId);
        setNewRepairerName(repairerName);
        setNewRepairerDeputy(repairerDeputy);
        setNewRepairerAddress(repairerAddress);
        setNewRepairerPhone(repairerPhone);
        setIsModalOpen(true);
    }

    // Hàm xử lý khi người dùng ấn nút "Lưu"
    const handleSaveRepairer = async () => {
        if (!newRepairerName || !newRepairerDeputy || !newRepairerAddress || !newRepairerPhone) {
            setValidationError("*Vui lòng không bỏ trống");
            return;
        }

        if (selectedRepairerId) {
            // Kiểm tra xem giá trị đã thay đổi so với ban đầu
            const originalRepairer = repairers.find(repairer => repairer._id === selectedRepairerId);
            if (
                originalRepairer &&
                originalRepairer.repairerName === newRepairerName &&
                originalRepairer.repairerDeputy === newRepairerDeputy &&
                originalRepairer.repairerAddress === newRepairerAddress &&
                originalRepairer.repairerPhone === newRepairerPhone
            ) {
                setIsModalOpen(false);
                errCallback();
                setValidationError("");
                return;
            }
            // Gọi hàm updateRepairer khi cần cập nhật đơn vị bảo dưỡng/sửa chữa
            const newData = {
                repairerName: newRepairerName,
                repairerDeputy: newRepairerDeputy,
                repairerAddress: newRepairerAddress,
                repairerPhone: newRepairerPhone,
            };
            await updateRepairer(selectedRepairerId, newData, dispatch, successCallback, errCallback,user?.accessToken, axiosJWT);
        } else {
            // Gọi hàm postNewRepairer khi cần thêm mới đơn vị bảo dưỡng/sửa chữa
            const newData = {
                repairerName: newRepairerName,
                repairerDeputy: newRepairerDeputy,
                repairerAddress: newRepairerAddress,
                repairerPhone: newRepairerPhone,
            };
            await postNewRepairer(newData, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
        }
        setNewRepairerName("");
        setNewRepairerDeputy("");
        setNewRepairerAddress("");
        setNewRepairerPhone("");
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
        await getAllRepairer(dispatch,user?.accessToken, axiosJWT);
        setIsModalOpen(false);
        setIsNotiSucces(true);
    }

    const errCallback = () => {
        setIsModalOpen(false);
        setIsNotiFailed(true);
    }

    useEffect(() => {
        if (user?.accessToken&&user.admin) {
            getAllRepairer(dispatch,user?.accessToken, axiosJWT);
        }
    }, []);

    return (
        user.admin ? (
            <>
                <div className={cx('repairer-container')}>
                    <div className={cx('repairer-wrap')}>
                        <h1>Danh sách đơn vị bảo dưỡng/sửa chữa tài sản nội bộ</h1>
                        <button className={cx('add-button')} onClick={handleOpenModal}>Thêm mới</button>
                        <div className={cx('repairer-list')}>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th>Tên</th>
                                        <th>Đại diện</th>
                                        <th>Địa chỉ</th>
                                        <th>Số điện thoại</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {repairers.map((repairer, index) => (
                                        <tr key={index}>
                                            <td>{repairer.repairerName}</td>
                                            <td>{repairer.repairerDeputy}</td>
                                            <td>{repairer.repairerAddress}</td>
                                            <td>{repairer.repairerPhone}</td>
                                            <td>
                                                <button
                                                    className={cx('edit-button')}
                                                    onClick={() =>
                                                        handleOpenUpdateModal(
                                                            repairer._id,
                                                            repairer.repairerName,
                                                            repairer.repairerDeputy,
                                                            repairer.repairerAddress,
                                                            repairer.repairerPhone
                                                        )
                                                    }
                                                >
                                                    <i className={cx('fa-solid fa-pen-to-square')} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {isModalOpen && (
                        <div className={cx('modal-overlay')}>
                            <div className={cx('modal-create')}>
                                <button className={cx('close-button')} onClick={handleCloseModal}>
                                    <i className={cx("fa-solid fa-times")} />
                                </button>
                                <h2>{selectedRepairerId ? "Sửa đơn vị bảo dưỡng/sửa chữa" : "Tạo mới đơn vị bảo dưỡng/sửa chữa"}</h2>
                                <input
                                    type="text"
                                    value={newRepairerName}
                                    onChange={(e) => setNewRepairerName(e.target.value)}
                                    placeholder="Nhập tên đơn vị bảo dưỡng/sửa chữa"
                                />
                                <input
                                    type="text"
                                    value={newRepairerDeputy}
                                    onChange={(e) => setNewRepairerDeputy(e.target.value)}
                                    placeholder="Nhập tên phụ trách"
                                />
                                <input
                                    type="text"
                                    value={newRepairerAddress}
                                    onChange={(e) => setNewRepairerAddress(e.target.value)}
                                    placeholder="Nhập địa chỉ"
                                />
                                <input
                                    type="text"
                                    value={newRepairerPhone}
                                    onChange={(e) => setNewRepairerPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                />
                                <span className={cx('validation-error')}>{validationError}</span>
                                <div className={cx('group-button')}>
                                    <button className={cx('cancel-button')} onClick={handleCloseModal}>
                                        Hủy
                                    </button>
                                    <button className={cx('create-button')} onClick={handleSaveRepairer}>
                                        {selectedRepairerId ? "Lưu" : "Thêm"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {isNotiSucces && <NotiSucces handleCloseSuccessModal={handleCloseSuccessModal} />}
                {isNotiFailed && <NotiFailed handleCloseFailedModal={handleCloseFailedModal} />}
            </>
        ) : (
            <Blockuser />
        )
    );
}

export default Repairer;
