import Home from '../Pages/Home';
import Devices from '../Pages/Device';
import DeviceById from '../Pages/DeviceById';
import MaintenanceHis from '../Pages/MnHistory';
import RepairHis from '../Pages/RpHistory';
import Category from '../Pages/Category';
import Location from '../Pages/Location';
import Status from '../Pages/Status';
import Repairer from '../Pages/Repairer';
import Login from '../Pages/Login';
import User from '../Pages/User';
import Historylogin from '../Pages/Historylogin';
import Department from '../Pages/Department';
//Public Route
const privateRoutes = [
    { path: '/', component: Home },
    { path: '/devices', component: Devices },
    { path: '/devices/:id', component: DeviceById },
    { path: '/maintenance', component: MaintenanceHis },
    { path: '/repair', component: RepairHis },
    { path: '/category', component: Category },
    { path: '/location', component: Location },
    { path: '/status', component: Status },
    { path: '/fixer', component: Repairer },
    { path: '/user', component: User },
    { path: '/historylogin', component: Historylogin },
    { path: '/department', component: Department },
];
const publicRoutes = [
    { path: '/login', component: Login, layout: null },
];
export { publicRoutes, privateRoutes }