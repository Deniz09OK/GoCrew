import PropTypes from 'prop-types';

Workspace.propTypes = {
    color: PropTypes.string.required,
}

export default function Workspace({color}) {
    return (
        <>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="w-6 h-6 rounded-lg z-20">
                <rect x="0" y="0" width="24" height="24" fill={color} stroke="currentColor" strokeWidth="0.1"/>
            </svg>
        </>
    )
}