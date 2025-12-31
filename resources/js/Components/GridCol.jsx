const GridCol = ({ label, icon = null, children, image = null, className = '' }) => {
  return (
    <div className="grid grid-cols-12 items-start gap-8 sm:gap-0">
      {!!icon && <i className={`${icon} mx-auto`}></i>}
      {!!image && <img src={image} className={`${className} mx-auto`}></img>}
      <div className="flex gap-4 col-span-11">
        <div className="">
          <p className='text-sm opacity-80 capitalize'>{label}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
export default GridCol