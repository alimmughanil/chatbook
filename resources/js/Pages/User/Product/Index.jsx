import CategoryCard from '@/Components/Card/CategoryCard'
import ProductCard from '@/Components/Card/ProductCard'
import ExploreLayout from '@/Layouts/ExploreLayout'
import { usePage } from '@inertiajs/react'
import { Fragment } from 'react'

function Index(props) {
  const { product } = props

  return (
    <ExploreLayout links={product.links} HeadCard={props?.category || props?.company ? HeadCard : null} searchPlaceholder='Cari jasa: Desain Logo, Website...'>
      <ProductIndex />
    </ExploreLayout>
  )
}

const HeadCard = () => {
  const { category } = usePage().props
  if (category) return <CategoryCard category={category} isShowButton={false} type='index' />
}

export const ProductIndex = () => {
  const { product } = usePage().props

  return (
    <div className='w-full py-4 mb-8'>
      <p className='w-full px-4 pb-2 text-center'>
        Menampilkan <span className='font-semibold'>{product.total}</span> jasa
      </p>

      {product.data.length == 0 ? (
        <p className="pt-4 pb-8">Belum ada data yang dapat ditampilkan</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] justify-center gap-6 w-full">
          {product?.data?.map((product) => (
            <Fragment key={product.id}>
              <ProductCard product={product} />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default Index
