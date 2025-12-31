import { useForm } from "@inertiajs/react";

function LogoutModal() {
    const { post, processing } = useForm();

    function submit(e) {
        e.preventDefault();
        post("/logout");
        setTimeout(() => {
            location.replace("#");
        }, 1000);
    }
    return (
        <>
            <div className="modal" id="logout-confirm">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">
                         Apakah anda yakin ingin keluar?
                    </h3>
                    <div className="modal-action">
                        <a href="#" className="btn btn-primary btn-outline">
                            Tidak

                        </a>
                        <button
                            onClick={submit}
                            disabled={processing}
                            className="btn btn-primary"
                        >
                            Ya
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LogoutModal;
