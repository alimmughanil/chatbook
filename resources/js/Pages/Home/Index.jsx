import ServiceCard from "@/Components/Card/ProductCard"; // Pastikan rename file komponen ini nanti
import SearchCard from "@/Components/Card/SearchCard";
import HomeLayout from "@/Layouts/HomeLayout";
import { Link, usePage } from "@inertiajs/react";
import { Fragment } from "react";
import { ShieldCheck, Search, Briefcase, Zap, Star, Rocket } from "lucide-react"
import { useSearchParams } from "@/utils/format";

export default function Index(props) {
  return (
    <HomeLayout title={props.title} auth={props.auth}>
      <Hero />
      <UniquePoint />
      <FeaturedCategory />
      <FeaturedServices />
    </HomeLayout>
  );
}

const Hero = () => {
  const { appName, auth } = usePage().props
  return (
    <section className="relative flex px-[20px] sm:px-[70px] justify-center items-center w-full py-12 sm:py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white -z-10"></div>

      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1280px]">
        <div className="max-w-[700px] lg:mr-[50px] flex flex-col items-center lg:items-start text-center lg:text-left">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-6">
            <Rocket size={14} />
            <span>Platform Freelance Terpercaya #1</span>
          </div>

          <h1 className="text-[24px] sm:text-[32px] leading-[1.1] text-main-black font-bold mb-[16px] tracking-tight">
            Temukan Jasa Profesional untuk <span className="text-transparent bg-clip-text linear-gradient-purple text-[24px] sm:text-[32px]">Bisnismu</span>
          </h1>

          <p className="text-[14px] sm:text-[18px] text-main-gray font-normal leading-relaxed mb-8 max-w-[600px]">
            {appName} menghubungkan Anda dengan ribuan freelancer bertalenta. Mulai dari desain, coding, hingga penulisan, selesaikan proyek Anda dengan cepat, aman, dan berkualitas.
          </p>

          <div className="w-full max-w-[500px] mb-6">
            <SearchCard searchPath="/app/service" placeholder="Cari jasa: Desain Logo, Website..." />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/app/service"
              className="flex items-center gap-2 linear-gradient-purple text-white text-sm sm:text-base font-medium px-8 py-3 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              <span>Mulai Cari Jasa</span>
              <i className="fas fa-arrow-right"></i>
            </a>
            <FreelancerRegistrationButton />
          </div>
        </div>

        <div className="relative hidden lg:block">
          {/* Ganti dengan gambar ilustrasi orang bekerja/freelancer */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400 rounded-full blur-2xl opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
          <img
            src="/image/hero-freelance.avif" // Pastikan ganti gambar yang relevan
            alt="Freelancer working"
            className="relative z-10 object-cover drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  )
}

const UniquePoint = () => {
  const { appName } = usePage().props

  const uniquePoints = [
    {
      icon: ShieldCheck,
      title: "Transaksi Aman",
      desc: `Pembayaran Anda aman bersama ${appName}. Dana hanya diteruskan ke freelancer setelah Anda menyetujui hasil kerja.`,
    },
    {
      icon: Search,
      title: "Talenta Terverifikasi",
      desc: "Setiap freelancer melewati proses kurasi ketat untuk memastikan keahlian dan profesionalitas kerja.",
    },
    {
      icon: Briefcase,
      title: "Beragam Kategori",
      desc: "Temukan ahli untuk segala kebutuhan bisnis, mulai dari pengembangan web, desain grafis, hingga pemasaran digital.",
    },
    {
      icon: Zap,
      title: "Pengerjaan Cepat",
      desc: `Dapatkan hasil kerja berkualitas tinggi dengan tenggat waktu yang jelas dan komunikasi langsung dengan freelancer.`,
    },
  ]

  return (
    <section className="flex flex-col px-[20px] sm:px-[70px] justify-center items-center w-full mt-10 sm:mt-20">
      <div className="text-center max-w-[600px] mb-12">
        <h2 className="text-2xl sm:text-[42px] font-bold text-main-black mb-4">
          Mengapa Memilih Kami?
        </h2>
        <p className="text-gray-500">Kami memberikan pengalaman terbaik dalam mencari jasa profesional untuk mengembangkan bisnis Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1440px]">
        {uniquePoints.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="group flex flex-col p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="rounded-xl flex items-center justify-center bg-purple-50 w-14 h-14 mb-6 group-hover:bg-[#6017BE] transition-colors duration-300">
                <Icon size={28} className="text-[#6017BE] group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-main-black text-xl font-bold mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const FeaturedCategory = () => {
  const { categories } = usePage().props
  const { params } = useSearchParams()

  return (
    <section className="flex flex-col px-[20px] sm:px-[70px] justify-center items-center w-full mt-16 sm:mt-24">
      <h2 className="text-2xl sm:text-3xl font-bold text-main-black text-center">
        Eksplorasi Kategori Jasa
      </h2>
      <p className="text-gray-500 mt-2 text-center mb-8">Pilih kategori yang sesuai dengan kebutuhan proyekmu</p>

      <div className="flex flex-wrap justify-center gap-3 w-full max-w-[1000px]">
        {categories.length > 0 ? (
          categories.map((category, idx) => {
            const isActive = params && params.get("category") && params.get("category") == category.slug;
            return (
              <Link
                preserveState
                preserveScroll
                href={`/?category=${category.slug}`}
                key={idx}
                className={`
                  inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 border
                  ${isActive
                    ? 'text-white bg-[#6017BE] border-[#6017BE] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#6017BE] hover:text-[#6017BE]'}
                    px-6 py-2.5`}
              >
                {category.name}
              </Link>
            )
          })
        ) : <p className="text-gray-400">Belum ada kategori</p>}

        {categories.length > 0 ? (
          <a
            href="/app/category"
            className="inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 transition-colors"
          >
            <span className="sr-only">Lihat semua</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        ) : null}
      </div>
    </section>
  )
}


const FeaturedServices = () => {
  const { props } = usePage()
  const services = props.featuredProducts || props.featuredCourses || [];

  return (
    <section className="flex flex-col mx-auto px-[20px] sm:px-[70px] justify-center items-center w-full mt-16 sm:mt-24 mb-20 max-w-[1440px]">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center w-full mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-main-black flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
            Jasa Pilihan
          </h2>
          <p className="text-gray-500 text-sm mt-1">Layanan dengan rating tinggi yang paling banyak dicari</p>
        </div>

        <a
          href="/app/service"
          className="hidden sm:flex items-center gap-2 text-[#6017BE] font-medium hover:underline mt-4 sm:mt-0"
        >
          <span>Lihat semua layanan</span>
          <i className="fas fa-arrow-right"></i>
        </a>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] justify-center gap-6 w-full">
        {services.length > 0 ? services.map((service, index) => {
          return (
            <Fragment key={index}>
              {/* Pastikan CourseCard sudah diganti namanya menjadi ServiceCard secara internal/file */}
              <ServiceCard product={service} />
            </Fragment>
          )
        }) : (
          <div className="col-span-full text-center py-10 text-gray-400">
            Belum ada layanan unggulan saat ini.
          </div>
        )}
      </div>

      <a href="/app/service" className="sm:hidden w-full text-center mt-6 text-[#6017BE] font-medium border border-[#6017BE] rounded-lg py-3">
        Lihat semua layanan
      </a>
    </section>
  );
};

const FreelancerRegistrationButton = ({ isDisabled = true }) => {
  const { auth } = usePage().props

  if (!!auth?.user) return <></>
  if (isDisabled) return <></>

  return (
    <a href="/login?role=partner" className="flex items-center gap-2 linear-gradient-yellow text-white text-sm sm:text-base font-medium px-8 py-3 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300">
      Jadi Freelancer
      <i className="fas fa-rocket"></i>
    </a>
  )
}