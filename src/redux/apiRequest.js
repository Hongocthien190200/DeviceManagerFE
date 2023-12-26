import axios from "axios";
//Lấy chỉ số các danh mục menu
import { countStart, countSuccess, countFailed } from "./homeSlice";
//Đăng ký/Đăng nhập/User
import {
    RegisterFailed, RegisterStart, RegisterSuccess,
    loginFailed, loginStart, loginSuccess,
    logoutFailed, logoutStart, logoutSuccess,
    getallUserStart, getallUserSuccess, getallUserFailed,
    getallLoginStart, getallLoginSuccess, getallLoginFailed
} from "./authSlice";
//Thiết bị
import {
    getAllDeviceStart, getAllDeviceSuccess, getAllDeviceFailed,
    postDeviceFailed, postDeviceSuccess, postDeviceStart,
    getDeviceByIdStart, getDeviceByIdSuccess, getDeviceByIdFailed,
    updateDeviceFailed, updateDeviceSuccess, updateDeviceStart
} from "./deviceSlice";
//Phân loại
import {
    getAllCategoryStart, getAllCategorySuccess, getAllCategoryFailed,
    updateCategoryStart, updateCategorySuccess, updateCategoryFailed,
    postCategoryStart, postCategorySuccess, postCategoryFailed
} from "./categorySlice";
//Phòng ban
import {
    getAllDepartmentStart, getAllDepartmentSuccess, getAllDepartmentFailed,
    updateDepartmentStart, updateDepartmentSuccess, updateDepartmentFailed,
    postDepartmentStart, postDepartmentSuccess, postDepartmentFailed
} from "./departmentSlice";
//Đơn vị tính (tài sản/thiết bị)
import {
    getAllUnitStart, getAllUnitSuccess, getAllUnitFailed,
    updateUnitStart, updateUnitSuccess, updateUnitFailed,
    postUnitStart, postUnitSuccess, postUnitFailed
} from "./unitSlice";
//Trạng thái
import {
    getAllStatusStart, getAllStatusSuccess, getAllStatusFailed,
    updateStatusStart, updateStatusSuccess, updateStatusFailed,
    postStatusStart, postStatusSuccess, postStatusFailed
} from "./statusSlice";
//Vị trí
import {
    getAllLocationStart, getAllLocationSuccess, getAllLocationFailed,
    updateLocationStart, updateLocationSuccess, updateLocationFailed,
    postLocationStart, postLocationSuccess, postLocationFailed,
} from "./locationSlice";
//Đơn vị bảo dưỡng/sửa chữa
import {
    getAllRepairerStart, getAllRepairerSuccess, getAllRepairerFailed,
    updateRepairerStart, updateRepairerSuccess, updateRepairerFailed,
    postRepairerStart, postRepairerSuccess, postRepairerFailed
} from "./repairerSlice";
//Lịch sử bảo dưỡng
import {
    getAllMnStart, getAllMnSuccess, getAllMnFailed,
    getMaintenanceStart, getMaintenanceSuccess, getMaintenanceFailed,
    postMnHisStart, postMnHisSuccess, postMnHisFailed,
    getCurrenMnHisStart, getCurrenMnHisSuccess, getCurrenMnHisFailed,
    updateMnHisStart, updateMnHisSuccess, updateMnHisFailed
} from "./mnHisSlice";
//Lịch sử sửa chữa
import {
    getAllRpStart, getAllRpSuccess, getAllRpFailed,
    getRepairHisStart, getRepairHisSuccess, getRepairHisFailed,
    postRpHisStart, postRpHisSuccess, postRpHisFailed,
    getCurrenRpHisStart, getCurrenRpHisSuccess, getCurrenRpHisFailed,
    updateRpHisStart, updateRpHisSuccess, updateRpHisFailed
} from "./repairHisSlice";

// axios.defaults.baseURL = 'https://thienho.gcalls.vn';
axios.defaults.baseURL = 'http://localhost:4000';

//LẤY TẤT CẢ DANH SÁCH TÀI KHOẢN ĐÃ ĐĂNG NHẬP
export const getAlllistLogin = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(getallLoginStart());
    try {
        const res = await axiosJWT.get("/api/schedulelogin", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getallLoginSuccess(res.data));
    }
    catch (error) {
        await dispatch(getallLoginFailed());
    }
}
//LẤY TẤT CẢ USER
export const getAllUser = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(getallUserStart());
    try {
        const res = await axiosJWT.get("/api/alluser", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getallUserSuccess(res.data));
    }
    catch (error) {
        await dispatch(getallUserFailed());
    }
}
//ĐĂNG NHẬP
export const loginUser = async (user, dispatch, navigate, errorCallback) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/api/login", user);
        await dispatch(loginSuccess(res.data));
        await navigate("/");
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message !== "") {
            errorCallback(new Error("Sai tên đăng nhập hoặc mật khẩu"));
            dispatch(loginFailed());
        }
    }
}
//ĐĂNG XUẤT
export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post("/api/logout", id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logoutSuccess());
        navigate("/login");
    }
    catch (err) {
        dispatch(logoutFailed());
    }
}
//ĐĂNG KÝ
export const registerUser = async (user, dispatch, successCallback, errCallback,accessToken, axiosJWT) => {
    dispatch(RegisterStart());
    try {
        await axiosJWT.post("/api/register", user, {
            headers: { token: `Bearer ${accessToken}` },
        })
        dispatch(RegisterSuccess());
        await successCallback();
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message !== "") {
            await errCallback();
            // errorCallback(new Error("Username already exists"));
            dispatch(RegisterFailed(error));
        }
    }
}
//ĐẾM SỐ LƯỢNG
export const getCountAll = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(countStart());
    try {
        const res = await axiosJWT.get("/api/countAll", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(countSuccess(res.data));
    }
    catch (error) {
        await dispatch(countFailed());
    }
}
//LẤY TẤT CẢ THIẾT BỊ
export const getAllDevice = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(getAllDeviceStart());
    try {
        const res = await axiosJWT.get("/api/devices", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllDeviceSuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllDeviceFailed());
    }
}
//LẤY THIẾT BỊ THEO ID
export const getDeviceById = async (id, dispatch, accessToken, axiosJWT) => {
    await dispatch(getDeviceByIdStart());
    try {
        const res = await axiosJWT.get(`/api/devices/${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getDeviceByIdSuccess(res.data));
    }
    catch (error) {
        await dispatch(getDeviceByIdFailed());
    }
}
//THÊM MỚI THIẾT BỊ
export const postNewDevice = async (newDevice, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(postDeviceStart());
    try {
        await axiosJWT.post("/api/devices", newDevice, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        });
        await dispatch(postDeviceSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postDeviceFailed(error));
    }
}
//SỬA THIẾT BỊ
export const updateDevice = async (id, newDevice, dispatch, successCallback, accessToken, axiosJWT) => {
    await dispatch(updateDeviceStart());
    try {
        await axiosJWT.patch(`/api/devices/${id}`, newDevice, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateDeviceSuccess());
        await successCallback();
    }
    catch (error) {
        // await errCallback();
        await dispatch(updateDeviceFailed(error));
    }
}
//LẤY TẤT CẢ PHÂN LOẠI
export const getAllCategory = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(getAllCategoryStart());
    try {
        const res = await axiosJWT.get("/api/category", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllCategorySuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllCategoryFailed());
    }
}
//THÊM MỚI PHÂN LOẠI
export const postNewCategory = async (newCategory, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(postCategoryStart());
    try {
        await axiosJWT.post("/api/category", newCategory, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(postCategorySuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postCategoryFailed(error));
    }
}
//SỬA PHÂN LOẠI
export const updateCategory = async (id, newCategory, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(updateCategoryStart());
    try {
        await axiosJWT.patch(`/api/category/${id}`, newCategory, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateCategorySuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(updateCategoryFailed(error));
    }
}
//LẤY TẤT CẢ PHÒNG BAN
export const getAllDepartment = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(getAllDepartmentStart());
    try {
        const res = await axiosJWT.get("/api/department", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllDepartmentSuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllDepartmentFailed());
    }
}
//THÊM MỚI PHÒNG BAN
export const postNewDepartment = async (newDepartment, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(postDepartmentStart());
    try {
        await axiosJWT.post("/api/department", newDepartment, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(postDepartmentSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postDepartmentFailed(error));
    }
}
//SỬA PHÒNG BAN
export const updateDepartment = async (id, newDepartment, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(updateDepartmentStart());
    try {
        await axiosJWT.patch(`/api/department/${id}`, newDepartment, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateDepartmentSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(updateDepartmentFailed(error));
    }
}
//LẤY TẤT CẢ ĐƠN VỊ TÍNH (Tài Sản/Thiết Bị)
export const getAllUnit = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(getAllUnitStart());
    try {
        const res = await axiosJWT.get("/api/unit", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllUnitSuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllUnitFailed());
    }
}
//THÊM MỚI ĐƠN VỊ TÍNH (Tài Sản/Thiết Bị)
export const postNewUnit = async (newUnit, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(postUnitStart());
    try {
        await axiosJWT.post("/api/unit", newUnit, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(postUnitSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postUnitFailed(error));
    }
}
//SỬA ĐƠN VỊ TÍNH (Tài Sản/Thiết Bị)
export const updateUnit = async (id, newUnit, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(updateUnitStart());
    try {
        await axiosJWT.patch(`/api/unit/${id}`, newUnit, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateUnitSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(updateUnitFailed(error));
    }
}
//LẤY TẤT CẢ TRẠNG THÁI
export const getAllStatus = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(getAllStatusStart());
    try {
        const res = await axiosJWT.get("/api/status", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllStatusSuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllStatusFailed());
    }
}
//THÊM MỚI TRẠNG THÁI
export const postNewStatus = async (newStatus, dispatch, successCallback, errCallback,accessToken, axiosJWT) => {
    await dispatch(postStatusStart());
    try {
        await axiosJWT.post("/api/status", newStatus, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(postStatusSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postStatusFailed(error));
    }
}
//SỬA TRẠNG THÁI
export const updateStatus = async (id, newStatus, dispatch, successCallback, errCallback,accessToken, axiosJWT) => {
    await dispatch(updateStatusStart());
    try {
        await axiosJWT.patch(`/api/status/${id}`, newStatus, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateStatusSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(updateStatusFailed(error));
    }
}
//LẤY TẤT CẢ VỊ TRÍ
export const getAllLocation = async (accessToken, dispatch, axiosJWT) => {
    await dispatch(getAllLocationStart());
    try {
        const res = await axiosJWT.get("/api/location", {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllLocationSuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllLocationFailed());
    }
}
//THÊM MỚI VỊ TRÍ
export const postNewLocation = async (newLocation, dispatch, successCallback, errCallback,accessToken, axiosJWT) => {
    await dispatch(postLocationStart());
    try {
        await axiosJWT.post("/api/location", newLocation, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(postLocationSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postLocationFailed(error));
    }
}
//SỬA VỊ TRÍ
export const updateLocation = async (id, newLocation, dispatch, successCallback, errCallback,accessToken, axiosJWT) => {
    await dispatch(updateLocationStart());
    try {
        await axiosJWT.patch(`/api/location/${id}`, newLocation, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateLocationSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(updateLocationFailed(error));
    }
}
//LẤY TẤT CẢ ĐƠN VỊ BẢO DƯỠNG/SỬA CHỮA
export const getAllRepairer = async (dispatch, accessToken, axiosJWT) => {
    await dispatch(getAllRepairerStart());
    try {
        const res = await axiosJWT.get('/api/repairer', {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllRepairerSuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllRepairerFailed());
    }
}
//THÊM MỚI ĐƠN VỊ BẢO DƯỠNG/SỬA CHỮA
export const postNewRepairer = async (newRepairer, dispatch, successCallback, errCallback,accessToken, axiosJWT) => {
    await dispatch(postRepairerStart());
    try {
        await axiosJWT.post("/api/repairer", newRepairer, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(postRepairerSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postRepairerFailed(error));
    }
}
//SỬA ĐƠN VỊ BẢO DƯỠNG/SỬA CHỮA
export const updateRepairer = async (id, newRepairer, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(updateRepairerStart());
    try {
        await axiosJWT.patch(`/api/repairer/${id}`, newRepairer, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateRepairerSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(updateRepairerFailed(error));
    }
}
//LẤY TẤT CẢ LỊCH SỬ BẢO DƯỠNG
export const getAllMnHis = async (dispatch, accessToken, axiosJWT) => {
    await dispatch(getAllMnStart());
    try {
        const res = await axiosJWT.get(`/api/maintenance-history`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllMnSuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllMnFailed());
    }
}
//LẤY TẤT CẢ LỊCH SỬ BẢO DƯỠNG THEO ID THIẾT BỊ
export const getMnHisById = async (id, dispatch, accessToken, axiosJWT) => {
    await dispatch(getMaintenanceStart());
    try {
        const res = await axiosJWT.get(`/api/maintenance-history/devices/${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getMaintenanceSuccess(res.data));
    }
    catch (error) {
        await dispatch(getMaintenanceFailed());
    }
}
//THÊM MỚI PHIẾU BẢO DƯỠNG
export const postNewMnHis = async (id, newMnHis, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(postMnHisStart());
    try {
        await axiosJWT.post(`/api/maintenance-history/${id}`, newMnHis, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(postMnHisSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postMnHisFailed(error));
    }
}
//LẤY PHIẾU BẢO DƯỠNG THEO ID CỦA PHIẾU
export const getMnHisByIdCurrent = async (id, dispatch,accessToken, axiosJWT ) => {
    await dispatch(getCurrenMnHisStart());
    try {
        const res = await axiosJWT.get(`/api/maintenance-history/${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getCurrenMnHisSuccess(res.data));
    }
    catch (error) {
        await dispatch(getCurrenMnHisFailed());
    }
}
//SỬA THÔNG TIN PHIẾU BẢO DƯỠNG
export const updateMnHisById = async (id, newMnHis, dispatch, successCallback, errCallback, accessToken, axiosJWT) => {
    await dispatch(updateMnHisStart());
    try {
        await axiosJWT.patch(`/api/maintenance-history/${id}`, newMnHis, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateMnHisSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(updateMnHisFailed(error));
    }
}
//LẤY TẤT CẢ LỊCH SỬ SỬA CHỮA
export const getAllRpHis = async (dispatch,accessToken, axiosJWT) => {
    await dispatch(getAllRpStart());
    try {
        const res = await axiosJWT.get(`/api/repair-history`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getAllRpSuccess(res.data));
    }
    catch (error) {
        await dispatch(getAllRpFailed());
    }
}
//LẤY TẤT CẢ LỊCH SỬ SỬA CHỮA THEO ID THIẾT BỊ
export const getRpHisById = async (id, dispatch, accessToken, axiosJWT) => {
    await dispatch(getRepairHisStart());
    try {
        const res = await axiosJWT.get(`/api/repair-history/devices/${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getRepairHisSuccess(res.data));
    }
    catch (error) {
        await dispatch(getRepairHisFailed());
    }
}
//THÊM MỚI PHIẾU SỬA CHỮA
export const postNewRpHis = async (id, newRpHis, dispatch, successCallback, errCallback,accessToken, axiosJWT) => {
    await dispatch(postRpHisStart());
    try {
        await axiosJWT.post(`/api/repair-history/${id}`, newRpHis, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(postRpHisSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(postRpHisFailed(error));
    }
}
//LẤY PHIẾU SỬA CHỮA THEO ID CỦA PHIẾU
export const getRpHisByIdCurrent = async (id, dispatch, accessToken, axiosJWT) => {
    await dispatch(getCurrenRpHisStart());
    try {
        const res = await axiosJWT.get(`/api/repair-history/${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(getCurrenRpHisSuccess(res.data));
    }
    catch (error) {
        await dispatch(getCurrenRpHisFailed());
    }
}
//SỬA THÔNG TIN PHIẾU SỬA CHỮA
export const updateRpHisById = async (id, newRpHis, dispatch, successCallback, errCallback,accessToken, axiosJWT) => {
    await dispatch(updateRpHisStart());
    try {
        await axiosJWT.patch(`/api/repair-history/${id}`, newRpHis, {
            headers: { token: `Bearer ${accessToken}` },
        });
        await dispatch(updateRpHisSuccess());
        await successCallback();
    }
    catch (error) {
        await errCallback();
        await dispatch(updateRpHisFailed(error));
    }
}
