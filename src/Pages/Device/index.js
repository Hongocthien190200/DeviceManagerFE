import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import DeviceModal from './deviceModal';
import Pagination from '../../Components/Pagination';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import { getAllDevice, getAllCategory, getAllStatus, getAllLocation, getAllDepartment, getAllUnit } from "../../redux/apiRequest";
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';

import styles from './Devices.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Devices() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let stateDevice = useSelector((state) => state.devices.device);
    let stateLocations = useSelector((state) => state.locations.location);
    let stateStatus = useSelector((state) => state.statuses.status);
    let stateCategory = useSelector((state) => state.categories.category);
    let stateDepartment = useSelector((state) => state.departments.department);
    let stateUnit = useSelector((state) => state.units.unit)

    //Xử lý gọi danh sách thiết bị
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    let departments = [];
    if (stateDepartment && stateDepartment.listdepartments) {
        departments = stateDepartment.listdepartments;
    }

    let units = [];
    if (stateUnit && stateUnit.listunits) {
        units = stateUnit.listunits;
    }

    let devices = [];
    if (stateDevice && stateDevice.listdevices) {
        devices = stateDevice.listdevices;
    }

    let locations = [];
    if (stateLocations && stateLocations.listlocations) {
        locations = stateLocations.listlocations;
    }

    let statuses = [];
    if (stateStatus && stateStatus.liststatuses) {
        statuses = stateStatus.liststatuses;
    }
    let categories = [];
    if (stateCategory && stateCategory.listcategories) {
        categories = stateCategory.listcategories;
    }

    //Xử lý thêm mới một thiết bị
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hàm xử lý khi người dùng mở modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    //Sắp xếp - Lọc các thiết bị
    const filteredDevices = devices.filter((device) => {
        const isLocationMatch = selectedLocation === 'all' || device.locationId === selectedLocation;
        const isStatusMatch = selectedStatus === 'all' || device.statusId === selectedStatus;
        const isCategoryMatch = selectedCategory === 'all' || device.categoryId === selectedCategory;
        return isLocationMatch && isStatusMatch && isCategoryMatch;
    });
    //Sắp xếp theo a-z z-a
    const [sortOrder, setSortOrder] = useState('all');
    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    }
    const sortedDevices = [...filteredDevices];
    if (sortOrder === 'asc') {
        sortedDevices.sort((a, b) => a.deviceName.localeCompare(b.deviceName));
    } else if (sortOrder === 'desc') {
        sortedDevices.sort((a, b) => b.deviceName.localeCompare(a.deviceName));
    }
    //Phân trang 
    const itemsPerPage = 20; // Số lượng mục trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedDevices.slice(indexOfFirstItem, indexOfLastItem);

    //CHuyển đổi thời gian đầu vào
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    }
    //Thông báo
    const [isNotiSucces, setIsNotiSucces] = useState(false);
    const handleCloseSuccessModal = () => {
        setIsNotiSucces(false);
    }
    function exportToExcel(data) {
        const vietnameseHeaders = {
            category: "Phân loại",
            deviceCode: "Mã",
            deviceName: "Tên",
            unit: "Đơn vị tính",
            modelSeri: "Model /SN",
            emloyeE: "Người sử dụng",
            location: "Khu vực",
            department: "Phòng/Nơi sử dụng",
            yearofMn: "Năm sản xuất",
            yearofUse: "Năm sử dụng",
            price: "Giá",
            depreciation: "Dự kiến thanh lý",
            status: "Trạng thái",
            nextMaintenance: "Lần bảo dưỡng kế",
            maintenanceStatus: "Hạn bảo dưỡng",
            desCription: "Mô tả/Bảo hành",
            note: "Ghi chú"
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
        XLSX.utils.book_append_sheet(wb, ws, 'DeviceData');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DeviceData.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }
    const handleData = () => {
        return sortedDevices.map(function (item) {
            return {
                category: item.category,
                deviceCode: item.deviceCode,
                deviceName: item.deviceName,
                unit: item.unit,
                modelSeri: item.modelSeri,
                emloyeE: item.emloyeE,
                location: item.location,
                department: item.department,
                yearofMn: item.yearofMn,
                yearofUse: item.yearofUse,
                price: item.price,
                depreciation: item.depreciation,
                status: item.status,
                nextMaintenance: item.nextMaintenance ? formatDate(item.nextMaintenance) : "",
                maintenanceStatus: item.maintenanceStatus ? item.maintenanceStatus : "",
                desCription: item.desCription,
                note: item.note,
            };
        })
    }
    const handleExportToExcel = () => {
        const data = handleData()
        exportToExcel(data);
    }

    //Xử lý phóng to hình ảnh tài sản
    const [hoveredDevice, setHoveredDevice] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const imgRef = useRef(null);

    // Hàm xử lý khi chuột di chuyển vào
    
    const handleMouseEnter = (device) => {
        if(imgRef.current){
            setModalVisible(true)
            setHoveredDevice(device);
        }
    };

    // Hàm xử lý khi chuột di chuyển ra
    const handleMouseLeave = () => {
        setHoveredDevice(null);
        setModalVisible(false)
    };
    //Đóng xử lý phóng to
    useEffect(() => {
        if (user?.accessToken) {
            getAllDevice(user?.accessToken, dispatch, axiosJWT);
            getAllCategory(user?.accessToken, dispatch, axiosJWT);
            getAllStatus(user?.accessToken, dispatch, axiosJWT);
            getAllLocation(user?.accessToken, dispatch, axiosJWT);
            getAllDepartment(user?.accessToken, dispatch, axiosJWT);
            getAllUnit(user?.accessToken, dispatch, axiosJWT);
        }
    }, [])
    return (
        <div className={cx('devices')}>
            <div className={cx('toolbar')}>
                <div className={cx('select-container')}>
                    <h4>LỌC TÀI SẢN:</h4>
                </div>
                <div className={cx('select-container')}>
                    {/* Sắp xếp theo tên */}
                    <select
                        id="sort-select"
                        className={cx('filter-select')}
                        value={sortOrder} // sortOrder là state để theo dõi tùy chọn sắp xếp
                        onChange={handleSortChange} // handleSortChange là hàm xử lý thay đổi sắp xếp
                    >
                        <option value="all"> BẢNG CHỮ CÁI</option>
                        <option value="asc">Từ A-Z</option>
                        <option value="desc">Từ Z-A</option>
                    </select>
                </div>
                <div className={cx('select-container')}>
                    {/* Sắp xếp theo vị trí */}
                    <select
                        id="status-select"
                        className={cx('filter-select')}
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                        <option value="all">VỊ TRÍ --- Tất cả</option>
                        {locations.map((location, index) => (
                            <option key={index} value={location._id}>
                                {location.locationName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={cx('select-container')}>
                    {/* Sắp xếp theo trạng thái */}
                    <select
                        id="location-select"
                        className={cx('filter-select')}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="all">TRẠNG THÁI --- Tất cả</option>
                        {statuses.map((status, index) => (
                            <option key={index} value={status._id}>
                                {status.statusName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={cx('select-container')}>
                    {/* Sắp xếp theo phân loại  */}
                    <select
                        id="category-select"
                        className={cx('filter-select')}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">PHÂN LOẠI --- Tất cả</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category._id}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <button className={cx('add-button')} onClick={handleOpenModal}><i className={cx('fa-solid fa-folder-plus')} />Thêm</button>
                <button className={cx('export-button')} onClick={handleExportToExcel}><i className={cx('fa-solid fa-file-excel')} />In</button>
            </div>

            <div className={cx('device-list')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th className={cx('th-tr-18')}></th>
                            <th className={cx('th-tr-1')}>Nhóm tài sản</th>
                            <th className={cx('th-tr-2')}>Mã</th>
                            <th className={cx('th-tr-3')}>Tên</th>
                            <th className={cx('th-tr-4')}>ĐVT</th>
                            <th className={cx('th-tr-5')}>Model/Seri</th>
                            <th className={cx('th-tr-6')}>Người dùng</th>
                            <th className={cx('th-tr-7')}>Khu vực</th>
                            <th className={cx('th-tr-8')}>Nơi sử dụng</th>
                            <th className={cx('th-tr-9')}>Năm sản xuất</th>
                            <th className={cx('th-tr-10')}>Năm sử dụng</th>
                            <th className={cx('th-tr-11')}>Giá</th>
                            <th className={cx('th-tr-13')}>Thanh lý dự kiến</th>
                            <th className={cx('th-tr-14')}>Tình trạng</th>
                            <th className={cx('th-tr-15')}>Ngày bảo dưỡng</th>
                            <th className={cx('th-tr-16')}>Hạn bảo dưỡng</th>
                            <th className={cx('th-tr-12')}>Mô tả/Bảo hành</th>
                            <th className={cx('th-tr-17')}>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((device, index) => (
                            <tr key={index}>
                                <td className={cx('th-tr-18')}>
                                    <Link to={`/devices/${device.id}`} className={cx('detail-button')}><i className={cx('fa-solid fa-eye')} /></Link>
                                    <button className={cx('detail-button-2', 'imageContainer')}
                                        onMouseEnter={() => handleMouseEnter(device)}
                                        onMouseLeave={handleMouseLeave}
                                        ref={imgRef}
                                    >!</button>
                                </td>
                                <td className={cx('th-tr-1')}>{device.category}</td>
                                <td className={cx('th-tr-2')}>{device.deviceCode}</td>
                                <td className={cx('th-tr-3')}>{device.deviceName}</td>
                                <td className={cx('th-tr-4')}>{device.unit}</td>
                                <td className={cx('th-tr-5')}>{device.modelSeri}</td>
                                <td className={cx('th-tr-6')}>{device.emloyeE}</td>
                                <td className={cx('th-tr-7')}>{device.location}</td>
                                <td className={cx('th-tr-8')}>{device.department}</td>
                                <td className={cx('th-tr-9')}>{device.yearofMn}</td>
                                <td className={cx('th-tr-10')}>{device.yearofUse}</td>
                                <td className={cx('th-tr-11')}>{device.price}</td>
                                <td className={cx('th-tr-13')}>{device.depreciation}</td>
                                <td className={cx('th-tr-14')}>{device.status}</td>
                                <td className={cx('th-tr-15')}>{device.nextMaintenance ? formatDate(device.nextMaintenance) : "Không"}</td>
                                <td className={cx('th-tr-16')}>{device.maintenanceStatus === false ? "Không" : "Đến hạn bảo dưỡng"}</td>
                                <td className={cx('th-tr-12')}>{device.desCription}</td>
                                <td className={cx('th-tr-17')}>{device.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                listItem={sortedDevices}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
            {isModalOpen && (<DeviceModal
                statuses={statuses}
                categories={categories}
                locations={locations}
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                setIsModalOpen={setIsModalOpen}
                setIsNotiSucces={setIsNotiSucces}
                getAllDevice={getAllDevice}
                user={user}
                axiosJWT={axiosJWT}
                departments={departments}
                units={units}
            />)}
            {isNotiSucces && (
                <div className={cx('success-modal')} style={{ display: isNotiSucces ? 'flex' : 'none' }}>
                    <div className={cx('success-modal-content')}>
                        <h2>THÔNG BÁO</h2>
                        <h2>Đã thêm thiết bị thành công</h2>
                        <button className={cx('close-button')} onClick={handleCloseSuccessModal}>
                            <i className={cx('fa-solid fa-times')} />
                        </button>
                    </div>
                </div>
            )}
            {modalVisible && hoveredDevice && (
                <div className={cx('enlarged-image-modal')}>
                    <img
                        src={hoveredDevice.deviceImg}
                        alt={hoveredDevice.deviceName}
                        className={cx('enlarged-image')}
                    />
                </div>
            )}
        </div>
    )
}

export default Devices;
