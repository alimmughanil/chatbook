import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import TextArea from '@/Components/Form/TextArea'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import { useEffect } from 'react'

function MainForm({ order = null }) {
  const { props } = usePage()
  const params = new URLSearchParams(location.search)
  const { products, packages, users, customs } = props

  const { data, setData, post, errors, processing } = useForm({
    user_id: 'other',
    product_id: params.get('product_id'),
    product_detail_id: '',
    is_custom: params.get('is_custom') ?? 0,
    name: '',
    email: '',
    phone: '',
  })

  function handleChange(e) {
    const { name, value } = e.target

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  function handleSelected(e, name) {
    const { value } = e

    setData((state) => ({
      ...state,
      [name]: value
    }))
    params.set(name, value)
    handleReload()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    return post(`/admin/order`)
  }

  const handleReload = () => {
    router.visit(`?${params.toString()}`, {
      method: "get",
      preserveState: true,
      preserveScroll: true
    })
  }
  const productIndex = params.get('product_id') ? products.findIndex((product) => product.value == params.get('product_id')) : null
  const customIndex = params.get('is_custom') ? customs.findIndex((custom) => custom.value == params.get('is_custom')) : 1

  return (
    <form className='flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg'>
      <p className='text-lg font-semibold'>{props.title}</p>
      <div className='flex flex-col w-full gap-4 md:flex-row z-50'>
        <Select
          isReactSelect={true}
          name='product_id'
          label='Produk'
          alt={<AddButton path="/admin/product/create" />}
          handleChange={(e) => (handleSelected(e, 'product_id'))}
          data={data}
          errors={errors}
          defaultValue={products[productIndex]}
          options={products}
        />
        {params.get('product_id') ? (
          <>
            <Select
              isReactSelect={true}
              name='is_custom'
              label='Custom?'
              alt={<p className='leading-6 text-white'>*</p>}
              handleChange={(e) => (handleSelected(e, 'is_custom'))}
              data={data}
              errors={errors}
              defaultValue={customs[customIndex]}
              options={customs}
            />
            <Select
              isReactSelect={true}
              name='product_detail_id'
              label='Paket'
              alt={<AddButton path={`/admin/product/${data.product_id}?show=packet&create=true&is_custom=${data.is_custom}&ref=${location}`} />}
              handleChange={(e) => setData('product_detail_id', e?.value)}
              data={data}
              errors={errors}
              options={packages}
            />
          </>
        ) : null}
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row z-30'>
        <Select
          isReactSelect={true}
          name='user_id'
          label='Pembeli'
          handleChange={(e) => setData('user_id', e?.value)}
          data={data}
          errors={errors}
          defaultValue={users[0]}
          options={users}
        />
      </div>

      {data.user_id == 'other' ? (
        <div className='flex flex-col w-full gap-4 md:flex-row z-20'>
          <Input type='text' name='name' label='Nama Pembeli' handleChange={handleChange} data={data} errors={errors} />
          <Input type='email' name='email' label='email' handleChange={handleChange} data={data} errors={errors} />
          <Input type='tel' name='phone' label='Whatsapp' alt="Opsional" handleChange={handleChange} data={data} errors={errors} />
        </div>
      ) : null}

      <div className='flex justify-center gap-2 mt-4'>
        <Link href={'/admin/order'} className='btn btn-primary btn-outline btn-sm'>
          Batal
        </Link>
        <button onClick={handleSubmit} className={`btn btn-primary btn-sm `} disabled={processing} >
          <span className={`${processing && 'loading'}`}>Submit</span>
        </button>
      </div>
    </form>
  )
}

const AddButton = ({ path }) => {
  return (
    <Link href={path} className='text-lg btn btn-xs btn-neutral btn-circle'>
      <i className='text-white fas fa-plus'></i>
    </Link>
  )
}


export default MainForm
