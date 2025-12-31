import HomeLayout from "@/Layouts/HomeLayout";
import { date } from "@/utlis/format";

function Show(props) {
    const { blog } = props
    return (
        <HomeLayout title={props.title} auth={props.auth}>
            <div className="grid w-full md:place-content-center">
                <div className="w-full min-h-[70vh] xl:min-h-[50vh] sm:w-[70vw] bg-white border rounded-lg shadow mt-4 mb-16">
                    {blog ? (
                        <div className="card w-full bg-base-100 glass">
                            <div className="card-body mb-8">
                                <div className="">
                                    <h2 className="card-title text-2xl">{blog.title}</h2>
                                    <p className="text-sm">{date(blog.created_at)}</p>
                                </div>
                                <div className="self-start">
                                    <figure><img src={blog.thumbnail} alt="Thumbnail" className="sm:w-96 rounded-lg" /></figure>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: blog.description }} className="text-justify"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto grid place-content-center h-full gap-4">
                            <p className="text-xl font-bold">Artikel tidak ditemukan</p>
                            <button onClick={() => history.back()} className="btn btn-primary btn-outline btn-sm">Kembali</button>
                        </div>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}

export default Show;
