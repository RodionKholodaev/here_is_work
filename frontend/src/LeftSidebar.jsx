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
}) {
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
    </aside>
  )
}