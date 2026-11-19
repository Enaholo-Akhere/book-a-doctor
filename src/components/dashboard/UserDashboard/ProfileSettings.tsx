import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Camera, UserRound } from 'lucide-react';
import avatar from '@/assets/images/upload_avatar.png';
import { editRegistrationSchema, editRegistrationType } from '@/utils/authSchema';
import { useEditUser } from '@/Hook/useUsers';
import { queryClient } from '@/library/provider/reactQuery';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { user } from '@/types/users';
import { useAuthStore } from '@/store/authStore';
import { handleAxiosError } from '@/utils/axiosError';
import { Card, CardHeader, Field, fieldClass, primaryBtn, secondaryBtn } from '../shared/ui';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const ProfileSettings = ({ user }: { user: user }) => {
  const updatedUser = useAuthStore((state) => state.updateUser);
  const [preview, setPreview] = useState<string | null>(user.photo?.imageUrl ?? null);
  const { mutate, isPending } = useEditUser();

  const imageData = { imageUrl: user.photo?.imageUrl, publicId: user.photo?.publicId };

  const defaults = {
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    gender: (user?.gender || undefined) as editRegistrationType['gender'],
    photo: imageData,
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<editRegistrationType>({ resolver: zodResolver(editRegistrationSchema), defaultValues: defaults });

  // Free the object URL created for a picked photo.
  useEffect(() => () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
  }, [preview]);

  const submitHandler = (data: editRegistrationType) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('gender', data.gender);
    formData.append('photo', JSON.stringify(imageData));
    if (data.photo instanceof FileList && data.photo.length > 0) {
      formData.append('photo', data.photo[0]);
    }

    mutate(
      { id: user._id, formData },
      {
        onSuccess: (result) => {
          toast.success('Profile updated');
          updatedUser(result.data);
          reset({ ...defaults, ...data, photo: result.data?.photo ?? imageData });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
        },
        onError: (err) => toast.error(handleAxiosError(err) || 'Profile update failed'),
      }
    );
  };

  return (
    <Card>
      <CardHeader
        title='Personal information'
        description='Your name, contact details and profile photo'
        icon={<UserRound size={18} />}
      />
      <form onSubmit={handleSubmit(submitHandler)} noValidate className='px-5 pb-5 sm:px-6'>
        <div className='flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4'>
          <img
            src={preview || avatar}
            alt='Profile'
            className='h-16 w-16 rounded-full object-cover ring-4 ring-white'
          />
          <div className='min-w-[10rem] flex-1'>
            <p className='text-sm font-semibold text-headingColor'>Profile photo</p>
            <p className='text-xs text-gray-500'>JPG, PNG, WEBP or HEIC, up to 5 MB</p>
          </div>
          <Controller
            name='photo'
            control={control}
            render={({ field }) => (
              <label className={`${secondaryBtn} relative`}>
                <Camera size={16} /> Change photo
                <input
                  type='file'
                  accept='.jpg,.jpeg,.png,.webp,.heic'
                  className='sr-only'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > MAX_PHOTO_BYTES) {
                      toast.error('Photo must be 5 MB or smaller');
                      e.target.value = '';
                      return;
                    }
                    field.onChange(e.target.files);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            )}
          />
        </div>

        <div className='mt-5 grid gap-4 sm:grid-cols-2'>
          <Field label='Full name' htmlFor='name' error={errors.name?.message}>
            <input id='name' autoComplete='name' {...register('name')} className={fieldClass} />
          </Field>
          <Field label='Email address' htmlFor='email' hint='Contact support to change your email.'>
            <input id='email' type='email' disabled {...register('email')} className={fieldClass} />
          </Field>
          <Field label='Phone number' htmlFor='phone' error={errors.phone?.message}>
            <input id='phone' type='tel' autoComplete='tel' placeholder='+2349012345678' {...register('phone')} className={fieldClass} />
          </Field>
          <Field label='Gender' htmlFor='gender' error={errors.gender?.message}>
            <select id='gender' {...register('gender')} className={fieldClass}>
              <option value=''>Select gender</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
          </Field>
        </div>

        <div className='mt-6 flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end'>
          <button
            type='button'
            disabled={!isDirty || isPending}
            onClick={() => {
              reset(defaults);
              setPreview(user.photo?.imageUrl ?? null);
            }}
            className={secondaryBtn}
          >
            Cancel
          </button>
          <button type='submit' disabled={!isDirty || isPending} className={primaryBtn}>
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileSettings;
