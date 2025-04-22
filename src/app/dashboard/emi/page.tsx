'use client'

import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import { Pencil, Trash2 } from 'lucide-react'
import SKHeader from '@/components/common/Header'
import SKDataTable, { ColumnDefinition } from '@/components/common/SKDataTable'
import SKModal from '@/components/common/SKModal'
import { useToast } from '@/hooks/useToast'
import { createEMILabel, getEMILabels } from '@/utils/ui/apiFunctions/settingsAPI'
import { getEmiList, createEmi, updateEmi, deleteEmi } from '@/utils/ui/apiFunctions/emiAPI'
import { ActionType, IEmiItem } from '@/types/common'
import SKButton from '@/components/elements/SKButton'
import React, { useEffect, useState } from 'react'
import BlockingLoader from '@/components/common/BlockingLoader'
import { formatText } from '@/utils/ui/functions'
import Card from '@/components/common/Card'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  const [emiList, setEmiList] = useState<IEmiItem[]>([]);
  const [action, setAction] = useState<ActionType>(null);
  const [emiItem, setEmiItem] = useState<any>({});
  const [savedLabels, setSavedLabels] = useState<string[]>([]);
  const [information, setInformation] = useState<string>('');
  const { successToast, errorToast } = useToast();
  const [loadingCount, setLoadingCount] = useState(0);

  const emiSummary = emiList.reduce(
    (acc: any, curr: any) => {
      const { amount } = curr;

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
    console.log("Count : ", loadingCount)
  }, [loadingCount])

  useEffect(() => {
    let isMounted = true;
    setLoadingCount((prev) => prev + 1);
  
    const fetchData = async () => {
      try {
        const [labelsRes, emiRes] = await Promise.all([
          getEMILabels(),
          getEmiList(),
        ]);
  
        if (!isMounted) return;
  
        setSavedLabels(labelsRes.data.map((item: { label: string }) => item.label));
        setEmiList(emiRes.data);
      } catch (err) {
        errorToast(err);
      } finally {
        if (isMounted) setLoadingCount((prev) => prev - 1);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, []);
  

  const columns: ColumnDefinition[] = [
    { label: 'Amount', accessor: 'amount' },
    { label: 'Label', accessor: 'label' },
    { label: 'Total Emis', accessor: 'totalEmis' },
    { label: 'Deduction Date', accessor: 'deductionDate' },
    { label: 'Tag', accessor: 'tag' },
    {
      label: 'Actions',
      accessor: 'actions',
      renderCell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setAction('add'); setEmiItem(row) }}
            className="text-blue-600 hover:opacity-80 p-1 cursor-pointer"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => { setAction('delete'); setEmiItem(row) }}
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
    setEmiItem({ ...emiItem, [key]: value });
  }

  const saveCustomLabel = async (newLbl: string) => {
    try {
      await createEMILabel({ label: newLbl, note: '' });
      setSavedLabels([...savedLabels, newLbl]);
    } catch (err) {
      errorToast(err)
    }
  }

  const handleSaveItem = async (payload: object) => {
    try {

      if (emiItem?._id) {
        const res = await updateEmi(emiItem?._id, payload);
        successToast(res.message);
        // update loacal list
        setEmiList(emiList.map((item: IEmiItem) => {
          return item._id === res?.data._id ? { _id: emiItem._id, ...payload } : item
        }))
      } else {
        const res = await createEmi(payload);
        if (res) {
          successToast(res.message);
          // update loacal list
          setEmiList([...emiList, { _id: res.data._id, ...payload }])
        }
      }
      setAction(null);
    } catch (err) {
      errorToast(err)
    } finally {
      setEmiItem(null)
    }
  }

  const handleDeleteIncome = async () => {
    try {
      const res = await deleteEmi(emiItem?._id)
      successToast(res?.message);
      setEmiList(emiList.filter((e) => e._id !== res?.data._id))
    } catch (err) {
      errorToast(err)
    } finally {
      setEmiItem(null)
    }
  }

  const handleIncomeItem = async () => {
    const { amount, label, customLabel, totalEmis, deductionDate, tag } = emiItem;;
    const newLbl = formatText(customLabel || label);
    if (amount && (newLbl)) {

      // check if label is already exists in the list

      // save the custom label if it doesn't exist in the labels list
      if (newLbl && !savedLabels?.includes(newLbl)) {
        saveCustomLabel(newLbl)
      }

      let isLabelUsed = false;
      if (emiItem?._id) {
        isLabelUsed = emiList.some((item: IEmiItem) => item._id !== emiItem?._id && item?.label === newLbl);
      } else {
        isLabelUsed = emiList.some((item: IEmiItem) => item?.label === newLbl);
      }
      if (isLabelUsed) {
        errorToast('Label already used. Please use a different label.');
        setEmiItem({ ...emiItem, label: '', customLabel: '' });
        return;
      }

      handleSaveItem({
        amount: Number(amount),
        label: newLbl,
        totalEmis,
        deductionDate,
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
      <SKHeader text='Emi List'>
        <SKButton label='Manage labels' tabType='emi' onClick={() => router.push("/dashboard/settings/emi")} />
      </SKHeader>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card amount={emiSummary.currMonthlyIncome || 0} title='Current Monthly Emi' />
          <Card amount={emiSummary.currYearlyIncome || 0} title='Current Yearly Emi' />
          <Card amount={emiSummary.nextMonthlyIncome || 0} title='Next Year Monthly Emi' />
          <Card amount={emiSummary.nextYearlyIncome || 0} title='Next Year Yearly Emi' />
        </div>
      </div>

      {/* Income Table*/}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <div className='flex gap-3 items-center justify-between'>
          <h3 className="flextext-lg font-semibold text-gray-700">Income List</h3>
          <SKButton label='+ Add emi' tabType='emi' onClick={() => setAction('add')} />
        </div>

        <SKDataTable
          columns={columns}
          rows={emiList}
        />
      </div>

      {/* Add / Update Income Source */}
      <SKModal
        visible={action === 'add'}
        onClose={() => { setAction('default'); setEmiItem(null) }}
        onSave={() => handleIncomeItem()}
        title={`${emiItem?._id ? 'Update' : 'Save'} Emi Entry`}
      >
        <div className="space-y-6 px-2 pt-1 pb-4">


          {/* Label Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Label</label>
            <select
              value={emiItem?.label || ''}
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
              value={emiItem?.customLabel || ''}
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
              value={emiItem?.amount || ''}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Total EMIs Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Total EMIs</label>
            <input
              type="number"
              placeholder="Enter total number of emis"
              value={emiItem?.totalEmis || ''}
              onChange={(e) => handleChange('totalEmis', e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Deduction Date Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Deduction Date</label>
            <input
              type="number"
              placeholder="Enter deduction date"
              value={emiItem?.deductionDate || ''}
              onChange={(e) => handleChange('deductionDate', e.target.value)}
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
              value={emiItem?.tag || ''}
              onChange={(e) => handleChange('tag', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
        </div>
      </SKModal>


      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        variant='delete'
        onClose={() => { setAction(null); setEmiItem(null) }}
        open={action === 'delete'}
        onConfirm={() => handleDeleteIncome()}
        information="Are you sure you want to delete this emi entry?"
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