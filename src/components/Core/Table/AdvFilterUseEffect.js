import { getLeavePolicy, getOrgPersons, getRoles, getStates } from "../../../service/constant-Apis";

export const EmployeeModalUseEffect = (state, setState) => {
  const managerUrl = `helpers/contact-persons?organizationId=1&active=1&associated=1`;
  Promise.all([getStates(), getRoles(), getLeavePolicy(), getOrgPersons(managerUrl)])
    .then((res) => {
      const { filterFields } = state;
      filterFields[11].data = res[0].success ? res[0].data : [];
      filterFields[14].data = res[1].success ? res[1].data : [];
      filterFields[19].data = res[2].success ? res[2].data : [];
      filterFields[29].data = res[3].success ? res[3].data : [];

      setState({
        filterFields,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};