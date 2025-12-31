import { useForm, usePage } from '@inertiajs/react'
import { BaseMultipleInput } from '@/Components/Form/MultipleInput'
import { Trash2 } from 'lucide-react'
import useLang from '@/utils/useLang'
import { useState } from 'react'

export default function UpdateProfileDetailForm({ className = '' }) {
  const { user, flash } = usePage().props

  const getInitialDetails = (type) => {
    if (!user.profile?.details) return [];
    return user.profile.details
      .filter(d => d.type === type)
      .map(d => d.value);
  };

  const { data, setData, post, processing, errors } = useForm({
    education: getInitialDetails('education'),
    experience: getInitialDetails('experience'),
    skills: getInitialDetails('skill'),
    languages: getInitialDetails('language'),
    certificates: getInitialDetails('certificate'),
    banner: null,
  })

  const createSetForm = (field) => (action) => {
    if (typeof action === 'function') {
      setData(prev => ({ ...prev, [field]: action(prev[field]) }));
    } else {
      setData(field, action);
    }
  }

  const submit = (e) => {
    e.preventDefault()
    post(`/app/profile?partner=1`, {
      preserveScroll: true,
    })
  }

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Detail Profil</h2>
        <p className="mt-1 text-sm text-gray-600">
          Lengkapi detail profil Anda untuk meningkatkan kepercayaan klien.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <BannerInput errors={errors} setData={setData} initialBanner={getInitialDetails('banner')[0]?.path} />
        <EducationInput errors={errors} form={data.education} setForm={createSetForm('education')} />
        <ExperienceInput errors={errors} form={data.experience} setForm={createSetForm('experience')} />
        <SkillInput errors={errors} form={data.skills} setForm={createSetForm('skills')} />
        <LanguageInput errors={errors} form={data.languages} setForm={createSetForm('languages')} />
        <CertificateInput errors={errors} form={data.certificates} setForm={createSetForm('certificates')} />

        <div className="flex items-center gap-4">
          <button disabled={processing} className="btn btn-primary">
            {processing && <span className="loading"></span>}
            Simpan Detail
          </button>
        </div>
      </form>
    </section>
  )
}

const DetailItemWrapper = ({ children, onRemove }) => (
  <div className="relative bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-all">
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
    >
      <Trash2 size={16} />
    </button>
    {children}
  </div>
)

const EducationInput = ({ errors, form, setForm }) => {
  const baseForm = { school: '', degree: '', start_year: '', end_year: '' }

  const handleChange = (index, field, value) => {
    setForm(prev => {
      const newState = [...prev]
      newState[index] = { ...newState[index], [field]: value }
      return newState
    })
  }

  const handleRemove = (index) => {
    setForm(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <BaseMultipleInput errors={errors} form={form} setForm={setForm} baseForm={baseForm} label="Pendidikan">
      {form.map((item, index) => (
        <DetailItemWrapper key={index} onRemove={() => handleRemove(index)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label-text text-xs font-medium text-gray-500 mb-1">Sekolah/Universitas</label>
              <input type="text" className="input input-bordered input-sm w-full" value={item.school} onChange={e => handleChange(index, 'school', e.target.value)} placeholder="Nama Instansi" />
            </div>
            <div className="form-control">
              <label className="label-text text-xs font-medium text-gray-500 mb-1">Gelar/Jurusan</label>
              <input type="text" className="input input-bordered input-sm w-full" value={item.degree} onChange={e => handleChange(index, 'degree', e.target.value)} placeholder="Gelar" />
            </div>
            <div className="form-control">
              <label className="label-text text-xs font-medium text-gray-500 mb-1">Tahun Mulai</label>
              <input type="number" min="1900" max="2100" className="input input-bordered input-sm w-full" value={item.start_year} onChange={e => handleChange(index, 'start_year', e.target.value)} placeholder="YYYY" />
            </div>
            <div className="form-control">
              <label className="label-text text-xs font-medium text-gray-500 mb-1">Tahun Selesai</label>
              <input type="number" min="1900" max="2100" className="input input-bordered input-sm w-full" value={item.end_year} onChange={e => handleChange(index, 'end_year', e.target.value)} placeholder="YYYY" />
            </div>
          </div>
        </DetailItemWrapper>
      ))}
    </BaseMultipleInput>
  )
}

const ExperienceInput = ({ errors, form, setForm }) => {
  const baseForm = { company: '', position: '', start_date: '', end_date: '', description: '' }

  const handleChange = (index, field, value) => {
    setForm(prev => {
      const newState = [...prev]
      newState[index] = { ...newState[index], [field]: value }
      return newState
    })
  }

  const handleRemove = (index) => {
    setForm(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <BaseMultipleInput errors={errors} form={form} setForm={setForm} baseForm={baseForm} label="Pengalaman Kerja">
      {form.map((item, index) => (
        <DetailItemWrapper key={index} onRemove={() => handleRemove(index)}>
          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label-text text-xs font-medium text-gray-500 mb-1">Perusahaan</label>
                <input type="text" className="input input-bordered input-sm w-full" value={item.company} onChange={e => handleChange(index, 'company', e.target.value)} placeholder="Nama Perusahaan" />
              </div>
              <div className="form-control">
                <label className="label-text text-xs font-medium text-gray-500 mb-1">Posisi</label>
                <input type="text" className="input input-bordered input-sm w-full" value={item.position} onChange={e => handleChange(index, 'position', e.target.value)} placeholder="Posisi" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label-text text-xs font-medium text-gray-500 mb-1">Tanggal Mulai</label>
                <input type="date" className="input input-bordered input-sm w-full" value={item.start_date} onChange={e => handleChange(index, 'start_date', e.target.value)} />
              </div>
              <div className="form-control">
                <label className="label-text text-xs font-medium text-gray-500 mb-1">Tanggal Selesai</label>
                <input type="date" className="input input-bordered input-sm w-full" value={item.end_date} onChange={e => handleChange(index, 'end_date', e.target.value)} />
              </div>
            </div>
            <div className="form-control">
              <label className="label-text text-xs font-medium text-gray-500 mb-1">Deskripsi</label>
              <textarea className="textarea textarea-bordered textarea-sm w-full" value={item.description} onChange={e => handleChange(index, 'description', e.target.value)} placeholder="Deskripsi pekerjaan..."></textarea>
            </div>
          </div>
        </DetailItemWrapper>
      ))}
    </BaseMultipleInput>
  )
}

const SkillInput = ({ errors, form, setForm }) => {
  const baseForm = { name: '' }

  const handleChange = (index, field, value) => {
    setForm(prev => {
      const newState = [...prev]
      newState[index] = { ...newState[index], [field]: value }
      return newState
    })
  }

  const handleRemove = (index) => {
    setForm(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <BaseMultipleInput errors={errors} form={form} setForm={setForm} baseForm={baseForm} label="Keahlian">
      <div className="flex flex-wrap gap-2">
        {form.map((item, index) => (
          <div key={index} className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1 shadow-sm">
            <input
              type="text"
              className="input input-ghost input-xs w-32 focus:outline-none focus:bg-gray-50 rounded px-1"
              value={item.name}
              onChange={e => handleChange(index, 'name', e.target.value)}
              placeholder="Skill"
            />
            <button type="button" onClick={() => handleRemove(index)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </BaseMultipleInput>
  )
}

const LanguageInput = ({ errors, form, setForm }) => {
  const { languageLevelType } = usePage().props;
  const baseForm = { language: '', level: '' }

  const handleChange = (index, field, value) => {
    setForm(prev => {
      const newState = [...prev]
      newState[index] = { ...newState[index], [field]: value }
      return newState
    })
  }

  const handleRemove = (index) => {
    setForm(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <BaseMultipleInput errors={errors} form={form} setForm={setForm} baseForm={baseForm} label="Bahasa">
      {form.map((item, index) => (
        <div key={index} className="flex gap-2 items-center bg-white p-2 rounded border border-gray-200 mb-2 shadow-sm">
          <input
            type="text"
            className="input input-bordered input-sm w-full"
            value={item.language}
            onChange={e => handleChange(index, 'language', e.target.value)}
            placeholder="Bahasa"
          />
          <select
            className="select text-xs select-sm select-bordered"
            value={item.level}
            onChange={e => handleChange(index, 'level', e.target.value)}
          >
            {languageLevelType.map((type, index) => (
              <option key={index} value={type}>{useLang(`language.level.${type}`)}</option>
            ))}
          </select>
          <button type="button" onClick={() => handleRemove(index)} className="text-gray-400 hover:text-red-500 p-1">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </BaseMultipleInput>
  )
}

const CertificateInput = ({ errors, form, setForm }) => {
  const baseForm = { title: '' }

  const handleChange = (index, field, value) => {
    setForm(prev => {
      const newState = [...prev]
      newState[index] = { ...newState[index], [field]: value }
      return newState
    })
  }

  const handleRemove = (index) => {
    setForm(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <BaseMultipleInput errors={errors} form={form} setForm={setForm} baseForm={baseForm} label="Sertifikat">
      {form.map((item, index) => (
        <div key={index} className="flex gap-2 items-center bg-white p-2 rounded border border-gray-200 mb-2 shadow-sm">
          <input
            type="text"
            className="input input-bordered input-sm w-full"
            value={item.title}
            onChange={e => handleChange(index, 'title', e.target.value)}
            placeholder="Nama Sertifikat/Penghargaan"
          />
          <button type="button" onClick={() => handleRemove(index)} className="text-gray-400 hover:text-red-500 p-1">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </BaseMultipleInput>
  )
}

const BannerInput = ({ errors, setData, initialBanner }) => {
  const [preview, setPreview] = useState(initialBanner ?? null)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setData('banner', file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="font-medium text-gray-900 mb-4">Banner Profil</h3>
      <div className="space-y-4">
        <div className="aspect-[3/1] w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 relative group">
          {preview ? (
            <img src={preview} alt="Banner Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-sm">Belum ada banner</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50">
              Ganti Banner
              <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
            </label>
          </div>
        </div>
        {errors?.banner && <p className="text-sm text-red-600">{errors.banner}</p>}
        <p className="text-xs text-gray-500">
          Format: JPG, PNG, WEBP. Maksimal 2MB. Rasio yang disarankan 3:1.
        </p>
      </div>
    </div>
  )
}
