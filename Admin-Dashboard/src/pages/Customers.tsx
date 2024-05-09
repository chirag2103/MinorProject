import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
} from 'react';
import { BsSearch } from 'react-icons/bs';
import AdminSidebar from '../components/AdminSidebar';
import { BarChart1, LineChart, PieChart } from '../components/Charts';
import { FaRegBell } from 'react-icons/fa';
import userImg from '../assets/userpic.png';
import io, { Socket } from 'socket.io-client';
const Customers = () => {
  useEffect(() => {
    const socket = io('http://localhost:4000');
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('server-details', (data) => {
      console.log(typeof data);
      console.log('Received server details:', data);
    });

    socket.on('error', (error) => {
      console.error('Error:', error.message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }, []);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <section className='customer'>
        <div className='bar'>
          <BsSearch />
          <input type='text' placeholder='Search for data,users,docs' />
          <FaRegBell />
          <img src={userImg} alt='User' />
        </div>
        <div className='pie-container'>
          <div className='pie-chart'>
            <h2>Ports (Open/Closed)</h2>
            <PieChart
              labels={['Open Ports', 'Closed Ports']}
              label={'No of Ports'}
              data={[12, 19]}
              backgroundColor={[
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
              ]}
              borderColor={['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)']}
              borderWidth={1}
            />
          </div>
          <div className='bar1-chart'>
            <h2>Events & Count</h2>
            <BarChart1
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              title_1='Events'
              bgColor_1='rgb(0,115,255)'
            />
            {/* Graph */}
          </div>
        </div>
        <div className='line-container'>
          <div className='line-chart'>
            <h2>No. of IP Address</h2>
            <LineChart
              data={[
                200, 444, 444, 556, 778, 455, 990, 1444, 256, 447, 1000, 1200,
              ]}
              label='Users'
              borderColor='rgb(53, 162, 255)'
              backgroundColor='rgba(53, 162, 255,0.5)'
              labels={months}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Customers;
