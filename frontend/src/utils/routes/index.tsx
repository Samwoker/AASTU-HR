import { routeConstants } from '../constants';
import AdminDashboard from '../../app/pages/Admin/Dashboard';
import CreateUser from '../../app/pages/Admin/CreateAccount';
import CreateEmployment from '../../app/pages/Admin/CreateEmployment';
import Departments from '../../app/pages/Admin/Departments';
import EmployeeDashboard from '../../app/pages/employee/Dashboard';
import { IRoute } from './types';

export const routes: IRoute[] = [
  {
    path: routeConstants.dashboard,
    element: <AdminDashboard />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.createUser,
    element: <CreateUser />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.createEmployment,
    element: <CreateEmployment />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.employeeDashboard,
    element: <EmployeeDashboard />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.departments,
    element: <Departments />,
    isAuthenticated: true,
  },
];
