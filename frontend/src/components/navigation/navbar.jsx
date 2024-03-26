import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';  
import { MegaMenu } from 'primereact/megamenu';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const place = location.pathname+location.hash
    const itemRenderer = (item, options) => {
        let isActive = (place === item.value)
        if (! ['/bills', '/capitalCalls'].includes(place) && item.value =='/investors') isActive = true 
            
        
        return (
            <a className={`flex align-items-center p-menuitem-link ${isActive ? 'bg-gray-200 rounded' : ''}`}>
                <span className={item.icon + ' text-lg'} />
                <span className="mx-2 text-xl">{item.label}</span>
                {item.badge && <Badge className="ml-auto" value={item.badge} />}
                {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
            </a>
        );
};


    const items = [
        {
            value:'/investors',
            label: 'Investors',
            icon: 'pi pi-users',
            template: itemRenderer,
            command: () => {
                navigate('/investors');
            }
        },
        {
            value:'/bills',
            label: 'Bills',
            icon: 'pi pi-money-bill',
            template: itemRenderer,
            command: () => {
                navigate('/bills');
            }
        },
        {
            value:'/capitalCalls',
            label: 'Capital Calls',
            icon: 'pi pi-chart-line',
            template: itemRenderer,
            command: () => {
                navigate('/capitalCalls');
            }
        }
    ];

    const start = <span style={{ fontStyle: 'italic', fontSize: '28px',paddingRight:'3vw' }}>Archimed</span>;

    const end = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );

    return (
        <div className="card p-4">
            <MegaMenu model={items} start={start}  orientation="horizontal" breakpoint="960px" className="p-3 pl-5 surface-0 shadow-2" style={{ borderRadius: '1rem' }} />
        </div>
    )
}
