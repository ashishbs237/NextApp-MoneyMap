'use client'

import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import { Pencil, Trash2 } from 'lucide-react'
import SKHeader from '@/components/common/Header'
import SKDataTable, { ColumnDefinition } from '@/components/common/SKDataTable'
import SKModal from '@/components/common/SKModal'
import { useToast } from '@/hooks/useToast'
import { createExpenseLabel, getExpenseLabels } from '@/utils/ui/apiFunctions/settingsAPI'
import { getExpenseList, createExpense, updateExpense, deleteExpense } from '@/utils/ui/apiFunctions/expenseAPI'
import { ActionType, IExpenseItem } from '@/types/common'
import SKButton from '@/components/elements/SKButton'
import React, { useEffect, useState } from 'react'
import BlockingLoader from '@/components/common/BlockingLoader'
import { formatText } from '@/utils/ui/functions'
import Card from '@/components/common/Card'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  const [expenseList, setExpenseList] = useState<IExpenseItem[]>([]);
  const [action, setAction] = useState<ActionType>(null);
  const [expenseItem, setExpenseItem] = useState<any>({});
  const [savedLabels, setSavedLabels] = useState<string[]>([]);
  const [information, setInformation] = useState<string>('');
  const { successToast, errorToast } = useToast();
  const [loadingCount, setLoadingCount] = useState(0);

  const expenseSummary = expenseList.reduce(
    (acc: any, curr: any) => {
      const { amount, yearlyIncrement } = curr;

      acc.currMonthlyIncome = (acc.currMonthlyIncome || 0) + amount;
      acc.currYearlyIncome = acc.currMonthlyIncome * 12;

      // Next month's income is current amount + increment
      // const nextMonthIncome = amount + (amount * yearlyIncrement) / 100;
      // acc.nextMonthlyIncome = (acc.nextMonthlyIncome || 0) + nextMonthIncome;
      // acc.nextYearlyIncome = acc.nextMonthlyIncome * 12;

      return acc;
    },
    {}
  );

  useEffect(() => {
    try {
      setLoadingCount((prev) => prev + 1);
      (async () => {
        const res = await getExpenseLabels();
        setSavedLabels(res.data.map((item: { label: string }) => item?.label));
      })();

      (async () => {
        const res = await getExpenseList();
        setExpenseList(res.data);
      })();
    } catch (err) {
      errorToast(err);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  }, [])

  const columns: ColumnDefinition[] = [
    { label: 'Amount', accessor: 'amount' },
    { label: 'Label', accessor: 'label' },
    { label: 'Tag', accessor: 'tag' },
    {
      label: 'Actions',
      accessor: 'actions',
      renderCell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setAction('add'); setExpenseItem(row) }}
            className="text-blue-600 hover:opacity-80 p-1 cursor-pointer"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => { setAction('delete'); setExpenseItem(row) }}
            className="text-red-600 hover:opacity-80 p-1 cursor-pointer"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>

      )
    }
  ];

  const handleChange = (key, value) => {
    setExpenseItem({ ...expenseItem, [key]: value });
  }

  const saveCustomLabel = async (newLbl: string) => {
    try {
      await createExpenseLabel({ label: newLbl, note: '' });
      setSavedLabels([...savedLabels, newLbl]);
    } catch (err) {
      errorToast(err)
    }
  }

  const handleSaveItem = async (payload: object) => {
    try {

      if (expenseItem?._id) {
        const res = await updateExpense(expenseItem?._id, payload);
        successToast(res.message);
        // update loacal list
        setExpenseList(expenseList.map((item: IExpenseItem) => {
          return item._id === expenseItem._id ? payload : item
        }))
      } else {
        const res = await createExpense(payload);
        if (res) {
          successToast(res.message);
          // update loacal list
          setExpenseList([...expenseList, { _id: res.data._id, ...payload }])
        }
      }
      setAction(null);
    } catch (err) {
      errorToast(err)
    } finally {
      setExpenseItem(null)
    }
  }

  const handleDeleteIncome = async () => {
    try {
      const res = await deleteExpense(expenseItem?._id)
      successToast(res);
      setExpenseList(expenseList.filter((e) => e._id !== expenseItem?._id))
    } catch (err) {
      errorToast(err)
    } finally {
      setExpenseItem(null)
    }
  }

  const handleIncomeItem = async () => {
    const { amount, label, customLabel, tag } = expenseItem;;
    const newLbl = formatText(customLabel || label);
    if (amount && (newLbl)) {

      // check if label is already exists in the list

      // save the custom label if it doesn't exist in the labels list
      if (newLbl && !savedLabels?.includes(newLbl)) {
        saveCustomLabel(newLbl)
      }

      let isLabelUsed = false;
      if (expenseItem?._id) {
        isLabelUsed = expenseList.some((item: IExpenseItem) => item._id !== expenseItem?._id && item?.label === newLbl);
      } else {
        isLabelUsed = expenseList.some((item: IExpenseItem) => item?.label === newLbl);
      }
      if (isLabelUsed) {
        errorToast('Label already used. Please use a different label.');
        setExpenseItem({ ...expenseItem, label: '', customLabel: '' });
        return;
      }

      handleSaveItem({
        amount: Number(amount),
        label: newLbl,
        tag
      });

    } else {
      errorToast('Please fill all the fields.');
      return
    }

    // 
  }

  return (
    <>
      <SKHeader text='Expense List'>
        <SKButton label='Manage labels' tabType='expense' onClick={() => router.push("/dashboard/settings/expense")} />
      </SKHeader>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card amount={expenseSummary.currMonthlyIncome || 0} title='Current Monthly Expense' />
          <Card amount={expenseSummary.currYearlyIncome || 0} title='Current Yearly Expense' />
          <Card amount={expenseSummary.nextMonthlyIncome || 0} title='Next Year Monthly Expense' />
          <Card amount={expenseSummary.nextYearlyIncome || 0} title='Next Year Yearly Expense' />
        </div>
      </div>

      {/* Income Table*/}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <div className='flex gap-3 items-center justify-between'>
          <h3 className="flextext-lg font-semibold text-gray-700">Income List</h3>
          <SKButton label='+ Add expense' tabType='expense' onClick={() => setAction('add')} />
        </div>

        <SKDataTable
          columns={columns}
          rows={expenseList}
        />
      </div>

      {/* Add / Update Income Source */}
      <SKModal
        visible={action === 'add'}
        onClose={() => { setAction('default'); setExpenseItem(null) }}
        onSave={() => handleIncomeItem()}
        title={`${expenseItem?._id ? 'Update' : 'Save'} Expense Entry`}
      >
        <div className="space-y-6 px-2 pt-1 pb-4">


          {/* Label Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Label</label>
            <select
              value={expenseItem?.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white"
            >
              <option value="">Select Label</option>
              {savedLabels?.map((label, index) => (
                <option key={label + index} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Label Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Custom Label (optional)</label>
            <input
              type="text"
              placeholder="Enter custom label"
              value={expenseItem?.customLabel || ''}
              onChange={(e) => handleChange('customLabel', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={expenseItem?.amount || ''}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Tag Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Tag</label>
            <input
              type="text"
              placeholder="Enter tag"
              value={expenseItem?.tag || ''}
              onChange={(e) => handleChange('tag', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
        </div>
      </SKModal>


      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        variant='delete'
        onClose={() => { setAction(null); setExpenseItem(null) }}
        open={action === 'delete'}
        onConfirm={() => handleDeleteIncome()}
        information="Are you sure you want to delete this expense entry?"
      />

      <ConfirmationDialog
        variant='info'
        onClose={() => setInformation('')}
        open={!!information}
        information={information}
        onConfirm={() => setInformation('')}
      />
      <BlockingLoader show={loadingCount > 0} />
    </>
  );
}

export default Page