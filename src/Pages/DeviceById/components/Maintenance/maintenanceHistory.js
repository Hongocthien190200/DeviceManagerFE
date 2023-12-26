import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import CreateMnHis from './CreateMnModal';
import EditMnHis from './EditMnModal';
import Pagination from '../../../../Components/Pagination';
import formatNumber from '../../../../Components/func/formatvnd'

import * as XLSX from 'xlsx';

import styles from './mnHistories.module.scss';
import classNames from 'classnames/bind';

import { getMnHisByIdCurrent } from "../../../../redux/apiRequest";


const cx = classNames.bind(styles);

function MnHistories({ device, listMnById, getMnHisById, setIsNotiFailed, setIsNotiSucces, getDeviceById, user, axiosJWT }) {

    let state = useSelector((state) => state.maintenance.currentMnHis)
    const dispatch = useDispatch();

    let maintenance = {};
    if (state && state.maintenance) {
        maintenance = state.maintenance;
    }

    //format thời gian
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    };

    //Thu gọn Lịch sử bảo dưỡng, phóng to lịch sử bảo dưỡng
    const [isHidden, setIsHidden] = useState(false);
    const toggleHidden = () => {
        setIsHidden(!isHidden);
    }

    //Phân trang
    const itemsPerPage = 10; // Số lượng mục trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    //sắp xếp
    const [sortOrder, setSortOrder] = useState('asc');
    const sortedItems = [...listMnById];
    if (sortOrder === 'asc') {
        sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'desc') {
        sortedItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    //Đóng, mở Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    //In tài liệu:
    function exportToExcel(data) {
        const vietnameseHeaders = {
            deviceName: 'Tên Thiết Bị',
            deviceCode: 'Mã Thiết Bị',
            reasonMaintenance: 'Lý Do Bảo Dưỡng',
            decriptionMaintenance: 'Thông Tin Bảo Dưỡng',
            maintenancePrice: 'Phí Bảo Dưỡng',
            repairerName: 'Tên Đơn Vị Bảo Dưỡng',
            repairerDeputy: 'Người Đại Diện',
            repairerAddress: 'Địa Chỉ Đơn Vị Bảo Dưỡng',
            repairerPhone: 'Số Điện Thoại Đơn Vị',
            createdAt: 'Ngày Tạo Phiếu',
        };
        const vietnameseData = data.map(item => {
            const newItem = {};
            for (const key in item) {
                if (vietnameseHeaders[key]) {
                    newItem[vietnameseHeaders[key]] = item[key];
                } else {
                    newItem[key] = item[key];
                }
            }
            return newItem;
        });
        const ws = XLSX.utils.json_to_sheet(vietnameseData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Lịch sử bảo dưỡng-${device.deviceCode}`);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Lịch sử bảo dưỡng-${device.deviceCode}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    }
    const handleData = () => {
        return sortedItems.map(function (item) {
            return {
                deviceName: item.deviceName,
                deviceCode: item.deviceCode,
                reasonMaintenance: item.reasonMaintenance,
                decriptionMaintenance: item.decriptionMaintenance,
                maintenancePrice: item.maintenancePrice,
                repairerName: item.repairerName,
                repairerDeputy: item.repairerDeputy,
                repairerAddress: item.repairerAddress,
                repairerPhone: item.repairerPhone,
                createdAt: formatDate(item.createdAt),
            }
        })
    }
    const handleExportToExcel = () => {
        const data = handleData()
        exportToExcel(data);
    }
    const [isEditMnOpen, setIsEditMnOpen] = useState(false);
    const handleOpenModalEdit = () => {
        setIsEditMnOpen(true);
    }
    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModalEdit = () => {
        setIsEditMnOpen(false);
    }
    //Các hàm chỉnh sửa một phiếu bảo dưỡng
    const handleEditClick = async (id) => {
        await getMnHisByIdCurrent(id, dispatch, user?.accessToken, axiosJWT)
        handleOpenModalEdit();
    }
    return (
        <div>
            {isModalOpen && (
                <CreateMnHis
                    deviceId={device.id}
                    getMnHisById={getMnHisById}
                    handleCloseModal={handleCloseModal}
                    setIsNotiSucces={setIsNotiSucces}
                    setIsNotiFailed={setIsNotiFailed}
                    setIsModalOpen={setIsModalOpen}
                    getDeviceById={getDeviceById}
                    user={user}
                    axiosJWT={axiosJWT}
                />
            )}
            {isEditMnOpen && (
                <EditMnHis
                    maintenance={maintenance}
                    handleCloseModal={handleCloseModalEdit}
                    setIsNotiSucces={setIsNotiSucces}
                    setIsNotiFailed={setIsNotiFailed}
                    setisEditMnOpen={setIsEditMnOpen}
                    getMnHisById={getMnHisById}
                    deviceId={device.id}
                    user={user}
                    axiosJWT={axiosJWT}
                />
            )
            }
            <div className={cx('mn-container')}>
                <div className={cx('title-mn-container')}>
                    <h3 className={cx('tilte-name')}>Lịch sử bảo dưỡng: {device.deviceName} - {device.deviceCode} </h3>
                    {!isHidden && (
                        <button className={cx('minus-button')} onClick={toggleHidden}><i className={cx('fa-solid fa-minus')} /></button>
                    )}
                    {isHidden && (
                        <button className={cx('minus-button')} onClick={toggleHidden}><i className={cx('fa-solid fa-caret-down')} /></button>
                    )}
                </div>

                <div className={cx('mn-wrap', { hidden: isHidden })}>
                    <div className={cx('toolbar')}>
                        <div className={cx('group-left')}>
                            <button className={cx('add-button')} onClick={handleOpenModal}><i className={cx('fa-solid fa-plus')} />Thêm</button>
                            <button className={cx('export-button')} onClick={handleExportToExcel} ><i className={cx('fa-solid fa-file-excel')} />In</button>
                        </div>
                        <div className={cx('group-right')}>
                            <div className={cx('select-container')}>
                                <label htmlFor="sort-select">Lọc theo thời gian tạo:</label>
                                <select
                                    id="sort-select"
                                    className={cx('filter-select')}
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="asc">Mới nhất</option>
                                    <option value="desc">Cũ nhất</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={cx('device-list')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>Thời gian tạo phiếu</th>
                                    <th>Yêu cầu</th>
                                    <th>Thông tin bảo dưỡng</th>
                                    <th>Phí bảo dưỡng (vnđ)</th>
                                    <th>Đơn vị bảo dưỡng</th>
                                    <th>Người đại diện</th>
                                    <th>Địa chỉ</th>
                                    <th>Số điện thoại</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((mnHstory, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(mnHstory.createdAt)}</td>
                                        <td>{mnHstory.reasonMaintenance}</td>
                                        <td>{mnHstory.decriptionMaintenance}</td>
                                        <td>{formatNumber(mnHstory.maintenancePrice)}</td>
                                        <td>{mnHstory.repairerName}</td>
                                        <td>{mnHstory.repairerDeputy}</td>
                                        <td>{mnHstory.repairerAddress}</td>
                                        <td>{mnHstory.repairerPhone}</td>
                                        <td>
                                            <button className={cx('edit-button')} onClick={() => handleEditClick(mnHstory._id)}><i className={cx("fa-solid fa-pen-to-square")}></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            listItem={listMnById}
                            itemsPerPage={itemsPerPage}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MnHistories;
