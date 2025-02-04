import Link from 'next/link';
import { Bell, MessageCircle, Wrench } from 'lucide-react';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuBadge,
} from '@/components/ui/sidebar';

export default function SidebarNotifications() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Notificações</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="#">
								<Bell />
								<span>Notificações</span>
							</Link>
						</SidebarMenuButton>
						<SidebarMenuBadge>99+</SidebarMenuBadge>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="#">
								<MessageCircle />
								<span>Whatsapp</span>
							</Link>
						</SidebarMenuButton>
						<SidebarMenuBadge>
							<Wrench size={16} />
						</SidebarMenuBadge>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
