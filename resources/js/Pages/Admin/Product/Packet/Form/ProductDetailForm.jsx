import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import TextArea from '@/Components/Form/TextArea'
import {useStatusLabel} from '@/utils/useStatus'
import {Link, router, useForm, usePage} from '@inertiajs/react'
import {useEffect} from 'react'

function ProductDetailForm({productDetail = null, product = null}) {
  const {props} = usePage()
  const params = new URLSearchParams(location.search)

  const {data, setData, post, errors, processing} = useForm({
    name: productDetail?.name ?? '',
    slug: productDetail?.slug ?? '',
    price: productDetail?.price ?? '',
    status: productDetail?.status ?? props.detail_status[0],
    description: productDetail?.description ?? '',
    thumbnail: productDetail?.thumbnail ?? '',
    is_custom: params.get('is_custom') ? params.get('is_custom') : productDetail ? productDetail?.is_custom : 0
  })

  function handleChange(e) {
    const {name, value, files} = e.target
    const fileNames = ['thumbnail']
    let filteredValue = fileNames.includes(name) ? files[0] : value

    setData((state) => ({
      ...state,
      [name]: filteredValue
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const routerConfig = {
      onSuccess: () => router.get(`?show=packet`)
    }
    if (productDetail) {
      data._method = 'put'
      return post(`/admin/product/${product?.id}/detail/${productDetail.id}`, routerConfig)
    }
    return post(`/admin/product/${product?.id}/detail${params.get('ref') ? `?ref=${params.get('ref')}` : ''}`, routerConfig)
  }

  useEffect(() => {
    if (data.name && !productDetail) {
      const slug = data.name.toLowerCase().split(' ').join('-').substring(0, 150)
      const filteredSlug = product ? `${product?.id}-${slug}` : slug
      setData('slug', filteredSlug)
    }
  }, [data.name])

  return (
    <form className='flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg'>
      {product ? null : <p className='text-lg font-semibold'>{props.title}</p>}
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Input type='text' name='name' label='Nama Paket' handleChange={handleChange} data={data} errors={errors} />
        <Input type='text' name='slug' label='slug' handleChange={handleChange} data={data} errors={errors} />
        <Input type='number' name='price' label='Harga' handleChange={handleChange} data={data} errors={errors} />
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Select name='status' label='Status' handleChange={handleChange} data={data} errors={errors} defaultValue={data.status}>
          <option value=''>Pilih salah satu</option>
          {props.detail_status.length == 0
            ? null
            : props.detail_status.map((status, index) => (
                <option key={index} value={status} className='capitalize'>
                  {useStatusLabel(status)}
                </option>
              ))}
        </Select>
        <Select name='is_custom' label='Custom' handleChange={handleChange} data={data} errors={errors} defaultValue={data.is_custom}>
          <option value=''>Pilih salah satu</option>
          <option value='1'>Ya</option>
          <option value='0'>Tidak</option>
        </Select>
        <Input type='file' name='thumbnail' label='Thumbnail' alt='Opsional' handleChange={handleChange} data={data} errors={errors} />
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <TextArea isTextEditor={true} name='description' label='deskripsi' alt='opsional' setData={setData} data={data} errors={errors} />
      </div>

      <div className='flex justify-center gap-2 mt-4'>
        <Link href={'?show=packet'} className='btn btn-primary btn-outline btn-sm'>
          Batal
        </Link>
        <button onClick={handleSubmit} className={`btn btn-primary btn-sm `} disabled={processing}>
          <span className={`${processing && 'loading'}`}>Submit</span>
        </button>
      </div>
    </form>
  )
}

export default ProductDetailForm
