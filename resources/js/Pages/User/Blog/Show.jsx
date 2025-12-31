import { BlogCardSidebar } from "@/Components/Card/BlogCard";
import CarouselCard from "@/Components/Card/CarouselCard";
import HomeLayout from "@/Layouts/HomeLayout";
import { date } from "@/utils/format";
import { usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
} from "react-share";

function Show(props) {
  const { blog, blogUrl } = props
  let theme = 'light'
  const category = blog?.category ?? {}

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
    toast('Link Artikel Berhasil Di Salin', { type: 'success' });
  }

  return (
    <HomeLayout title={props.title} auth={props.auth} theme={theme}>
      <div className="w-full sm:mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 relative px-4 mt-8 min-h-[50vh]">
        <div className={`sm:col-span-8 flex overflow-hidden flex-col gap-2 lg:gap-4 w-full xl:max-w-7xl lg:max-w-5xl mx-auto 2xl:max-w-[80vw] 3xl:max-w-[50vw] ${theme == 'dark' ? 'text-white' : ''}`}>
          <div className="flex items-center gap-2 w-full">
            <p className="text-2xl font-bold capitalize">{blog?.title}</p>
          </div>
          <div className='flex flex-col gap-1 lg:flex-row lg:gap-4 text-sm lg:items-center'>
            <div className="flex items-center gap-2">
              {!!blog?.user ? (
                <>
                  {!!blog.user?.picture ? (
                    <figure>
                      <img src={blog.user?.picture} width={20} className="rounded-full" />
                    </figure>
                  ) : null}
                  <p className='text-start sm:max-w-[200px] text-sm font-normal text-ellipsis overflow-hidden ... line-clamp-2 capitalize'>{blog?.user?.name}</p>
                </>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <p className="text-sm"><i className="fas fa-minus pr-1 hidden lg:inline-flex"></i> {date(blog?.published_at, 'id-ID', 'numeric', 'long')}</p>
              <p className="text-sm">in <a href={`/blog/category/${blog?.category?.slug}`} className="underline">{blog?.category?.name}</a></p>
            </div>
          </div>

          {blog.is_slider == 0 && !!blog?.banner_image ? (
            <figure>
              <img src={blog.banner_image} className="w-full object-cover rounded-lg" />
            </figure>
          ) : null}
          {blog.is_slider == 1 && blog?.blog_image?.length > 0 ? (
            <div className="w-full h-full max-h-[28vh] lg:max-h-[26rem] overflow-hidden">
              <CarouselCard sliderCount={blog?.blog_image?.length}>
                {blog?.blog_image.map((image, index) => {
                  return (
                    <img key={index} src={image?.value} className="w-full object-cover" />
                  )
                })}
              </CarouselCard>
            </div>
          ) : null}

          <div className="mt-2 w-full">
            <div className={`text-editor-content text-start text-sm text-ellipsis w-full`} dangerouslySetInnerHTML={{ __html: blog.description }}></div>
            {blog?.blog_label?.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <p className="text-lg">Tags: </p>
                {blog?.blog_label.map(({ label }, index) => {
                  return (
                    <p key={index} className="px-2 py-1 bg-neutral text-white bg-opacity-50 capitalize">{label?.name}</p>
                  )
                })}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <p className="text-lg">Share:</p>
              <div className='flex items-center gap-4'>
                <FacebookShareButton url={blogUrl}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={blogUrl} title={blog.title}>
                  <XIcon size={32} round />
                </TwitterShareButton>
                <button onClick={() => handleCopyUrl(blogUrl)} className='border rounded-full h-[33px] w-[33px] flex items-center justify-center'>
                  <i className="fas fa-link fa-2x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <RelatedBlogIndex theme={theme} category={category} />
      </div>
    </HomeLayout>
  );
}

const RelatedBlogIndex = ({ theme, category }) => {
  const { props } = usePage();
  const { relatedBlogs } = props
  if (relatedBlogs?.length == 0) return <></>

  return (
    <div className="bg-white sm:col-span-4 h-max sticky top-0 w-full">
      <div className="flex items-center gap-2 p-4 w-full ">
        {!!category?.image ? (
          <figure>
            <img src={category?.image} className="w-7 object-cover rounded-full" />
          </figure>
        ) : null}
        <p className="text-lg font-bold capitalize">{category?.name}</p>
      </div>
      <div>
        {relatedBlogs?.map((blog, index) => (
          <a key={index} href={`/blog/${blog.slug}`} className="">
            <BlogCardSidebar blog={blog} theme={theme} />
          </a>
        ))}
      </div>
    </div>
  )
}

export default Show;
