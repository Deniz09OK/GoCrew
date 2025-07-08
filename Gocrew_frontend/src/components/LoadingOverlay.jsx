import PropTypes from 'prop-types';

export default function LoadingOverlay({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#280648CC]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">En cours de chargement...</h2>
                    <p className="text-white/80 text-sm">
                        Nous mettons tout en œuvre pour rendre votre expérience aussi fluide que possible. Merci de patienter un instant.
                    </p>
                </div>
            </div>
        </div>
    );
}

LoadingOverlay.propTypes = {
    isVisible: PropTypes.bool.isRequired
}; 