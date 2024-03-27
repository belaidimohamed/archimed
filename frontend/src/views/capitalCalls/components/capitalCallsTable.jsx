import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { HiDotsVertical } from "react-icons/hi";

export default function CapitalCallsTable({ data, handleEdit, handleDelete, handleStatus }) {
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
                label: 'Change Status',
                icon: 'pi pi-file-edit',
                command: () => { handleStatus(currentElement) }
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
                globalFilterFields={['investor__name', 'total_amount','iban', 'due_date', 'from_company', 'status']}
                header={header}
                emptyMessage="No data found."
            >
                <Column field="investor__name" header="To Person"  style={{ minWidth: '12rem' }} />
                <Column field="total_amount" header="Total Amount" sortable style={{ minWidth: '12rem' }} />
                <Column field="due_date" header="Due Date" sortable style={{ minWidth: '12rem' }} />
                <Column field="from_company" header="From Company"  style={{ minWidth: '12rem' }} />
                <Column field="iban" header="IBAN" style={{ minWidth: '12rem' }} />
                <Column field="status" header="Status"  style={{ minWidth: '12rem' }} />
                <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>
    );
};
