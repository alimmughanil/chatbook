import HomeLayout from "@/Layouts/HomeLayout"
import { useState } from "react"
import { Star, ChevronDown, ShieldCheck, ShoppingBag, Tag, Rocket, SquareArrowOutUpRight } from "lucide-react"
import { currency, dateHumanize, whatsappNumber } from "@/utils/format"
import { useAtom } from "jotai"
import { activePackageAtom, showModalAtom } from "@/atoms"
import RatingModal from "@/Components/Modal/RatingShowModal"
import ProductDetailImages from "@/Components/Card/ProductDetailImages"
import { ProductActionCard, ShareBtn } from "@/Components/Card/ProductActionCard"
import ProductActionMobileCard from "@/Components/Card/ProductActionMobileCard"
import ExpandableCard from "@/Components/Card/ExpandableCard"

function Show(props) {
  const { product, otherProducts, phoneNumber } = props
  const { product_detail = [], user, product_tag } = product
  const [showModal, setShowModal] = useAtom(showModalAtom)

  let whatsappUrl = null
  if (phoneNumber) {
    const text = `Halo, saya tertarik dengan jasa "${product.name}" di ${appName}. Bisa diskusi lebih lanjut?`
    whatsappUrl = `https://wa.me/${whatsappNumber(phoneNumber)}?text=${encodeURIComponent(text)}`
  }

  return (
    <HomeLayout auth={props.auth} className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 pb-32 lg:pb-10">

        <ProductBreadcrumb product={product} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="border-b border-gray-100 pb-6 mb-2">
              <div className="flex items-center gap-3 mb-3">
                {product.category && (
                  <span className="bg-purple-50 text-[#6017BE] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-100">
                    {product.category.name}
                  </span>
                )}
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${product.status === 'publish' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'publish' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  {product.status === 'publish' ? 'Tersedia' : 'Tidak Tersedia'}
                </span>
              </div>

              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                {product.ratings_avg_rating && (
                  <a href="#review" className="flex items-center gap-1.5 pr-4 border-r border-gray-200">
                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900 text-base">
                      {parseFloat(product.ratings_avg_rating).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 underline decoration-dotted cursor-pointer hover:text-[#6017BE]">
                      ({product.ratings_count} ulasan)
                    </span>
                  </a>
                )}

                <div className="flex items-center gap-1.5 pr-4 border-r border-gray-200 text-sm text-gray-600">
                  <ShoppingBag size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{product.order_count ?? 0}</span>
                  <span className="text-gray-500">Pesanan Selesai</span>
                </div>

              </div>
            </div>

            <ProductDetailImages images={props.images} />
            <div className="lg:hidden space-y-4">
              <FreelancerProfileCard user={user} />
              <ShareBtn product={product} />
            </div>

            <ProductDescription description={product.description} tags={product_tag} />

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <ShieldCheck className="text-[#6017BE]" />
                Pilihan Paket
              </h2>
              <div className="space-y-3">
                {product_detail.length > 0 ? (
                  product_detail.map((detail, index) => (
                    <PackageAccordionItem key={detail.id || index} detail={detail} index={index} />
                  ))
                ) : (
                  <div className="p-6 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-500">
                    Paket detail belum ditambahkan oleh freelancer.
                  </div>
                )}
              </div>
            </div>

            <ProductReview product={product} />
          </div>

          <div className="hidden lg:block lg:col-span-4 h-full relative">
            <div className="sticky top-24">
              <div className="space-y-2">
                <FreelancerProfileCard user={user} />
                <ProductActionCard product={product} whatsappUrl={whatsappUrl} packages={product.product_detail} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12">
          <RelatedProducts products={otherProducts} categorySlug={product.category?.slug} />
        </div>
      </div>

      <ProductActionMobileCard
        product={product}
        packages={product.product_detail}
        user={user}
        isShowNego={product.is_nego}
      />

      {showModal && (
        <RatingModal data={showModal} ratings={showModal?.ratings} handleClick={() => setShowModal(null)} />
      )}
    </HomeLayout >
  )
}

export const ProductBreadcrumb = ({ product }) => {
  return (
    <div className="text-sm text-gray-500 breadcrumbs overflow-x-auto whitespace-nowrap scrollbar-hide py-2 max-w-[82vw]">
      <ul className="flex items-center gap-2">
        <li><a href="/" className="hover:text-[#6017BE]">Beranda</a></li>
        <li className="before:content-['/'] before:mx-2"><a href="/app/service" className="hover:text-[#6017BE]">Jasa</a></li>
        {product.category && (
          <li className="before:content-['/'] before:mx-2"><a href={`/app/category/${product.category.slug}`} className="hover:text-[#6017BE]">{product.category.name}</a></li>
        )}
        <li className="before:content-['/'] before:mx-2 font-medium text-gray-900 truncate max-w-[200px]">{product.name}</li>
      </ul>
    </div>
  )
}

const FreelancerProfileCard = ({ user }) => {
  const profile = user?.profile;
  const avatarUrl = user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
  let profileLink = user?.username ? `/u/${user?.username}` : null

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <a href={profileLink ?? ""} className="shrink-0">
          <img src={avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 hover:border-[#6017BE] transition-colors" />
        </a>
        <div className="flex-1">
          <a href={profileLink ?? ""} className="flex items-center gap-2 group">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#6017BE] transition-colors">{user.name}</h3>
            <ShieldCheck size={16} className="text-green-500 fill-green-50" />
          </a>
          <p className="text-sm text-gray-500 mb-2">{profile?.short_bio}</p>
        </div>
      </div>

      {profile?.about && (
        <div className="pt-4 border-t border-gray-50">
          <p className="text-sm text-gray-600 line-clamp-3 italic">"{profile.about}"</p>
        </div>
      )}
      {!!profileLink && (
        <a
          href={profileLink}
          className="group flex items-center justify-center gap-2 w-full mt-4 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200"
        >
          <span>Lihat Profil</span>
          <SquareArrowOutUpRight
            size={16}
            className="text-gray-400 group-hover:text-primary transition-colors"
          />
        </a>
      )}
    </div>
  )
}

const ProductDescription = ({ description, tags }) => {
  if (!description) return null

  return (
    <div className="bg-white rounded-xl p-0 md:p-6 md:border md:border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Deskripsi Jasa</h2>

      <ExpandableCard maxHeight="180px">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
      </ExpandableCard>

      {tags && tags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
            <Tag size={14} />
            <span>Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tagItem, idx) => (
              <span key={idx} className="text-xs uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors cursor-default">
                {tagItem?.tag?.title || tagItem}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ProductReview = ({ product }) => {
  if (!product) return null
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div id="review">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Ulasan Klien</h2>
        <span className="text-sm text-gray-500">
          {product.ratings_count} Ulasan
        </span>
      </div>

      {product.ratings_count === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 text-sm">Belum ada ulasan untuk jasa ini.</p>
        </div>
      ) : (
        <>
          <div className={`space-y-4 transition-all duration-500 ease-in-out ${isExpanded ? "max-h-full" : "max-h-[400px] overflow-hidden relative"}`}>

            {product.ratings?.map((rating, index) => {
              const avatarUrl = rating.user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.user?.name)}&background=random`;

              return (
                <div key={index} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt={rating.user?.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-900 text-sm">
                          {rating.user?.name || 'Pengguna'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {dateHumanize(rating.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-gray-700">
                        {Number(rating.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p>{rating.message || <span className="italic text-gray-400">Tidak ada komentar tertulis.</span>}</p>
                  </div>
                </div>
              );
            })}

            {!isExpanded && product.ratings?.length > 3 && (
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
            )}
          </div>

          {product.ratings?.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-full gap-1 font-semibold text-[#6017BE] mt-6 hover:underline group"
            >
              {isExpanded ? "Sembunyikan Ulasan" : "Lihat Semua Ulasan"}
              <ChevronDown size={18} className={`transition-transform duration-300 group-hover:translate-y-0.5 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </>
      )}
    </div>
  )
}

const PackageAccordionItem = ({ detail, index }) => {
  const [activeIdx, setActiveIdx] = useAtom(activePackageAtom)
  const [isOpen, setIsOpen] = useState(index === activeIdx)

  const handleSelected = (index) => {
    setActiveIdx(index)
  }

  return (
    <div className={`border rounded-xl transition-all duration-300 ${isOpen ? 'border-[#6017BE] bg-purple-50/30' : 'border-gray-200 bg-white'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full p-4 text-left">
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-base">{detail.name}</span>
          <span className="text-sm text-[#6017BE] font-semibold mt-1">{currency(detail.price)}</span>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="text-sm text-gray-600">
            {detail.description ? (
              <div dangerouslySetInnerHTML={{ __html: detail.description }} />
            ) : null}
          </div>

          <button onClick={() => handleSelected(index)} className="w-full mt-4 bg-[#6017BE] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#4c1296] transition-colors shadow-lg shadow-purple-200">
            Pilih Paket Ini
          </button>
        </div>
      )}
    </div>
  )
}

const RelatedProducts = ({ products, categorySlug }) => {
  if (!products || products.length === 0) return null;
  const displayProducts = products.length > 5 ? products.slice(5) : products;

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Produk Lainnya</h3>
          <p className="text-sm text-gray-500 mt-1">Jasa lain yang mungkin anda butuhkan</p>
        </div>

        {categorySlug && (
          <a href={`/app/category/${categorySlug}`} className="text-[#6017BE] text-sm font-semibold hover:underline">
            Lihat Semua
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayProducts.map((el, idx) => (
          <a key={idx} href={`/product/${el.slug}`} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
            <div className="relative h-32 md:h-40 overflow-hidden bg-gray-100">
              <img
                src={el.thumbnail || '/images/default.jpg'}
                alt={el.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#6017BE] transition-colors mb-2">{el.name}</h4>
              <div className="mt-auto">
                <span className="text-[#6017BE] text-sm font-bold">{currency(el.price)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Show