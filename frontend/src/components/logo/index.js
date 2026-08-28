function Logo({ tamanho = 32 }) {
    return (
        <svg
            className="logo-marca"
            width={tamanho}
            height={tamanho * (30 / 28)}
            viewBox="0 0 28 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* dois "Y" - um normal, um de ponta cabeça - encostando só numa perna cada */}
            <path
                d="M5 2 L14 12 L23 2 M14 12 L14 26 M14 26 L8 18 L2 26 M8 18 L8 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default Logo;
