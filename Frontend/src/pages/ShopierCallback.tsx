import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const ShopierCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Shopier callback verilerini yakala
    const callbackData = Object.fromEntries(searchParams.entries());
    console.log('Shopier Callback Data:', callbackData);
    
    // Backend'e callback verilerini gönder
    fetch('https://karakus-website-backend.onrender.com/api/payment/shopier-callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callbackData)
    }).then(response => response.json())
      .then(data => {
        console.log('Backend response:', data);
        
        // Ödeme durumuna göre yönlendir
        if (data.success) {
          window.location.href = '/payment/success';
        } else {
          window.location.href = '/payment/fail';
        }
      })
      .catch(error => {
        console.error('Callback error:', error);
        window.location.href = '/payment/fail';
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p>Ödeme işleminiz kontrol ediliyor...</p>
      </div>
    </div>
  );
};

export default ShopierCallback;