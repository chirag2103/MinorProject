import AdminSidebar from '../components/AdminSidebar';
import userImg from '../assets/userpic.png';
import { BsSearch } from 'react-icons/bs';
import { FaRegBell } from 'react-icons/fa';
import { BarChart1 } from '../components/Charts';

const Products = () => {
  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main className='products'>
        <div className='bar'>
          <BsSearch />
          <input type='text' placeholder='Search for data,users,docs' />
          <FaRegBell />
          <img src={userImg} alt='User' />
        </div>
        <div className='bar-container'>
          <div className='bar1-chart'>
            <h2>Events & Count</h2>
            <BarChart1
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              title_1='Events'
              bgColor_1='rgb(0,115,255)'
            />
          </div>
          <div className='bar1-chart'>
            <h2>Events & Count</h2>
            <BarChart1
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              title_1='Events'
              bgColor_1='rgb(0,115,255)'
            />
          </div>
        </div>
        <div className='bar-container'>
          <div className='bar1-chart'>
            <h2>Events & Count</h2>
            <BarChart1
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              title_1='Events'
              bgColor_1='rgb(0,115,255)'
            />
          </div>
          <div className='bar1-chart'>
            <h2>Events & Count</h2>
            <BarChart1
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              title_1='Events'
              bgColor_1='rgb(0,115,255)'
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
