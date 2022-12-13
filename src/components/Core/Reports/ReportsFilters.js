import React, { useState, useEffect } from 'react'
import { formatDate } from '../../../service/constant'
import { getStandardLevels, getStandardSkills } from '../../../service/constant-Apis'
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
      Promise.all([getStandardSkills(), getStandardLevels()]).then((res) => {
        let tempFields = [...fields];
        // if (res[0].success) {
        //setting up skill data 
        tempFields[1].data = res[0].success ? res[0].data : [];
        //setting up level data 
        tempFields[3].data = res[1].success ? res[1].data : [];
        // tempFields[1].onChange = skillLevelSelection
        // let levels = res.data.map(el=>{
        //   return {
        //     label: el.label,
        //     options: el.levels || []
        //   }
        // })
        // //setting level value
        // tempFields[3].data = levels
        // }

        setFields([...tempFields]);
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
        // mode: 'multiple',
        // customValue: (value, option) => ({selectedIds: value, option}),
        // getValueProps: (value)=> value?.option,
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
        // mode: 'multiple',
        // customValue: (value, option) => ({selectedIds: value, option}),
        // getValueProps: (value)=> value?.option,
        customValue: (value, option) => option,
        data: [],
        type: 'Select',
      },
    ],
    searchValue: {
      skill: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      level: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let {skill, level} = formData || {}
      //for multi select
      // let qurey = `${skill?.selectedIds?.length ? 'skillId=' + skill?.selectedIds?.[0] : ''}&${
      //   level?.selectedIds?.length ? 'levelId=' + level?.selectedIds?.[0] : ''
      // }`;
      let qurey = `${skill ? 'skillId=' + skill.value: ''}${ //for single select
        level ? '&levelId=' + level.value: ''
      }`;
      console.log(filters, qurey)
      getCompData(qurey, filters);
    },
  };


  const positions = {
    effectRender: true,
    filterModalUseEffect: () => {
      Promise.all([getStandardSkills(), getStandardLevels()]).then((res) => {
        let tempFields = [...fields];
        // if (res[0].success) {
        //setting up skill data 
        tempFields[9].data = res[0].success ? res[0].data : [];
        //setting up level data 
        tempFields[11].data = res[1].success ? res[1].data : [];
        // tempFields[1].onChange = skillLevelSelection
        // let levels = res.data.map(el=>{
        //   return {
        //     label: el.label,
        //     options: el.levels || []
        //   }
        // })
        // //setting level value
        // tempFields[3].data = levels
        // }

        setFields([...tempFields]);
      });
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
        key: 'workType',
        size: 'small',
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
        data: [
          { label: 'Milestone', value: 1 },
          { label: 'Time & Materials', value: 2 },
        ],
        type: 'Select',
      },
      {
        Placeholder: 'Opportunity/Project',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workStatus',
        size: 'small',
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
        data: [
          { value: 0, label: 'Opportunity' },
          { value: 1, label: 'Project' },
        ],
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
        key: 'resourceType',
        size: 'small',
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
        data: [
          { value: 0, label: 'Softbooked' },
          { value: 1, label: 'Allocated' },
          { value: 2, label: 'Assigned' },
        ],
        type: 'Select',
      },
      // {
      //   Placeholder: 'Resources',
      //   fieldCol: 12,
      //   size: 'small',
      //   type: 'Text',
      // },
      // {
      //   object: 'obj',
      //   fieldCol: 24,
      //   key: 'resource',
      //   size: 'small',
        // mode: 'multiple',
      //   customValue: (value, option) => option,
      //   data: [],
      //   type: 'Select',
      // },
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
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option ,
        // getValueProps: (value) => value?.option,
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
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
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
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      level: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
      workType: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Project Type',
        showInColumn: false,
        disabled: false,
      },
      workStatus: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Opportunity/Project',
        showInColumn: false,
        disabled: false,
      },
      resourceType: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Booking Type',
        showInColumn: false,
        disabled: false,
      },
    },

    callFilters: (value1, value2, filters, formData) => {
      let {
        dates: [startDate, endDate] = [],
        skillId,
        levelId,
        resourceType,
        workStatus,
        workType,
      } = formData || {};
      startDate = formatDate(startDate, true);
      endDate = formatDate(endDate, true);
      //for multiselect
      // let qurey = `${startDate ? 'startDate=' + startDate : ''}
      // ${endDate ? '&endDate=' + endDate : ''}
      // ${skillId.selectedIds.length ? '&skillId=' + skillId?.selectedIds : ''}
      // ${levelId.selectedIds.length ? '&levelId=' + levelId?.selectedIds : ''}
      // ${workStatus.selectedIds.length ? '&workStatus=' + workStatus?.selectedIds : ''}
      // ${workType.selectedIds.length ? '&workType=' + workType?.selectedIds : ''}
      // ${resourceType.selectedIds.length ? '&resourceType=' + resourceType?.selectedIds : ''}`;
      //for single select
      let qurey = `${startDate ? 'startDate=' + startDate : ''}${
        endDate ? '&endDate=' + endDate : ''
      }${skillId ? '&skillId=' + skillId.value : ''}${
        levelId ? '&levelId=' + levelId.value : ''
      }${workStatus ? '&workStatus=' + workStatus.value : ''}${
        workType ? '&workType=' + workType.value : ''
      }${resourceType ? '&resourceType=' + resourceType.value : ''}`;
      getCompData(qurey, filters);
    },
  };

  const allocations = {
    effectRender: true,
    filterModalUseEffect: () => {
      Promise.all([getStandardSkills(), getStandardLevels()]).then((res) => {
        let tempFields = [...fields];
        // if (res[0].success) {
        //setting up skill data
        tempFields[1].data = res[0].success ? res[0].data : [];
        //setting up level data
        tempFields[3].data = res[1].success ? res[1].data : [];
        // tempFields[1].onChange = skillLevelSelection
        // let levels = res.data.map(el=>{
        //   return {
        //     label: el.label,
        //     options: el.levels || []
        //   }
        // })
        // //setting level value
        // tempFields[3].data = levels
        // }

        setFields([...tempFields]);
      });
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
        key: 'workType',
        size: 'small',
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
        data: [
          { label: 'Milestone', value: 1 },
          { label: 'Time & Materials', value: 2 },
        ],
        type: 'Select',
      },
      {
        Placeholder: 'Opportunity/Project',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workStatus',
        size: 'small',
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
        data: [
          { value: 0, label: 'Opportunity' },
          { value: 1, label: 'Project' },
        ],
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
        key: 'resourceType',
        size: 'small',
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
        data: [
          { value: 0, label: 'Softbooked' },
          { value: 1, label: 'Allocated' },
          { value: 2, label: 'Assigned' },
        ],
        type: 'Select',
      },
      // {
      //   Placeholder: 'Resources',
      //   fieldCol: 12,
      //   size: 'small',
      //   type: 'Text',
      // },
      // {
      //   object: 'obj',
      //   fieldCol: 24,
      //   key: 'resource',
      //   size: 'small',
      // mode: 'multiple',
      //   customValue: (value, option) => option,
      //   data: [],
      //   type: 'Select',
      // },
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
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
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
        // mode: 'multiple',
        // customValue: (value, option) => ({ selectedIds: value, option }),
        customValue: (value, option) => option,
        // getValueProps: (value) => value?.option,
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
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      level: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
      workType: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Project Type',
        showInColumn: false,
        disabled: false,
      },
      workStatus: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Opportunity/Project',
        showInColumn: false,
        disabled: false,
      },
      resourceType: {
        type: 'Select',
        // multi: true,
        value: [],
        label: 'Booking Type',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let {
        dates: [startDate, endDate] = [],
        skillId,
        levelId,
        resourceType,
        workStatus,
        workType,
      } = formData || {};
      startDate = formatDate(startDate, true);
      endDate = formatDate(endDate, true);
      //for multiselect
      // let qurey = `${startDate ? 'startDate=' + startDate : ''}
      // ${endDate ? '&endDate=' + endDate : ''}
      // ${skillId.selectedIds.length ? '&skillId=' + skillId?.selectedIds : ''}
      // ${levelId.selectedIds.length ? '&levelId=' + levelId?.selectedIds : ''}
      // ${workStatus.selectedIds.length ? '&workStatus=' + workStatus?.selectedIds : ''}
      // ${workType.selectedIds.length ? '&workType=' + workType?.selectedIds : ''}
      // ${resourceType.selectedIds.length ? '&resourceType=' + resourceType?.selectedIds : ''}`;
      //for single select
      let qurey = `${startDate ? 'startDate=' + startDate : ''}${
        endDate ? '&endDate=' + endDate : ''
      }${skillId ? '&skillId=' + skillId.value : ''}${
        levelId ? '&levelId=' + levelId.value : ''
      }${workStatus ? '&workStatus=' + workStatus.value : ''}${
        workType ? '&workType=' + workType.value : ''
      }${resourceType ? '&resourceType=' + resourceType.value : ''}`;
      getCompData(qurey, filters);
    },
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