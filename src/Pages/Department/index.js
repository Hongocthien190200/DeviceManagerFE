import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllDepartment, updateDepartment, postNewDepartment } from "../../redux/apiRequest";
import NotiSucces from '../../Components/Notification/notisuccess';
import NotiFailed from '../../Components/Notification/notifailed';
import Blockuser from '../../Components/Layout/components/Block';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';
import styles from './Department.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Department() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let state = useSelector((state) => state.departments.department);

    let departments = [];
    if (state && state.listdepartments) {
        departments = state.listdepartments;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [validationError, setValidationError] = useState("");

    // Hàm xử lý khi người dùng mở modal thêm mới
    const handleOpenModal = () => {
        setIsModalOpen(true);
        setNewDepartmentName("");
        setSelectedDepartmentId(null);
    }

    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setValidationError("");
    }

    // Hàm xử lý khi người dùng ấn nút "Sửa"
    const handleOpenUpdateModal = (departmentId, departmentName) => {
        setSelectedDepartmentId(departmentId);
        setNewDepartmentName(departmentName);
        setIsModalOpen(true);
    }

    // Hàm xử lý khi người dùng ấn nút "Lưu"
    const handleSaveDepartment = async () => {
        if (!newDepartmentName) {
            setValidationError("*Vui lòng không bỏ trống");
            return;
        }

        if (selectedDepartmentId) {
            // Kiểm tra xem giá trị đã thay đổi so với ban đầu
            const originalDepartment = departments.find(department => department._id === selectedDepartmentId);
            if (originalDepartment && originalDepartment.departmentName === newDepartmentName) {
                setIsModalOpen(false);
                errCallback();
                setValidationError("");
                return;
            }
            // Gọi hàm updateCategory khi cần cập nhật phân loại
            const newData = { departmentName: newDepartmentName };
            await updateDepartment(selectedDepartmentId, newData, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
        } else {
            // Gọi hàm postNewCategory khi cần thêm mới phân loại
            const newData = { departmentName: newDepartmentName };
            await postNewDepartment(newData, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
        }
        setNewDepartmentName("");
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
        await getAllDepartment(user?.accessToken,dispatch, axiosJWT);
        setIsModalOpen(false);
        setIsNotiSucces(true);
    }
    const errCallback = () => {
        setIsModalOpen(false);
        setIsNotiFailed(true);
    }

    useEffect(() => {
        if (user?.accessToken&&user.admin) {
            getAllDepartment(user?.accessToken,dispatch, axiosJWT);
        }
    }, []);

    return (
        user.admin ? (
            <>
                <div className={cx('category-container')}>
                    <div className={cx('category-wrap')}>
                        <h1>Danh sách vị trí/phòng ban</h1>
                        <button className={cx('add-button')} onClick={handleOpenModal}>Thêm mới</button>
                        <div className={cx('category-list')}>
                            {departments.map(department => (
                                <div key={department._id} className={cx('category-item')}>
                                    <span>{department.departmentName}</span>
                                    <button
                                        className={cx('edit-button')}
                                        onClick={() => handleOpenUpdateModal(department._id, department.departmentName)}
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
                                <h2>{selectedDepartmentId ? "Sửa phân loại" : "Tạo mới phân loại"}</h2>
                                <input
                                    type="text"
                                    value={newDepartmentName}
                                    onChange={(e) => setNewDepartmentName(e.target.value)}
                                    placeholder="Nhập tên phân loại"
                                />
                                <span className={cx('validation-error')}>{validationError}</span>
                                <div className={cx('group-button')}>
                                    <button className={cx('cancel-button')} onClick={handleCloseModal}>
                                        Hủy
                                    </button>
                                    <button className={cx('create-button')} onClick={handleSaveDepartment}>
                                        {selectedDepartmentId ? "Lưu" : "Thêm"}
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

export default Department;
