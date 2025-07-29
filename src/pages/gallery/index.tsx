import Layout from '@theme/Layout';
import { useState, useEffect } from 'react';
import styles from './gallery.module.css';

const images = [
  {
    id: 'image1',
    src: 'img/gallery/image1.png',
    title: '教堂',
    description: '石英与琉璃的邂逅，纯净与斑斓的交融。在神圣的光影交错间，寻找心灵的永恒归宿。设计与建造：Cloud_ling'
  },
  {
    id: 'image2',
    src: 'img/gallery/image2.png',
    title: '许愿树',
    description: '樱花满树，心愿满怀;让花朵带着愿望飞向天空的云朵间。设计与建造：Cloud_ling'
  },
  {
    id: 'image3',
    src: 'img/gallery/image3.png',
    title: '高级建筑',
    description: '精美的建筑设计展现了玩家们的创造力和艺术天赋。'
  },
  {
    id: 'image4',
    src: 'img/gallery/image4.png',
    title: '炼药机',
    description: '魔法，机械，炼金，工业：将平凡的水源化作生命的甘露。设计与建造：rhnmabj'
  }
];

export default function Gallery() {
  const [currentImage, setCurrentImage] = useState(0);
  const [transitionPhase, setTransitionPhase] = useState('visible');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  // 处理URL锚点导航
  useEffect(() => {
    const hash = window.location.hash.substring(1); // 移除 # 符号
    if (hash) {
      const imageIndex = images.findIndex(img => img.id === hash);
      if (imageIndex !== -1) {
        setCurrentImage(imageIndex);
      }
    }
  }, []);

  useEffect(() => {
    images.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => new Set([...prev, index]));
      };
      img.src = image.src;
    });
  }, []);

  const changeImage = (newIndex) => {
    if (newIndex === currentImage || transitionPhase !== 'visible') return;
    setTransitionPhase('fadeOut');
    setTimeout(() => {
      setCurrentImage(newIndex);
      setTransitionPhase('fadeIn');
      setTimeout(() => {
        setTransitionPhase('visible');
      }, 50);
    }, 300);
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
          style={{ backgroundImage: `url(${images[currentImage].src})` }}
        />

        <button 
          className={styles.toggleButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarContent}>
            <h3>选择景观</h3>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${styles.imageItem} ${index === currentImage ? styles.active : ''}`}
                onClick={() => {
                  changeImage(index);
                  setSidebarOpen(false);
                }}
              >
                <img src={image.src} alt={image.title} />
                <span>{image.title}</span>
                {!imagesLoaded.has(index) && (
                  <div className={styles.loadingIndicator}>⟳</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.textBox} ${transitionPhase !== 'visible' ? styles.textFadeOut : styles.textFadeIn}`}>
          <h2>{images[currentImage].title}</h2>
          <p>{images[currentImage].description}</p>
        </div>

        <div className={styles.navigation}>
          <button 
            onClick={() => changeImage(currentImage > 0 ? currentImage - 1 : images.length - 1)}
            className={styles.navButton}
            disabled={transitionPhase !== 'visible'}
          >
            ‹
          </button>
          <span className={styles.imageCounter}>
            {currentImage + 1} / {images.length}
          </span>
          <button 
            onClick={() => changeImage(currentImage < images.length - 1 ? currentImage + 1 : 0)}
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