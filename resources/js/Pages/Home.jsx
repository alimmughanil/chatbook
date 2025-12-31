import Guest from "@/Layouts/GuestLayout";
import { Link, Head } from "@inertiajs/react";

export default function Home({ auth, laravelVersion, phpVersion }) {
    return (
        <Guest>
            <Head title="Laravel" />
            <div className="flex flex-col items-center justify-center">
                <p className="text-2">Selamat datang</p>
                <div className="flex gap-2 my-2">
                    <Link href="/login" className="btn btn-primary btn-sm">Login</Link>
                    <Link href="/register" className="btn btn-primary btn-sm btn-outline">Register</Link>
                </div>
            </div>
        </Guest>
    );
}
