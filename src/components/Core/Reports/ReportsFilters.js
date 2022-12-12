import React, { useState, useEffect } from 'react'
import { formatDate } from '../../../service/constant'
import { getStandardLevels } from '../../../service/constant-Apis'
import { TableModalFilter } from '../Table/TableFilter'




function ReportsFilters({compName, compKey, visible, invisible, getCompData, tags}) {
  const [fields, setFields] = useState([]);
  const [open, setOpen] = useState(false)

  const bench = {
    effectRender: false,
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
      },
    ],
    searchValue: {
      dates: {
        type: 'Date',
        value: null,
        label: 'Dates',
        showInColumn: true,
        disabled: true,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let [startDate, endDate] = formData?.dates || [];
      startDate = formatDate(startDate, true);
      endDate = formatDate(endDate, true);
      let qurey = `${startDate ? 'startDate=' + startDate : ''}&${
        endDate ? 'endDate=' + endDate : ''
      }`;
      getCompData(qurey, filters);
    },
  };

  const skillResources = {
    effectRender: true,
    filterModalUseEffect: () => {
      getStandardLevels().then((res) => {
        if (res.success) {
          let tempFields = [...fields]
          //setting up fields
          tempFields[1].data = res.data
          tempFields[1].onChange = skillLevelSelection
          let levels = res.data.map(el=>{
            return {
              label: el.label,
              options: el.levels || []
            }
          })
          //setting level value
          tempFields[3].data = levels
          setFields([...tempFields])
        }
      });
    },
    fields: [
      {
        Placeholder: 'Skill',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'skill',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Level',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'level',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
    ],
    searchValue: {
      skill: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      level: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let {skills, levels} = formData || [];
      console.log(skills, levels)
      // if (!true){
      //   let qurey = `${startDate ? 'startDate=' + startDate : ''}&${
      //     endDate ? 'endDate=' + endDate : ''
      //   }`;
      //   getCompData(qurey, filters);
      // }
    },
  };


  const positions = {
    effectRender: false,
    filterModalUseEffect: () => {

      // Promise.all(proje ,getStandardLevels()).then(res=>{
      //   if(res){}
      // })

      // getStandardLevels().then((res) => {
      //   if (res.success) {
      //     let tempFields = [...fields]
      //     //setting up fields
      //     tempFields[1].data = res.data
      //     tempFields[1].onChange = skillLevelSelection
      //     let levels = res.data.map(el=>{
      //       return {
      //         label: el.label,
      //         options: el.levels || []
      //       }
      //     })
      //     //setting level value
      //     tempFields[3].data = levels
      //     setFields([...tempFields])
      //   }
      // });
    },
    fields: [
      {
        Placeholder: 'Date Allocation Range',
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
      },
      {
        Placeholder: 'Project Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'projectType',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [
          {label: 'Milestone', value: 1},
          {label: 'Time & Materials', value: 2}
        ],
        type: 'Select',
      },
      {
        Placeholder: 'Project',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'project',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Booking Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'booking',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Resources',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'resource',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Skill',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'skill',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Level',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'level',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
    ],
    searchValue: {
      dates: {
        type: 'Date',
        value: null,
        label: 'Dates',
        showInColumn: true,
        disabled: true,
      },
      skill: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      level: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
      projectType: {
        type: 'none',
        multi: true,
        value: [],
        label: 'projectType',
        showInColumn: false,
        disabled: false,
      },
      project: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Project',
        showInColumn: false,
        disabled: false,
      },
      resource: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Project',
        showInColumn: false,
        disabled: false,
      },
    },
    // callFilters: (value1, value2, filters, formData) => {
    //   let [startDate, endDate] = formData?.dates || [];
    //   startDate = formatDate(startDate, true);
    //   endDate = formatDate(endDate, true);
    //   let qurey = `${startDate ? 'startDate=' + startDate : ''}&${
    //     endDate ? 'endDate=' + endDate : ''
    //   }`;
    //   getCompData(qurey, filters);
    // },
  };

  const allocations = {
    effectRender: false,
    filterModalUseEffect: () => {

      // Promise.all(proje ,getStandardLevels()).then(res=>{
      //   if(res){}
      // })

      // getStandardLevels().then((res) => {
      //   if (res.success) {
      //     let tempFields = [...fields]
      //     //setting up fields
      //     tempFields[1].data = res.data
      //     tempFields[1].onChange = skillLevelSelection
      //     let levels = res.data.map(el=>{
      //       return {
      //         label: el.label,
      //         options: el.levels || []
      //       }
      //     })
      //     //setting level value
      //     tempFields[3].data = levels
      //     setFields([...tempFields])
      //   }
      // });
    },
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
      },
      {
        Placeholder: 'Project Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'projectType',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [
          {label: 'Milestone', value: 1},
          {label: 'Time & Materials', value: 2}
        ],
        type: 'Select',
      },
      {
        Placeholder: 'Project',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'project',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Skill',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'skill',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Level',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'level',
        size: 'small',
        mode: 'multiple',
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
    ],
    searchValue: {
      dates: {
        type: 'Date',
        value: null,
        label: 'Dates',
        showInColumn: true,
        disabled: true,
      },
      skill: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      level: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
      projectType: {
        type: 'none',
        multi: true,
        value: [],
        label: 'projectType',
        showInColumn: false,
        disabled: false,
      },
      project: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Project',
        showInColumn: false,
        disabled: false,
      },
      booking: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Project',
        showInColumn: false,
        disabled: false,
      },
      resourceType: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Project',
        showInColumn: false,
        disabled: false,
      },
      workType: {
        type: 'none',
        multi: true,
        value: [],
        label: 'Project',
        showInColumn: false,
        disabled: false,
      },
    },
    // callFilters: (value1, value2, filters, formData) => {
    //   let [startDate, endDate] = formData?.dates || [];
    //   startDate = formatDate(startDate, true);
    //   endDate = formatDate(endDate, true);
    //   let qurey = `${startDate ? 'startDate=' + startDate : ''}&${
    //     endDate ? 'endDate=' + endDate : ''
    //   }`;
    //   getCompData(qurey, filters);
    // },
  };

  const reportsFilter = {
    bench,
    skillResources,
    positions,
    allocations
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

  // const workForceSkills = {
    const skillLevelSelection = (selectedValues, selectedOptions)=>{
      let levelFieldKey =
        compKey === 'skillResources' ? 1 : compKey === 'position' ? 9 : 0;

      let selectedLabel =[]
      if (selectedValues?.length){
        selectedLabel  = selectedOptions.map(el=>{
          return{
            label: el.label, 
            value: el.value, 
            options: el.levels || []
          }
        })
      }else{
        selectedLabel = fields[1].data.map(el=>{
          return {
            label: el.label,
            options: el.levels || []
          }
        })
      }

      let tempFields = fields
      tempFields[3].data = selectedLabel
      setFields([...tempFields])

    }
  // }

  return (
    open && <TableModalFilter
      title={`Filter Bench ${compName}`}
      visible={visible}
      filters={searchValue}
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