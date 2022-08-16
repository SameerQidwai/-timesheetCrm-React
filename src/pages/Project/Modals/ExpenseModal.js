import React, { Component } from 'react';
import { Modal, Tabs, Form } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'; //Icons

import {
  getMilestoneExpense,
  addMilestoneExpense,
  editMilestoneExpense,
} from '../../../service/projects';

import FormItems from '../../../components/Core/Forms/FormItems';

import { getListAlt as getExpenseTypeList } from '../../../service/expenseType-Apis';

class ExpenseModal extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      editRex: false,
      check: false,
      loading: false,
      SKILLS: [],
      STATES: [],
      ORGS: [],
      data: {},

      ExpenseFields: [
        {
          Placeholder: 'Expense',
          fieldCol: 24,
          size: 'small',
          rangeMin: true,
          type: 'Text',
          labelAlign: 'right',
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: 'obj',
          fieldCol: 24,
          key: 'expenseId',
          size: 'small',
          rules: [{ required: true, message: 'Expense is Required' }],
          data: [],
          type: 'Select',
          fieldStyle: { width: '50%' },
        },
        {
          Placeholder: 'Buy Rate',
          fieldCol: 12,
          size: 'small',
          rangeMin: true,
          type: 'Text',
          labelAlign: 'right',
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: 'Sell Rate',
          fieldCol: 12,
          rangeMin: true,
          size: 'small',
          type: 'Text',
          labelAlign: 'right',
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'buyingRate',
          shape: '$',
          size: 'small',
          rules: [{ required: true, message: 'Buying Rate is Required' }],
          type: 'InputNumber',
          fieldStyle: { width: '100%' },
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'sellingRate',
          shape: '$',
          size: 'small',
          rules: [{ required: true, message: 'Selling Rate is Required' }],
          type: 'InputNumber',
          fieldStyle: { width: '100%' },
        },
      ],
    };
  }

  componentDidMount = () => {
    this.openModal();
  };

  checkRates = (value, option) => {
    if (value) {
      if (option.label.includes('Employee')) {
        this.getRates('employees', value);
      } else if (option.label.includes('Sub Contractor')) {
        this.getRates('sub-contractors', value);
      } else {
        this.setRates('No Active Contract', 'No Active Contract');
      }
    } else {
      this.setRates(undefined, undefined);
    }
  };

  setRates = (buy, sell) => {
    const { ExpenseFields } = this.state;
    ExpenseFields[16].suggestion = buy;
    ExpenseFields[17].suggestion = sell;
    this.setState({ ExpenseFields: [...ExpenseFields] });
  };

  openModal = () => {
    const { editRex } = this.props;
    getExpenseTypeList().then((res) => {
      const { ExpenseFields } = this.state;
      ExpenseFields[1].data = res.success ? res.data : [];
      this.setState({ ExpenseFields }, () => {
        if (editRex) {
          this.getRecord(res.data);
        }
      });
    });
  };

  onFinish = (vake) => {
    // this will work after I get the Object from the form
    this.setState({ loading: true });
    const { editRex } = this.props;

    let { obj } = vake;

    if (editRex) {
      this.editRecord(obj);
    } else {
      this.addRecord(obj);
    }
  };

  addRecord = (data) => {
    const { proId, callBack, crud } = this.props;
    addMilestoneExpense(crud, data, proId).then((res) => {
      if (res.success) {
        callBack();
      } else {
        this.setState({ loading: false });
      }
    });
  };

  getRecord = (skills) => {
    const { crud, editRex } = this.props;
    getMilestoneExpense(crud, editRex).then((resR) => {
      if (resR.success) {
        const skillIndex = skills.findIndex(
          (skill) => skill.value === resR.data.panelSkillId
        );
        this.formRef.current.setFieldsValue({ obj: resR.data });
      }
    });
  };

  editRecord = (data) => {
    const { editRex, crud, callBack } = this.props;
    data.id = editRex;
    editMilestoneExpense(crud, editRex, data).then((res) => {
      if (res.success) {
        callBack();
      } else {
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { editRex, visible, close, onHold } = this.props;
    const { ExpenseFields, loading } = this.state;
    return (
      <Modal
        title={editRex ? 'Edit Expense' : 'Add Expense'}
        maskClosable={false}
        centered
        visible={visible}
        okButtonProps={{
          disabled: loading || onHold,
          htmlType: 'submit',
          form: 'my-form',
        }}
        okText={loading ? <LoadingOutlined /> : 'Save'}
        onCancel={close}
        width={900}
      >
        <Form
          id={'my-form'}
          ref={this.formRef}
          onFinish={this.onFinish}
          scrollToFirstError={true}
          size="small"
          layout="inline"
          initialValues={{ obj: { effortRate: 100 } }}
        >
          <FormItems FormFields={ExpenseFields} />
        </Form>
      </Modal>
    );
  }
}

export default ExpenseModal;
