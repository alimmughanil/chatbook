import { PortfolioCardSidebar } from "@/Components/Card/PortfolioCard";
import CarouselCard from "@/Components/Card/CarouselCard";
import HomeLayout from "@/Layouts/HomeLayout";
import { currency, date } from "@/utils/format";
import { usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
} from "react-share";
import useStatus, { useStatusLabel } from "@/utils/useStatus";

function Show(props) {
  const { portfolio, portfolioUrl } = props;
  let theme = 'light';
  const category = portfolio?.category ?? {};

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast('Link Portofolio Berhasil Disalin', { type: 'success' });
  };

  return (
    <HomeLayout title={portfolio?.name} auth={props.auth} theme={theme}>
      <div className="w-full sm:mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative px-4 mt-8 min-h-[50vh] max-w-7xl mx-auto">

        {/* Konten Utama (Kiri) */}
        <div className={`lg:col-span-8 flex flex-col gap-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold capitalize">{portfolio?.name}</h1>
            <div className='flex flex-wrap gap-4 text-sm items-center text-gray-500'>
              <div className="flex items-center gap-2">
                {portfolio?.user?.picture && (
                  <img src={portfolio.user.picture} width={24} className="rounded-full" alt="avatar" />
                )}
                <p className='font-medium capitalize'>by {portfolio?.user?.name}</p>
              </div>
              <p><i className="fas fa-calendar-alt pr-1"></i> {date(portfolio?.project_date, 'id-ID', 'numeric', 'long')}</p>
              <p>di <a href={`/portfolio/category/${portfolio?.category?.slug}`} className="underline text-primary">{portfolio?.category?.name}</a></p>
              <span className={`badge ${useStatus(`portfolio.${portfolio?.project_status}`)}`}>{useStatusLabel(`portfolio.${portfolio?.project_status}`)}</span>
            </div>
          </div>

          {/* Media (Slider or Thumbnail) */}
          <div className="rounded-xl overflow-hidden shadow-sm">
            {portfolio?.portfolio_image?.length > 0 ? (
              <div className="w-full h-[20rem] lg:h-[30rem]">
                <CarouselCard sliderCount={portfolio?.portfolio_image?.length} provider="react-image-gallery">
                  {portfolio?.portfolio_image.map((image, index) => (
                    <img key={index} src={image?.value} className="w-full h-full object-cover" alt={`Slide ${index}`} />
                  ))}
                </CarouselCard>
              </div>
            ) : (
              <img
                src={portfolio.thumbnail || portfolio.banner_image}
                className="w-full max-h-[30rem] object-cover"
                alt="Thumbnail"
              />
            )}
          </div>

          {/* Project Highlights (Price, Client, Duration) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Harga</p>
              <p className="text-sm font-semibold">
                {portfolio.price_min ? currency(portfolio.price_min) : 'Free'}
                {portfolio.price_max ? ` - ${currency(portfolio.price_max)}` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Durasi</p>
              <p className="text-sm font-semibold">{portfolio.duration || '-'} {portfolio.duration_unit || 'Hari'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Client</p>
              <p className="text-sm font-semibold">
                {portfolio.is_show_client && portfolio.client ? portfolio.client.name : 'Private Client'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Link</p>
              {portfolio.site_url ? (
                <a href={portfolio.site_url} target="_blank" className="text-sm text-blue-600 underline font-semibold flex items-center gap-1">
                  Visit Site <i className="fas fa-external-link-alt text-[10px]"></i>
                </a>
              ) : <p className="text-sm font-semibold">-</p>}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold">Keterangan</h3>
            <div className="text-editor-content text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: portfolio.description }}></div>
          </div>

          {/* Tags & Share */}
          <div className="border-t pt-6 space-y-4">
            {portfolio?.portfolio_label?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">Tags:</span>
                {portfolio.portfolio_label.map(({ label }, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full capitalize">
                    {label?.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold">Share:</span>
              <div className='flex items-center gap-3'>
                <FacebookShareButton url={portfolioUrl}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={portfolioUrl} title={portfolio.name}>
                  <XIcon size={32} round />
                </TwitterShareButton>
                <button
                  onClick={() => handleCopyUrl(portfolioUrl)}
                  className='border bg-white hover:bg-gray-100 transition-colors rounded-full h-[32px] w-[32px] flex items-center justify-center text-gray-600'
                  title="Copy Link"
                >
                  <i className="fas fa-link text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Kanan) */}
        <div className="lg:col-span-4 h-max sticky top-4">
          <RelatedPortfolioIndex theme={theme} category={category} />
        </div>

      </div>
    </HomeLayout>
  );
}

const RelatedPortfolioIndex = ({ theme, category }) => {
  const { props } = usePage();
  const { relatedPortfolios } = props;

  if (!relatedPortfolios || relatedPortfolios.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        {category?.image && (
          <img src={category.image} className="w-8 h-8 object-cover rounded-full" alt="category" />
        )}
        <p className="text-lg font-bold capitalize">Proyek lain di {category?.name}</p>
      </div>
      <div className="divide-y divide-gray-50">
        {relatedPortfolios.map((item, index) => (
          <a key={index} href={`/portfolio/${item.slug}`} className="block hover:bg-gray-50 transition-colors">
            <PortfolioCardSidebar portfolio={item} theme={theme} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default Show;
