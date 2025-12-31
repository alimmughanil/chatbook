import { dateHumanize } from '@/utils/format'

const BlogCard = ({ blog, theme='dark' }) => {
  return (
    <div className={`card w-full card-side relative rounded-none ${theme == 'light' ? 'bg-white border' : 'bg-secondary'} shadow-none`}>
      {!!blog.banner_image || !!blog.thumbnail ? (
        <figure>
          <img src={blog.thumbnail ?? blog.banner_image} srcSet={blog.banner_image} className="w-[10rem] h-[10rem] object-cover" />
        </figure>
      ) : null}
      <div className={`p-4 w-full flex-1 `}>
        <h1 className="font-semibold line-clamp-2 text-lg">
          {blog?.title}
        </h1>
        <div className='flex flex-col gap-1 lg:flex-row lg:gap-4 text-sm lg:items-center'>
					{!!blog?.user ? (
	          <p className='text-start sm:max-w-[200px] text-xs font-normal text-ellipsis overflow-hidden ... line-clamp-2 capitalize'>by {blog?.user?.name}</p>
					): null}
          <p className="text-xs"><i className="fas fa-clock pr-1"></i> {dateHumanize(blog?.published_at)}</p>
        </div>

        <p className='text-start text-sm text-ellipsis overflow-hidden ... line-clamp-2 mt-2'>{blog?.short_description}</p>
      </div>
    </div>
  )
}

export const BlogCardSidebar = ({ blog, theme='dark' }) => {
  return (
    <div className={`card w-full card-side relative rounded-none ${theme == 'light' ? 'bg-white border' : 'bg-secondary'} shadow-none`}>
      <div className={`p-4 w-full flex-1 `}>
        <h1 className="font-semibold line-clamp-3 text-sm">
          {blog?.title}
        </h1>
        <div className='flex gap-4 text-sm items-center'>
					{!!blog?.user ? (
	          <p className='text-start sm:max-w-[200px] text-xs font-normal text-ellipsis overflow-hidden ... line-clamp-2 capitalize'>by {blog?.user?.name}</p>
					): null}
          <p className="text-xs"><i className="fas fa-clock pr-1"></i> {dateHumanize(blog?.published_at)}</p>
        </div>
      </div>

			{!!blog.banner_image || !!blog.thumbnail ? (
        <figure>
          <img src={blog.thumbnail ?? blog.banner_image} srcSet={blog.banner_image} className="w-[8rem] h-[8rem] object-cover" />
        </figure>
      ) : null}
    </div>
  )
}

export default BlogCard
