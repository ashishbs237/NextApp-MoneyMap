'use client'

import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import { Pencil, Trash2 } from 'lucide-react'
import SKHeader from '@/components/common/Header'
import SKDataTable, { ColumnDefinition } from '@/components/common/SKDataTable'
import SKModal from '@/components/common/SKModal'
import { useToast } from '@/hooks/useToast'
import { createIncomeLabel, getIncomeLabels } from '@/utils/ui/apiFunctions/settingsAPI'
import { getIncomeList, createIncome, updateIncome, deleteIncome } from '@/utils/ui/apiFunctions/incomeAPI'
import { ActionType, IIncomeItem } from '@/types/common'
import SKButton from '@/components/elements/SKButton'
import React, { useEffect, useState } from 'react'
import BlockingLoader from '@/components/common/BlockingLoader'
import { formatText } from '@/utils/ui/functions'
import Card from '@/components/common/Card'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  const [incomeList, setIncomeList] = useState<IIncomeItem[]>([]);
  const [action, setAction] = useState<ActionType>(null);
  const [incomeItem, setIncomeItem] = useState<any>({});
  const [savedLabels, setSavedLabels] = useState<string[]>([]);
  const [information, setInformation] = useState<string>('');
  const { successToast, errorToast } = useToast();
  const [loadingCount, setLoadingCount] = useState(0);

  const incomeSummary = incomeList.reduce(
    (acc: any, curr: any) => {
      const { amount, yearlyIncrement } = curr;

      acc.currMonthlyIncome = (acc.currMonthlyIncome || 0) + amount;
      acc.currYearlyIncome = acc.currMonthlyIncome * 12;

      // Next month's income is current amount + increment
      const nextMonthIncome = amount + (amount * yearlyIncrement) / 100;
      acc.nextMonthlyIncome = (acc.nextMonthlyIncome || 0) + nextMonthIncome;
      acc.nextYearlyIncome = acc.nextMonthlyIncome * 12;

      return acc;
    },
    {}
  );

  useEffect(() => {
    try {
      setLoadingCount((prev) => prev + 1);
      (async () => {
        const res = await getIncomeLabels();
        setSavedLabels(res.data.map((item: { label: string }) => item?.label));
      })();

      (async () => {
        const res = await getIncomeList();
        setIncomeList(res.data);
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
    { label: 'Yearly Increment', accessor: 'yearlyIncrement' },
    {
      label: 'Actions',
      accessor: 'actions',
      renderCell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setAction('add'); setIncomeItem(row) }}
            className="text-blue-600 hover:opacity-80 p-1 cursor-pointer"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => { setAction('delete'); setIncomeItem(row) }}
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
    setIncomeItem({ ...incomeItem, [key]: value });
  }

  const saveCustomLabel = async (newLbl: string) => {
    try {
      await createIncomeLabel({ label: newLbl, note: '' });
      setSavedLabels([...savedLabels, newLbl]);
    } catch (err) {
      errorToast(err)
    }
  }

  const handleSaveItem = async (payload: object) => {
    try {

      if (incomeItem?._id) {
        const res = await updateIncome(incomeItem?._id, payload);
        successToast(res.message);
        // update loacal list
        setIncomeList(incomeList.map((item: IIncomeItem) => {
          return item._id === incomeItem._id ? payload : item
        }))
      } else {
        const res = await createIncome(payload);
        if (res) {
          successToast(res.message);
          // update loacal list
          setIncomeList([...incomeList, { _id: res.data._id, ...payload }])
        }
      }
      setAction(null);
    } catch (err) {
      errorToast(err)
    } finally {
      setIncomeItem(null)
    }
  }

  const handleDeleteIncome = async () => {
    try {
      const res = await deleteIncome(incomeItem?._id)
      successToast(res);
      setIncomeList(incomeList.filter((e) => e._id !== incomeItem?._id))
    } catch (err) {
      errorToast(err)
    } finally {
      setIncomeItem(null)
    }
  }

  const handleIncomeItem = async () => {
    const { amount, label, customLabel, yearlyIncrement } = incomeItem;;
    const newLbl = formatText(customLabel || label);
    if (amount && (newLbl)) {

      // check if label is already exists in the list

      // save the custom label if it doesn't exist in the labels list
      if (newLbl && !savedLabels?.includes(newLbl)) {
        saveCustomLabel(newLbl)
      }

      let isLabelUsed = false;
      if (incomeItem?._id) {
        isLabelUsed = incomeList.some((item: IIncomeItem) => item._id !== incomeItem?._id && item?.label === newLbl);
      } else {
        isLabelUsed = incomeList.some((item: IIncomeItem) => item?.label === newLbl);
      }
      if (isLabelUsed) {
        errorToast('Label already used. Please use a different label.');
        setIncomeItem({ ...incomeItem, label: '', customLabel: '' });
        return;
      }

      handleSaveItem({
        amount: Number(amount),
        label: newLbl,
        yearlyIncrement
      });

    } else {
      errorToast('Please fill all the fields.');
      return
    }

    // 
  }

  return (
    <>
      <SKHeader text='Income List'>
        <SKButton label='Manage labels' tabType='income' onClick={() => router.push("/dashboard/settings/income")} />
      </SKHeader>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card amount={incomeSummary.currMonthlyIncome || 0} title='Current Monthly Income' />
          <Card amount={incomeSummary.currYearlyIncome || 0} title='Current Yearly Income' />
          <Card amount={incomeSummary.nextMonthlyIncome || 0} title='Next Year Monthly Income' />
          <Card amount={incomeSummary.nextYearlyIncome || 0} title='Next Year Yearly Income' />
        </div>
      </div>

      {/* Income Table*/}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <div className='flex gap-3 items-center justify-between'>
          <h3 className="flextext-lg font-semibold text-gray-700">Income List</h3>
          <SKButton label='+ Add income' tabType='income' onClick={() => setAction('add')} />
        </div>

        <SKDataTable
          columns={columns}
          rows={incomeList}
        />
      </div>

      {/* Add / Update Income Source */}
      <SKModal
        visible={action === 'add'}
        onClose={() => { setAction('default'); setIncomeItem(null) }}
        onSave={() => handleIncomeItem()}
        title={`${incomeItem?._id ? 'Update' : 'Save'} Income Entry`}
      >
        <div className="space-y-6 px-2 pt-1 pb-4">


          {/* Label Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Label</label>
            <select
              value={incomeItem?.label || ''}
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
              value={incomeItem?.customLabel || ''}
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
              value={incomeItem?.amount || ''}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Yearly Increment Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Yearly Increment in % </label>
            <input
              type="text"
              placeholder="Enter yearly increment"
              value={incomeItem?.yearlyIncrement || ''}
              onChange={(e) => handleChange('yearlyIncrement', +e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
        </div>
      </SKModal>


      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        variant='delete'
        onClose={() => { setAction(null); setIncomeItem(null) }}
        open={action === 'delete'}
        onConfirm={() => handleDeleteIncome()}
        information="Are you sure you want to delete this income entry?"
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