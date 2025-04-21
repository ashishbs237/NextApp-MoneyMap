'use client'

import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import { Pencil, Trash2 } from 'lucide-react'
import SKHeader from '@/components/common/Header'
import SKDataTable, { ColumnDefinition } from '@/components/common/SKDataTable'
import SKModal from '@/components/common/SKModal'
import { useToast } from '@/hooks/useToast'
import { createInvestmentLabel, getInvestmentLabels } from '@/utils/ui/apiFunctions/settingsAPI'
import { getInvestmentList, createInvestment, updateInvestment, deleteInvestment } from '@/utils/ui/apiFunctions/investmentAPI'
import { ActionType, IInvestmentItem } from '@/types/common'
import SKButton from '@/components/elements/SKButton'
import React, { useEffect, useState } from 'react'
import BlockingLoader from '@/components/common/BlockingLoader'
import { formatText } from '@/utils/ui/functions'
import Card from '@/components/common/Card'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  const [investmentList, setInvestmentList] = useState<IInvestmentItem[]>([]);
  const [action, setAction] = useState<ActionType>(null);
  const [investmentItem, setInvestmentItem] = useState<any>({});
  const [savedLabels, setSavedLabels] = useState<string[]>([]);
  const [information, setInformation] = useState<string>('');
  const { successToast, errorToast } = useToast();
  const [loadingCount, setLoadingCount] = useState(0);

  const investmentSummary = investmentList.reduce(
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
        const res = await getInvestmentLabels();
        setSavedLabels(res.data.map((item: { label: string }) => item?.label));
      })();

      (async () => {
        const res = await getInvestmentList();
        setInvestmentList(res.data);
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
            onClick={() => { setAction('add'); setInvestmentItem(row) }}
            className="text-blue-600 hover:opacity-80 p-1 cursor-pointer"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => { setAction('delete'); setInvestmentItem(row) }}
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
    setInvestmentItem({ ...investmentItem, [key]: value });
  }

  const saveCustomLabel = async (newLbl: string) => {
    try {
      await createInvestmentLabel({ label: newLbl, note: '' });
      setSavedLabels([...savedLabels, newLbl]);
    } catch (err) {
      errorToast(err)
    }
  }

  const handleSaveItem = async (payload: object) => {
    try {

      if (investmentItem?._id) {
        const res = await updateInvestment(investmentItem?._id, payload);
        successToast(res.message);
        // update loacal list
        setInvestmentList(investmentList.map((item: IInvestmentItem) => {
          return item._id === investmentItem._id ? payload : item
        }))
      } else {
        const res = await createInvestment(payload);
        if (res) {
          successToast(res.message);
          // update loacal list
          setInvestmentList([...investmentList, { _id: res.data._id, ...payload }])
        }
      }
      setAction(null);
    } catch (err) {
      errorToast(err)
    } finally {
      setInvestmentItem(null)
    }
  }

  const handleDeleteIncome = async () => {
    try {
      const res = await deleteInvestment(investmentItem?._id)
      successToast(res);
      setInvestmentList(investmentList.filter((e) => e._id !== investmentItem?._id))
    } catch (err) {
      errorToast(err)
    } finally {
      setInvestmentItem(null)
    }
  }

  const handleIncomeItem = async () => {
    const { amount, label, customLabel, tag } = investmentItem;;
    const newLbl = formatText(customLabel || label);
    if (amount && (newLbl)) {

      // check if label is already exists in the list

      // save the custom label if it doesn't exist in the labels list
      if (newLbl && !savedLabels?.includes(newLbl)) {
        saveCustomLabel(newLbl)
      }

      let isLabelUsed = false;
      if (investmentItem?._id) {
        isLabelUsed = investmentList.some((item: IInvestmentItem) => item._id !== investmentItem?._id && item?.label === newLbl);
      } else {
        isLabelUsed = investmentList.some((item: IInvestmentItem) => item?.label === newLbl);
      }
      if (isLabelUsed) {
        errorToast('Label already used. Please use a different label.');
        setInvestmentItem({ ...investmentItem, label: '', customLabel: '' });
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
      <SKHeader text='Investment List'>
        <SKButton label='Manage labels' tabType='investment' onClick={() => router.push("/dashboard/settings/investment")} />
      </SKHeader>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card amount={investmentSummary.currMonthlyIncome || 0} title='Current Monthly Investment' />
          <Card amount={investmentSummary.currYearlyIncome || 0} title='Current Yearly Investment' />
          <Card amount={investmentSummary.nextMonthlyIncome || 0} title='Next Year Monthly Investment' />
          <Card amount={investmentSummary.nextYearlyIncome || 0} title='Next Year Yearly Investment' />
        </div>
      </div>

      {/* Income Table*/}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <div className='flex gap-3 items-center justify-between'>
          <h3 className="flextext-lg font-semibold text-gray-700">Income List</h3>
          <SKButton label='+ Add investment' tabType='investment' onClick={() => setAction('add')} />
        </div>

        <SKDataTable
          columns={columns}
          rows={investmentList}
        />
      </div>

      {/* Add / Update Income Source */}
      <SKModal
        visible={action === 'add'}
        onClose={() => { setAction('default'); setInvestmentItem(null) }}
        onSave={() => handleIncomeItem()}
        title={`${investmentItem?._id ? 'Update' : 'Save'} Investment Entry`}
      >
        <div className="space-y-6 px-2 pt-1 pb-4">


          {/* Label Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Label</label>
            <select
              value={investmentItem?.label || ''}
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
              value={investmentItem?.customLabel || ''}
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
              value={investmentItem?.amount || ''}
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
              value={investmentItem?.tag || ''}
              onChange={(e) => handleChange('tag', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
        </div>
      </SKModal>


      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        variant='delete'
        onClose={() => { setAction(null); setInvestmentItem(null) }}
        open={action === 'delete'}
        onConfirm={() => handleDeleteIncome()}
        information="Are you sure you want to delete this investment entry?"
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