import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminOrders from '../components/AdminOrders';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-900">
                Karakuş Tech Admin
              </h1>
              <nav className="flex space-x-8">
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Siparişler
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Ürünler
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Kategoriler
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<AdminOrders />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;



