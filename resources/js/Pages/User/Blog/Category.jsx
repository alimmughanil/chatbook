import BlogCard from "@/Components/Card/BlogCard";
import Pagination from "@/Components/Pagination";
import HomeLayout from "@/Layouts/HomeLayout";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

function Category(props) {
	let theme = 'light'
	return (
		<HomeLayout title={props.title} auth={props.auth} theme={theme}>
			<div className="w-full sm:mt-8 sm:px-4">
				<BlogCategory category={props.category} theme={theme}/>
			</div>
		</HomeLayout>
	);
}

const BlogCategory = ({category, theme}) => {
	const {props} = usePage();
	const {blogs} = props;
	const [isShow, setIsShow] = useState(false)

	return (
    <div className={`flex flex-col gap-4 w-full xl:max-w-7xl lg:max-w-5xl mx-auto 2xl:max-w-[80vw] 3xl:max-w-[50vw] min-h-[50vh] ${theme == 'dark' ? 'text-white' : ''}`}>
			<div className="flex items-center gap-2 w-full">
				{!!category.image ? (
					<figure>
						<img src={category.image} className="w-7 object-cover rounded-full" />
					</figure>
				) : null}
				<p className="text-2xl font-bold capitalize">{category?.name}</p>
			</div>

			{category?.description ? (
				<div className="mt-2 w-full">
					<div className={`text-editor-content text-start text-sm text-ellipsis overflow-hidden ... ${!isShow && 'line-clamp-3'}`} dangerouslySetInnerHTML={{ __html: category.description }}></div>
					<button type="button" className="underline" onClick={() => setIsShow((state) => !state)}>
						{isShow ? 'Sembunyikan' : 'Tampilkan Semua'}
					</button>
				</div>
			) : null}

			<div className="w-full mt-4">
				<div className={`grid grid-cols-1 sm:grid-cols-2 3xl:grid-cols-3 mx-auto max-w-[92vw] lg xl:max-w-7xl lg:max-w-5xl 2xl:max-w-[80vw] 3xl:max-w-[50vw] gap-4 overflow-y-hidden overflow-auto scrollbar-none justify-start`}>
					{blogs?.data.map((blog, index) => (
						<a key={index} href={`/blog/${blog.slug}`} className="">
							<BlogCard blog={blog} theme={theme}/>
						</a>
					))}
				</div>
				<div className={`flex justify-start mt-8 w-max rounded-xl ${theme == 'light' ? '' : 'bg-secondary'}`}>
					<Pagination links={props.blogs?.links} theme={theme} />
				</div>
			</div>
		</div>
	)
}

export default Category;
