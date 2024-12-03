
import Sidebar from '../components/Dashboard/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className='min-h-screen'>
            <Sidebar></Sidebar>
            <div className='flex-1 md:ml-64 p-5'>

            <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;