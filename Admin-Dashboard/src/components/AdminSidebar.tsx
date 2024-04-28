import { Link, Location, useLocation } from 'react-router-dom';
import {
  RiCoupon3Fill,
  RiDashboardFill,
  RiShoppingBag3Fill,
} from 'react-icons/ri';
import { IoIosPeople } from 'react-icons/io';
import { AiFillFileText } from 'react-icons/ai';
import { IconType } from 'react-icons';
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaGamepad,
  FaStopwatch,
} from 'react-icons/fa';
const AdminSidebar = () => {
  const location = useLocation();
  return (
    <aside>
      <h2>Logo.</h2>
      <DivOne location={location} />
      {/* <DivTwo location={location} /> */}
      <DivThree location={location} />
    </aside>
  );
};
const DivOne = ({ location }: { location: Location }) => (
  <div>
    <h5>Dashboard</h5>
    <ul>
      <Li
        url='/admin/dashboard'
        text='Dashboard'
        Icon={RiDashboardFill}
        location={location}
      />
      <Li
        url='/admin/product'
        text='Event Log'
        Icon={RiShoppingBag3Fill}
        location={location}
      />
      <Li
        url='/admin/customer'
        text='Network Profiling'
        Icon={IoIosPeople}
        location={location}
      />
      <Li
        url='/admin/transaction'
        text='Network Monitoring'
        Icon={AiFillFileText}
        location={location}
      />
    </ul>
  </div>
);
const DivTwo = ({ location }: { location: Location }) => (
  <div>
    <h5>Charts</h5>
    <ul>
      <Li
        url='/admin/chart/bar'
        text='Bar'
        Icon={FaChartBar}
        location={location}
      />
      <Li
        url='/admin/chart/pie'
        text='Pie'
        Icon={FaChartPie}
        location={location}
      />
      <Li
        url='/admin/chart/line'
        text='Line'
        Icon={FaChartLine}
        location={location}
      />
    </ul>
  </div>
);
const DivThree = ({ location }: { location: Location }) => (
  <div>
    <h5>Logs</h5>
    <ul>
      <Li
        url='/admin/app/stopwatch'
        text='Activity Log'
        Icon={FaStopwatch}
        location={location}
      />
      <Li
        url='/admin/coupon'
        text='Anomaly Log'
        Icon={RiCoupon3Fill}
        location={location}
      />
      <Li
        url='/admin/toss'
        text='Fault Log'
        Icon={FaGamepad}
        location={location}
      />
    </ul>
  </div>
);

interface LiProps {
  url: string;
  text: string;
  location: Location;
  Icon: IconType;
}
const Li = ({ url, text, location, Icon }: LiProps) => (
  <li
    style={{
      backgroundColor: location.pathname.includes(url)
        ? 'rgba(0,115,255,0.1)'
        : 'white',
    }}
  >
    <Link
      to={url}
      style={{
        color: location.pathname.includes(url) ? 'rgb(0,115,255)' : 'black',
      }}
    >
      <Icon />
      {text}
    </Link>
  </li>
);

export default AdminSidebar;
