import { useState } from 'react'
import Home from './home';
import Cfg from './config';
import Report from './report';
import Products from './products';
import { Sidebar,SidebarFooter,SidebarContent,SidebarGroup,SidebarHeader,SidebarProvider,SidebarGroupContent,SidebarMenu,SidebarMenuButton,SidebarMenuItem, SidebarGroupLabel,} from "./components/ui/sidebar";
import { HomeIcon, Settings, Sheet,WheatIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar';
import { ToastContainer } from 'react-toastify';
import './index.css'
import { Factory } from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';

const App = () => {  
 
  const[view,setView] = useState('Home');
  
  let content;
  switch (view) {
    case 'Home':
      content = <Home />;
      break;
    case 'Report':
      content = <Report />;
      break;
    case 'Cfg':
      content = <Cfg />;
      break;
    case 'Products':
      content = <Products/>;
      break;
    default:
      content = <h1>404 - Not Found</h1>;
  }
  const items=[
    {
      title:"Início",
      icon:HomeIcon,
      view: 'Home'
    },
    {
      title:"Relatórios",
      icon:Sheet,
      view: 'Report'
    },
    {
      title:"Produtos",
      icon:WheatIcon,
      view: 'Products'
    },

  ]
  const itemsFooter=[
    {
      title:"configurações",
      icon:Settings,
      view: 'Cfg'
    }
  ]
  return (<div id='app' className='flex flex-row w-screen h-dvh overflow-hidden gap-0 '>
      <SidebarProvider className='shadow-xl'>
        <Sidebar className="bg-sidebar-red-600 shadow-xl">
          <SidebarHeader className="pt-6 ">
            <div id='avatar' className='flex gap-3'>
              <Avatar className="h-12 w-12 ml-2">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback><Factory/></AvatarFallback>
              </Avatar>
              <div className='flex flex-col font-semibold'>
                <h2>Nome da empresa</h2>
                <h3>Ração</h3>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
             <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <Separator/>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => setView(item.view)}
                          className={`flex items-center gap-2 transition-colors 
                            ${view === item.view 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground inset-shadow-sm" 
                              : "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"}`}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarGroup>
                <SidebarGroupLabel>Outros</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {itemsFooter.map((itemsFooter) => (
                      <SidebarMenuItem key={itemsFooter.title}>
                        <SidebarMenuButton
                          onClick={() => setView(itemsFooter.view)}
                          className={`flex itemsFooters-center gap-2 transition-colors 
                            ${view === itemsFooter.view 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                              : "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"}`}
                        >
                          <itemsFooter.icon />
                          <span>{itemsFooter.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>  
        <div id='main-content' className='flex flex-row justify-center items-center w-[200vh] h-full overflow-auto gap-5 px-4 py-1'>
            {content}
                <ToastContainer
                  position="bottom-right"
                  autoClose={3000}
                  theme="light"
                />
        </div>   
      </div>
  );
};
export default App
