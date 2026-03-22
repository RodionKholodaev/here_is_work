import { useEffect, useMemo, useRef, useState } from 'react'
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

const YANDEX_MAPS_API_KEY = '0e2f26fb-0dd2-4844-b9b2-1ff5867cb501'
const YANDEX_GEOCODER_API_KEY = '0e2f26fb-0dd2-4844-b9b2-1ff5867cb501'

const INITIAL_MAP_CENTER = [55.733842, 37.588144]
const INITIAL_MAP_ZOOM = 10

let yandexApiPromise = null

const loadScript = (src, id) =>
  new Promise((resolve, reject) => {
    const existingScript = document.getElementById(id)

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve()
        return
      }

      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error(`Не удалось загрузить скрипт ${id}`)),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = true

    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }

    script.onerror = () => {
      reject(new Error(`Не удалось загрузить скрипт ${id}`))
    }

    document.head.appendChild(script)
  })

const loadYandexMapsApi = async () => {
  if (window.ymaps?.util?.calculateArea) {
    return window.ymaps
  }

  if (yandexApiPromise) {
    return yandexApiPromise
  }

  yandexApiPromise = (async () => {
    await loadScript(
      `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(
        YANDEX_MAPS_API_KEY,
      )}&lang=ru_RU`,
      'yandex-maps-api',
    )

    await loadScript(
      'https://yastatic.net/s3/mapsapi-jslibs/area/0.0.1/util.calculateArea.min.js',
      'yandex-area-plugin',
    )

    await window.ymaps.ready(['util.calculateArea'])
    return window.ymaps
  })()

  return yandexApiPromise
}

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

const createPolygonCoordinates = (points) => {
  if (points.length !== 4) {
    return []
  }

  const ring = points.map((point) => [point.lat, point.lng])
  ring.push([points[0].lat, points[0].lng])
  return [ring]
}

const formatArea = (area) => Math.round(area).toLocaleString('ru-RU')

export default function App() {
  const [activeTab, setActiveTab] = useState('how')
  const [selectedService, setSelectedService] = useState(sortedServiceItems[0].id)
  const [selectedServiceTag, setSelectedServiceTag] = useState(sortedServiceItems[0].tag)
  const [address, setAddress] = useState('')
  const [hoveredService, setHoveredService] = useState(null)
  const [currentPage, setCurrentPage] = useState('services')
  const [usePointsMode, setUsePointsMode] = useState(false)
  const [latitude, setLatitude] = useState(INITIAL_MAP_CENTER[0])
  const [longitude, setLongitude] = useState(INITIAL_MAP_CENTER[1])
  const [polygonPoints, setPolygonPoints] = useState([])
  const [previewAreaSquareMeters, setPreviewAreaSquareMeters] = useState(null)
  const [savedAreaSquareMeters, setSavedAreaSquareMeters] = useState(null)

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const pointMarkersRef = useRef([])
  const polygonRef = useRef(null)
  const currentPageRef = useRef(currentPage)
  const usePointsModeRef = useRef(usePointsMode)
  const polygonPointsRef = useRef(polygonPoints)

  useEffect(() => {
    currentPageRef.current = currentPage
  }, [currentPage])

  useEffect(() => {
    usePointsModeRef.current = usePointsMode
  }, [usePointsMode])

  useEffect(() => {
    polygonPointsRef.current = polygonPoints
  }, [polygonPoints])

  const selectedServiceData = useMemo(
    () =>
      sortedServiceItems.find((service) => service.id === selectedService) ??
      sortedServiceItems[0],
    [selectedService],
  )

  useEffect(() => {
    let isMounted = true

    const initMap = async () => {
      try {
        const ymaps = await loadYandexMapsApi()

        if (!isMounted || !mapContainerRef.current || mapRef.current) {
          return
        }

        const mapInstance = new ymaps.Map(
          mapContainerRef.current,
          {
            center: INITIAL_MAP_CENTER,
            zoom: INITIAL_MAP_ZOOM,
            controls: ['zoomControl'],
          },
          {
            suppressMapOpenBlock: true,
          },
        )

        mapInstance.events.add('click', (event) => {
          if (currentPageRef.current !== 'details' || !usePointsModeRef.current) {
            return
          }

          if (polygonPointsRef.current.length >= 4) {
            return
          }

          const coords = event.get('coords')

          setPolygonPoints((prev) => {
            if (prev.length >= 4) {
              return prev
            }

            const nextPoints = [
              ...prev,
              {
                lat: coords[0],
                lng: coords[1],
              },
            ]

            return nextPoints
          })
        })

        mapInstance.events.add('boundschange', () => {
          const center = mapInstance.getCenter()
          setLatitude(center[0])
          setLongitude(center[1])
        })

        mapRef.current = mapInstance
      } catch (error) {
        console.error('Ошибка инициализации карты:', error)
      }
    }

    initMap()

    return () => {
      isMounted = false

      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!window.ymaps?.util?.calculateArea) {
      return
    }

    if (polygonPoints.length !== 4) {
      setPreviewAreaSquareMeters(null)
      return
    }

    const polygonCoordinates = createPolygonCoordinates(polygonPoints)

    const polygonGeoObject = new window.ymaps.GeoObject({
      geometry: {
        type: 'Polygon',
        coordinates: polygonCoordinates,
      },
    })

    const nextArea = Math.round(window.ymaps.util.calculateArea(polygonGeoObject))
    setPreviewAreaSquareMeters(nextArea)
  }, [polygonPoints])

  useEffect(() => {
    if (!mapRef.current || !window.ymaps) {
      return
    }

    const ymaps = window.ymaps
    const mapInstance = mapRef.current

    pointMarkersRef.current.forEach((marker) => {
      mapInstance.geoObjects.remove(marker)
    })
    pointMarkersRef.current = []

    if (polygonRef.current) {
      mapInstance.geoObjects.remove(polygonRef.current)
      polygonRef.current = null
    }

    polygonPoints.forEach((point, index) => {
      const marker = new ymaps.Placemark(
        [point.lat, point.lng],
        {
          iconCaption: `${index + 1}`,
        },
        {
          preset: 'islands#blueCircleDotIconWithCaption',
        },
      )

      pointMarkersRef.current.push(marker)
      mapInstance.geoObjects.add(marker)
    })

    if (polygonPoints.length === 4) {
      const polygonCoordinates = createPolygonCoordinates(polygonPoints)
      const polygon = new ymaps.Polygon(
        polygonCoordinates,
        {
          hintContent: `Площадь области ${formatArea(previewAreaSquareMeters ?? 0)} м²`,
        },
        {
          fillColor: '2f6fe455',
          strokeColor: '2f6fe4ff',
          strokeWidth: 3,
          interactivityModel: 'default#geoObject',
        },
      )

      polygonRef.current = polygon
      mapInstance.geoObjects.add(polygon)
    }
  }, [polygonPoints, previewAreaSquareMeters])

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
      polygonPoints,
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

      if (mapRef.current) {
        mapRef.current.setCenter([nextLatitude, nextLongitude], 16, {
          duration: 300,
        })
      }

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
    setPreviewAreaSquareMeters(null)
    setSavedAreaSquareMeters(null)
    console.log('Полигон сброшен')
  }

  const handlePolygonSubmit = () => {
    if (polygonPoints.length !== 4 || previewAreaSquareMeters === null) {
      console.log('Сначала нужно поставить 4 точки')
      return
    }

    setSavedAreaSquareMeters(previewAreaSquareMeters)

    console.log('Площадь сохранена:', {
      areaSquareMeters: previewAreaSquareMeters,
      polygonPoints,
      serviceTag: selectedServiceTag,
    })
  }

  return (
    <div
      className="appShell"
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <div
        ref={mapContainerRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          background: '#e5e7eb',
        }}
      />

      <div
        className="pageFrame"
        style={{
          position: 'relative',
          zIndex: 1,
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