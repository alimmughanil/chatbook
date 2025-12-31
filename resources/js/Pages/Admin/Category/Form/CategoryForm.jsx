import Input from '@/Components/Form/Input'
import { useForm, usePage } from '@inertiajs/react'
import { useEffect } from 'react'
import * as Unicons from 'lucide-react';
import Select from '@/Components/Form/Select';
import { components } from 'react-select';
import TextArea from '@/Components/Form/TextArea'

function CategoryForm({ category = null }) {
  const { props } = usePage()

  const { data, setData, post, errors, processing } = useForm({
    title: category?.name ?? '',
    description: category?.description ?? '',
    slug: category?.slug ?? '',
    icon: category?.icon ?? '',
    is_active: category?.is_active ?? 1,
    is_featured: category?.is_featured ?? 0,
  })

  function handleChange(e) {
    const { name, value } = e.target
    let filteredValue = value

    setData((state) => ({
      ...state,
      [name]: filteredValue
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (category) {
      data._method = 'put'
      return post(`/admin/category/${category.id}`)
    }
    return post(`/admin/category`)
  }
  useEffect(() => {
    if (data.title && !category) {
      const slug = data.title.toLowerCase().split(' ').join('-').substring(0, 150)
      const filteredSlug = `${slug}`
      setData('slug', filteredSlug)
    }
  }, [data.title])

  const options = [];
  Object.keys(Unicons).map((unicon) => (options.push({ label: unicon.substring(3).replace(/([A-Z])/g, " $1"), value: unicon })))
  const selectedIndex = data.icon ? options.findIndex((option) => option.value == data.icon) : null

  return (
    <form className='flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg'>
      <p className='text-lg font-semibold'>{props.title}</p>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Input type='text' name='title' label='Judul' handleChange={handleChange} data={data} errors={errors} />
        <Input type='text' name='slug' label='slug' handleChange={handleChange} data={data} errors={errors} />
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Select
          isReactSelect={true}
          name='icon'
          label='Icon'
          alt={<PreviewIcon icon={data.icon} />}
          handleChange={(e) => setData('icon', e?.value)}
          data={data}
          errors={errors}
          defaultValue={options[selectedIndex]}
          options={options}
          optionComponent={{ Option: IconOption }}
        />
      </div>
      <TextArea name='description' label='deskripsi' alt='opsional' handleChange={handleChange} data={data} errors={errors} />
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Select name='is_active' label='Active' handleChange={handleChange} data={data} errors={errors} defaultValue={data.is_active}>
          <option value=''>Pilih salah satu</option>
          <option value='1'>Ya</option>
          <option value='0'>Tidak</option>
        </Select>
        <Select name='is_featured' label='Featured' handleChange={handleChange} data={data} errors={errors} defaultValue={data.is_featured}>
          <option value=''>Pilih salah satu</option>
          <option value='1'>Ya</option>
          <option value='0'>Tidak</option>
        </Select>
      </div>

      <div className='flex justify-center gap-2 mt-4'>
        <button type='button' onClick={() => history.back()} className='btn btn-primary btn-outline btn-sm'>
          Batal
        </button>
        <button onClick={handleSubmit} className={`btn btn-sm btn-primary text-white`} disabled={processing} >
          <span className={`${processing && 'loading'}`}>Submit</span>
        </button>
      </div>
    </form>
  )
}

const PreviewIcon = ({ icon }) => {
  const IconName = icon ? Unicons[icon] : null

  return (
    <div className="flex items-center gap-2">
      {icon ? (
        <>
          <p>Preview: </p>
          <IconName className="mb-2" size="32" color="black" />
        </>
      ) : null}
    </div>
  )
}

const IconOption = (props) => {
  const { Option } = components;
  const IconName = Unicons[props.data.value]
  return (
    <Option {...props}>
      <div className="flex items-center gap-2">
        <IconName className="mb-2" size="32" color="black" />
        <span className='capitalize'>{props.data.label}</span>
      </div>
    </Option>
  )
}

export default CategoryForm
