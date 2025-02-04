import { ReactNode } from 'react';
import SidebarPartLayout from '@/components/layout/sidebar/layout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<SidebarPartLayout>
			<div className="grid ">{children}</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
				{children}
			</div>

			{/* {modal} */}
		</SidebarPartLayout>
	);
}
