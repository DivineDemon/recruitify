import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
	return (
		<header className="flex h-16 w-full items-center justify-end gap-5 border-b p-3.5">
			<ModeToggle />
		</header>
	);
};

export default Navbar;
