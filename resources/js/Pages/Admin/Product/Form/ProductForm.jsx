import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import TextArea from '@/Components/Form/TextArea'
import { Link, useForm, usePage } from '@inertiajs/react'
import { useEffect } from 'react'

function ProductForm({ isEdit = false }) {
  const { props } = usePage()
  const { isAdmin, product = null } = props

  const { data, setData, post, errors, processing } = useForm({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    category_id: product?.category_id ?? '',
    assigned_user_id: product?.assigned_user_id ?? '',
    price: product?.price ?? '',
    status: product?.status ?? props.status[0],
    description: product?.description ?? '',
    thumbnail: product?.thumbnail ?? '',
    sort_number: product?.sort_number ?? '',
    is_featured: product?.is_featured ?? '',
    keywords: product?.keywords ?? '',
    meta_description: product?.meta_description ?? '',
    tags: '',
  })

  function handleChange(e) {
    const { name, value, files } = e.target
    const fileNames = ['thumbnail']
    let filteredValue = fileNames.includes(name) ? files[0] : value

    setData((state) => ({
      ...state,
      [name]: filteredValue
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (product) {
      if (data.assigned_user_id === undefined) data.assigned_user_id = null
      data._method = 'put'
      return post(`/admin/product/${product.id}`)
    }
    return post(`/admin/product`)
  }

  useEffect(() => {
    if (data.name && !product) {
      const slug = data.name.toLowerCase().split(' ').join('-').substring(0, 150)
      const filteredSlug = `${slug}`
      setData('slug', filteredSlug)
    }
  }, [data.name])

  let categoryIndex = null;
  if (props.categories.length > 0) {
    categoryIndex = data.category_id ? props.categories.findIndex((option) => option.value == data.category_id) : null
  }
  let assignedIdx = null;
  if (props.partner.length > 0) {
    assignedIdx = data.assigned_user_id ? props.partner.findIndex((option) => option.value == data.assigned_user_id) : null
  }
  return (
    <form className='flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg'>
      <p className='text-lg font-semibold'>{props.title}</p>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Input type='text' name='name' label='Nama Produk' handleChange={handleChange} data={data} errors={errors} />
        <Input type='text' name='slug' label='slug' handleChange={handleChange} data={data} errors={errors} />
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Input type='file' name='thumbnail' label='Thumbnail' alt='Opsional' handleChange={handleChange} data={data} errors={errors} />
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row z-50'>
        <Select
          isReactSelect={true}
          name='category_id'
          label='Kategori'
          alt={isAdmin && <AddButton path="category" />}
          handleChange={(e) => setData('category_id', e?.value)}
          data={data}
          errors={errors}
          defaultValue={props.categories[categoryIndex]}
          options={props.categories}
        />
        {isAdmin && (
          <Select
            isReactSelect={true}
            name='assigned_user_id'
            label='Assign User'
            isDisabled={props?.product && props?.product?.user_id !== 1}
            handleChange={(e) => setData('assigned_user_id', e?.value)}
            data={data}
            errors={errors}
            defaultValue={props.partner[assignedIdx]}
            options={props.partner}
          />
        )}
        <Select
          isReactSelect={true}
          isMulti={true}
          name='tag_id'
          label='Tag'
          alt={isAdmin && <AddButton path="tag" />}
          handleChange={(e) => setData("tags", e ? JSON.stringify(e) : null)}
          data={data}
          errors={errors}
          defaultValue={props.productTags}
          options={props.tags}
        />
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        {isAdmin && (
          <>
            <Select name='status' label='Status' handleChange={handleChange} data={data} errors={errors} defaultValue={data.status}>
              <option value=''>Pilih salah satu</option>
              {props.status.length == 0
                ? null
                : props.status.map((status, index) => (
                  <option key={index} value={status} className='capitalize'>
                    {status}
                  </option>
                ))}
            </Select>
            <Select name='is_featured' label='Featured' handleChange={handleChange} data={data} errors={errors} defaultValue={data.is_featured}>
              <option value=''>Pilih salah satu</option>
              <option value='1'>Ya</option>
              <option value='0'>Tidak</option>
            </Select>
            {data.is_featured == '1' && product ? (
              <Input type='number' name='sort_number' label='Nomor Urut' alt='Opsional' handleChange={handleChange} data={data} errors={errors} />
            ) : null}
          </>
        )}
      </div>

      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Input type='text' name='keywords' label='Meta Keywords' alt='Pisahkan dengan Koma' handleChange={handleChange} data={data} errors={errors} />
        <TextArea name='meta_description' label='meta deskripsi' alt='opsional' handleChange={handleChange} data={data} errors={errors} />
      </div>

      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <TextArea isTextEditor={true} name='description' label='deskripsi' alt='opsional' setData={setData} data={data} errors={errors} />
      </div>

      <div className='flex justify-center gap-2 mt-4'>
        <button type='button' onClick={() => history.back()} className='btn btn-primary btn-outline btn-sm'>
          Batal
        </button>
        <button onClick={handleSubmit} className={`btn btn-primary btn-sm `} disabled={processing} >
          <span className={`${processing && 'loading'}`}>Submit</span>
        </button>
      </div>
    </form>
  )
}

const AddButton = ({ path }) => {
  return (
    <Link href={`/admin/${path}/create`} className='text-lg btn btn-xs btn-neutral btn-circle'>
      <i className='text-white fas fa-plus'></i>
    </Link>
  )
}

const getOption = (categories) => {
  let option = [];
  categories.map((category) => {
    return option.push({
      value: category.id,
      label: category?.name,
    });
  });
  return option;
};


export default ProductForm
