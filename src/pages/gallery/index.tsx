import Layout from '@theme/Layout';
import { useEffect, useMemo, useState } from 'react';
import styles from './gallery.module.css';
import galleryData from '../../data/gallery.json';

type GalleryCategory = '建筑' | '机械' | '活动' | '进行中';
type GalleryStatus = '已完成' | '建设中' | '记录中';
type ViewMode = 'grid' | 'list';
type ImageMotion = 'none' | 'next' | 'prev' | 'jump';
type ArrowDirection = 'left' | 'right';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category?: GalleryCategory;
  status?: GalleryStatus;
  builder?: string;
  featured?: boolean;
  images: GalleryImage[];
}

interface NormalizedGalleryItem extends GalleryItem {
  category: GalleryCategory;
  status: GalleryStatus;
  builder: string;
  cover: GalleryImage;
}

const galleryItems = galleryData as GalleryItem[];
const galleryItemParam = 'item';

function getImageKey(itemId: string, imageIndex: number) {
  return `${itemId}-${imageIndex}`;
}

function getRequestedItemId() {
  return new URLSearchParams(window.location.search).get(galleryItemParam);
}

function replaceItemInUrl(itemId: string) {
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set(galleryItemParam, itemId);
  nextUrl.hash = '';
  window.history.replaceState(
    null,
    '',
    `${nextUrl.pathname}${nextUrl.search}`,
  );
}

function replaceIndexUrl() {
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.delete(galleryItemParam);
  nextUrl.hash = '';
  window.history.replaceState(
    null,
    '',
    nextUrl.search ? `${nextUrl.pathname}${nextUrl.search}` : nextUrl.pathname,
  );
}

function normalizeItem(item: GalleryItem): NormalizedGalleryItem {
  return {
    ...item,
    category: item.category ?? '建筑',
    status: item.status ?? '已完成',
    builder: item.builder ?? '社区成员',
    cover: item.images[0],
  };
}

function ArrowIcon({ direction }: { direction: ArrowDirection }) {
  const path =
    direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6';

  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Zm5.1-1.9 4.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M19 12H5m0 0 6-6m-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Gallery() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [imageMotion, setImageMotion] = useState<ImageMotion>('none');

  const normalizedItems = useMemo(
    () => galleryItems.map((item) => normalizeItem(item)),
    [],
  );
  const selectedItem =
    normalizedItems.find((item) => item.id === selectedItemId) ?? null;
  const currentImage =
    selectedItem?.images[currentImageIndex] ?? selectedItem?.images[0] ?? null;
  const currentImageKey =
    selectedItem && currentImage
      ? getImageKey(selectedItem.id, currentImageIndex)
      : '';
  const imageLoaded = currentImageKey ? imagesLoaded.has(currentImageKey) : true;

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return normalizedItems.filter((item) => {
      const searchable = [
        item.title,
        item.description,
        item.builder,
        item.category,
        item.status,
        ...item.images.map((image) => image.alt),
      ]
        .join(' ')
        .toLowerCase();

      return !query || searchable.includes(query);
    });
  }, [normalizedItems, searchQuery]);

  useEffect(() => {
    const syncFromUrl = () => {
      const requestedItemId = getRequestedItemId();
      const itemExists = normalizedItems.some(
        (item) => item.id === requestedItemId,
      );

      if (requestedItemId && itemExists) {
        setSelectedItemId(requestedItemId);
        setCurrentImageIndex(0);
        window.scrollTo(0, 0);
        return;
      }

      setSelectedItemId(null);
      setCurrentImageIndex(0);
      if (requestedItemId || window.location.hash) {
        replaceIndexUrl();
      }
    };

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);

    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, [normalizedItems]);

  useEffect(() => {
    normalizedItems.forEach((item) => {
      item.images.forEach((image, imageIndex) => {
        const img = new Image();
        img.onload = () => {
          const loadedKey = getImageKey(item.id, imageIndex);
          setImagesLoaded((previous) => {
            const next = new Set(previous);
            next.add(loadedKey);
            return next;
          });
        };
        img.src = image.src;
      });
    });
  }, [normalizedItems]);

  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === 'ArrowRight') {
        nextImage();
      }

      if (event.key === 'ArrowLeft') {
        prevImage();
      }

      if (event.key === 'Escape') {
        showIndex();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  });

  const markImageLoaded = () => {
    if (!currentImageKey) return;

    setImagesLoaded((previous) => {
      const next = new Set(previous);
      next.add(currentImageKey);
      return next;
    });
  };

  const showDetail = (itemId: string) => {
    setSelectedItemId(itemId);
    setCurrentImageIndex(0);
    setImageMotion('none');
    replaceItemInUrl(itemId);
    window.scrollTo(0, 0);
  };

  const showIndex = () => {
    setSelectedItemId(null);
    setCurrentImageIndex(0);
    setImageMotion('none');
    replaceIndexUrl();
    window.scrollTo(0, 0);
  };

  const changeImage = (
    newImageIndex: number,
    motion: ImageMotion = 'jump',
  ) => {
    if (!selectedItem || newImageIndex === currentImageIndex) return;
    setImageMotion(motion);
    setCurrentImageIndex(newImageIndex);
  };

  const nextImage = () => {
    if (!selectedItem) return;
    const nextIndex =
      currentImageIndex < selectedItem.images.length - 1
        ? currentImageIndex + 1
        : 0;
    changeImage(nextIndex, 'next');
  };

  const prevImage = () => {
    if (!selectedItem) return;
    const prevIndex =
      currentImageIndex > 0
        ? currentImageIndex - 1
        : selectedItem.images.length - 1;
    changeImage(prevIndex, 'prev');
  };

  const renderProjectCard = (item: NormalizedGalleryItem, index: number) => {
    const isFeatured = viewMode === 'grid' && (item.featured || index === 0);

    return (
      <button
        key={item.id}
        type="button"
        className={`${styles.projectCard} ${
          isFeatured ? styles.projectCardFeatured : ''
        } ${viewMode === 'list' ? styles.projectCardList : ''}`}
        onClick={() => showDetail(item.id)}
      >
        <span className={styles.projectImageFrame}>
          <img src={item.cover.src} alt="" loading="lazy" />
        </span>
        <span className={styles.projectContent}>
          <span className={styles.projectTitle}>{item.title}</span>
          <span className={styles.projectDivider} />
          <span className={styles.projectMeta}>
            <span>{item.category}</span>
            <span>{item.status}</span>
            <span>{item.images.length} 张影像</span>
          </span>
          <span className={styles.projectBuilder}>{item.builder}</span>
        </span>
      </button>
    );
  };

  return (
    <Layout title="风光一览" description="Lie-downCraft 服务器画廊">
      <main className={styles.galleryPage}>
        {!selectedItem && (
          <>
            <section className={styles.galleryHero}>
              <div>
                <h1>风光一览</h1>
                <p>
                  从社区地标到机械工程，把服务器里值得停留的瞬间整理成可搜索的项目索引。
                </p>
              </div>
            </section>

            <section className={styles.galleryControls} aria-label="画廊控制">
              <label className={styles.searchControl}>
                <SearchIcon />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="搜索主题、建造者、图片说明..."
                  aria-label="搜索画廊项目"
                />
              </label>

              <div className={styles.resultBar}>
                <span>
                  {filteredItems.length} OF {normalizedItems.length} SHOWN
                </span>
                <div className={styles.viewToggle} aria-label="切换视图">
                  <button
                    type="button"
                    className={viewMode === 'grid' ? styles.viewToggleActive : ''}
                    onClick={() => setViewMode('grid')}
                    aria-label="网格视图"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <GridIcon />
                  </button>
                  <button
                    type="button"
                    className={viewMode === 'list' ? styles.viewToggleActive : ''}
                    onClick={() => setViewMode('list')}
                    aria-label="列表视图"
                    aria-pressed={viewMode === 'list'}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </section>

            <section aria-label="画廊项目">
              {filteredItems.length > 0 ? (
                <div
                  className={`${styles.projectGrid} ${
                    viewMode === 'list' ? styles.projectList : ''
                  }`}
                >
                  {filteredItems.map((item, index) =>
                    renderProjectCard(item, index),
                  )}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <strong>没有找到匹配的项目</strong>
                  <span>试试清空搜索词，或换一个关键词。</span>
                </div>
              )}
            </section>
          </>
        )}

        {selectedItem && currentImage && (
          <section className={styles.detailLayout} aria-label="项目详情">
            <div className={styles.detailHeader}>
              <button
                type="button"
                className={styles.backButton}
                onClick={showIndex}
              >
                <BackIcon />
                返回全部项目
              </button>
              <div className={styles.detailMeta}>
                <span>{selectedItem.category}</span>
                <span>{selectedItem.status}</span>
                <span>{selectedItem.builder}</span>
              </div>
            </div>

            <div className={styles.detailIntro}>
              <div>
                <p>{currentImage.alt}</p>
                <h1>{selectedItem.title}</h1>
              </div>
              <span className={styles.detailCounter}>
                {currentImageIndex + 1} / {selectedItem.images.length}
              </span>
            </div>

            <figure
              className={`${styles.imageStage} ${
                imageMotion === 'next'
                  ? styles.imageStageNext
                  : imageMotion === 'prev'
                    ? styles.imageStagePrev
                    : imageMotion === 'jump'
                      ? styles.imageStageJump
                      : ''
              }`}
            >
              {!imageLoaded && <div className={styles.imageSkeleton} />}
              <img
                key={currentImageKey}
                className={styles.featuredImage}
                src={currentImage.src}
                alt={currentImage.alt}
                onLoad={markImageLoaded}
              />
              <button
                type="button"
                className={`${styles.stageButton} ${styles.prevButton}`}
                onClick={prevImage}
                aria-label="上一张图片"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                className={`${styles.stageButton} ${styles.nextButton}`}
                onClick={nextImage}
                aria-label="下一张图片"
              >
                <ArrowIcon direction="right" />
              </button>
            </figure>

            <div className={styles.detailBody}>
              <p>{selectedItem.description}</p>
              <div className={styles.thumbnailStrip} aria-label="当前主题缩略图">
                {selectedItem.images.map((image, imageIndex) => {
                  const isActive = imageIndex === currentImageIndex;

                  return (
                    <button
                      key={image.src}
                      type="button"
                      className={`${styles.thumbnailButton} ${
                        isActive ? styles.thumbnailActive : ''
                      }`}
                      onClick={() => changeImage(imageIndex, 'jump')}
                      aria-label={`查看 ${image.alt}`}
                      aria-pressed={isActive}
                    >
                      <img src={image.src} alt="" loading="lazy" />
                      <span>{image.alt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
