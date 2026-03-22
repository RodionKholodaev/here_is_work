import { useEffect, useState } from 'react'

export default function LeftSidebar({
  address,
  setAddress,
  handleAddressSubmit,
  sortedServiceItems,
  serviceIcons,
  selectedService,
  setSelectedService,
  hoveredService,
  setHoveredService,
  handleContinueClick,
  onOrderSubmit,
  currentPage,
  savedArea,
}) {
  // --- СОСТОЯНИЯ ДЛЯ НОВОЙ ФОРМЫ ОФОРМЛЕНИЯ ---
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [area, setArea] = useState('')
  const [comment, setComment] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  // Синхронизация площади с карты
  useEffect(() => {
    if (typeof savedArea === 'number') {
      setArea(Math.round(savedArea).toString())
    } else if (!savedArea) {
      setArea('')
    }
  }, [savedArea])

  const handleSubmitOrder = async () => {
  onOrderSubmit({
    date,
    startTime,
    endTime,
    area,
    comment,
    isUrgent,
    })
    }

  return (
    <aside
      style={{
        flex: '0 0 372px',
        width: '372px',
        minHeight: currentPage === 'services' ? '690px' : 'auto',
        border: '2px solid var(--stroke)',
        borderRadius: '28px',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-soft)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
      }}
    >
      {/* ==========================================================
          ЭКРАН 1: SERVICES (ВЫБОР УСЛУГ И ВВОД АДРЕСА)
          ========================================================== */}
      {currentPage === 'services' && (
        <>
          <div
            style={{
              marginBottom: '12px',
              border: '2px solid var(--stroke)',
              borderRadius: '18px',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-soft)',
              padding: '6px 6px 6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
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
                minWidth: 0,
              }}
            />
            <button
              type="button"
              onClick={handleAddressSubmit}
              style={{
                flex: '0 0 auto',
                minWidth: '72px',
                height: '36px',
                border: '2px solid var(--stroke)',
                borderRadius: '12px',
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0 14px',
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
              Ввод
            </button>
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
              const serviceIcon = serviceIcons[service.tag]

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
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {serviceIcon && (
                      <img
                        src={serviceIcon}
                        alt=""
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          left: '5px',
                          width: '150px',
                          height: '150px',
                          objectFit: 'contain',
                          opacity: 0.32,
                          zIndex: 0,
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    <span
                      style={{
                        display: 'block',
                        fontSize: '15px',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        minHeight: '38px',
                        position: 'relative',
                        zIndex: 1,
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
                        position: 'relative',
                        zIndex: 1,
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
              Далее
            </button>
          </div>
        </>
      )}

      {/* ==========================================================
          ЭКРАН 2: DETAILS (НОВАЯ ФОРМА ОФОРМЛЕНИЯ ЗАКАЗА)
          ========================================================== */}
      {currentPage === 'details' && (
        <>
          {/* Секция Адреса (Всегда сверху) */}
          <div
            style={{
              padding: '12px',
              border: '2px solid var(--stroke)',
              borderRadius: '18px',
              background: 'var(--surface)',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '16px',
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            {address || 'Адрес не указан'}
          </div>

          {/* Контейнер полей */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {/* Дата */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Дата:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Начать работу с + Кнопка Срочно */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Начать работу с:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setIsUrgent(!isUrgent)}
                  style={{
                    height: '40px',
                    padding: '0 12px',
                    border: '2px solid var(--stroke)',
                    borderRadius: '12px',
                    background: isUrgent ? 'var(--accent)' : 'var(--surface)',
                    color: isUrgent ? '#fff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isUrgent ? 'Как можно скорее 🔥' : 'Как можно скорее'}
                </button>
              </div>
            </div>

            {/* Закончить работу до */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Закончить работу до:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Площадь */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Площадь (м²):</label>
              <input
                type="number"
                placeholder="0"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Комментарий */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Комментарий:</label>
              <textarea
                rows="3"
                placeholder="Дополнительные детали..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ ...inputStyle, resize: 'none', height: '80px', padding: '10px 12px' }}
              />
            </div>
          </div>

          {/* Кнопка Заказать (Всегда снизу) */}
          <div style={{ paddingTop: '16px' }}>
            <button
              type="button"
              onClick={handleSubmitOrder}
              style={{
                width: '100%',
                minHeight: '56px',
                border: '2px solid var(--stroke)',
                borderRadius: '18px',
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                fontSize: '18px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
                transition:
                  'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
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
              Заказать
            </button>
          </div>
        </>
      )}
    </aside>
  )
}

// Повторяющиеся стили
const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const labelStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#475569',
}

const inputStyle = {
  width: '100%',
  height: '40px',
  border: '2px solid var(--stroke)',
  borderRadius: '12px',
  background: 'var(--surface)',
  padding: '0 12px',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text-primary)',
  outline: 'none',
}