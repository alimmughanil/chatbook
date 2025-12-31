import ExploreLayout from "@/Layouts/ExploreLayout";
import { Link, usePage } from "@inertiajs/react";

function Index(props) {
  return (
    <ExploreLayout links={props.category.links} searchPlaceholder="Cari kategori yang kamu inginkan">
      <CategoryIndex />
    </ExploreLayout>
  );
}

const CategoryIndex = () => {
  const { category } = usePage().props;

  return (
    <div className="py-4 mb-8 w-full">
      <p className="px-4 pb-2 text-center w-full">
        Menampilkan <span className="font-semibold">{category.total}</span>{" "}  Kategori
      </p>
      <div className="box-content flex flex-wrap gap-2 mt-1 rounded-xl justify-center item-center">
        {category.data.map((category, index) => (
          <div key={index} className="card w-40 sm:w-48 bg-base-100 border-2 hover:shadow-lg">
            <Link href={`/app/category/${category.slug}`} className="btn btn-sm btn-outline h-full flex-col py-2">
              {/* <i className={`${category.icon ?? 'fas fa-layer-group'} fa-2x`}></i> */}
              <span>{category.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Index;
