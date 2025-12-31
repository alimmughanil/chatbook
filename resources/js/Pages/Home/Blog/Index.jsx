import Pagination from "@/Components/Pagination";
import HomeLayout from "@/Layouts/HomeLayout";
import { date } from "@/utlis/format";
import { Link } from "@inertiajs/react";

function Index(props) {
    const { blogs } = props
    return (
        <HomeLayout title={props.title} auth={props.auth}>
            <div className="grid w-full md:place-content-center">
                <div className="w-full min-h-[70vh] xl:min-h-[50vh] sm:w-[70vw] bg-white border px-4 rounded-lg shadow py-4 mt-4 mb-16">
                    <div className="grid gap-2 text-justify">
                        <h1 className="text-lg font-semibold text-center">
                            Blog
                        </h1>

                        <div className="flex flex-wrap gap-4 justify-center mb-4">

                            {blogs.data.length == 0 ? (
                                <div className="mt-4 text-gray-600">
                                    <p>Belum ada artikel yang dipublikasikan</p>
                                </div>
                            ) : blogs.data.map((blog, index) => (
                                <div key={index} className="card w-96 bg-base-100 shadow">
                                    <figure><img src={blog.thumbnail} alt="Thumbnail" /></figure>
                                    <div className="card-body mb-8">
                                        <div className="">
                                            <h2 className="card-title">{blog.title}</h2>
                                            <p className="text-sm">{date(blog.created_at)}</p>
                                        </div>
                                        <div dangerouslySetInnerHTML={{ __html: blog.description.substring(0, 100) }}></div>
                                        <div className="card-actions justify-end absolute bottom-4 right-4">
                                            <Link href={`/blog/${blog.slug}`} className="btn btn-primary btn-outline btn-sm">Selengkapnya</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {blogs.data.length == 0 ? null : (
                            <div className="my-4 mx-auto">
                                <Pagination links={blogs.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Index;
