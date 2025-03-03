import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any;
  }
}
interface AdBannerProps {
  format?: 'vertical' | 'horizontal' | 'rectangle' | 'large-skyscraper';
  className?: string;
}
const AdBanner: React.FC<AdBannerProps> = ({ format = 'rectangle', className = '' }) => {
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
  }, [format]);
  const getAdSize = () => {
    switch (format) {
      case 'vertical':
        return { width: '160px', height: '600px' };
      case 'large-skyscraper':
        return { width: '320px', height: '600px' };
      case 'horizontal':
        return { width: '728px', height: '90px' };
      case 'rectangle':
      default:
        return { width: '300px', height: '250px' };
    }
  };
  const adSize = getAdSize();
  return (
    <div className={`ad-container ${className}`} style={{ maxWidth: adSize.width }}>
      <div className="text-xs text-gray-500 uppercase text-center mb-1">Advertisement</div>
      <div ref={adRef} className="ad-wrapper flex items-center justify-center" style={{ width: adSize.width, height: adSize.height }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: adSize.width, height: adSize.height }}
          data-ad-client="ca-pub-1712213211562891"
          data-ad-slot="1759185675"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default AdBanner;
