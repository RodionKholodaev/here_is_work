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
      <style>
        {`
          @keyframes finishPanelAppear {
            0% {
              opacity: 0;
              transform: translateY(10px) scale(0.985);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes rippleWave {
            0% {
              transform: translate(-50%, -50%) scale(0.55);
              opacity: 0;
            }
            18% {
              opacity: 0.38;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.75);
              opacity: 0;
            }
          }

          @keyframes pulseArea {
            0% {
              transform: scale(1);
              box-shadow:
                0 0 0 0 rgba(47, 111, 228, 0.18),
                inset 0 1px 0 rgba(255,255,255,0.35);
            }
            50% {
              transform: scale(1.035);
              box-shadow:
                0 0 0 10px rgba(47, 111, 228, 0.06),
                inset 0 1px 0 rgba(255,255,255,0.35);
            }
            100% {
              transform: scale(1);
              box-shadow:
                0 0 0 0 rgba(47, 111, 228, 0),
                inset 0 1px 0 rgba(255,255,255,0.35);
            }
          }

          @keyframes shimmerLine {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }
            35% {
              opacity: 0.55;
            }
            100% {
              transform: translateX(120%);
              opacity: 0;
            }
          }
        `}
      </style>

      <div
        style={{
          border: '2px solid var(--stroke)',
          borderRadius: '20px',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-soft)',
          padding: '16px 16px 14px',
          marginBottom: '14px',
          overflow: 'hidden',
          animation: 'finishPanelAppear 0.45s ease',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: '164px',
            borderRadius: '18px',
            marginBottom: '14px',
            background:
              'linear-gradient(180deg, rgba(247,250,255,0.88) 0%, rgba(236,243,255,0.74) 100%)',
            border: '1px solid rgba(47, 111, 228, 0.12)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '0',
              background:
                'radial-gradient(circle at 50% 50%, rgba(47,111,228,0.07) 0%, rgba(47,111,228,0.03) 30%, rgba(255,255,255,0) 68%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '94px',
                height: '94px',
                borderRadius: '999px',
                border: '2px solid rgba(47, 111, 228, 0.18)',
                animation: 'rippleWave 2.8s ease-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '94px',
                height: '94px',
                borderRadius: '999px',
                border: '2px solid rgba(47, 111, 228, 0.16)',
                animation: 'rippleWave 2.8s ease-out 0.7s infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '94px',
                height: '94px',
                borderRadius: '999px',
                border: '2px solid rgba(47, 111, 228, 0.14)',
                animation: 'rippleWave 2.8s ease-out 1.4s infinite',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '92px',
              height: '92px',
              transform: 'translate(-50%, -50%) rotate(-7deg)',
              borderRadius: '22px',
              background:
                'linear-gradient(180deg, rgba(47,111,228,0.26) 0%, rgba(47,111,228,0.18) 100%)',
              border: '2px solid rgba(47, 111, 228, 0.38)',
              animation: 'pulseArea 2.6s ease-in-out infinite',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.18) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '70%',
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 100%)',
                animation: 'shimmerLine 2.8s ease-in-out infinite',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: '18px',
              right: '18px',
              bottom: '14px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 700,
              color: 'rgba(47, 111, 228, 0.92)',
            }}
          >
            Исполнители получают заказ и видят область работ
          </div>
        </div>

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
        {orderInfoRows.map((row, index) => (
          <div
            key={row.label}
            style={{
              border: '2px solid var(--stroke)',
              borderRadius: '16px',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-soft)',
              padding: '12px 14px',
              animation: `finishPanelAppear 0.35s ease ${0.04 * index}s both`,
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