export default function Footer() {
  return (
    <footer className="bg-accent text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">E-Ticaret</h3>
            <p className="text-gray-300">Modern ve güvenilir alışveriş deneyimi</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/urunler?type=sarj-aletleri">Şarj Aletleri</a></li>
              <li><a href="/urunler?type=airpods-kulaklik">Airpods & Kulaklık</a></li>
              <li><a href="/urunler?type=powerbank">Powerbank</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <p className="text-gray-300">destek@eticaret.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
          &copy; 2024 E-Ticaret. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}



