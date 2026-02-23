import { useState } from 'react';
import { AxiosError } from 'axios';
import avatar from '@/assets/images/upload_avatar.png';
import {
  editRegistrationSchema,
  editRegistrationType,
} from '@/utils/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';
import { useEditUser } from '@/Hook/users';
import { queryClient } from '@/library/provider/reactQuery';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { user } from '@/types/users';
import { useAuthStore } from '@/store/authStore';

const ProfileSettings = ({ user }: { user: user }) => {
  const updatedUser = useAuthStore((state) => state.updateUser);

  const [preview, setPreview] = useState<string | null>(
    user.photo ? user.photo.imageUrl : null
  );

  const { mutate, isPending } = useEditUser();

  const imageData = {
    imageUrl: user.photo.imageUrl,
    publicId: user.photo.publicId,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<editRegistrationType>({
    resolver: zodResolver(editRegistrationSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      gender: user?.gender as 'male' | 'female' | 'others',
      bloodType: user?.bloodType,
      photo: imageData,
    },
  });

  const submitHandler = (data: editRegistrationType) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('gender', data.gender);
    formData.append('bloodType', data.bloodType);
    formData.append('photo', JSON.stringify(imageData));

    if (data.photo instanceof FileList && data.photo.length > 0) {
      formData.append('photo', data.photo[0]);
    }

    mutate(
      { id: user._id, formData },
      {
        onSuccess: (result) => {
          toast.success('Profile updated successfully');
          updatedUser(result.data);
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
        },
        onError: (err) => {
          const error = err as AxiosError;
          const errorData = error?.response?.data as { message?: string };
          toast.error(errorData?.message || 'Profile update failed');
        },
      }
    );
  };

  const classStylings =
    'w-full px-[10px] py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer';

  return (
    <div className='px-5 lg:px-0 mt-5'>
      <div className='w-full mx-auto rounded-lg shadow-md md:py-5'>
        {/* <div className='grid grid-cols-1 lg:grid-cols-2 px-3'> */}
        {/* Form */}
        <div className='rounded-l-lg py-10 lg:mt-[-40px]'>
          <form className='py-4 md:py-0' onSubmit={handleSubmit(submitHandler)}>
            {/* Name */}
            <div className='mb-3'>
              <input
                type='text'
                placeholder='Full Name'
                {...register('name')}
                className={classStylings}
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className='mb-3'>
              <input
                type='email'
                disabled={true}
                placeholder='Enter your email'
                {...register('email')}
                className={`${classStylings} bg-gray-100 cursor-not-allowed`}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email.message}</p>
              )}
            </div>
            {/* bloodType */}
            <div className='mb-3'>
              <input
                type='text'
                placeholder='Enter your blood type'
                {...register('bloodType')}
                className={classStylings}
              />
              {errors.bloodType && (
                <p className='text-red-500 text-sm'>
                  {errors.bloodType.message}
                </p>
              )}
            </div>
            {/* Phone */}
            <div className='mb-3'>
              <input
                type='tel'
                placeholder='Phone number (+2349012345678)'
                {...register('phone')}
                className={classStylings}
              />
              {errors.phone && (
                <p className='text-red-500 text-sm'>{errors.phone.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className='mb-3 flex items-center justify-between px-[15px]'>
              <label className='text-headingColor font-bold text-[15px]'>
                Gender
                <select
                  {...register('gender')}
                  className='text-textColor font-semibold text-[15px] px-4 py-3 focus:outline-none'
                >
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='others'>Others</option>
                </select>
              </label>
            </div>

            {/* Upload */}
            <div className='mb-3 flex items-center gap-3 px-[15px]'>
              <figure className='w-[60px] h-[60px] rounded-full border-2 border-primaryColor flex items-center justify-center'>
                <img
                  src={preview || avatar}
                  alt='avatar'
                  className='w-full rounded-full h-full object-cover'
                />
              </figure>

              <div className='relative w-[130px] h-[50px]'>
                <Controller
                  name='photo'
                  control={control}
                  render={({ field }) => (
                    <input
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                      type='file'
                      accept='.jpg,.jpeg,.png,.webp,.heic'
                      id='customFile'
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        setPreview(URL.createObjectURL(e.target.files![0]));
                      }}
                    />
                  )}
                />
                <label
                  htmlFor='customFile'
                  className='absolute inset-0 flex items-center px-3 py-2 text-[15px] font-semibold rounded-lg truncate cursor-pointer bg-[#0066ff46] text-headingColor'
                >
                  Upload Photo
                </label>
              </div>
            </div>

            <div className='mt-7'>
              <button
                type='submit'
                disabled={isPending}
                className='w-full bg-primaryColor text-white text-[18px] rounded-lg px-4 py-3 cursor-pointer'
              >
                {isPending ? (
                  <HashLoader size={20} color='#ffffff' />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ProfileSettings;
