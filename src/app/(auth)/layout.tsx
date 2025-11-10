import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-12">
			<div className="w-full max-w-md space-y-6">{children}</div>
		</div>
	);
};

export default AuthLayout;
