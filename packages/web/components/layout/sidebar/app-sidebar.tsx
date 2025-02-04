import { Cpu, Home, LibraryBig, MessagesSquare } from 'lucide-react';
import { auth } from '@/lib/functions/auth';
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';
import { MenuItem, SidebarLinkGroup } from './link-group';
import SidebarNotifications from './notifications';
import SidebarFooterContent from './footer';

const homeItems: MenuItem[] = [
	{
		title: 'Início',
		url: '/dashboard',
		icon: Home,
	},
];

const agentItems: MenuItem[] = [
	{
		title: 'Agentes',
		url: '/dashboard/agentes',
		icon: Cpu,
	},
	{
		title: 'Base de conhecimento',
		url: '/dashboard/base-de-conhecimento',
		icon: LibraryBig,
	},
];

const conversationItems: MenuItem[] = [
	{
		title: 'Conversas',
		url: '/dashboard/conversas',
		icon: MessagesSquare,
	},
];

export default async function AppSidebar() {
	const user = await auth().getUser();

	return (
		<Sidebar>
			<SidebarHeader />
			<SidebarContent>
				<SidebarLinkGroup label="Início" items={homeItems} />
				<SidebarLinkGroup label="Agentes" items={agentItems} />
				<SidebarLinkGroup label="Conversas" items={conversationItems} />
				<SidebarNotifications />
			</SidebarContent>
			<SidebarFooterContent username={user.name} />
			<SidebarRail />
		</Sidebar>
	);
}
