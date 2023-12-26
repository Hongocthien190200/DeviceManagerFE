import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Pagination from '../../Components/Pagination';
import * as XLSX from 'xlsx';
import { getAllRpHis, getAllRepairer } from "../../redux/apiRequest";
import formatNumber from '../../Components/func/formatvnd';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';

import styles from './RpHistory.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function RepairHistory() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let stateRepairHistory = useSelector((state) => state.repairhistories.allrepair);
    let stateRepairers = useSelector((state) => state.repairers.repairer);

    let repairHistories = [];
    if (stateRepairHistory && stateRepairHistory.listall) {
        repairHistories = stateRepairHistory.listall;
    }
    let repairers = [];
    if (stateRepairers && stateRepairers.listrepairers) {
        repairers = stateRepairers.listrepairers;
    }

    const [sortOrder, setSortOrder] = useState('newest'); // Hướng sắp xếp: Mới nhất hoặc Cũ nhất
    const [selectedRepairer, setSelectedRepairer] = useState('all'); // Lọc theo đơn vị bảo dưỡng
    const [selectedMonth, setSelectedMonth] = useState(''); //Theo tháng
    const [selectedYear, setSelectedYear] = useState(''); //Theo năm
    //CHuyển đổi thời gian đầu vào
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    }
    //Chọn thời gian theo tháng/năm :
    const handleFilterByMonthYear = (e) => {
        const { name, value } = e.target;
        if (name === 'month') {
            setSelectedMonth(value);
        } else if (name === 'year') {
            setSelectedYear(value);
        }
    };
    // Logic để lọc và sắp xếp dữ liệu tùy theo các lựa chọn
    const filteredRepairHistory = repairHistories.filter((repairHis) => {
        const isRepairerMatch = selectedRepairer === 'all' || repairHis.repairerName === selectedRepairer;
        const isMonthMatch = selectedMonth === '' || new Date(repairHis.createdAt).getMonth() + 1 === parseInt(selectedMonth);
        const isYearMatch = selectedYear === '' || new Date(repairHis.createdAt).getFullYear() === parseInt(selectedYear);

        return isRepairerMatch && isMonthMatch && isYearMatch;
    });

    const sortedRepairHistories = [...filteredRepairHistory].sort((a, b) => {
        // Sắp xếp dựa trên hướng sắp xếp (newest hoặc oldest)
        if (sortOrder === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });
    //Phân trang 
    const itemsPerPage = 16; // Số lượng mục trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedRepairHistories.slice(indexOfFirstItem, indexOfLastItem);
    //In tài liệu
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
        XLSX.utils.book_append_sheet(wb, ws, 'Lịch sử sửa chữa');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Lịch sử sửa chữa.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }
    const handleData = () => {
        return sortedRepairHistories.map(function (item) {
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
    useEffect(() => {
        if (user?.accessToken) {
            getAllRpHis(dispatch, user?.accessToken, axiosJWT);
            getAllRepairer(dispatch, user?.accessToken, axiosJWT);
        }
    }, [])
    return (
        <div className={cx('repair')}>
            <div className={cx('toolbar')}>
                <div className={cx('select-container')}>
                    <label htmlFor="sort-select">Sắp xếp theo ngày:</label>
                    <select
                        id="sort-select"
                        className={cx('filter-select')}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Mới nhất - Cũ</option>
                        <option value="oldest">Cũ nhất - Mới</option>
                    </select>
                </div>
                <div className={cx('select-container')}>
                    <label htmlFor="month-select">Chọn tháng:</label>
                    <select
                        id="month-select"
                        className={cx('filter-select')}
                        name="month"
                        value={selectedMonth}
                        onChange={handleFilterByMonthYear}
                    >
                        <option value="">Tất cả</option>
                        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={cx('select-container')}>
                    <label htmlFor="year-select">Chọn năm:</label>
                    <select
                        id="year-select"
                        className={cx('filter-select')}
                        name="year"
                        value={selectedYear}
                        onChange={handleFilterByMonthYear}
                    >
                        <option value="">Tất cả</option>
                        {Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={cx('select-container')}>
                    <label htmlFor="repairer-select">Sắp xếp theo đơn vị bảo dưỡng:</label>
                    <select
                        id="repairer-select"
                        className={cx('filter-select')}
                        value={selectedRepairer}
                        onChange={(e) => setSelectedRepairer(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        {repairers.map((repairer, index) => (
                            <option key={index} value={repairer.repairerName}>
                                {repairer.repairerName}
                            </option>
                        ))}
                    </select>
                </div>
                <button className={cx('export-button')} onClick={handleExportToExcel}><i className={cx('fa-solid fa-file-excel')} />In</button>
            </div>

            <div className={cx('repair-list')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>Tên tài sản</th>
                            <th>Mã</th>
                            <th>Yêu cầu</th>
                            <th>Mô tả</th>
                            <th>Chi phí</th>
                            <th>Đơn vị sửa chữa</th>
                            <th>Địa chỉ</th>
                            <th>Sđt</th>
                            <th>Thời gian tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((repairHis, index) => (
                            <tr key={index}>
                                <td>{repairHis.deviceName}</td>
                                <td>{repairHis.deviceCode}</td>
                                <td>{repairHis.reasonRepair}</td>
                                <td>{repairHis.decriptionRepair}</td>
                                <td>{formatNumber(repairHis.repairPrice)}</td>
                                <td>{repairHis.repairerName}</td>
                                <td>{repairHis.repairerAddress}</td>
                                <td>{repairHis.repairerPhone}</td>
                                <td>{formatDate(repairHis.createdAt)}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    listItem={sortedRepairHistories}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}

export default RepairHistory;
