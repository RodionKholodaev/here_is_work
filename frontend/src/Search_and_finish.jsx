import { useEffect, useMemo, useState } from 'react'

const workerMocks = [
  {
    id: 'worker-1',
    name: 'ДворникGO Сервис',
    rating: 4.9,
    experience: 'Стаж 6 лет',
    eta: 'Прибудет через 12 минут',
    phone: '+7 (999) 101-20-30',
  },
  {
    id: 'worker-2',
    name: 'Алексей Петров',
    rating: 4.8,
    experience: 'Стаж 8 лет',
    eta: 'Прибудет через 18 минут',
    phone: '+7 (999) 222-44-55',
  },
  {
    id: 'worker-3',
    name: 'Чистый двор',
    rating: 5.0,
    experience: 'Стаж 5 лет',
    eta: 'Прибудет через 14 минут',
    phone: '+7 (999) 333-66-77',
  },
]

function StarRating({ value }) {
  const fullStars = Math.round(value)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <div
        style={{
          color: '#f5b301',
          fontSize: '16px',
          lineHeight: 1,
          letterSpacing: '1px',
        }}
      >
        {'★'.repeat(fullStars)}
      </div>

      <div
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}
      >
        {value.toFixed(1)}
      </div>
    </div>
  )
}

function WorkerAvatarPlaceholder() {
  return (
    <div
      style={{
        width: '96px',
        height: '96px',
        borderRadius: '999px',
        background: 'linear-gradient(180deg, rgba(226,232,240,0.95) 0%, rgba(203,213,225,0.9) 100%)',
        border: '2px solid var(--stroke)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-soft)',
        flex: '0 0 auto',
      }}
    >
      <svg
        width="54"
        height="54"
        viewBox="0 0 54 54"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="27" cy="18" r="10" fill="#94a3b8" />
        <path
          d="M11 45c2.8-8.2 10-12 16-12s13.2 3.8 16 12"
          fill="#94a3b8"
        />
      </svg>
    </div>
  )
}

export default function Search_and_finish({
  selectedServiceData,
  selectedServiceTag,
  date,
  startTime,
  endTime,
  area,
  comment,
  isUrgent,
  savedAreaSquareMeters,
  onCancel,
}) {
  const [isWorkerAssigned, setIsWorkerAssigned] = useState(false)

  const selectedWorker = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * workerMocks.length)
    return workerMocks[randomIndex]
  }, [])

  const transitionDelayMs = useMemo(() => {
    const randomSeconds = Math.floor(Math.random() * 21) + 10
    return randomSeconds * 1000
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsWorkerAssigned(true)
    }, transitionDelayMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [transitionDelayMs])

  const finalArea =
    typeof savedAreaSquareMeters === 'number' && savedAreaSquareMeters > 0
      ? Math.round(savedAreaSquareMeters).toString()
      : area || 'Не указана'

  const orderInfoRows = [
    {
      label: 'Услуга',
      value: selectedServiceData?.title || 'Не выбрана',
    },
    {
      label: 'Тег',
      value: selectedServiceTag || 'Не указан',
    },
    {
      label: 'Дата',
      value: date || 'Не указана',
    },
    {
      label: 'Время',
      value:
        startTime && endTime
          ? `${startTime} — ${endTime}`
          : startTime || endTime || 'Не указано',
    },
    {
      label: 'Площадь',
      value:
        finalArea !== 'Не указана'
          ? `${finalArea} м²`
          : 'Не указана',
    },
    {
      label: 'Срочность',
      value: isUrgent ? 'Срочный заказ' : 'Обычный заказ',
    },
    {
      label: 'Комментарий',
      value: comment?.trim() ? comment : 'Без комментария',
    },
  ]

  if (isWorkerAssigned) {
    return (
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
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            border: '2px solid var(--stroke)',
            borderRadius: '20px',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-soft)',
            padding: '18px 16px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '8px',
            }}
          >
            Исполнитель назначен
          </div>

          <div
            style={{
              fontSize: '24px',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            Исполнитель скоро будет
          </div>

          <div
            style={{
              fontSize: '14px',
              lineHeight: 1.45,
              color: '#475569',
            }}
          >
            Заказ подтвержден. Исполнитель уже направляется к вам.
          </div>
        </div>

        <div
          style={{
            border: '2px solid var(--stroke)',
            borderRadius: '20px',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-soft)',
            padding: '18px 16px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              marginBottom: '16px',
            }}
          >
            <WorkerAvatarPlaceholder />

            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  wordBreak: 'break-word',
                }}
              >
                {selectedWorker.name}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <StarRating value={selectedWorker.rating} />
              </div>

              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#475569',
                  marginBottom: '6px',
                }}
              >
                {selectedWorker.experience}
              </div>

              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                {selectedWorker.eta}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '10px',
            }}
          >
            <div
              style={{
                border: '2px solid var(--stroke)',
                borderRadius: '16px',
                background: 'var(--surface)',
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#64748b',
                  marginBottom: '4px',
                }}
              >
                Услуга
              </div>

              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.35,
                }}
              >
                {selectedServiceData?.title || 'Не выбрана'}
              </div>
            </div>

            <div
              style={{
                border: '2px solid var(--stroke)',
                borderRadius: '16px',
                background: 'var(--surface)',
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#64748b',
                  marginBottom: '4px',
                }}
              >
                Площадь области
              </div>

              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.35,
                }}
              >
                {finalArea !== 'Не указана' ? `${finalArea} м²` : 'Не указана'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'grid', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              console.log('Позвонить исполнителю:', selectedWorker.phone)
            }}
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
            Позвонить
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              width: '100%',
              minHeight: '52px',
              border: '2px solid var(--stroke)',
              borderRadius: '18px',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition:
                'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
              boxShadow: 'var(--shadow-soft)',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = 'translateY(-1px)'
              event.currentTarget.style.background = 'var(--surface-hover)'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = 'translateY(0)'
              event.currentTarget.style.background = 'var(--surface)'
            }}
          >
            Отменить
          </button>
        </div>
      </aside>
    )
  }

  return (
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
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          border: '2px solid var(--stroke)',
          borderRadius: '20px',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-soft)',
          padding: '16px 16px 14px',
          marginBottom: '14px',
          overflow: 'hidden',
        }}
      >

        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '8px',
          }}
        >
          Заказ оформлен
        </div>

        <div
          style={{
            fontSize: '21px',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          Идет поиск исполнителя...
        </div>

        <div
          style={{
            fontSize: '14px',
            lineHeight: 1.45,
            color: '#475569',
          }}
        >
          Область зафиксирована, параметры заказа сохранены. Ожидайте подтверждения.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
        }}
      >
        {orderInfoRows.map((row) => (
          <div
            key={row.label}
            style={{
              border: '2px solid var(--stroke)',
              borderRadius: '16px',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-soft)',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#64748b',
                marginBottom: '4px',
              }}
            >
              {row.label}
            </div>

            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: 1.35,
                color: 'var(--text-primary)',
                wordBreak: 'break-word',
              }}
            >
              {row.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={onCancel}
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
          Отменить
        </button>
      </div>
    </aside>
  )
}