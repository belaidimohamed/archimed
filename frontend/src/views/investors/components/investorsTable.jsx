import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { HiDotsVertical } from "react-icons/hi";

export default function InvestorsTable({ data, handleEdit, handleDelete }) {
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);
    const menu = useRef(null);
    const [currentElement, setCurrentElement] = useState('');

    useEffect(() => {
        setLoading(false);
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            // Define additional filters as needed
        });
        setGlobalFilterValue('');
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const clearFilter = () => {
        initFilters();
    };

    const renderHeader = () => (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        const actionItems = [
            {
                label: 'Update',
                icon: 'pi pi-file-edit',
                command: () => { handleEdit(currentElement) }
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => { handleDelete(currentElement) }
            }
        ];
        return (
            <React.Fragment>
                <Menu data={rowData} model={actionItems} popup ref={menu} id="popup_menu" />
                <div className="ml-2" style={{ 'cursor': 'pointer' }}
                    onClick={(event) => {
                        setCurrentElement(rowData)
                        menu.current.toggle(event)
                    }} aria-controls="popup_menu" aria-haspopup >
                    <HiDotsVertical size={30} />
                </div>
            </React.Fragment>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable
                value={data}
                paginator
                stripedRows
                rows={10}
                loading={loading}
                dataKey="id"
                filters={filters}
                globalFilterFields={['name', 'email', 'amount_invested','bill_type']}
                header={header}
                emptyMessage="No data found."
            >
                <Column field="name" header="Name" style={{ minWidth: '12rem' }} />
                <Column field="email" header="Email"  style={{ minWidth: '12rem' }} />
                <Column field="amount_invested" header="Amount Invested" style={{ minWidth: '12rem' }} />
                <Column field="investment_date" header="Investment Date"  style={{ minWidth: '12rem' }} />
                <Column field="billing_type" header="Billing type"  style={{ minWidth: '12rem' }} />

                <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>
    );
};
