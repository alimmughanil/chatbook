import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Link, usePage } from '@inertiajs/react'
import { currency, dateTime, number } from '@/utils/format'
import useStatus, { useStatusLabel } from '@/utils/useStatus'
import useLang from '@/utils/useLang'

function Show(props) {
	const location = new URL(props.location)
	const params = new URLSearchParams(location.search)
	const show = params.get('show') ?? 'detail'

	return (
		<AuthenticatedLayout title={props.title} auth={props.auth}>
			<div className="relative w-full gap-4 p-4 mt-4 border rounded-lg">
				<NavbarButton params={params} />

				{show == 'detail' && <ShowDetail />}
			</div>
		</AuthenticatedLayout>
	)
}

const NavbarButton = ({ params }) => {
	const show = params.get('show') ?? 'detail'

	return (
		<div className="flex gap-2 mb-4 overflow-auto scrollbar-none">
			<Link href={'?show=detail'} className={`btn btn-sm btn-primary ${show == 'detail' ? '' : 'btn-outline'}`}>
				Detail
			</Link>
		</div>
	)
}
const ShowDetail = () => {
	const { portfolioProject} = usePage().props

	const properties = [
		{
			type: 'text',
			label: 'Nama Proyek',
			value: portfolioProject?.name,
		},
		{
			type: 'text',
			label: 'Nama Client',
			value: portfolioProject?.client?.name,
		},
		{
			type: 'text',
			label: 'Tampilkan Nama Client',
			value: portfolioProject?.is_show_client == 1 ? 'Ya' : 'Tidak',
		},
		{
			type: 'text',
			label: 'Range Harga',
			value: `${portfolioProject?.price_min ? `${currency(portfolioProject?.price_min)} - ` : ''} ${currency(portfolioProject?.price_max)}`,
		},
		{
			type: 'text',
			label: 'Durasi',
			value: `${number(portfolioProject?.duration)} ${useLang(portfolioProject?.duration_unit)}`,
		},
		{
			type: 'external-url',
			label: 'Live Site',
			value: portfolioProject?.site_url ?? null,
		},
		{
			type: 'text',
			label: 'Kategori',
			value: portfolioProject?.category?.name,
		},
		{
			type: 'text',
			label: 'Dibuat',
			value: dateTime(portfolioProject.created_at),
		},
		{
			type: 'text',
			label: 'Terakhir diperbarui',
			value: dateTime(portfolioProject.updated_at),
		},
		{
			type: 'status',
			label: 'status proyek',
			value: `portfolio.${portfolioProject?.project_status}`,
		},
		{
			type: 'status',
			label: 'status publikasi',
			value: `post.${portfolioProject?.status}`,
		},
		{
			type:  'image',
			label: 'Thumbnail',
			value: portfolioProject?.thumbnail,
			className: 'w-full h-full max-h-[40vh] object-cover',
		},
		{
			type: 'longtext',
			label: 'deskripsi',
			value: portfolioProject?.description ?? '-',
		},
	]

	return (
		<div className="flex flex-col gap-1">
			<div className="flex flex-wrap gap-4">
				<div className="flex-1">
					<div className="flex flex-col gap-2">
						{properties.map((property, i) => {
							if (!!property.hidden) return null

							return (
								<div key={i} className={`grid py-1 capitalize lg:grid-cols-12 sm:py-0 ${!!property?.center ? 'items-center' : ''}`}>
									<p className="col-span-4 font-semibold whitespace-pre lg:col-span-3 2xl:col-span-2">{property.label}</p>
									<div className={`col-span-6`}>
										{['text'].includes(property.type) ? <p>{property.value}</p> : null}
										{property.type == 'status' ? <div className={`capitalize badge ${useStatus(property.value)}`}>{useStatusLabel(property.value)}</div> : null}
										{property.type == 'image' && !!property.value ? <img src={property.value} alt={property.label} className={property?.className} /> : null}
										{property.type == 'longtext' ? <div className='text-editor-content' dangerouslySetInnerHTML={{ __html: property.value }}></div> : null}
										{property.type == 'color' ? <div className="w-full h-12 rounded-lg" style={{ backgroundColor: property.value }}></div> : null}
										{property.type == 'external-url' ? <a className="underline" href={property?.value ?? '#'} target='_blank'>{property?.value ? 'Lihat' : '-'}</a> : null}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Show
