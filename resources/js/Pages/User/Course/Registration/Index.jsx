import HomeLayout from '@/Layouts/HomeLayout';
import RegistrationForm from './Form/RegistrationForm';
import { CourseDetailCard } from '@/Components/Card/CourseCard';
import { router, usePage } from '@inertiajs/react';
import Countdown from "@/Components/Countdown"
import { dateTime } from '@/utlis/format';
import { toast } from 'react-toastify';

function Index(props) {
  return (
    <HomeLayout auth={props.auth}>
      <div className="w-full flex flex-col justify-center lg:flex-row gap-2 lg:gap-8 items-stretch">
        <div className="w-max max-w-[90vw]">
          <div className="border-b pb-2 max-w-xl mx-auto lg:mx-0">
            <CourseDetailCard course={props.course} title={props?.course?.title} wrapperImageClassName="aspect-[16/9] overflow-hidden" />
          </div>
          {props.course.registration_start_at ? (
            <div className="max-w-xl mx-auto lg:mx-0">
              <h1 className="text-primary text-opacity-80 font-semibold mt-4">Waktu Pendaftaran</h1>
              <div className="flex flex-wrap gap-2 opacity-90">
                <p>{dateTime(props.course.registration_start_at)}</p>

                {props.course.registration_close_at ? (
                  <>
                    <span>-</span>
                    <p>{dateTime(props.course.registration_close_at)}</p>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
          {props.course.description ? (
            <div className="max-w-xl mx-auto lg:mx-0">
              <h1 className="text-primary text-opacity-80 font-semibold mt-4">Tentang Kursus</h1>
              <div className='text-editor-content text-sm' dangerouslySetInnerHTML={{ __html: props.course.description }}></div>
            </div>
          ) : null}
        </div>
        <RegistrationSection />
      </div>
    </HomeLayout>
  );
}

const RegistrationSection = () => {
  const { props } = usePage()
  if (!!props.course?.registration_countdown) return <RegistrationCountdown />

  return (
    <div className="flex-1">
      <p className='text-primary text-opacity-80 font-semibold mt-4'>Isi Data Diri</p>
      <p className='text-black text-opacity-80 text-sm'>
        Mohon periksa kembali data diri Anda—informasi ini akan tercantum di sertifikat.
      </p>

      {props.participant ? (
        <p className='text-black text-opacity-80 text-sm'>
          Data diri akan terisi otomatis dari data kepesertaan terakhir yang kamu daftarkan, silahkan disesuaikan jika diperlukan.
        </p>
      ) : null}

      <div className="mt-2">
        <RegistrationForm BackButton={() => <></>} SubmitButton={SubmitButton} />
      </div>
    </div>
  )
}

const RegistrationCountdown = () => {
  const { props } = usePage()
  const handleTimeUp = () => {
    toast("Pendaftaran kursus telah dimulai", { type: "success" })
    router.reload({ async: false })
  }

  return (
    <div className="flex-1 grid sm:px-6">
      <div className="w-full border border-purple-200 bg-white rounded-2xl py-10 shadow-sm grid place-content-center">

        <h2 className="text-center text-lg sm:text-xl font-semibold text-purple-700 mb-6 tracking-wide">
          Pendaftaran akan dibuka dalam
        </h2>

        <div className="flex justify-center">
          <Countdown
            durationInSeconds={props.course.registration_countdown}
            onTimeUp={handleTimeUp}
            className="text-[4rem] sm:text-[5rem] md:text-[6rem] font-bold text-purple-600"
          />
        </div>

        <p className="text-center mt-6 text-sm text-purple-500 italic">
          Halaman akan otomatis diperbarui saat hitung mundur berakhir.
        </p>
      </div>
    </div>
  )
}



const SubmitButton = (props) => {
  const { handleSubmit, form } = props
  const { processing } = form

  return (
    <button onClick={handleSubmit} disabled={processing} className={`btn btn-primary btn-sm`}>
      <span className={`${processing && "loading"}`}></span>
      <span>Daftar Sekarang</span>
    </button>
  )
}

export default Index;