function Logo({ tamanho = 32 }) {
    return (
        <svg
            className="logo-marca"
            width={tamanho}
            height={tamanho * 1.35}
            viewBox="0 0 28 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 2 L11 19 L5 25 L14 38 L21 13 L15 20 L24 2"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default Logo;
