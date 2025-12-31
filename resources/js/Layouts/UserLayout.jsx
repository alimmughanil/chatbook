import { Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import HomeLayout from './HomeLayout';

const UserLayout = ({ children, links }) => {
  const { url } = usePage();

  const tabs = [
    { link: '/me/orders', label: 'Pesanan' },
  ];

  const isActive = (path) => {
    if (path == '/me/orders' && url.startsWith('/app/order')) {
      return true
    }
    return url.startsWith(path)
  };

  return (
    <HomeLayout className="relative flex flex-col justify-between w-full max-w-[100vw]">
      <div className="min-h-screen w-full bg-white text-black font-sans">

        <div className="sticky top-[4.5rem] z-40 w-full border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto">
            <nav
              className="flex space-x-8 overflow-x-auto scrollbar-hide"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <Link
                  key={tab.link}
                  href={tab.link}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-all uppercase
                    ${
                      isActive(tab.link)
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }
                  `}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <main className="w-full">
          {children}
        </main>

        {links && (
          <div className="max-w-7xl w-full flex justify-end">
            <Pagination links={links} />
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default UserLayout;
