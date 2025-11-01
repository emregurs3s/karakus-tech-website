import { useCartStore } from '../store/cart';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, getTotals } = useCartStore();
  const totals = getTotals();

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
          <Link
            to="/urunler"
            className="inline-block bg-brand text-white px-8 py-3 rounded hover:bg-accent transition"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>
      <p className="text-gray-600">Toplam: {totals.grandTotal}₺</p>
    </div>
  );
}



