import React, { useState, useEffect } from 'react'
import { TableModalFilter } from '../Table/TableFilter'
import {bench, skillResources, positions, allocations, projectRevenue, clientRevenue, leave_summary, timesheet_summary } from "./filtersFields"

function ReportsFilters({compName, compKey, visible, invisible, getCompData, tags}) {
  const [fields, setFields] = useState([]);
  const [open, setOpen] = useState(false)
  
  const reportsFilter = {
    bench: bench({fields,setFields, getCompData}),
    skillResources: skillResources({fields,setFields, getCompData}),
    positions: positions({fields,setFields, getCompData}),
    allocations: allocations({fields,setFields, getCompData}),
    projectRevenue: projectRevenue({fields,setFields, getCompData}),
    clientRevenue: clientRevenue({fields,setFields, getCompData}),
    leave_summary: leave_summary({fields,setFields, getCompData}),
    timesheet_summary: timesheet_summary({fields,setFields, getCompData}),
  };
  const {searchValue, callFilters, filterModalUseEffect, effectRender} = reportsFilter?.[compKey] ||{}

  useEffect(() => {
    setFields(reportsFilter[compKey]?.['fields'])
    
    return () => {
      // setSearchedColumn({})
    };
  }, []);

  useEffect(() => {
    if (!open){
      setOpen(visible)
    }
  }, [visible]);


  return (
    open && <TableModalFilter
      title={compName}
      visible={visible}
      filters={tags ?? searchValue}
      filterFields={fields || []}
      filterFunction={callFilters}
      destroyOnClose={true}
      effectFunction={filterModalUseEffect}
      effectRender={effectRender}
      onClose={() => invisible()}
    />
  );
}

export default ReportsFilters

//------------->HELPER<-------