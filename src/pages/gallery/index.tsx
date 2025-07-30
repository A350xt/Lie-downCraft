import Layout from '@theme/Layout';
import { useState, useEffect } from 'react';
import styles from './gallery.module.css';
import galleryData from '../../data/gallery.json';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
}

export default function Gallery() {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transitionPhase, setTransitionPhase] = useState('visible');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  const currentItem = galleryData[currentCategory] as GalleryItem;
  const currentImage = currentItem.images[currentImageIndex];

  // 处理URL锚点导航
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const categoryIndex = galleryData.findIndex(item => item.id === hash);
      if (categoryIndex !== -1) {
        setCurrentCategory(categoryIndex);
        setCurrentImageIndex(0);
      }
    } else {
      // 如果没有锚点，设置默认锚点为第一个分类
      const firstItem = galleryData[0];
      if (firstItem) {
        window.history.replaceState(null, '', `#${firstItem.id}`);
      }
    }
  }, []);

  // 预加载所有图片
  useEffect(() => {
    galleryData.forEach((item, categoryIndex) => {
      item.images.forEach((image, imageIndex) => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded(prev => new Set([...prev, `${categoryIndex}-${imageIndex}`]));
        };
        img.src = image.src;
      });
    });
  }, []);

  const changeCategory = (newCategoryIndex: number) => {
    if (newCategoryIndex === currentCategory || transitionPhase !== 'visible') return;
    setTransitionPhase('fadeOut');
    setTimeout(() => {
      setCurrentCategory(newCategoryIndex);
      setCurrentImageIndex(0);
      // 更新URL锚点为对应的分类ID
      const newItem = galleryData[newCategoryIndex];
      window.history.replaceState(null, '', `#${newItem.id}`);
      setTransitionPhase('fadeIn');
      setTimeout(() => {
        setTransitionPhase('visible');
      }, 50);
    }, 300);
  };

  const changeImage = (newImageIndex: number) => {
    if (newImageIndex === currentImageIndex || transitionPhase !== 'visible') return;
    setTransitionPhase('fadeOut');
    setTimeout(() => {
      setCurrentImageIndex(newImageIndex);
      setTransitionPhase('fadeIn');
      setTimeout(() => {
        setTransitionPhase('visible');
      }, 50);
    }, 300);
  };

  const nextImage = () => {
    const nextIndex = currentImageIndex < currentItem.images.length - 1 
      ? currentImageIndex + 1 
      : 0;
    changeImage(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex > 0 
      ? currentImageIndex - 1 
      : currentItem.images.length - 1;
    changeImage(prevIndex);
  };

  return (
    <Layout title="风光一览">
      <div className={styles.galleryContainer}>
        <div 
          className={`${styles.backgroundImage} ${
            transitionPhase === 'fadeOut' ? styles.fadeOut : 
            transitionPhase === 'fadeIn' ? styles.fadeIn : 
            styles.visible
          }`}
          style={{ backgroundImage: `url(${currentImage.src})` }}
        />

        <button 
          className={styles.toggleButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarContent}>
            <h3>画廊分类</h3>
            {galleryData.map((item, categoryIndex) => (
              <div key={item.id} className={styles.categorySection}>
                <div
                  className={`${styles.categoryTitle} ${categoryIndex === currentCategory ? styles.categoryActive : ''}`}
                  onClick={() => changeCategory(categoryIndex)}
                >
                  <span className={styles.categoryName}>{item.title}</span>
                  <span className={styles.imageCount}>({item.images.length})</span>
                </div>
                {categoryIndex === currentCategory && (
                  <div className={styles.thumbnailGrid}>
                    {item.images.map((image, imageIndex) => (
                      <div
                        key={imageIndex}
                        className={`${styles.thumbnail} ${imageIndex === currentImageIndex ? styles.thumbnailActive : ''}`}
                        onClick={() => {
                          changeImage(imageIndex);
                          setSidebarOpen(false);
                        }}
                      >
                        <img src={image.src} alt={image.alt} />
                        <div className={styles.thumbnailOverlay}>
                          <span>{image.alt}</span>
                        </div>
                        {!imagesLoaded.has(`${categoryIndex}-${imageIndex}`) && (
                          <div className={styles.loadingIndicator}>⟳</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.textBox} ${transitionPhase !== 'visible' ? styles.textFadeOut : styles.textFadeIn}`}>
          <h2>{currentItem.title}</h2>
          <p>{currentItem.description}</p>
          <div className={styles.imageInfo}>
            <span className={styles.imageAlt}>{currentImage.alt}</span>
          </div>
        </div>

        <div className={styles.navigation}>
          <button 
            onClick={prevImage}
            className={styles.navButton}
            disabled={transitionPhase !== 'visible'}
          >
            ‹
          </button>
          <span className={styles.imageCounter}>
            {currentImageIndex + 1} / {currentItem.images.length}
          </span>
          <button 
            onClick={nextImage}
            className={styles.navButton}
            disabled={transitionPhase !== 'visible'}
          >
            ›
          </button>
        </div>
      </div>
    </Layout>
  );
}