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

const INITIAL_MAP_CENTER = {
  lng: 37.588144,
  lat: 55.733842,
}

const INITIAL_MAP_ZOOM = 10
const YANDEX_GEOCODER_API_KEY = '0e2f26fb-0dd2-4844-b9b2-1ff5867cb501'
const TILE_SIZE = 256
const EARTH_RADIUS = 6378137

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

const degreesToRadians = (value) => (value * Math.PI) / 180
const radiansToDegrees = (value) => (value * 180) / Math.PI

const lngToWorldX = (lng, zoom) => {
  const scale = TILE_SIZE * 2 ** zoom
  return ((lng + 180) / 360) * scale
}

const latToWorldY = (lat, zoom) => {
  const scale = TILE_SIZE * 2 ** zoom
  const sinLat = Math.sin(degreesToRadians(lat))
  const mercatorY =
    0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)

  return mercatorY * scale
}

const worldXToLng = (x, zoom) => {
  const scale = TILE_SIZE * 2 ** zoom
  return (x / scale) * 360 - 180
}

const worldYToLat = (y, zoom) => {
  const scale = TILE_SIZE * 2 ** zoom
  const normalizedY = y / scale
  const mercator = Math.PI * (1 - 2 * normalizedY)
  return radiansToDegrees(Math.atan(Math.sinh(mercator)))
}

const screenPointToGeo = (screenX, screenY, viewportWidth, viewportHeight, center, zoom) => {
  const centerWorldX = lngToWorldX(center.lng, zoom)
  const centerWorldY = latToWorldY(center.lat, zoom)

  const pointWorldX = centerWorldX + (screenX - viewportWidth / 2)
  const pointWorldY = centerWorldY + (screenY - viewportHeight / 2)

  return {
    lng: worldXToLng(pointWorldX, zoom),
    lat: worldYToLat(pointWorldY, zoom),
  }
}

const calculatePolygonAreaSquareMeters = (points) => {
  if (points.length < 3) {
    return 0
  }

  const averageLat =
    points.reduce((sum, point) => sum + point.lat, 0) / points.length
  const averageLng =
    points.reduce((sum, point) => sum + point.lng, 0) / points.length

  const averageLatRad = degreesToRadians(averageLat)
  const averageLngRad = degreesToRadians(averageLng)

  const projectedPoints = points.map((point) => {
    const latRad = degreesToRadians(point.lat)
    const lngRad = degreesToRadians(point.lng)

    return {
      x: EARTH_RADIUS * (lngRad - averageLngRad) * Math.cos(averageLatRad),
      y: EARTH_RADIUS * (latRad - averageLatRad),
    }
  })

  let areaAccumulator = 0

  for (let index = 0; index < projectedPoints.length; index += 1) {
    const currentPoint = projectedPoints[index]
    const nextPoint = projectedPoints[(index + 1) % projectedPoints.length]

    areaAccumulator += currentPoint.x * nextPoint.y - nextPoint.x * currentPoint.y
  }

  return Math.abs(areaAccumulator) / 2
}

const formatArea = (area) => {
  const roundedArea = Math.round(area)
  return roundedArea.toLocaleString('ru-RU')
}

export default function App() {
  const [activeTab, setActiveTab] = useState('how')
  const [selectedService, setSelectedService] = useState(sortedServiceItems[0].id)
  const [selectedServiceTag, setSelectedServiceTag] = useState(sortedServiceItems[0].tag)
  const [address, setAddress] = useState('')
  const [hoveredService, setHoveredService] = useState(null)
  const [currentPage, setCurrentPage] = useState('services')
  const [usePointsMode, setUsePointsMode] = useState(false)
  const [mapCenter, setMapCenter] = useState(INITIAL_MAP_CENTER)
  const [mapZoom, setMapZoom] = useState(INITIAL_MAP_ZOOM)
  const [latitude, setLatitude] = useState(INITIAL_MAP_CENTER.lat)
  const [longitude, setLongitude] = useState(INITIAL_MAP_CENTER.lng)
  const [polygonPoints, setPolygonPoints] = useState([])
  const [savedAreaSquareMeters, setSavedAreaSquareMeters] = useState(null)
  const [isPolygonHovered, setIsPolygonHovered] = useState(false)
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

  const mapUrl = useMemo(
    () =>
      `https://yandex.ru/map-widget/v1/?ll=${mapCenter.lng}%2C${mapCenter.lat}&z=${mapZoom}&lang=ru_RU`,
    [mapCenter, mapZoom],
  )

  const point1Lng = polygonPoints[0]?.lng ?? null
  const point1Lat = polygonPoints[0]?.lat ?? null
  const point2Lng = polygonPoints[1]?.lng ?? null
  const point2Lat = polygonPoints[1]?.lat ?? null
  const point3Lng = polygonPoints[2]?.lng ?? null
  const point3Lat = polygonPoints[2]?.lat ?? null
  const point4Lng = polygonPoints[3]?.lng ?? null
  const point4Lat = polygonPoints[3]?.lat ?? null

  const polygonCoordinates = {
    point1Lng,
    point1Lat,
    point2Lng,
    point2Lat,
    point3Lng,
    point3Lat,
    point4Lng,
    point4Lat,
  }

  const currentPolygonAreaSquareMeters = useMemo(
    () => calculatePolygonAreaSquareMeters(polygonPoints),
    [polygonPoints],
  )

  const polygonTooltipPosition = useMemo(() => {
    if (polygonPoints.length !== 4) {
      return null
    }

    const averageX =
      polygonPoints.reduce((sum, point) => sum + point.x, 0) / polygonPoints.length
    const averageY =
      polygonPoints.reduce((sum, point) => sum + point.y, 0) / polygonPoints.length

    return {
      x: averageX + 16,
      y: averageY - 12,
    }
  }, [polygonPoints])

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
      savedAreaSquareMeters,
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
      setMapCenter({
        lng: nextLongitude,
        lat: nextLatitude,
      })
      setMapZoom(16)

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
    setSavedAreaSquareMeters(null)
    setIsPolygonHovered(false)
    console.log('Полигон сброшен')
  }

  const handlePolygonSubmit = () => {
    if (polygonPoints.length !== 4) {
      console.log('Сначала нужно поставить 4 точки')
      return
    }

    setSavedAreaSquareMeters(currentPolygonAreaSquareMeters)

    console.log('Площадь сохранена:', {
      areaSquareMeters: currentPolygonAreaSquareMeters,
      polygonCoordinates,
      serviceTag: selectedServiceTag,
    })
  }

  const handleMapOverlayClick = (event) => {
    if (!usePointsMode || currentPage !== 'details') {
      return
    }

    if (polygonPoints.length >= 4) {
      return
    }

    const geoPoint = screenPointToGeo(
      event.clientX,
      event.clientY,
      viewportSize.width,
      viewportSize.height,
      mapCenter,
      mapZoom,
    )

    const nextPoint = {
      x: event.clientX,
      y: event.clientY,
      lng: geoPoint.lng,
      lat: geoPoint.lat,
    }

    setPolygonPoints((prev) => {
      const nextPoints = [...prev, nextPoint]

      console.log('Точки полигона:', nextPoints)
      console.log('Координаты точек:', {
        point1Lng: nextPoints[0]?.lng ?? null,
        point1Lat: nextPoints[0]?.lat ?? null,
        point2Lng: nextPoints[1]?.lng ?? null,
        point2Lat: nextPoints[1]?.lat ?? null,
        point3Lng: nextPoints[2]?.lng ?? null,
        point3Lat: nextPoints[2]?.lat ?? null,
        point4Lng: nextPoints[3]?.lng ?? null,
        point4Lat: nextPoints[3]?.lat ?? null,
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
              onMouseEnter={() => setIsPolygonHovered(true)}
              onMouseLeave={() => setIsPolygonHovered(false)}
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

      {polygonPoints.length === 4 && isPolygonHovered && polygonTooltipPosition && (
        <div
          style={{
            position: 'fixed',
            left: `${polygonTooltipPosition.x}px`,
            top: `${polygonTooltipPosition.y}px`,
            zIndex: 4,
            pointerEvents: 'none',
            padding: '10px 12px',
            border: '1px solid var(--stroke)',
            borderRadius: '14px',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-soft)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: 1.35,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          Площадь области {formatArea(currentPolygonAreaSquareMeters)} м²
        </div>
      )}

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
            currentPage={currentPage}
          />
        </main>
      </div>
    </div>
  )
}