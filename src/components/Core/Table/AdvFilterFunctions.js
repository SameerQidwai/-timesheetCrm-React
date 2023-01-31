import moment from "moment"
import { useEffect } from "react";
import { formatDate } from "../../../service/constant";
export const EmployeeAdvaceFilter = (value, column, state, setState, advSearch) => {
  
    let { data, searchedColumn: search } = state;
    if (column) {
      search[column]['value'] = value; // this will need in column filter
    } else {
      search = advSearch;
    }

    if (
      search['id']['value'] ||
      search['firstName']['value'] ||
      search['lastName']['value'] ||
      search['email']['value'] ||
      search['phoneNumber']['value'] ||
      search['gender']['value'].length > 0 ||
      search['stateId']['value'].length > 0 ||
      search['address']['value'] ||
      search['clearanceLevel']['value'].length > 0 ||
      search['role']['value'].length > 0 ||
      search['employeeStatus']['value'].length > 0 ||
      search['minSalary']['value']||
      search['maxSalary']['value']||
      search['leaveRequestPolicyId']['value'] ||
      search['contractStartDate']['value']||
      search['contractEndDate']['value']||
      search['payFrequency']['value'].length > 0 ||
      search['lineManagerId']['value'].length > 0 

    ) {
      let dummyDates = ['2010-10-19', '2010-10-25'];
      const contractStart = search['contractStartDate']['value'] ?? dummyDates;
      const contractEnd = search['contractEndDate']['value'] ?? dummyDates;
      console.log(search['minSalary']['value']?search['minSalary']['value']: 0,search['maxSalary']['value']?search['maxSalary']['value']:0)
      setState({
        filterData: data.filter((el) => {
          // method one which have mutliple if condition for every multiple search
          const {
            firstName,
            lastName,
            email,
            phoneNumber,
            id,
            gender,
            stateId,
            address,
            clearanceLevel
          } = el.contactPersonOrganization.contactPerson;
          const {
            type: employeeStatus = null,
            leaveRequestPolicyId,
            payFrequency,
            startDate: contractStartDate,
            endDate: contractEndDate,
            remunerationAmount: salary,
          } = el.employmentContracts.filter((p, index) => {
            if (
              moment().isBetween(
                moment(p.startDate),
                moment(p.endDate ?? moment().add(10, 'years'))
              )
            ) {
              return p.type;
            }
            if (index === el.employmentContracts.length - 1) {
              return p.type;
            }
          })?.[0];
          console.log(parseFloat(salary??0) >= parseFloat(search['minSalary']['value']?search['minSalary']['value']: 0) &&
          parseFloat(salary??999999999999) <= parseFloat(search['minSalary']['value']?search['minSalary']['value']:999999999999))
          return (
            `Emp-00${id.toString()}`.includes(search['id']['value']) &&
            `${firstName ?? ''}`
              .toLowerCase()
              .includes(search['firstName']['value'].toLowerCase()) &&
            `${lastName ?? ''}`
              .toLowerCase()
              .includes(search['lastName']['value'].toLowerCase()) &&
            `${email ?? ''}`
              .toLowerCase()
              .includes(search['email']['value'].toLowerCase()) &&
            `${phoneNumber ?? ''}`
              .toLowerCase()
              .includes(search['phoneNumber']['value'].toLowerCase()) &&
            `${address ?? ''}`
              .toLowerCase()
              .includes(search['address']['value'].toLowerCase()) &&
            //Creating an string using reduce of all the String array and searching sting in the function

            //Define  ====  //Reducing and creating the array        // but gotta check if the array is not empty otherwise gender value can't be found in emptySrting
            (search['gender']['value'].length > 0
              ? search['gender']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['gender']['value'].length > 0
                ? [gender]
                : [',']
              ).includes(s.value)
            ) &&
            (search['stateId']['value'].length > 0
              ? search['stateId']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['stateId']['value'].length > 0
                ? [stateId]
                : [',']
              ).includes(s.value)
            ) &&
            (search['role']['value'].length > 0
              ? search['role']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['role']['value'].length > 0
                ? [el.roleId]
                : [',']
              ).includes(s.value)
            ) &&
            (search['employeeStatus']['value'].length > 0
              ? search['employeeStatus']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['employeeStatus']['value'].length > 0
                ? [employeeStatus]
                : [',']
              ).includes(s.value)
            ) &&
            (search['payFrequency']['value'].length > 0
              ? search['payFrequency']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['payFrequency']['value'].length > 0
                ? [payFrequency]
                : [',']
              ).includes(s.value)
            ) &&
            (search['leaveRequestPolicyId']['value'].length > 0
              ? search['leaveRequestPolicyId']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['leaveRequestPolicyId']['value'].length > 0
                ? [leaveRequestPolicyId]
                : [',']
              ).includes(s.value)
            ) &&

            // `${salary.toString() ?? ''}`
            //   .toLowerCase()
            //   .includes(search['salary']['value'].toString().toLowerCase()) &&
              (parseFloat(salary?salary:0) >= parseFloat(search['minSalary']['value']?search['minSalary']['value']: 0) &&
              parseFloat(salary?salary:999999999999) <= parseFloat(search['maxSalary']['value']?search['maxSalary']['value']:999999999999)) &&

              moment(
                search['contractStartDate']['value']
                  ? formatDate(contractStartDate, true, 'YYYY-MM-DD')
                  : '2010-10-20'
              ).isBetween(contractStart[0], contractStart[1], undefined, '[]') &&
             
              moment(
                search['contractEndDate']['value']
                  ? formatDate(contractEndDate, true, 'YYYY-MM-DD')
                  : '2010-10-20'
              ).isBetween(contractEnd[0], contractEnd[1], undefined, '[]') &&
              (search['lineManagerId']['value'].length > 0
                ? search['lineManagerId']['value']
                : [{ value: ',' }]
              ).some((s) =>
                (search['lineManagerId']['value'].length > 0
                  ? [el.lineManagerId]
                  : [',']
                ).includes(s.value)
              )&&
            (search['clearanceLevel']['value'].length > 0
              ? search['clearanceLevel']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['clearanceLevel']['value'].length > 0
                ? [clearanceLevel]
                : [',']
              ).includes(s.value)
            )
          );
        }),
        searchedColumn: search,
        openSearch: false,
      });
    } else {
      setState({
        searchedColumn: search,
        filterData: data,
        openSearch: false,
      });
    }
};

