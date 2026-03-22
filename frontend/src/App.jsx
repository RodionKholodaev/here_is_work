import { useEffect, useMemo, useState } from 'react'
import './App.css'
import logoImage from './assets_for_app/LOGO.png'
import grassImage from './assets_for_app/GRASS.png'
import iceKillImage from './assets_for_app/ICEKILL.png'
import leavesImage from './assets_for_app/LEAVES.png'
import handImage from './assets_for_app/HAND.png'
import mechImage from './assets_for_app/MECH.png'
import snowHandImage from './assets_for_app/SNOWHAND.png'
import mechSummerImage from './assets_for_app/MECHSUMMER.png'
import coatingsImage from './assets_for_app/COATINGS.png'
import garbCollectorImage from './assets_for_app/GARBCOLLECTOR.png'
import LeftSidebar from './LeftSidebar'

const YANDEX_MAP_EMBED_URL =
  'https://yandex.ru/map-widget/v1/?ll=37.588144%2C55.733842&z=10&lang=ru_RU'

const YANDEX_GEOCODER_API_KEY = '0e2f26fb-0dd2-4844-b9b2-1ff5867cb501'

const navItems = [
  { id: 'how', label: 'Как работает' },
  { id: 'pricing', label: 'Тарифы' },
  { id: 'support', label: 'Поддержка' },
]

const serviceItems = [
  {
    id: 'anti-ice',
    title: 'Антигололедная обработка',
    price: 'от 8 ₽/м²',
    sortValue: 8,
    tag: 'ICEKILL',
    descr: 'Рассыпка песка, соли или реагентов против наледи.',
  },
  {
    id: 'lawn-care',
    title: 'Покос травы',
    price: 'от 10 ₽/м²',
    sortValue: 10,
    tag: 'GRASS',
    descr: 'Покос травы, сбор скошенной растительности.',
  },
  {
    id: 'leaf-collection',
    title: 'Сбор листвы',
    price: 'от 12 ₽/м²',
    sortValue: 12,
    tag: 'LEAVES',
    descr: 'Сгребание, упаковка в мешки и вывоз листвы.',
  },
  {
    id: 'manual-cleaning',
    title: 'Ручная уборка',
    price: 'от 15 ₽/м²',
    sortValue: 15,
    tag: 'HAND',
    descr: 'Подметание дорожек и тротуаров, сбор мелкого мусора.',
  },
  {
    id: 'mechanized-summer',
    title: 'Механизированная уборка',
    price: 'от 18 ₽/м²',
    sortValue: 18,
    tag: 'MECH',
    descr: 'Очистка территории трактором со щеткой или отвалом, сдвигание снега в валы.',
  },
  {
    id: 'snow-cleaning',
    title: 'Уборка снега',
    price: 'от 20 ₽/м²',
    sortValue: 20,
    tag: 'SNOWHAND',
    descr: 'Очистка покрытий от свежего и слежавшегося снега.',
  },
  {
    id: 'mechanized-winter',
    title: 'Мехуборка летняя',
    price: 'от 24 ₽/м²',
    sortValue: 24,
    tag: 'MECHSUMMER',
    descr: 'Подметальные машины, мойки высокого давления.',
  },
  {
    id: 'pressure-wash',
    title: 'Мойка покрытий',
    price: 'от 30 ₽/м²',
    sortValue: 30,
    tag: 'COATINGS',
    descr: 'Очистка урн, скамеек, детских и спортивных площадок.',
  },
  {
    id: 'garbage-haul',
    title: 'Погрузка и вывоз мусора',
    price: 'от 1 500 ₽/рейс',
    sortValue: 1500,
    tag: 'GARBCOLLECTOR',
    descr: 'Сбор, погрузка и вывоз веток, мешков, КГМ',
  },
  {
    id: 'container-site',
    title: 'Содержание КП',
    price: 'от 1 500 ₽/площадка',
    sortValue: 1501,
    tag: 'CONTAINER_SITE',
    descr: 'Очистка территории вокруг баков, мытье контейнеров',
  },
]

const serviceIcons = {
  ICEKILL: iceKillImage,
  GRASS: grassImage,
  LEAVES: leavesImage,
  HAND: handImage,
  MECH: mechImage,
  SNOWHAND: snowHandImage,
  MECHSUMMER: mechSummerImage,
  COATINGS: coatingsImage,
  GARBCOLLECTOR: garbCollectorImage,
}

const sortedServiceItems = [...serviceItems].sort((a, b) => a.sortValue - b.sortValue)

export default function App() {
  const [activeTab, setActiveTab] = useState('how')
  const [selectedService, setSelectedService] = useState(sortedServiceItems[0].id)
  const [selectedServiceTag, setSelectedServiceTag] = useState(sortedServiceItems[0].tag)
  const [address, setAddress] = useState('')
  const [hoveredService, setHoveredService] = useState(null)
  const [currentPage, setCurrentPage] = useState('services')
  const [usePointsMode, setUsePointsMode] = useState(false)
  const [mapUrl, setMapUrl] = useState(YANDEX_MAP_EMBED_URL)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [polygonPoints, setPolygonPoints] = useState([])
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const selectedServiceData = useMemo(
    () =>
      sortedServiceItems.find((service) => service.id === selectedService) ??
      sortedServiceItems[0],
    [selectedService],
  )

  const point1X = polygonPoints[0]?.x ?? null
  const point1Y = polygonPoints[0]?.y ?? null
  const point2X = polygonPoints[1]?.x ?? null
  const point2Y = polygonPoints[1]?.y ?? null
  const point3X = polygonPoints[2]?.x ?? null
  const point3Y = polygonPoints[2]?.y ?? null
  const point4X = polygonPoints[3]?.x ?? null
  const point4Y = polygonPoints[3]?.y ?? null

  const polygonCoordinates = {
    point1X,
    point1Y,
    point2X,
    point2Y,
    point3X,
    point3Y,
    point4X,
    point4Y,
  }

  const handleAccountClick = () => {
    console.log('Клик по аккаунту')
  }

  const handleContinueClick = () => {
    const hasAddress = address.trim().length > 0
    const hasService = Boolean(selectedServiceData)

    if (!hasAddress || !hasService) {
      console.log('Для перехода нужно ввести адрес и выбрать услугу')
      return
    }

    setSelectedServiceTag(selectedServiceData.tag)
    setCurrentPage('details')

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    console.log('Переход на вторую страницу:', {
      address,
      serviceId: selectedServiceData.id,
      serviceTag: selectedServiceData.tag,
      latitude,
      longitude,
      polygonCoordinates,
    })
  }

  const handleAddressSubmit = async () => {
    const trimmedAddress = address.trim()

    console.log('Ввод адреса:', trimmedAddress)

    if (!trimmedAddress) {
      console.error('Адрес пустой')
      return
    }

    try {
      console.log('Отправляем запрос в Yandex Geocoder...')

      const geocoderUrl =
        `https://geocode-maps.yandex.ru/v1/?apikey=${encodeURIComponent(YANDEX_GEOCODER_API_KEY)}&geocode=${encodeURIComponent(trimmedAddress)}&format=json&lang=ru_RU&results=1`

      const response = await fetch(geocoderUrl, {
        method: 'GET',
      })

      console.log('Ответ получен:', response)

      if (!response.ok) {
        throw new Error(`Ошибка Geocoder API: ${response.status}`)
      }

      const data = await response.json()

      console.log('JSON получен:', data)

      const pointPos =
        data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point?.pos

      if (!pointPos) {
        console.error('Координаты не найдены в ответе:', data)
        return
      }

      const [rawLongitude, rawLatitude] = pointPos.trim().split(/\s+/)
      const nextLongitude = Number(rawLongitude)
      const nextLatitude = Number(rawLatitude)

      if (!Number.isFinite(nextLongitude) || !Number.isFinite(nextLatitude)) {
        console.error('Некорректные координаты:', pointPos)
        return
      }

      setLongitude(nextLongitude)
      setLatitude(nextLatitude)

      const nextMapUrl =
        `https://yandex.ru/map-widget/v1/?ll=${nextLongitude}%2C${nextLatitude}&z=16&lang=ru_RU`

      setMapUrl(nextMapUrl)

      console.log('Карта перемещена на координаты:', {
        latitude: nextLatitude,
        longitude: nextLongitude,
      })
    } catch (error) {
      console.error('Ошибка запроса:', error)
    }
  }

  const handlePointsModeToggle = () => {
    setUsePointsMode((prev) => !prev)
  }

  const handlePolygonReset = () => {
    setPolygonPoints([])
    console.log('Полигон сброшен')
  }

  const handlePolygonSubmit = () => {
    console.log('Заглушка ввода полигона:', {
      serviceTag: selectedServiceTag,
      polygonCoordinates,
    })
  }

  const handleMapOverlayClick = (event) => {
    if (!usePointsMode || currentPage !== 'details') {
      return
    }

    if (polygonPoints.length >= 4) {
      return
    }

    const nextPoint = {
      x: event.clientX,
      y: event.clientY,
    }

    setPolygonPoints((prev) => {
      const nextPoints = [...prev, nextPoint]

      console.log('Точки полигона:', nextPoints)
      console.log('Координаты точек:', {
        point1X: nextPoints[0]?.x ?? null,
        point1Y: nextPoints[0]?.y ?? null,
        point2X: nextPoints[1]?.x ?? null,
        point2Y: nextPoints[1]?.y ?? null,
        point3X: nextPoints[2]?.x ?? null,
        point3Y: nextPoints[2]?.y ?? null,
        point4X: nextPoints[3]?.x ?? null,
        point4Y: nextPoints[3]?.y ?? null,
      })

      return nextPoints
    })
  }

  const polygonPointsString = polygonPoints.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div
      className="appShell"
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          background: '#e5e7eb',
        }}
      >
        <iframe
          src={mapUrl}
          title="Яндекс Карта"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          style={{
            display: 'block',
            border: '0',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <div
        onClick={handleMapOverlayClick}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: currentPage === 'details' && usePointsMode ? 'auto' : 'none',
          cursor:
            currentPage === 'details' && usePointsMode && polygonPoints.length < 4
              ? 'crosshair'
              : 'default',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
          preserveAspectRatio="none"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        >
          {polygonPoints.length === 4 && (
            <polygon
              points={polygonPointsString}
              fill="rgba(47, 111, 228, 0.24)"
              stroke="rgba(47, 111, 228, 0.9)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          )}

          {polygonPoints.length > 1 && polygonPoints.length < 4 && (
            <polyline
              points={polygonPointsString}
              fill="none"
              stroke="rgba(47, 111, 228, 0.9)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {polygonPoints.map((point, index) => (
            <g key={`${point.x}-${point.y}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="rgba(47, 111, 228, 0.95)"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <text
                x={point.x}
                y={point.y - 14}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill="rgba(31, 42, 61, 0.95)"
              >
                {index + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div
        className="pageFrame"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
          pointerEvents: 'none',
        }}
      >
        <header
          className="topBar"
          style={{
            position: 'relative',
            zIndex: 3,
            pointerEvents: 'auto',
          }}
        >
          <div
            className="logoButton"
            aria-label="Логотип"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
              opacity: 1.5,
            }}
          >
            <img
              src={logoImage}
              alt="Логотип"
              style={{
                maxWidth: '300%',
                maxHeight: '240%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          <nav className="topNav" aria-label="Основная навигация">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`navButton ${activeTab === item.id ? 'navButtonActive' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="accountButton"
            onClick={handleAccountClick}
          >
            Аккаунт
          </button>
        </header>

        {currentPage === 'details' && (
          <div
            style={{
              position: 'absolute',
              top: '84px',
              right: '18px',
              zIndex: 3,
              width: '270px',
              border: '2px solid var(--stroke)',
              borderRadius: '24px',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-soft)',
              overflow: 'hidden',
              pointerEvents: 'auto',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div
              style={{
                padding: '18px 18px 16px',
                borderBottom: '1px solid var(--stroke)',
              }}
            >
              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                }}
              >
                Закрасьте предполагаемую область уборки
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              }}
            >
              <button
                type="button"
                onClick={handlePointsModeToggle}
                style={{
                  minHeight: '58px',
                  border: 'none',
                  borderRight: '1px solid var(--stroke)',
                  background: usePointsMode ? 'rgba(47, 111, 228, 0.22)' : 'transparent',
                  color: usePointsMode ? 'var(--accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(event) => {
                  if (!usePointsMode) {
                    event.currentTarget.style.background = 'rgba(47, 111, 228, 0.12)'
                  }
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = usePointsMode
                    ? 'rgba(47, 111, 228, 0.22)'
                    : 'transparent'
                }}
              >
                Точки
              </button>

              <button
                type="button"
                onClick={handlePolygonReset}
                style={{
                  minHeight: '58px',
                  border: 'none',
                  borderRight: '1px solid var(--stroke)',
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'translateY(-1px)'
                  event.currentTarget.style.background = '#bfdbfe'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'translateY(0)'
                  event.currentTarget.style.background = 'var(--accent-soft)'
                }}
              >
                Сбросить
              </button>

              <button
                type="button"
                onClick={handlePolygonSubmit}
                style={{
                  minHeight: '58px',
                  border: 'none',
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'translateY(-1px)'
                  event.currentTarget.style.background = '#bfdbfe'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'translateY(0)'
                  event.currentTarget.style.background = 'var(--accent-soft)'
                }}
              >
                Ввод
              </button>
            </div>
          </div>
        )}

        <main
          style={{
            marginTop: '20px',
            position: 'relative',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <LeftSidebar
            address={address}
            setAddress={setAddress}
            handleAddressSubmit={handleAddressSubmit}
            sortedServiceItems={sortedServiceItems}
            serviceIcons={serviceIcons}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            hoveredService={hoveredService}
            setHoveredService={setHoveredService}
            handleContinueClick={handleContinueClick}
          />
        </main>
      </div>
    </div>
  )
}