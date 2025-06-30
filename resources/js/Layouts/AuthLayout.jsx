export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex font-dinnext text-neutral-900">
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 to-primary-700 items-center justify-center"></div>
            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white">
                {children}
            </div>
        </div>
    );
}
