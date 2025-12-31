import React, { useEffect, useState, useRef } from "react"
import { Link, router, usePage, useForm } from "@inertiajs/react"
import ReactSelect from "react-select"
import { useAtom } from "jotai"
import { Plus, Edit, Trash2, Archive, Send, FileCheck, AlertCircle, Settings, XCircle, CheckCircle, MousePointerClick, Save, X, Ellipsis } from "lucide-react"

// Components & Utils
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Input from "@/Components/Form/Input"
import TextArea from "@/Components/Form/TextArea"
import Select from "@/Components/Form/Select"
import LabelIndex from "./Label/Index"
import SendEmailModal from "./Modal/SendEmailModal"
import DeleteModal from "@/Components/Modal/DeleteModal"
import PublishModal from "@/Components/Modal/PublishModal"
import ArchivedModal from "@/Components/Modal/ArchivedModal"
import { ModalButton } from "@/Components/WithModal"
import useFormChange from "@/utlis/useFormChange"
import useStatus, { useStatusLabel } from "@/utlis/useStatus"
import { showModalAtom } from "@/atoms"

function Index(props) {
  const { location } = props
  const params = new URLSearchParams(new URL(location).search)
  let courseIdParam = params.get("course_id")

  // State untuk Sertifikat
  const [certificate, setCertificate] = useState(null) // Untuk Edit Form Utama
  const [activeCertConfig, setActiveCertConfig] = useState(null) // Untuk Konfigurasi Label (Panel Kanan)
  const [labelPreview, setLabelPreview] = useState(null) // Untuk highlight kotak merah
  const [isDragging, setIsDragging] = useState(false);

  const isForm = params.has("create") || params.has("edit")
  const [isClearable, setIsClearable] = useState(false)

  let selectedIndex = courseIdParam ? props.courses.findIndex((course) => course.value == courseIdParam) : 0

  useEffect(() => {
    if (params.get("course_id")) setIsClearable(true)

    // Auto select sertifikat pertama untuk konfigurasi jika ada data
    if (props.certificates?.length > 0 && !activeCertConfig) {
      setActiveCertConfig(props.certificates[0])
    }
  }, [params, props.certificates])

  const handleSelectChange = (e) => {
    const courseId = e?.value ?? ""
    router.get(`?course_id=${courseId}`)
  }

  const [showModal, setShowModal] = useAtom(showModalAtom)

  return (
    <AuthenticatedLayout title={props.title} auth={props.auth}>
      <div className="container flex flex-col mx-auto py-6 w-full !px-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8 border-b pb-4">
          <div className="w-full flex items-center gap-2">
            <label className="label text-sm font-semibold text-gray-600 flex-1 whitespace-pre">Pilih Kursus: </label>
            <ReactSelect
              className="basic-single w-full"
              classNamePrefix="select"
              placeholder="Cari atau pilih kursus..."
              defaultValue={props.courses[selectedIndex]}
              isClearable={isClearable}
              isSearchable={true}
              onChange={handleSelectChange}
              options={props.courses}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#e5e7eb",
                  borderRadius: "0.5rem",
                }),
              }}
            />
          </div>

          {courseIdParam && (
            <Link href={`?show=certificate&create=true&course_id=${courseIdParam}`} className="btn btn-primary btn-sm gap-2 text-white shadow-lg">
              <Plus size={16} /> Tambah Sertifikat Baru
            </Link>
          )}
        </div>

        {/* Main Content Area */}
        <div className="min-h-[50vh] mb-[30vh]">
          {!courseIdParam ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-xl bg-gray-50">
              <Settings size={48} className="mb-2 opacity-50" />
              <p>Silakan pilih kursus terlebih dahulu untuk mengelola sertifikat.</p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              {/* FORM CREATE / EDIT SERTIFIKAT UTAMA */}
              {params.get("create") && (
                <div className="card bg-base-100 shadow-xl border border-gray-100 mb-6">
                  <div className="card-body">
                    <h3 className="card-title text-lg border-b pb-2 mb-4">Buat Sertifikat Baru</h3>
                    <CertificateCreate />
                  </div>
                </div>
              )}

              {certificate && isForm && !params.get("create") && (
                <div className="card bg-base-100 shadow-xl border border-gray-100 mb-6">
                  <div className="card-body">
                    <h3 className="card-title text-lg border-b pb-2 mb-4">Edit Data Sertifikat</h3>
                    <CertificateEdit certificate={certificate} params={params} />
                  </div>
                </div>
              )}

              {/* LIST & CONFIGURATION AREA */}
              {!isForm && (
                <div className="flex flex-col lg:flex-row gap-6 items-start relative">
                  {/* KOLOM KIRI: LIST SERTIFIKAT */}
                  <div className="w-full lg:w-2/3 order-1">
                    <CertificateList
                      setCertificate={setCertificate}
                      certificates={props.certificates}
                      activeCertConfig={activeCertConfig}
                      setActiveCertConfig={setActiveCertConfig}
                      labelPreview={labelPreview}
                      setLabelPreview={setLabelPreview}
                      isDragging={isDragging}
                      setIsDragging={setIsDragging}
                    />
                  </div>

                  {/* KOLOM KANAN: KONFIGURASI LABEL (STICKY) */}
                  <div
                    className="
                      order-2 w-full z-40
                      fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.15)]
                      lg:top-24 lg:w-1/3 lg:bg-transparent lg:border-t-0 lg:shadow-none lg:sticky
                  "
                  >
                    <div className="card bg-base-100 shadow-none lg:shadow-xl border-0 lg:border border-gray-200 h-full">
                      {/* Wrapper Scrollable untuk Mobile jika konten terlalu panjang */}
                      <div className="max-h-[50vh] lg:max-h-[calc(100vh-8rem)] overflow-y-auto px-4 custom-scrollbar">
                        <div className="flex items-center justify-between border-b pb-2 mb-4 sticky py-2 top-0 bg-base-100 z-10">
                          <div className="flex items-center gap-2">
                            <Settings className="text-primary" size={20} />
                            <h3 className="font-bold text-gray-800">Konfigurasi Label</h3>
                          </div>
                          {/* Indikator Mobile Swipe (Visual Only) */}
                          <div className="lg:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto absolute left-0 right-0 top-0"></div>
                        </div>

                        {activeCertConfig ? (
                          <div className="animate-fade-in">
                            <div className="alert alert-info shadow-sm py-2 px-3 mb-4 text-xs text-white flex justify-between items-center">
                              <div className="flex items-center gap-2 capitalize">
                                <MousePointerClick size={16} />
                                <span>
                                  Mengedit: <b>Sertifikat {activeCertConfig.type}</b>
                                </span>
                              </div>
                            </div>
                            {/* Pastikan LabelIndex merender form dengan baik */}
                            <LabelIndex certificate={activeCertConfig} setLabelPreview={setLabelPreview} labelPreview={labelPreview} isDragging={isDragging} setIsDragging={setIsDragging}/>
                          </div>
                        ) : (
                          <div className="text-center py-10 text-gray-400">
                            <MousePointerClick size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Pilih sertifikat di daftar untuk mengatur label.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <>
          <DeleteModal
            id={showModal?.id}
            label={`Sertifikat ${showModal.type}`}
            isForceDelete={showModal.deleted_at != null}
            handleClick={() => setShowModal(null)}
          />
          <PublishModal
            id={showModal?.id}
            label={showModal.type}
            data={showModal}
            handleClick={() => setShowModal(null)}
            content={(data) => <CertificateStatusAlert certificate={data} type="publish" />}
          />
          <ArchivedModal
            id={showModal?.id}
            label={showModal.type}
            data={showModal}
            handleClick={() => setShowModal(null)}
            content={(data) => <CertificateStatusAlert certificate={data} type="archived" />}
          />
          <SendEmailModal data={showModal} handleClick={() => setShowModal(null)} />
        </>
      )}
    </AuthenticatedLayout>
  )
}

// --- Sub Components ---

const CertificateStatusAlert = ({ certificate, type }) => {
  let courseName = certificate?.course?.title ?? "Semua Kursus"
  const isPublish = type === "publish"

  return (
    <div className={`mt-3 p-4 rounded-lg flex items-start gap-3 ${isPublish ? "bg-blue-50 text-blue-800" : "bg-orange-50 text-orange-800"}`}>
      <AlertCircle className="mt-0.5 shrink-0" size={20} />
      <div className="text-sm">
        <p className="font-medium mb-1">Sertifikat akan {isPublish ? "dipublikasikan" : "diarsipkan"}.</p>
        <p className="opacity-90">
          {isPublish
            ? `Peserta yang menyelesaikan "${courseName}" akan dapat mengunduh sertifikat ini.`
            : `Peserta tidak akan dapat mengakses sertifikat ini lagi.`}
        </p>
      </div>
    </div>
  )
}

const CertificateList = ({ setCertificate, certificates, activeCertConfig, setActiveCertConfig, labelPreview, setLabelPreview, isDragging, setIsDragging}) => {
  const [showModal, setShowModal] = useAtom(showModalAtom)
  const { props } = usePage()

  const parentRef = useRef(null);

  const handleEdit = (certificate) => {
    setCertificate(certificate)
    router.visit(`?show=certificate&edit=true&course_id=${certificate.course_id}`, {
      method: "get",
      preserveScroll: true,
      preserveState: true,
    })
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border">
        <FileCheck size={64} className="text-gray-200 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Belum ada sertifikat</h3>
        <p className="text-gray-500">Mulai dengan menambahkan template sertifikat baru.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {certificates.map((cert, index) => {
        const isActive = activeCertConfig?.id === cert.id

        return (
          <div
            key={cert.id}
            className={`card bg-base-100 shadow-lg border transition-all duration-300 overflow-hidden
                            ${isActive ? "border-primary ring-2 ring-primary/20" : "border-gray-200"}
                        `}
          >
            {/* Card Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-bold text-gray-800 capitalize">Sertifikat {cert.type}</h4>
                  <span className={`badge badge-sm mt-1 gap-1 ${useStatus(cert.status)}`}>{useStatusLabel(cert.status)}</span>
                </div>
              </div>

              {/* Action Buttons Toolbar dengan Label */}
              <div className="flex flex-wrap gap-2 items-center">
                <button onClick={() => handleEdit(cert)} className="btn btn-sm btn-ghost border border-gray-300 hover:bg-gray-100 text-gray-600">
                  <Edit size={14} />
                  <span>Edit Info</span>
                </button>

                <button
                  onClick={() => setActiveCertConfig(cert)} // Ini akan mentrigger scroll panel kanan jika di mobile
                  className={`btn btn-sm border border-gray-300 ${isActive ? "btn-primary text-white" : "btn-ghost hover:bg-gray-100"}`}
                >
                  <Settings size={14} />
                  <span>Atur Label</span>
                </button>

                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-sm btn-ghost border border-gray-300 m-1">
                    <Ellipsis size={14} />
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <ModalButton
                        id={`publish_${cert.id}`}
                        onClick={() => setShowModal(cert)}
                        className={`${cert.status === "published" ? "disabled text-gray-400" : ""}`}
                      >
                        <Send size={14} className="text-green-600" /> Publikasikan
                      </ModalButton>
                    </li>
                    <li>
                      <ModalButton id={`archived_${cert.id}`} onClick={() => setShowModal(cert)}>
                        <Archive size={14} className="text-orange-600" /> Arsipkan
                      </ModalButton>
                    </li>
                    <li>
                      <ModalButton id={`delete_${cert.id}`} onClick={() => setShowModal(cert)} className="text-red-600">
                        <Trash2 size={14} /> Hapus
                      </ModalButton>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card Body - Preview Area */}
            <div className="p-6">
              {/* Membatasi Lebar Kontainer Gambar */}
              <div
                ref={parentRef}
                onClick={() => setActiveCertConfig(cert)}
                className={`relative w-full max-w-4xl mx-auto bg-gray-200 rounded-lg overflow-hidden border shadow-inner cursor-pointer transition-colors
                                    ${isActive ? "border-primary" : "border-gray-300 hover:border-primary/50"}
                                `}
              >
                {/* Base Template Image */}
                <img src={cert.template} alt="Template Preview" className="w-full h-auto object-contain" />

                {/* Overlay Labels (Selalu Muncul) */}
                {cert.label.map((label, idx) => (
                  <div
                    key={idx}
                    style={{
                      top: `${label.y_coordinate}%`,
                      left: `${label.x_coordinate}%`,
                      width: `${label.box_width}%`,
                      height: `${label.box_height}%`,
                      fontSize: `${label.font_size}px`,
                    }}
                    className="absolute flex items-center justify-center border-2 border-dashed border-blue-400 bg-blue-500/10 text-blue-800 font-semibold pointer-events-none"
                  >
                    <span className="truncate capitalize">{label.type} {cert.type}</span>
                  </div>
                ))}

                {/* Highlight Box (Preview from LabelIndex interaction) */}
                {/* Hanya muncul jika sertifikat ini yang sedang aktif */}
                {isActive && labelPreview && (
                  <DraggableLabel
                    parentRef={parentRef}
                    isActive={isActive}
                    labelPreview={labelPreview}
                    setLabelPreview={setLabelPreview}
                    cert={cert}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                  />
                )}
              </div>

              {/* Informasi Tambahan */}
              <div className="mt-4 flex justify-between text-sm text-gray-500 border-t pt-2">
                <span>
                  Ukuran: {cert.paper_width}cm x {cert.paper_height}cm
                </span>
                <span>{cert.label.length} Label dikonfigurasi</span>
              </div>
              {cert.description && (
                <div className="mt-2 text-sm bg-yellow-50 p-2 rounded text-gray-600 border border-yellow-100">
                  <span className="font-semibold">Note:</span> <span dangerouslySetInnerHTML={{ __html: cert.description }} />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const DraggableLabel = ({ isActive, labelPreview, setLabelPreview, parentRef, cert, isDragging, setIsDragging }) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault(); // Mencegah seleksi teks saat drag
    setIsDragging(true);

    // Hitung offset agar kursor tidak "jump" ke pojok kiri atas elemen saat mulai geser
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 2. Handle Pergerakan & Stop Dragging (Global Window Event)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !parentRef.current) return;

      const parentRect = parentRef.current.getBoundingClientRect();

      // Hitung posisi baru dalam Pixel relative terhadap Parent
      // Rumus: Posisi Mouse - Posisi Kiri Parent - Offset Klik Awal
      let newX = e.clientX - parentRect.left - dragOffset.x;
      let newY = e.clientY - parentRect.top - dragOffset.y;

      // Batasi agar tidak keluar area (Optional)
      // newX = Math.max(0, Math.min(newX, parentRect.width - (labelPreview.box_width / 100 * parentRect.width)));
      // newY = Math.max(0, Math.min(newY, parentRect.height - (labelPreview.box_height / 100 * parentRect.height)));

      // Konversi Pixel kembali ke Persentase (%)
      const xPercent = (newX / parentRect.width) * 100;
      const yPercent = (newY / parentRect.height) * 100;

      // Update State
      setLabelPreview((prev) => ({
        ...prev,
        x_coordinate: parseInt(Math.round(xPercent)),
        y_coordinate: parseInt(Math.round(yPercent)),
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, parentRef, setLabelPreview]);

  if (!isActive || !labelPreview) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        top: `${labelPreview.y_coordinate}%`,
        left: `${labelPreview.x_coordinate}%`,
        width: `${labelPreview.box_width}%`,
        height: `${labelPreview.box_height}%`,
        fontSize: `${labelPreview.font_size}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className={`absolute flex items-center justify-center z-10 border-4 border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-none ease-linear ${isDragging ? 'scale-105' : ''}`}
    >
      <span className="bg-white/80 px-1 border shadow-sm truncate capitalize select-none pointer-events-none">
        {labelPreview.type} {cert?.type}
      </span>
    </div>
  );
};


// Wrapper Components to keep props clean
const CertificateCreate = () => <CertificateForm />
const CertificateEdit = ({ certificate }) => <CertificateForm certificate={certificate} />

function CertificateForm({ certificate = null }) {
  const { course, participantTypes } = usePage().props
  const [flash, setFlash] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(certificate?.template || null)

  const { data, setData, post, errors, processing } = useForm({
    course_id: certificate?.course_id ?? course?.id ?? "default",
    type: certificate?.type ?? participantTypes[0],
    template: certificate?.template ?? "",
    paper_width: certificate?.paper_width ?? "",
    paper_height: certificate?.paper_height ?? "",
    description: certificate?.description ?? "",
    is_default: certificate?.is_default ?? "",
    _method: certificate ? "put" : "post",
  })

  const handleChange = (e) => {
    const { name, value, files, type } = useFormChange(e, data)

    if (type === "file" && files[0]) {
      setPreviewUrl(URL.createObjectURL(files[0]))
      setData(name, files[0])
    } else {
      setData(name, value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = certificate ? `/admin/certificates/${certificate.id}` : `/admin/certificates`

    post(url, {
      onSuccess: ({ props }) => {
        setFlash({ type: "success", message: props.success?.message })
        router.visit(`/admin/certificates?course_id=${course?.id ?? "default"}`, {
          preserveScroll: true,
        })
      },
      onError: ({ props }) => setFlash({ type: "error", message: props.error?.message }),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {flash && (
        <div className={`alert ${flash.type === "success" ? "alert-success" : "alert-error"} shadow-sm`}>
          {flash.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{flash.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Select
            name="type"
            label="Tipe Penerima Sertifikat"
            errors={errors}
            handleChange={handleChange}
            value={data.type}
            className="select select-bordered w-full"
          >
            <option value="" disabled>
              Pilih Tipe
            </option>
            {participantTypes.map((t, i) => (
              <option key={i} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.1"
              name="paper_width"
              label="Lebar (cm)"
              placeholder="Contoh: 29.7"
              data={data}
              errors={errors}
              handleChange={handleChange}
            />
            <Input
              type="number"
              step="0.1"
              name="paper_height"
              label="Tinggi (cm)"
              placeholder="Contoh: 21.0"
              data={data}
              errors={errors}
              handleChange={handleChange}
            />
          </div>

          <div className="form-control w-full">
            <label className="label font-semibold">
              <span className="label-text">File Template (Gambar)</span>
            </label>
            <input
              type="file"
              name="template"
              onChange={handleChange}
              accept="image/*"
              className="file-input file-input-bordered file-input-primary w-full"
            />
            {errors.template && <span className="text-error text-sm mt-1">{errors.template}</span>}
            <label className="label">
              <span className="label-text-alt text-gray-500">Format: JPG, PNG. Pastikan resolusi tinggi.</span>
            </label>
          </div>

          <TextArea isTextEditor={true} name="description" label="Deskripsi Tambahan" setData={setData} data={data} errors={errors} />
        </div>

        <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 min-h-[300px]">
          {previewUrl ? (
            <>
              <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Preview Template</p>
              <img src={previewUrl} alt="Preview" className="rounded shadow-lg max-w-full h-auto object-contain" />
            </>
          ) : (
            <div className="text-center text-gray-400">
              <FileCheck size={48} className="mx-auto mb-2" />
              <p>Upload gambar untuk melihat preview</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4 mt-4">
        <Link href={`/admin/certificates?course_id=${course?.id ?? "default"}`} className="btn btn-ghost">
          Batal
        </Link>
        <button type="submit" disabled={processing} className="btn btn-primary text-white gap-2">
          {processing ? <span className="loading loading-spinner loading-sm"></span> : <Save size={18} />}
          <span>Simpan Sertifikat</span>
        </button>
      </div>
    </form>
  )
}

export default Index
