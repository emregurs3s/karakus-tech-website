import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './routes/Home';
import ProductsPage from './routes/Products';
import ProductDetailPage from './routes/ProductDetail';
import CartPage from './routes/Cart';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/urunler" element={<ProductsPage />} />
          <Route path="/urun/:slug" element={<ProductDetailPage />} />
          <Route path="/sepet" element={<CartPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;



