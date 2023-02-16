import { _createQuery } from '.';
import { entityProjects, getContactPersons, getEmpPersons, getleaveRequestTypes, getOrganizations, getStandardLevels, getStandardSkills, getUserLeaveType } from '../../../service/constant-Apis'
import { getUsers } from '../../../service/timesheet';

export const bench =({fields,setFields, getCompData})=> ({
    effectRender: true,
    filterModalUseEffect: () => {
      entityProjects('helpers/work', true).then(res=>{
        let tempFields = [...fields];
        // if (res[0].success) {
        //projects  data 
        tempFields[5].data = res.success ? res.options : [];
        setFields([...tempFields]);
      })
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
        Placeholder: 'Resource Type',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'resourceType',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          // { label: 'Contact Person', value: 0 },
          { label: 'Employee', value: 1 },
          { label: 'Sub Contractor', value: 2 },
        ],
        type: 'Select',
      },
      {
        Placeholder: 'Exclude Projects',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'excludeWorkId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
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
      resourceType: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Resource Type',
        showInColumn: false,
        disabled: false,
      },
      excludeWorkId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Exclude Projects',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      // let [startDate, endDate] = formData?.dates || [];
      // startDate = formatDate(startDate, true);
      // endDate = formatDate(endDate, true);
      // let query = `${startDate ? 'startDate=' + startDate : ''}&${
      //   endDate ? 'endDate=' + endDate : ''
      // }`;
      let query = _createQuery(filters)
      getCompData(query, filters);
    },
});

export const skillResources =({fields,setFields, getCompData})=> ({
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
        key: 'skillId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({selectedIds: value, option}),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
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
        key: 'levelId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({selectedIds: value, option}),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Resource Type',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'resourceType',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          // { label: 'Contact Person', value: 0 },
          { label: 'Employee', value: 1 },
          { label: 'Sub Contractor', value: 2 },
        ],
        type: 'Select',
      },
    ],
    searchValue: {
      skillId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      levelId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
      resourceType: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Resource Type',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let {skillId, levelId} = formData || {}
      let query = _createQuery(filters)
      getCompData(query, filters);
    },
});

export const positions =({fields,setFields, getCompData})=> ({
    effectRender: true,
    filterModalUseEffect: () => {
      Promise.all([
        getOrganizations(),
        entityProjects('helpers/work', true),
        getContactPersons(),
        getStandardSkills(),
        getStandardLevels(),
      ]).then((res) => {
        let tempFields = [...fields];
        //setting organization
        tempFields[3].data = res[0].success ? res[0].data : [];
        //setting projects
        tempFields[9].data = res[1].success ? res[1].options : [];
        //setting contact persons
        tempFields[15].data = res[2].success ? res[2].data : [];
        //setting up skill data
        tempFields[19].data = res[3].success ? res[3].data : [];
        //setting up level data
        tempFields[21].data = res[4].success ? res[4].data : [];

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
        Placeholder: 'Organisation',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'organizationId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Opportunity/Project Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workType',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          { label: 'Milestone', value: 1 },
          { label: 'Time & Materials', value: 2 },
        ],
        type: 'Select',
      },
      {
        Placeholder: 'Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workStatus',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          { value: 0, label: 'Opportunity' },
          { value: 1, label: 'Project' },
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
        key: 'workId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Opportunity/Project Status',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workPhase',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          { value: 0, label: 'Closed' },
          { value: 1, label: 'Open' },
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
        key: 'bookingType',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          { value: 0, label: 'Reserved' },
          { value: 1, label: 'Soft-booked' },
          { value: 2, label: 'Allocated' },
          { value: 3, label: 'Unallocated' },
        ],
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
        key: 'contactPersonId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Resource Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'resourceType',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          { label: 'Contact Person', value: 0 },
          { label: 'Employee', value: 1 },
          { label: 'Sub Contractor', value: 2 },
        ],
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
        key: 'skillId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
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
        key: 'levelId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
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
      organizationId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Organisation',
        showInColumn: false,
        disabled: false,
      },
      workType: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Opportunity/Project Type',
        showInColumn: false,
        disabled: false,
      },
      workStatus: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Type',
        showInColumn: false,
        disabled: false,
      },
      workId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Opportunity/Project',
        showInColumn: false,
        disabled: false,
      },
      contactPersonId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Resources',
        showInColumn: false,
        disabled: false,
      },
      resourceType: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Resource Type',
        showInColumn: false,
        disabled: false,
      },
      bookingType: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Booking Type',
        showInColumn: false,
        disabled: false,
      },
      workPhase: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Opportunity/Project Status',
        showInColumn: false,
        disabled: false,
      },
      skillId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      levelId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
    },

    callFilters: (value1, value2, filters, formData) => {
      // let {
      //   dates: [startDate, endDate] = [],
      //   skillId,
      //   levelId,
      //   resourceType,
      //   workStatus,
      //   workType,
      // } = formData || {};
      // startDate = formatDate(startDate, true);
      // endDate = formatDate(endDate, true);
      // //for multiselect
      // let query = `${startDate ? 'startDate=' + startDate : ''}
      // ${endDate ? '&endDate=' + endDate : ''}
      // ${skillId.selectedIds.length ? '&skillId=' + skillId?.selectedIds : ''}
      // ${levelId.selectedIds.length ? '&levelId=' + levelId?.selectedIds : ''}
      // ${workStatus.selectedIds.length ? '&workStatus=' + workStatus?.selectedIds : ''}
      // ${workType.selectedIds.length ? '&workType=' + workType?.selectedIds : ''}
      // ${resourceType.selectedIds.length ? '&resourceType=' + resourceType?.selectedIds : ''}`;
      
      
      //for single select
      // let query = `${startDate ? 'startDate=' + startDate : ''}${
      //   endDate ? '&endDate=' + endDate : ''
      // }${skillId ? '&skillId=' + skillId.value : ''}${
      //   levelId ? '&levelId=' + levelId.value : ''
      // }${workStatus ? '&workStatus=' + workStatus.value : ''}${
      //   workType ? '&workType=' + workType.value : ''
      // }${resourceType ? '&resourceType=' + resourceType.value : ''}`;
      let query = _createQuery(filters)
      getCompData(query, filters);
    },
});

export const allocations =({fields,setFields, getCompData})=> ({
    effectRender: true,
    filterModalUseEffect: () => {
      Promise.all([
        getOrganizations(),
        entityProjects('helpers/work', true),
        getContactPersons(),
        getStandardSkills(),
        getStandardLevels(),
      ]).then((res) => {
        let tempFields = [...fields];
        //setting organization
        tempFields[3].data = res[0].success ? res[0].data : [];
        //setting projects
        tempFields[9].data = res[1].success ? res[1].options : [];
        //setting contact persons
        tempFields[15].data = res[2].success ? res[2].data : [];
        //setting up skill data
        tempFields[19].data = res[3].success ? res[3].data : [];
        //setting up level data
        tempFields[21].data = res[4].success ? res[4].data : [];

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
        Placeholder: 'Organisation',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'organizationId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workStatus',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          { value: 0, label: 'Opportunity' },
          { value: 1, label: 'Project' },
        ],
        type: 'Select',
      },
      {
        Placeholder: 'Opportunity/Project Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workType',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
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
        key: 'workId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Opportunity/Project Status',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workPhase',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          { value: 0, label: 'Closed' },
          { value: 1, label: 'Open' },
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
        key: 'bookingType',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          { value: 0, label: 'Reserved' },
          { value: 1, label: 'Soft-booked' },
          { value: 2, label: 'Allocated' },
          { value: 3, label: 'Unallocated' },
        ],
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
        key: 'contactPersonId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Resource Type',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'resourceType',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          // { label: 'Contact Person', value: 0 },
          { label: 'Employee', value: 1 },
          { label: 'Sub Contractor', value: 2 },
        ],
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
        key: 'skillId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
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
        key: 'levelId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
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
      organizationId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Organisation',
        showInColumn: false,
        disabled: false,
      },
      workType: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Opportunity/Project Type',
        showInColumn: false,
        disabled: false,
      },
      workPhase: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Opportunity/Project Status',
        showInColumn: false,
        disabled: false,
      },
      workStatus: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Type',
        showInColumn: false,
        disabled: false,
      },
      workId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Opportunity/Project',
        showInColumn: false,
        disabled: false,
      },
      contactPersonId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Resources',
        showInColumn: false,
        disabled: false,
      },
      resourceType: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Resource Type',
        showInColumn: false,
        disabled: false,
      },
      bookingType: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Booking Type',
        showInColumn: false,
        disabled: false,
      },
      skillId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Skill',
        showInColumn: false,
        disabled: false,
      },
      levelId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Level',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let query = _createQuery(filters)
      getCompData(query, filters);
    },
});

export const projectRevenue =({fields,setFields, getCompData})=> ({
    effectRender: true,
    filterModalUseEffect: () => {
      Promise.all([getOrganizations(), entityProjects('helpers/work?type=P', true)]).then((res) => {

        let tempFields = [...fields];
        //setting organization
        tempFields[1].data = res[0].success ? res[0].data : [];
        //setting projects
        tempFields[3].data = res[1].success ? res[1].options : [];
        //setting exclude projects
        tempFields[5].data = res[1].success ? res[1].options : [];
        setFields([...tempFields]);
      })
    },
    fields: [
      // {
      //   Placeholder: 'Select Financial Year',
      //   fieldCol: 24,
      //   size: 'small',
      //   type: 'Text',
      // },
      // {
      //   object: 'obj',
      //   fieldCol: 24,
      //   key: 'date',
      //   size: 'small',
      //   mode: "year",
      //   format:"YYYY",
      //   type: 'DatePicker',
      //   fieldStyle: { width: '100%' },
      // },
      {
        Placeholder: 'Organisation',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'organizationId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Projects',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'projectId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Exclude Projects',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'excludeProjectId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Project Status',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'workPhase',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          {value: 0, label: 'Closed'},
          {value: 1, label: 'Open'},
        ],
        type: 'Select',
      },
    ],
    searchValue: {
      // date: {
      //   type: 'Date',
      //   mode: 'Year',
      //   value: null,
      //   label: 'Selected Financial Year',
      //   showInColumn: true,
      //   disabled: true,
      // },
      organizationId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Organisation',
        showInColumn: false,
        disabled: false,
      },
      projectId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Projects',
        showInColumn: false,
        disabled: false,
      },
      workPhase: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Opportunity/Project Status',
        showInColumn: false,
        disabled: false,
      },
      excludeProjectId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Exclude Projects',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let query = _createQuery(filters)
      getCompData(query, filters);
    },
});

export const clientRevenue =({fields,setFields, getCompData})=> ({
    effectRender: true,
    filterModalUseEffect: () => {
      getOrganizations().then((res) => {

        let tempFields = [...fields];
        //setting organization
        tempFields[1].data = res.success ? res.data : [];
        //setting exclude organization
        tempFields[3].data = res.success ? res.data : [];

        setFields([...tempFields]);
      })
    },
    fields: [
      // {
      //   Placeholder: 'Select Financial Year',
      //   fieldCol: 24,
      //   size: 'small',
      //   type: 'Text',
      // },
      // {
      //   object: 'obj',
      //   fieldCol: 24,
      //   key: 'date',
      //   size: 'small',
      //   mode: "year",
      //   format:"YYYY",
      //   type: 'DatePicker',
      //   fieldStyle: { width: '100%' },
      // },
      {
        Placeholder: 'Organisation',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'organizationId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Exclude Organisation',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'excludeOrganizationId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
    ],
    searchValue: {
      // date: {
      //   type: 'Date',
      //   mode: 'Year',
      //   value: null,
      //   label: 'Selected Financial Year',
      //   showInColumn: true,
      //   disabled: true,
      // },
      organizationId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Organisation',
        showInColumn: false,
        disabled: false,
      },
      excludeOrganizationId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Exclude Organisation',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let query = _createQuery(filters)
      getCompData(query, filters);
    },
});

export const leave_summary =({fields,setFields, getCompData})=> ({
    effectRender: true,
    filterModalUseEffect: () => {
      Promise.all([getEmpPersons(), getleaveRequestTypes(), entityProjects('helpers/work?type=P', true)]).then((res) => {

        let tempFields = [...fields];
        //setting organization
        tempFields[3].data = res[0].success ? res[0].data : [];
        //setting projects
        tempFields[5].data = res[1].success ? res[1].data : [];
        //setting exclude projects
        tempFields[9].data = res[2].success ? res[2].options : [];
        setFields([...tempFields]);
      })
    },
    fields: [
      {
        Placeholder: 'Select Month',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'date',
        size: 'small',
        mode: "month",
        format:"MMM YYYY",
        type: 'DatePicker',
        fieldStyle: { width: '100%' },
      },
      {
        Placeholder: 'Employee',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'contactPersonId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Leave Type',
        fieldCol: 22,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'leaveTypeId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
      {
        Placeholder: 'Leave Status',
        fieldCol: 22,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'leaveStatus',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [
          {value: 0, label: 'Rejected'},
          {value: 1, label: 'Submitted'},
          {value: 2, label: 'Approved'},
        ],
        type: 'Select',
      },
      {
        Placeholder: 'Project',
        fieldCol: 24,
        size: 'small',
        type: 'Text',
      },
      {
        object: 'obj',
        fieldCol: 24,
        key: 'projectId',
        size: 'small',
        mode: 'multiple',
        rangeMax:'responsive',
        customValue: (value, option) => ({ selectedIds: value, option }),
        getValueProps: (value)=>  ({value: value?.selectedIds}),
        data: [],
        type: 'Select',
      },
    ],
    searchValue: {
      date: {
        type: 'Date',
        mode: 'monthRange',
        value: null,
        label: 'Selected Month',
        showInColumn: true,
        disabled: true,
      },
      contactPersonId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Employee',
        showInColumn: false,
        disabled: false,
      },
      leaveTypeId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Leave Types',
        showInColumn: false,
        disabled: false,
      },
      leaveStatus: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Leave Status',
        showInColumn: false,
        disabled: false,
      },
      projectId: {
        type: 'Select',
        multi: true,
        value: [],
        label: 'Projects',
        showInColumn: false,
        disabled: false,
      },
    },
    callFilters: (value1, value2, filters, formData) => {
      let query = _createQuery(filters)
      getCompData(query, filters);
    },
});