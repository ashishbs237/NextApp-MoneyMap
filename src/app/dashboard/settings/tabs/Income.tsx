'use client';

import { createIncomeLabel, deleteIncomeLabel, getIncomeLabels, updateIncomeLabel } from '@/utils/ui/apiFunctions/settingsAPI';
import { useEffect, useRef, useState } from 'react';
import BlockingLoader from '@/components/common/BlockingLoader';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import AddEditFinanceDataForm from '@/components/common/AddEditFinanceDataForm';
import { useToast } from '@/hooks/useToast';
import FinanceDataList from '@/components/common/FinanceDataList';
import { IFinanceLabel } from "@/types/settings"
import { IConfirmatinDialogAction } from "@/types/common"
import SKHeader from '@/components/common/Header';
import { formatText } from '@/utils/ui/functions';

export default function IncomeSettings() {
  const { successToast, errorToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [labels, setLabels] = useState<IFinanceLabel[]>([]);
  const [loadingCount, setLoadingCount] = useState(0);
  const [action, setAction] = useState<IConfirmatinDialogAction<IFinanceLabel> | null>();

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      setLoadingCount((prev) => prev + 1);
      const res = await getIncomeLabels();
      if (res) {
        setLabels(res.data);
        successToast(res?.message)
      }
    } catch (err) {
      errorToast(err);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }

  };

  const handleSubmit = async ({ label, note }) => {

    const isDuplicate = labels.some(
      (item) =>
        item._id !== action?.data?._id && item?.label?.toLowerCase() === label.toLowerCase()
    );

    if (isDuplicate) {
      setAction({ command: 'info' })
      return;
    }

    try {

      let res;
      const payload = {
        label: formatText(label),
        note: formatText(note)
      }
      if (action?.data?._id) {
        res = await updateIncomeLabel(action?.data?._id, payload);
        setLabels(labels.map((e) => {
          return e._id === res?.data?._id ? { _id: res?.data?._id, ...payload } : e
        }))

      } else {
        res = await createIncomeLabel(payload);
        setLabels([...labels, { _id: res?.data._id, ...payload }])
      }
      successToast(res?.message)
    } catch (err) {
      errorToast(err);
    } finally {

      inputRef.current?.focus();
    }
  };


  const handleDelete = async () => {
    try {
      const res = await deleteIncomeLabel(action?.data?._id);
      successToast(res.message);
      setLabels(labels.filter((e) => e._id !== res.data._id))
    } catch (err) {
      errorToast(err)
    }
  };

  const handleOk = () => {
    setAction(null)
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  return (
    <div className='relative'>
      <SKHeader text="Manage Income Labels" />

      <AddEditFinanceDataForm
        editData={action?.command === 'edit' && action?.data}
        ref={inputRef}
        onSubmit={handleSubmit}
      />

      <FinanceDataList
        rowData={labels}
        onEdit={(item) => setAction({ command: 'edit', data: item })}
        onDelete={(item) => setAction({ command: 'delete', data: item })}
      />

      <BlockingLoader show={loadingCount > 0} />
      <ConfirmationDialog
        onConfirm={() => handleDelete()}
        onClose={() => setAction(null)}
        open={action?.command === 'delete'}
        variant='delete'
      />

      <ConfirmationDialog
        onClose={() => handleOk()}
        open={action?.command === 'info'}
        variant='info'
        information="Income label already exists."
      />

    </div>
  );
}
