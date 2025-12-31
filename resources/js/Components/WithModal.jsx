const WithModal = (state) => {
  const { type, children, btnLabel = null, openModalRef = null } = state
  const { btnClassName = "btn btn-sm btn-primary", modalBoxSize = "", backdrop = false, onClick = null, modalBottom = false, boxClassName = 'modal-box scrollbar-none overflow-visible'} = state
  let {onBackdoorClick = null} = state
  if (!onBackdoorClick && !!onClick) {
    onBackdoorClick = () => onClick(null)
  }

  return (
    <>
      {btnLabel || openModalRef ? (
        <label ref={openModalRef} htmlFor={`modal_${type}`} className={btnClassName} onClick={onClick}>{btnLabel}</label>
      ) : null}

      <input type="checkbox" id={`modal_${type}`} className="modal-toggle" />
       <div className={`modal ${!!modalBottom && 'modal-bottom'}`} role="dialog">
        <div className={`${boxClassName} ${modalBoxSize}`}>
          {children}
        </div>
        {!backdrop ? null : (
          <label htmlFor={`modal_${type}`} className="modal-backdrop" onClick={onBackdoorClick}>X</label>
        )}
      </div>
    </>
  )
}

export const ModalButton = ({ onClick, id, btnLabel, className = null, disabled = false, children = null }) => {
  id = id?.startsWith('modal') ? id : `modal_${id}`

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.target.click();
    }
  }

  return (
		<label tabIndex={0} onKeyDown={handleKeyPress} htmlFor={disabled ? null : id} id={`btn_${id}`} onClick={onClick} className={`${disabled && 'opacity-30'} ${className ?? 'capitalize cursor-pointer text-start whitespace-pre'}`}>
			{children ?? btnLabel}
		</label>
  )
}

export const closeMultipleModal = (backButtonRefs = [])=>{
  if (backButtonRefs.length == 0) return null
  for (const backButtonRef of backButtonRefs){
    backButtonRef?.current?.click()
  }
}
export default WithModal
