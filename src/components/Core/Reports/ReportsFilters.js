import React, { useState } from 'react'
import { useEffect } from 'react'
import { formatDate } from '../../../service/constant'
import { TableModalFilter } from '../Table/TableFilter'




function ReportsFilters({compName, compKey ,visible, invisible, callFilters, getCompData, tags}) {
  const bench = {
    fields: [
      {
        Placeholder: 'Date Range',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'dates',
        size: 'small',
        type: 'RangePicker',
        fieldStyle: { width: '100%' },
      }
    ],
    searchValue: {
      dates: {
        type: 'Date',
        value: null,
        label: 'Dates',
        showInColumn: true,
        disabled: true,
      }
    },
    callFilters: (value1, value2, filters, formData) =>{
      let [startDate, endDate] = formData?.dates || []
      startDate = formatDate(startDate, true)
      endDate = formatDate(endDate, true)
      let qurey = `${startDate? 'startDate='+ startDate :''}&${endDate? 'endDate='+ endDate :''}`
      getCompData(qurey, filters)
    }
  }
  // const [searchedColumn, setSearchedColumn] = useState(reportsFilter[compKey]?.['searchValue']||{})
  
  const reportsFilter = {
    bench
  }

  
  useEffect(() => {
    
  
    return () => {
      // setSearchedColumn({})
    }
  }, [])
  
  
  
 

  return (
    <TableModalFilter
      title={`Filter Bench ${compName}`}
      visible={visible}
      filters={reportsFilter[compKey]?.['searchValue']}
      filterFields={reportsFilter[compKey]?.['fields']||[]}
      filterFunction={reportsFilter?.[compKey]?.callFilters}
      destroyOnClose={false}
      // effectFunction={this.filterModalUseEffect}
      // effectRender={true}
      onClose={() => invisible()}
    />
  )
}

export default ReportsFilters