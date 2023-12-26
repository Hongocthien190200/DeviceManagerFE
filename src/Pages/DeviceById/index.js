import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import DeviceModalById from './components/DeviceByIdModal/deviceByIdModal';
import MnHistories from './components/Maintenance/maintenanceHistory';
import RpHistories from './components/RepairHis/repairHistory';
import NotiSucces from '../../Components/Notification/notisuccess';
import NotiFailed from '../../Components/Notification/notifailed';
import { getDeviceById, getMnHisById, getRpHisById } from "../../redux/apiRequest";
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';

import styles from './DeviceById.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function DeviceById() {

    const { id } = useParams();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    let stateDevice = useSelector((state) => state.devices.deviceById)
    let stateMn = useSelector((state) => state.maintenance.maintenances);
    let stateRp = useSelector((state) => state.repairhistories.repairHis);

    let device = {};
    if (stateDevice && stateDevice.currentDevice) {
        device = stateDevice.currentDevice;
    }
    let listMnById = [];
    if (stateMn && stateMn.listmaintenances) {
        listMnById = stateMn.listmaintenances;
    }
    let listRpById = [];
    if (stateRp && stateRp.listrepairhis) {
        listRpById = stateRp.listrepairhis;
    }
    //show-hidden devices description
    const [isHidden, setIsHidden] = useState(false);
    const toggleHidden = () => {
        setIsHidden(!isHidden);
    }
    //show-hidden modal update devices
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    // Hàm xử lý khi người dùng đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    //format thời gian
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
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


    //Xử lý phóng to hình ảnh tài sản
    const [modalVisible, setModalVisible] = useState(false);
    const imgRef = useRef(null);

    // Hàm xử lý khi chuột di chuyển vào
    const handleMouseEnter = () => {
        if(imgRef.current){
            setModalVisible(true)
        }
    };

    // Hàm xử lý khi chuột di chuyển ra
    const handleMouseLeave = () => {
        setModalVisible(false)
    };
    //Đóng xử lý phóng to
    useEffect(() => {
        if (user?.accessToken) {
            getDeviceById(id, dispatch, user?.accessToken, axiosJWT);
            getMnHisById(id, dispatch, user?.accessToken, axiosJWT);
            getRpHisById(id, dispatch, user?.accessToken, axiosJWT);
        }
    }, [])
    return (
        device && (
            <div>
                <div className={cx('devices-container')}>
                    <div className={cx('maintenance-repair', { hidden: isHidden })}>
                        <MnHistories
                            device={device}
                            listMnById={listMnById}
                            getMnHisById={getMnHisById}
                            setIsNotiFailed={setIsNotiFailed}
                            setIsNotiSucces={setIsNotiSucces}
                            getDeviceById={getDeviceById}
                            user={user}
                            axiosJWT={axiosJWT}
                        />
                        <RpHistories
                            device={device}
                            listRpById={listRpById}
                            getRpHisById={getRpHisById}
                            setIsNotiFailed={setIsNotiFailed}
                            setIsNotiSucces={setIsNotiSucces}
                            user={user}
                            axiosJWT={axiosJWT}
                        />
                    </div>
                    <div className={cx('descriptionDevice', { hidden: isHidden })}>
                        <button className={cx('show-button')} onClick={toggleHidden}>
                            <i className={cx(`${isHidden ? 'fa-solid fa-angles-left' : 'fa-solid fa-angles-right'}`)} />
                        </button>
                        <div className={cx('detail')}>
                            <div className={cx('imageContainer')}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                ref={imgRef}
                            >
                                <img src={device?.deviceImg} alt={device.deviceName} />
                            </div>
                            <div className={cx('detailsContainer')} style={{ display: isHidden ? 'none' : 'block' }}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>
                                                <button onClick={handleOpenModal}><i className={cx("fa-solid fa-pen-to-square")} /></button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Nhóm tài sản</td>
                                            <td>{device.category}</td>
                                        </tr>
                                        <tr>
                                            <td>Tên thiết bị</td>
                                            <td>{device.deviceName}</td>
                                        </tr>
                                        <tr>
                                            <td>Mã thiết bị</td>
                                            <td>{device.deviceCode}</td>
                                        </tr>
                                        <tr>
                                            <td>Đơn vị tính</td>
                                            <td>{device.unit}</td>
                                        </tr>
                                        <tr>
                                            <td>Giá</td>
                                            <td>{device.price ? device.price : "Không có"}</td>
                                        </tr>
                                        <tr>
                                            <td>Model/Seri</td>
                                            <td>{device.modelSeri}</td>
                                        </tr>
                                        <tr>
                                            <td>Người sử dụng</td>
                                            <td>{device.emloyeE}</td>
                                        </tr>
                                        <tr>
                                            <td>Khu vực</td>
                                            <td>{device.location}</td>
                                        </tr>
                                        <tr>
                                            <td>Nơi sử dụng</td>
                                            <td>{device.department}</td>
                                        </tr>
                                        <tr>
                                            <td>Năm sản xuất</td>
                                            <td>{device.yearofMn ? device.yearofMn : "Không"}</td>
                                        </tr>
                                        <tr>
                                            <td>Năm sử dụng</td>
                                            <td>{device.yearofUse ? device.yearofUse : "Không"}</td>
                                        </tr>

                                        <tr>
                                            <td>Dự kiến thanh lý</td>
                                            <td>{device.depreciation ? device.depreciation : "Không"}</td>
                                        </tr>

                                        <tr>
                                            <td>Trình trạng</td>
                                            <td>{device.status}</td>
                                        </tr>

                                        <tr>
                                            <td>Hạn bảo dưỡng</td>
                                            <td>{device.maintenanceStatus === true ? "Đã đến hạn bảo dưỡng" : "Không"}</td>
                                        </tr>
                                        <tr>
                                            <td>Chu kỳ bảo dưỡng</td>
                                            <td>{device.maintenanceStatus ? device.maintenanceStatus + "Ngày" : "Không"}</td>
                                        </tr>
                                        <tr>
                                            <td>Lần cuối bảo dưỡng</td>
                                            <td>{device.lastMaintenanceDate ? formatDate(device.lastMaintenanceDate) : "Không"}</td>
                                        </tr>
                                        <tr>
                                            <td>Kỳ bảo dưỡng kế</td>
                                            <td>{device.nextMaintenance ? formatDate(device.nextMaintenance) : "Không"}</td>
                                        </tr>

                                        <tr>
                                            <td>Mô tả/Bảo hành</td>
                                            <td>{device.desCription ? device.desCription : "Không"}</td>
                                        </tr>

                                        <tr>
                                            <td>Ghi chú</td>
                                            <td>{device.note ? device.note : "Không"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {isModalOpen && (<DeviceModalById
                    device={device}
                    handleCloseModal={handleCloseModal}
                    setIsModalOpen={setIsModalOpen}
                    setIsNotiSucces={setIsNotiSucces}
                    setIsNotiFailed={setIsNotiFailed}
                    getDeviceById={getDeviceById}
                    user={user}
                    axiosJWT={axiosJWT}
                />)}
                {isNotiSucces && (<NotiSucces handleCloseSuccessModal={handleCloseSuccessModal} />)
                }
                {isNotiFailed && (<NotiFailed handleCloseFailedModal={handleCloseFailedModal} />)
                }

                {modalVisible && (
                    <div className={cx('enlarged-image-modal')}>
                        <img
                            src={device?.deviceImg}
                            alt={device.deviceName}
                            className={cx('enlarged-image')}
                        />
                    </div>
                )}
            </div>
        )
    )
}

export default DeviceById;
