import { React, useState } from "react";
import { router } from "@inertiajs/react";

function VerifyEmail({ user }) {
    const [emailVerify, setEmailVerify] = useState(false);
    const [processing, setProcessing] = useState(false);

    const verifyEmailSubmit = (e) => {
        e.preventDefault();
        setProcessing("verification-link-sent");

        try {
            router.post("/email/verification-notification");
            setTimeout(() => {
                setProcessing(false);
                setEmailVerify(true);
            }, 8000);
        } catch (err) {
            setProcessing("verification-link-sent");
        }
    };
    return !user.email_verified_at ? (
        <div className="mx-auto my-4 border rounded-xl w-max">
            <div
                className={`${emailVerify ? "bg-green-600" : "bg-gray-700"} ${
                    user.email_verified_at
                        ? "hidden"
                        : "text-gray-100 py-2 px-4 rounded-md"
                }`}
            >
                {emailVerify ? (
                    <p className="">
                        Link verifikasi email dalam antrian pengiriman, harap
                        tunggu dan selalu periksa kotak masuk atau kotak spam
                        email anda!
                    </p>
                ) : (
                    <div className="">
                        Verifikasi email anda terlebih dahulu untuk dapat
                        menggunakan layanan aplikasi ini!{" "}
                        <button
                            onClick={verifyEmailSubmit}
                            type="submit"
                            className="underline"
                            disabled={processing}
                        >
                            {processing ? (
                                <i className="text-gray-200 fas fa-spinner animate-spin"></i>
                            ) : (
                                "Kirim Link Verifikasi"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    ) : null;
}

export default VerifyEmail;
