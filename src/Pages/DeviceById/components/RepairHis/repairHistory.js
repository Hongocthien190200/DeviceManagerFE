import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import CreateRpHis from './CreateRpModal';
import EditRpHis from './EditRpModal';
import Pagination from '../../../../Components/Pagination';

import * as XLSX from 'xlsx';

import styles from './rpHistories.module.scss';
import classNames from 'classnames/bind';

import { getRpHisByIdCurrent } from "../../../../redux/apiRequest";
import formatNumber from '../../../../Components/func/formatvnd'

const cx = classNames.bind(styles);

function RpHistories({ device, listRpById, getRpHisById, setIsNotiFailed, setIsNotiSucces, user, axiosJWT }) {

    let state = useSelector((state) => state.repairhistories.currentRpHis)
    const dispatch = useDispatch();
    let repairdata = {};
    if (state && state.repairhis) {
        repairdata = state.repairhis;
    }
    //format thời gian
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    }

    //Thu gọn Lịch sử Sửa Chữa, phóng to lịch sử Sửa Chữa
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
    const sortedItems = [...listRpById];
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
            reasonRepair: 'Lý Do Sửa Chữa',
            decriptionRepair: 'Thông Tin Sửa Chữa',
            repairPrice: 'Giá Sửa Chữa',
            repairerName: 'Tên Đơn Vị Sửa Chữa',
            repairerDeputy: 'Người Đại Diện',
            repairerAddress: 'Địa Chỉ Đơn Vị Sửa Chữa',
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
        XLSX.utils.book_append_sheet(wb, ws, `Lịch sử sửa chữa-${device.deviceCode}`);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Lịch sử sửa chữa-${device.deviceCode}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    }
    const handleData = () => {
        return sortedItems.map(function (item) {
            return {
                deviceName: item.deviceName,
                deviceCode: item.deviceCode,
                reasonRepair: item.reasonRepair,
                decriptionRepair: item.decriptionRepair,
                repairPrice: item.repairPrice,
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

    const [isEditRpOpen, setIsEditRpOpen] = useState(false);
    const handleOpenModalEdit = () => {
        setIsEditRpOpen(true);
    }
    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModalEdit = () => {
        setIsEditRpOpen(false);
    }
    //Các hàm chỉnh sửa một phiếu Sửa Chữa
    const handleEditClick = async (id) => {
        await getRpHisByIdCurrent(id, dispatch, user?.accessToken, axiosJWT);
        handleOpenModalEdit();
    }
    return (
        <div>
            {isModalOpen && (
                <CreateRpHis
                    deviceId={device.id}
                    getRpHisById={getRpHisById}
                    handleCloseModal={handleCloseModal}
                    setIsNotiSucces={setIsNotiSucces}
                    setIsNotiFailed={setIsNotiFailed}
                    setIsModalOpen={setIsModalOpen}
                    user={user}
                    axiosJWT={axiosJWT}
                />
            )}
            {isEditRpOpen && (
                <EditRpHis
                    repairdata={repairdata}
                    handleCloseModal={handleCloseModalEdit}
                    setIsNotiSucces={setIsNotiSucces}
                    setIsNotiFailed={setIsNotiFailed}
                    setisEditRpOpen={setIsEditRpOpen}
                    getRpHisById={getRpHisById}
                    deviceId={device.id}
                    user={user}
                    axiosJWT={axiosJWT}
                />
            )}
            <div className={cx('mn-container')}>
                <div className={cx('title-mn-container')}>
                    <h3 className={cx('tilte-name')}>Lịch sử sửa chữa: {device.deviceName} - {device.deviceCode} </h3>
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
                                        <th>Thông tin sửa chữa</th>
                                        <th>Phí sửa chữa (vnđ)</th>
                                        <th>Đơn vị sửa chữa</th>
                                        <th>Người đại diện</th>
                                        <th>Địa chỉ</th>
                                        <th>Số điện thoại</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((rpHstory, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(rpHstory.createdAt)}</td>
                                            <td>{rpHstory.reasonRepair}</td>
                                            <td>{rpHstory.decriptionRepair}</td>
                                            <td>{formatNumber(rpHstory.repairPrice)}</td>
                                            <td>{rpHstory.repairerName}</td>
                                            <td>{rpHstory.repairerDeputy}</td>
                                            <td>{rpHstory.repairerAddress}</td>
                                            <td>{rpHstory.repairerPhone}</td>
                                            <td>
                                                <button className={cx('edit-button')} onClick={() => handleEditClick(rpHstory._id)}><i className={cx("fa-solid fa-pen-to-square")}></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={cx('pagination')}>
                                <Pagination
                                    listItem={listRpById}
                                    itemsPerPage={itemsPerPage}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                />
                            </div>
                        </div>
                    </div>
                
            </div>
        </div>
    )
}

export default RpHistories;
