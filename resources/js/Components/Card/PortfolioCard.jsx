import { dateHumanize } from '@/utils/format'; 

const CardContent = ({ portfolio, isSidebar = false }) => (
  <div className="p-4 w-full flex-1 min-w-0">
    <h1 className={`font-semibold line-clamp-2 ${isSidebar ? 'text-sm' : 'text-lg'}`}>
      {portfolio?.name}
    </h1>

    <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs items-center mt-1 text-gray-500'>
      {portfolio?.user && (
        <p className='font-normal capitalize truncate max-w-[150px]'>
          by {portfolio.user.name}
        </p>
      )}
      <p className="whitespace-nowrap">
        <i className="fas fa-clock pr-1"></i>
        {dateHumanize(portfolio?.project_date || portfolio?.created_at)}
      </p>
    </div>

    {!isSidebar && (
      <div dangerouslySetInnerHTML={{__html: portfolio?.description}} className='text-sm line-clamp-2 mt-2 text-gray-600'></div>
    )}
  </div>
);

const PortfolioCard = ({ portfolio, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`card w-full card-side relative rounded-none shadow-none overflow-hidden  ${isLight ? 'bg-white border' : 'bg-secondary'}`}>
      {portfolio?.thumbnail && (
        <figure className="flex-shrink-0 max-h-[200px]">
          <img
            src={portfolio.thumbnail}
            alt={portfolio.name}
            className="w-[10rem] h-full object-cover"
          />
        </figure>
      )}

      <CardContent portfolio={portfolio} />
    </div>
  );
};

export const PortfolioCardSidebar = ({ portfolio, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`card w-full card-side relative rounded-none shadow-none overflow-hidden ${isLight ? 'bg-white border' : 'bg-secondary'}`}>
      <CardContent portfolio={portfolio} isSidebar={true} />

      {portfolio?.thumbnail && (
        <figure className="flex-shrink-0">
          <img
            src={portfolio.thumbnail}
            alt={portfolio.name}
            className="w-[6rem] h-full object-cover"
          />
        </figure>
      )}
    </div>
  );
};

export default PortfolioCard;