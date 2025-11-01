import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-soft py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Karakuş Tech'e Hoş Geldiniz</h1>
          <p className="text-xl text-accent mb-8">
            Teknoloji Ürünleri ve Aksesuarları
          </p>
          <Link
            to="/urunler"
            className="inline-block bg-brand text-white px-8 py-3 rounded hover:bg-accent transition"
          >
            Teknoloji Ürünlerini Keşfet
          </Link>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/urunler?type=sarj-aletleri"
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop"
                alt="Şarj Aletleri"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Şarj Aletleri</h3>
                <p className="text-gray-600">Hızlı şarj adaptörleri ve kablolar</p>
              </div>
            </Link>

            <Link
              to="/urunler?type=airpods-kulaklik"
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop"
                alt="Kulaklık"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Airpods & Kulaklık</h3>
                <p className="text-gray-600">Kablosuz ve kablolu kulaklıklar</p>
              </div>
            </Link>

            <Link
              to="/urunler?type=powerbank"
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop"
                alt="Powerbank"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Powerbank</h3>
                <p className="text-gray-600">Taşınabilir şarj cihazları</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}



