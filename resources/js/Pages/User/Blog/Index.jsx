import BlogCard from "@/Components/Card/BlogCard";
import HomeLayout from "@/Layouts/HomeLayout";

function Index(props) {
	let theme = 'light'

  return (
    <HomeLayout title={props.title} auth={props.auth} theme={theme}>
      {props?.categories?.length > 0 && props.blogCount > 0 ? (
        <div className="sm:mt-8 sm:px-4">
          {props?.categories?.map((category, index) => (
            <div key={index} className="w-full">
              {category.blog.length == 0 ? null : <BlogCategory category={category} theme={theme} />}
            </div>
          ))}
        </div>
      ): (
        <div className="w-full flex items-center justify-center mt-8 min-h-[50vh]">
          <p className="text-center">Belum ada artikel yang dapat ditampilkan</p>
        </div>
      )}
    </HomeLayout>
  );
}

export const BlogCategory = ({ category, theme, titleColor='' }) => {
  const blogs = category.blog
  if (blogs?.length == 0) return <></>

  return (
    <div id={category?.slug} className={`flex flex-col gap-4 w-full xl:max-w-7xl lg:max-w-5xl mx-auto 2xl:max-w-[80vw] 3xl:max-w-[50vw] ${theme == 'dark' ? 'text-white' : ''}`}>
      <div className="flex items-center gap-2 w-full">
        {!!category.image ? (
          <figure>
            <img src={category.image} className="w-7 object-cover rounded-full" />
          </figure>
        ) : null}
        <p className={`text-2xl font-bold capitalize ${titleColor}`}>{category?.name}</p>
      </div>
      <div className="w-full">
        <div className={`grid grid-cols-1 sm:grid-cols-2 3xl:grid-cols-3 mx-auto max-w-[92vw] lg xl:max-w-7xl lg:max-w-5xl 2xl:max-w-[80vw] 3xl:max-w-[50vw] gap-4 overflow-y-hidden overflow-auto scrollbar-none justify-start`}>
          {blogs.map((blog, index) => (
            <a key={index} href={`/blog/${blog.slug}`} className="">
              <BlogCard blog={blog} theme={theme} />
            </a>
          ))}
        </div>
        <div className="flex justify-start">
          <a href={`/blog/category/${category?.slug}`} className="btn btn-sm btn-primary mt-4">
            Lihat Lainnya
          </a>
        </div>
      </div>
    </div>
  )
}

export default Index;
