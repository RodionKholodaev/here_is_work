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
      <div
        style={{
          border: '2px solid var(--stroke)',
          borderRadius: '20px',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-soft)',
          padding: '16px 16px 14px',
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
          Заказ оформлен
        </div>

        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          Основная информация о заказе
        </div>

        <div
          style={{
            fontSize: '14px',
            lineHeight: 1.45,
            color: '#475569',
          }}
        >
          Проверьте детали. Адрес скрыт, панель рисования больше не отображается.
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