import HomeLayout from "@/Layouts/HomeLayout";
import { Star, CheckCircle } from "lucide-react";
import ProductCard from "@/Components/Card/ProductCard";
import { useState } from "react";
import useLang from "@/utils/useLang";
import { date, dateHumanize } from "@/utils/format";
import ExpandableCard from "@/Components/Card/ExpandableCard";

export default function Show({ user, profile, details, products, reviews, auth }) {
  const getDetails = (type) => details[type] || [];
  const banner = getDetails('banner')[0]?.value?.path;

  return (
    <HomeLayout title={`${user.name} - Freelancer Profile`} auth={auth} className="min-h-screen">
      <div className="bg-white min-h-screen pb-20 w-full">
        {banner ? (
          <div className="h-48 w-full relative overflow-hidden">
            <img src={banner} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ) : (
          <Banner />
        )}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            <div className="lg:col-span-1">
              <ProfileCard user={user} profile={profile} />
              <EducationSection education={getDetails('education')} />
              <ExperienceSection experience={getDetails('experience')} />
              <SkillSection skills={getDetails('skill')} />
              <LanguageSection languages={getDetails('language')} />
              <CertificateSection certificates={getDetails('certificate')} />
            </div>
            <div className="lg:col-span-2 mt-6 lg:mt-0">
              <ProductSection user={user} products={products} />
              <ReviewSection reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

const Banner = () => (
  <div
    className="h-48 w-full relative overflow-hidden linear-gradient-purple">
    <div className="absolute inset-0 bg-black/10"></div>
  </div>
);

const ProfileCard = ({ user, profile }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <img
          src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
          alt={user.name}
          className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 object-cover"
        />
        {profile?.is_verified && (
          <div className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-sm">
            <CheckCircle className="text-blue-500" size={20} />
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900">{user.username || user.name}</h1>

      <div className="flex items-center gap-1 mt-2 text-yellow-500">
        <div className="flex">
          <Star className="fill-current" size={14} />
        </div>
        <span className="font-bold text-gray-900 ml-1">{user?.avg_rating ? Math.round(user?.avg_rating).toFixed(1) : 0}</span>
      </div>

      {profile?.is_verified && (
        <div className="mt-3 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
          <CheckCircle size={14} className="fill-current" />
          Verified Freelance
        </div>
      )}
      {profile?.short_bio ? (
        <div className="mt-6 p-4 bg-orange-50 rounded-lg text-sm text-gray-600 leading-relaxed italic w-full text-center">
          "{profile?.short_bio}"
        </div>
      ) : null}

      <div className="w-full mt-8 space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Anggota sejak</span>
          <span className="font-medium text-blue-600">{date(user.created_at)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Dipesan sebanyak</span>
          <span className="font-medium text-blue-600">{user?.success_order ?? 0} kali</span>
        </div>
        {/* <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Waktu respons rata-rata</span>
          <span className="font-medium text-blue-600">15 menit</span>
        </div> */}
        {user?.success_order_rate ? (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Tingkat penyelesaian</span>
            <span className="font-medium text-blue-600">{user?.success_order_rate ?? 0}%</span>
          </div>
        ) : null}
        {profile?.about ? (
          <div className="flex flex-col items-start justify-start py-2 border-b border-gray-100">
            <span className="text-gray-500">Tentang Saya</span>
            <ExpandableCard maxHeight="100px" wrapperClassName="text-left">
              <span className="text-gray-700 text-left">{profile?.about}</span>
            </ExpandableCard>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

const EducationSection = ({ education }) => {
  if (!education || education.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase tracking-wide">Latar belakang pendidikan</h3>
      <div className="space-y-4">
        {education.map((item, idx) => (
          <div key={idx}>
            <div className="font-bold text-gray-900 text-sm">{item.value.school}</div>
            <div className="text-sm text-gray-500">{item.value.degree}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExperienceSection = ({ experience }) => {
  if (!experience || experience.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase tracking-wide">Pengalaman kerja</h3>
      <div className="space-y-4">
        {experience.map((item, idx) => (
          <div key={idx}>
            <div className="font-bold text-gray-900 text-sm">{item.value.company}</div>
            <div className="text-sm text-gray-600">{item.value.position}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {date(item.value.start_date)} - {item?.value?.end_date ? date(item.value.end_date) : 'Sekarang'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillSection = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase tracking-wide">Keahlian</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((item, idx) => (
          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
            {item.value.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const LanguageSection = ({ languages }) => {
  if (!languages || languages.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase tracking-wide">Bahasa</h3>
      <div className="space-y-2">
        {languages.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm text-gray-700">{item.value.language}</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              {useLang(`language.level.${item.value.level}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CertificateSection = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase tracking-wide">Sertifikat dan Penghargaan</h3>
      <div className="space-y-3">
        {certificates.map((item, idx) => (
          <div key={idx} className="text-sm text-gray-700 border-b border-gray-100 pb-2">
            {item.value.title}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductSection = ({ user, products }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-white mb-6">Jasa dari {user.username || user.name}</h2>
    <ExpandableCard maxHeight="1000px" buttonShowText="Lihat Semua" buttonHiddenText="Lebih Sedikit" className="flex flex-col justify-center items-center" isShadow={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        {products.length > 0 ? products.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        )) : (
          <div className="col-span-full text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
            Belum ada jasa yang ditambahkan.
          </div>
        )}
      </div>
    </ExpandableCard>

  </div>
);

const ReviewSection = ({ reviews }) => {
  const [activeTab, setActiveTab] = useState('buyer');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        <button
          className={`pb-3 font-medium text-sm relative ${activeTab === 'buyer' ? 'text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('buyer')}
        >
          Ulasan Pembeli ({reviews.length})
          {activeTab === 'buyer' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
        </button>
      </div>

      <div className="space-y-6">
        <ExpandableCard maxHeight="300px" buttonShowText="Lihat Semua" buttonHiddenText="Lebih Sedikit">
          {reviews.length > 0 ? reviews.map((review, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                {review.user?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-blue-600 text-sm">{review.user?.name}</h4>
                    <div className="text-xs text-gray-400 mt-0.5">{dateHumanize(review.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                    <Star className="fill-current" size={14} />
                    {review.rating}
                  </div>
                </div>
                {review.message ? (
                  <p className="text-gray-600 text-sm mt-2">{review.message}</p>
                ) : null}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-400">
              Belum ada ulasan.
            </div>
          )}
        </ExpandableCard>
      </div>
    </div>
  );
};
