import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';
import SignIn from './pages/SignIn';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Transaction = lazy(() => import('./pages/Transaction'));
const Customers = lazy(() => import('./pages/Customers'));
function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/' element={<SignIn />} />
          <Route path='/admin/product' element={<Products />} />
          <Route path='/admin/transaction' element={<Transaction />} />
          <Route path='/admin/customer' element={<Customers />} />

          {/* Charts */}

          {/* Apps */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
