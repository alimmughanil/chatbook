import { useState } from "react"

function CategoryCard({ category, isShowButton = true, type = 'show' }) {
  const [isShow, setIsShow] = useState(false)

  return (
    <div className="w-full p-2">
      <div className="bg-gradient-to-r linear-gradient-purple !text-white rounded-lg text-center py-8 px-2 font-semibold flex flex-col items-center">
        <p className='text-3xl font-bold'>{category.name}</p>
        {category?.description ? (
          <>
            <div className={`font-medium text-sm max-w-4xl mx-auto mt-2 mb-4 text-ellipsis overflow-hidden text-editor-content ... ${!isShow && 'line-clamp-3'}`} dangerouslySetInnerHTML={{ __html: category.description }}></div>

            <button type="button" className="underline" onClick={() => setIsShow((state) => !state)}>
              {isShow ? 'Sembunyikan' : 'Tampilkan Semua'}
            </button>
          </>
        ) : null}
        {isShowButton && (
          <a href={`/app/category/${category.slug}`} className='btn btn-sm btn-secondary font-medium w-max mt-4'>Lihat Kategori</a>
        )}
      </div>
    </div>
  )
}

export default CategoryCard
