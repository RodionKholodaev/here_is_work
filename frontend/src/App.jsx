import { useMemo, useState } from 'react'
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
  const [useBrushMode, setUseBrushMode] = useState(false)

  const selectedServiceData = useMemo(
    () =>
      sortedServiceItems.find((service) => service.id === selectedService) ??
      sortedServiceItems[0],
    [selectedService],
  )

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

    console.log('Переход на вторую страницу:', {
      address,
      serviceId: selectedServiceData.id,
      serviceTag: selectedServiceData.tag,
    })
  }

  const handleAddressSubmit = async () => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    console.log('Ввод адреса:', address)

    try {
      console.log('Отправляем запрос...')

      const response = await fetch(
        'http://127.0.0.1:8000/order/get-coordinates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adress: address,
          }),
        },
      )

      console.log('Ответ получен:', response)

      const data = await response.json()

      console.log('JSON получен:', data)
    } catch (error) {
      console.error('Ошибка запроса:', error)
    }
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
          src={YANDEX_MAP_EMBED_URL}
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
            zIndex: 2,
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
              zIndex: 2,
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
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              }}
            >
              <label
                style={{
                  minHeight: '58px',
                  borderRight: '1px solid var(--stroke)',
                  borderBottom: '1px solid var(--stroke)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px 10px',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={usePointsMode}
                  onChange={(event) => setUsePointsMode(event.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    margin: 0,
                    accentColor: 'var(--accent)',
                    cursor: 'pointer',
                  }}
                />
                <span>Точки</span>
              </label>

              <label
                style={{
                  minHeight: '58px',
                  borderBottom: '1px solid var(--stroke)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px 10px',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={useBrushMode}
                  onChange={(event) => setUseBrushMode(event.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    margin: 0,
                    accentColor: 'var(--accent)',
                    cursor: 'pointer',
                  }}
                />
                <span>Кисть</span>
              </label>

              <button
                type="button"
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
                Сохранить
              </button>
            </div>
          </div>
        )}

        <main
          style={{
            marginTop: '20px',
            position: 'relative',
            zIndex: 2,
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