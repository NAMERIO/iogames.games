import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any;
  }
}

const AdBanner: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAd = () => {
      if (window.adsbygoogle && adRef.current) {
        try {
          window.adsbygoogle.push({});
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }
    };

    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712213211562891';
      script.crossOrigin = 'anonymous';
      script.onload = loadAd;
      document.head.appendChild(script);
    } else {
      loadAd();
    }
  }, []);

  return (
    <div ref={adRef} className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '300px', height: '250px' }}
        data-ad-client="ca-pub-1712213211562891"
        data-ad-slot="1759185675"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
