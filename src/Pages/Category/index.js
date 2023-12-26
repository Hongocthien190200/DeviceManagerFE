import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory, updateCategory, postNewCategory, getAllUnit, updateUnit, postNewUnit } from "../../redux/apiRequest";
import NotiSucces from '../../Components/Notification/notisuccess';
import NotiFailed from '../../Components/Notification/notifailed';
import Blockuser from '../../Components/Layout/components/Block';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';
import styles from './Category.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Category() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let state = useSelector((state) => state.categories.category);
    let stateUnit = useSelector((state) => state.units.unit);

    let categories = [];
    if (state && state.listcategories) {
        categories = state.listcategories;
    }
    let units = [];
    if (stateUnit && stateUnit.listunits) {
        units = stateUnit.listunits;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [validationError, setValidationError] = useState("");

    // Hàm xử lý khi người dùng mở modal thêm mới
    const handleOpenModal = () => {
        setIsModalOpen(true);
        setNewCategoryName("");
        setSelectedCategoryId(null);
    }

    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setValidationError("");
    }

    // Hàm xử lý khi người dùng ấn nút "Sửa"
    const handleOpenUpdateModal = (categoryId, categoryName) => {
        setSelectedCategoryId(categoryId);
        setNewCategoryName(categoryName);
        setIsModalOpen(true);
    }

    // Hàm xử lý khi người dùng ấn nút "Lưu"
    const handleSaveCategory = async () => {
        if (!newCategoryName) {
            setValidationError("*Vui lòng không bỏ trống");
            return;
        }

        if (selectedCategoryId) {
            // Kiểm tra xem giá trị đã thay đổi so với ban đầu
            const originalCategory = categories.find(category => category._id === selectedCategoryId);
            if (originalCategory && originalCategory.categoryName === newCategoryName) {
                setIsModalOpen(false);
                errCallback();
                setValidationError("");
                return;
            }
            // Gọi hàm updateCategory khi cần cập nhật phân loại
            const newData = { categoryName: newCategoryName };
            await updateCategory(selectedCategoryId, newData, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
        } else {
            // Gọi hàm postNewCategory khi cần thêm mới phân loại
            const newData = { categoryName: newCategoryName };
            await postNewCategory(newData, dispatch, successCallback, errCallback, user?.accessToken, axiosJWT);
        }
        setNewCategoryName("");
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
        await getAllCategory(user?.accessToken, dispatch, axiosJWT);
        setIsModalOpen(false);
        setIsNotiSucces(true);
    }
    const errCallback = () => {
        setIsModalOpen(false);
        setIsNotiFailed(true);
    }

    useEffect(() => {
        if (user?.accessToken && user.admin) {
            getAllCategory(user?.accessToken, dispatch, axiosJWT);
            getAllUnit(user?.accessToken, dispatch, axiosJWT);
        }
    }, []);

    return (
        user.admin ? (
            <>
                <div className={cx('group-container')}>
                    <div className={cx('category-container')}>
                        <div className={cx('category-wrap')}>
                            <h1>Danh sách phân loại tài sản nội bộ</h1>
                            <button className={cx('add-button')} onClick={handleOpenModal}>Thêm mới</button>
                            <div className={cx('category-list')}>
                                {categories.map(category => (
                                    <div key={category._id} className={cx('category-item')}>
                                        <span>{category.categoryName}</span>
                                        <button
                                            className={cx('edit-button')}
                                            onClick={() => handleOpenUpdateModal(category._id, category.categoryName)}
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
                                    <h2>{selectedCategoryId ? "Sửa phân loại" : "Tạo mới phân loại"}</h2>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Nhập tên phân loại"
                                    />
                                    <span className={cx('validation-error')}>{validationError}</span>
                                    <div className={cx('group-button')}>
                                        <button className={cx('cancel-button')} onClick={handleCloseModal}>
                                            Hủy
                                        </button>
                                        <button className={cx('create-button')} onClick={handleSaveCategory}>
                                            {selectedCategoryId ? "Lưu" : "Thêm"}
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
                    <div className={cx('category-container','unit-container')}>
                        <div className={cx('category-wrap')}>
                            <h1>Đơn vị tính (Tài sản - Thiết bị )</h1>
                            <div className={cx('category-list')}>
                                {units.map(unit => (
                                    <div key={unit._id} className={cx('category-item')}>
                                        <span>{unit.unitName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </>
        ) : (
            <Blockuser />
        )
    );
}

export default Category;
