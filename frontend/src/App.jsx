import { useMemo, useState } from 'react'
import './App.css'

const YANDEX_MAP_EMBED_URL =
  'https://yandex.ru/map-widget/v1/?ll=37.588144%2C55.733842&z=10&lang=ru_RU'

const navItems = [
  { id: 'how', label: 'Как работает' },
  { id: 'pricing', label: 'Тарифы' },
  { id: 'support', label: 'Поддержка' },
]

const serviceItems = [
  { id: 'anti-ice', title: 'Антигололедная обработка', price: 'от 8 ₽/м²', sortValue: 8,
    descr:'Рассыпка песка, соли или реагентов против наледи.' },

  { id: 'lawn-care', title: 'Покос травы', price: 'от 10 ₽/м²', sortValue: 10,
    descr:'Покос травы, сбор скошенной растительности.'},

  { id: 'leaf-collection', title: 'Сбор листвы', price: 'от 12 ₽/м²', sortValue: 12,
    descr:'Сгребание, упаковка в мешки и вывоз листвы.' },

  { id: 'manual-cleaning', title: 'Ручная уборка', price: 'от 15 ₽/м²', sortValue: 15,
    descr: 'Подметание дорожек и тротуаров, сбор мелкого мусора.'},

  { id: 'mechanized-summer', title: 'Механизированная уборка', price: 'от 18 ₽/м²', sortValue: 18,
    descr:'Очистка территории трактором со щеткой или отвалом, сдвигание снега в валы.' },

  { id: 'snow-cleaning', title: 'Уборка снега', price: 'от 20 ₽/м²', sortValue: 20,
    descr: 'Очистка покрытий от свежего и слежавшегося снега.' },

  { id: 'mechanized-winter', title: 'Мехуборка зимняя', price: 'от 24 ₽/м²', sortValue: 24,
    descr:'Подметальные машины, мойки высокого давления.' },

  { id: 'pressure-wash', title: 'Мойка покрытий', price: 'от 30 ₽/м²', sortValue: 30,
    descr:'Очистка урн, скамеек, детских и спортивных площадок.'},

  { id: 'garbage-haul', title: 'Погрузка и вывоз мусора', price: 'от 1 500 ₽/рейс', sortValue: 1500,
    descr:'Сбор, погрузка и вывоз веток, мешков, КГМ'},

  { id: 'container-site', title: 'Содержание КП', price: 'от 1 500 ₽/площадка', sortValue: 1501,
    descr:'Очистка территории вокруг баков, мытье контейнеров' },
]

const sortedServiceItems = [...serviceItems].sort((a, b) => a.sortValue - b.sortValue)

export default function App() {
  const [activeTab, setActiveTab] = useState('how')
  const [selectedService, setSelectedService] = useState(sortedServiceItems[0].id)
  const [address, setAddress] = useState('')
  const [hoveredService, setHoveredService] = useState(null)

  const selectedServiceData = useMemo(
    () =>
      sortedServiceItems.find((service) => service.id === selectedService) ??
      sortedServiceItems[0],
    [selectedService],
  )

  const handleLogoClick = () => {
    console.log('Клик по логотипу')
  }

  const handleAccountClick = () => {
    console.log('Клик по аккаунту')
  }

  const handleContinueClick = () => {
    console.log(`Продолжить: ${selectedServiceData.title}`, address)
  }

  return (
    <div className="appShell">
      <div className="pageFrame">
        <header className="topBar">
          <button
            type="button"
            className="logoButton"
            onClick={handleLogoClick}
          >
            Логотип
          </button>

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

        <main
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginTop: '20px',
            alignItems: 'stretch',
          }}
        >
          <aside
            style={{
              flex: '0 0 372px',
              width: '372px',
              minHeight: '690px',
              border: '2px solid var(--stroke)',
              borderRadius: '28px',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-soft)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                marginBottom: '12px',
                border: '2px solid var(--stroke)',
                borderRadius: '18px',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-soft)',
                padding: '10px 12px',
              }}
            >
              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="введите ваш адрес"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gridAutoRows: '118px',
                gap: '12px',
              }}
            >
              {sortedServiceItems.map((service) => {
                const isActive = selectedService === service.id
                const isHovered = hoveredService === service.id

                return (
                  <div
                    key={service.id}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      aria-pressed={isActive}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: `2px solid ${isActive ? 'var(--accent)' : 'var(--stroke)'}`,
                        borderRadius: '18px',
                        background: isActive ? 'var(--accent-soft)' : 'var(--surface)',
                        color: 'var(--text-primary)',
                        padding: '14px 12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition:
                          'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
                        boxShadow: isActive ? 'var(--shadow-soft)' : 'none',
                      }}
                    >
                      <span
                        style={{
                          display: 'block',
                          fontSize: '15px',
                          fontWeight: 700,
                          lineHeight: 1.2,
                          minHeight: '38px',
                        }}
                      >
                        {service.title}
                      </span>

                      <span
                        style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: isActive ? 'var(--accent)' : '#475569',
                        }}
                      >
                        {service.price}
                      </span>
                    </button>

                    {isHovered && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: 'calc(100% + 10px)',
                          transform: 'translateY(-50%)',
                          width: '220px',
                          padding: '12px 14px',
                          border: '2px solid var(--stroke)',
                          borderRadius: '16px',
                          background: 'var(--surface)',
                          boxShadow: 'var(--shadow-soft)',
                          color: '#475569',
                          fontSize: '13px',
                          lineHeight: 1.35,
                          zIndex: 20,
                          pointerEvents: 'none',
                        }}
                      >
                        {service.descr}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={handleContinueClick}
                style={{
                  width: '100%',
                  minHeight: '56px',
                  border: '2px solid var(--stroke)',
                  borderRadius: '18px',
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition:
                    'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                  boxShadow: 'var(--shadow-soft)',
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
                Продолжить
              </button>
            </div>
          </aside>

          <section
            aria-hidden="true"
            style={{
              flex: '1 1 420px',
              minHeight: '690px',
              border: '2px solid rgba(31, 41, 55, 0.18)',
              borderRadius: '28px',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(241,245,249,0.85) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '24px',
                borderRadius: '20px',
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
                }}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}