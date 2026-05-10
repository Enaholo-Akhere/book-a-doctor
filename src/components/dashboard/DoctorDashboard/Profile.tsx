import { useState } from 'react';
import { AxiosError } from 'axios';
import avatar from '@/assets/images/upload_avatar.png';
import { editDoctorSchema, editDoctorType } from '@/utils/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';
import { queryClient } from '@/library/provider/reactQuery';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { doctorsInterface } from '@/types/doctors.ds';
import { useEditDoctor } from '@/Hook/doctors';
import { AiOutlineDelete } from 'react-icons/ai';
import { useAuthStore } from '@/store/authStore';

const Profile = ({ data: userData }: { data: doctorsInterface }) => {
  const [preview, setPreview] = useState<string | null>();
  const { mutate, isPending } = useEditDoctor();
  const updateDoctor = useAuthStore((state) => state.updateDoctor);

  const qualif = userData?.qualifications;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<editDoctorType>({
    resolver: zodResolver(editDoctorSchema),
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
      phone: userData?.phone,
      gender: userData?.gender,
      photo: userData?.photo || undefined,
      bio: userData?.bio,
      about: userData?.about,
      specialization: userData?.specialization,
      ticketPrice: userData?.ticketPrice?.toString() || '',
      qualifications: userData.qualifications?.length
        ? userData.qualifications.map((q) => ({
            startDate:
              q.startDate instanceof Date
                ? q.startDate.toISOString().split('T')[0]
                : q.startDate,
            endDate:
              q.endDate instanceof Date
                ? q.endDate.toISOString().split('T')[0]
                : q.endDate,
            university: q.university,
            degree: q.degree,
          }))
        : [{ startDate: '', endDate: '', university: '', degree: '' }],
      experiences: userData.experiences?.length
        ? userData.experiences.map((exp) => ({
            startDate:
              exp.startDate instanceof Date
                ? exp.startDate.toISOString().split('T')[0]
                : exp.startDate,
            endDate:
              exp.endDate instanceof Date
                ? exp.endDate.toISOString().split('T')[0]
                : exp.endDate,
            position: exp.position,
            hospital: exp.hospital,
          }))
        : [{ startDate: '', endDate: '', position: '', hospital: '' }],
      timeSlots: userData.timeSlots?.length
        ? userData.timeSlots.map((ts) => ({
            day: ts.day,
            startingTime:
              ts.startingTime instanceof Date
                ? ts.startingTime.toISOString().substring(11, 16)
                : ts.startingTime,
            endingTime:
              ts.endingTime instanceof Date
                ? ts.endingTime.toISOString().substring(11, 16)
                : ts.endingTime,
          }))
        : [{ day: '', startingTime: '', endingTime: '' }],
    },
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({ control, name: 'qualifications' });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'experiences' });

  const {
    fields: timeSlotFields,
    append: appendTimeSlot,
    remove: removeTimeSlot,
  } = useFieldArray({ control, name: 'timeSlots' });

  const submitHandler = (data: editDoctorType) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('gender', data.gender);
    formData.append('bio', data.bio);
    formData.append('about', data.about);
    formData.append('specialization', data.specialization);
    formData.append('ticketPrice', data.ticketPrice.toString());
    formData.append('qualifications', JSON.stringify(data.qualifications));
    formData.append('experiences', JSON.stringify(data.experiences));
    formData.append('timeSlots', JSON.stringify(data.timeSlots));

    if (data.photo instanceof FileList && data.photo.length > 0) {
      formData.append('photo', data.photo[0]);
    } else {
      formData.append('photo', JSON.stringify(data.photo));
    }

    mutate(
      { id: userData._id, formData },
      {
        onSuccess: (result) => {
          toast.success('Profile updated successfully');
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
          updateDoctor(result.data);
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
        <div className='rounded-l-lg py-10 lg:mt-[-40px]'>
          <form
            className='py-4 md:py-0 px-5'
            onSubmit={handleSubmit(submitHandler)}
          >
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
                disabled
                placeholder='Enter your email'
                {...register('email')}
                className={`${classStylings} bg-gray-100 cursor-not-allowed`}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email.message}</p>
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

            {/* Bio */}
            <div className='mb-3'>
              <input
                type='text'
                placeholder='Enter your BIO'
                {...register('bio')}
                className={classStylings}
              />
              {errors.bio && (
                <p className='text-red-500 text-sm'>{errors.bio.message}</p>
              )}
            </div>

            {/* Gender / Specialization / Ticket Price */}
            <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-5'>
              <div>
                <div className='mb-3 flex flex-col justify-between'>
                  <label className='text-headingColor font-bold text-[15px] text-left'>
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    className='text-textColor font-semibold text-[15px] px-4 py-3 focus:outline-none border-1 border-[#0066FF61] focus:border-primaryColor rounded-lg'
                  >
                    <option value=''>Select Gender</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='others'>Others</option>
                  </select>
                  {errors.gender && (
                    <p className='text-red-500 text-sm'>
                      {errors?.gender.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className='mb-3 flex flex-col justify-between'>
                  <label className='text-headingColor font-bold text-[15px] text-left'>
                    Specialization
                  </label>
                  <select
                    {...register('specialization')}
                    className='text-textColor font-semibold text-[15px] px-4 py-3 focus:outline-none border-1 border-[#0066FF61] focus:border-primaryColor rounded-lg'
                  >
                    <option value=''>Select Specialization</option>
                    <option value='cardiologist'>Cardiology</option>
                    <option value='neurologist'>Neurology</option>
                    <option value='oncologist'>Oncology</option>
                    <option value='optometrist'>Optometrist</option>
                    <option value='dentistry'>Dentistry</option>
                  </select>
                  {errors.specialization && (
                    <p className='text-red-500 text-sm'>
                      {errors?.specialization.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className='mb-3 flex flex-col justify-between'>
                  <label className='text-headingColor font-bold text-[15px] text-left'>
                    Ticket Price
                  </label>
                  <input
                    type='number'
                    placeholder='0.00'
                    {...register('ticketPrice')}
                    className={`${classStylings} border-1 h-12 rounded-lg`}
                  />
                  {errors.ticketPrice && (
                    <p className='text-red-500 text-sm'>
                      {errors.ticketPrice.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ===== QUALIFICATIONS ===== */}
            <div className='mb-5'>
              <h4 className='text-16 text-headingColor font-200 mt-5'>
                QUALIFICATIONS
              </h4>
              {qualificationFields.map((field, index) => (
                <div key={field.id}>
                  <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-5'>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        Start Date*
                      </label>
                      <input
                        type='date'
                        {...register(`qualifications.${index}.startDate`)}
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.qualifications?.[index]?.startDate && (
                        <p className='text-red-500 text-sm'>
                          {errors.qualifications[index]?.startDate?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        End Date*
                      </label>
                      <input
                        type='date'
                        {...register(`qualifications.${index}.endDate`)}
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.qualifications?.[index]?.endDate && (
                        <p className='text-red-500 text-sm'>
                          {errors.qualifications[index]?.endDate?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        Degree*
                      </label>
                      <input
                        type='text'
                        placeholder='Degree obtained'
                        {...register(`qualifications.${index}.degree`)}
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.qualifications?.[index]?.degree && (
                        <p className='text-red-500 text-sm'>
                          {errors.qualifications[index]?.degree?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        University*
                      </label>
                      <input
                        type='text'
                        placeholder='Name of University'
                        {...register(`qualifications.${index}.university`)}
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.qualifications?.[index]?.university && (
                        <p className='text-red-500 text-sm'>
                          {errors.qualifications[index]?.university?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeQualification(index)}
                    className='cursor-pointer bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] w-fit h-fit'
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              ))}
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() =>
                    appendQualification({
                      startDate: '',
                      endDate: '',
                      degree: '',
                      university: '',
                    })
                  }
                  className='cursor-pointer bg-[#000] py-2 px-4 rounded text-white h-fit'
                >
                  Add Qualification
                </button>
              </div>
            </div>

            {/* ===== EXPERIENCE ===== */}
            <div className='mb-5'>
              <h4 className='text-16 text-headingColor font-200 mt-5'>
                EXPERIENCE
              </h4>
              {experienceFields.map((field, index) => (
                <div key={field.id}>
                  <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-5'>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        Start Date*
                      </label>
                      <input
                        type='date'
                        {...register(`experiences.${index}.startDate`)}
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.experiences?.[index]?.startDate && (
                        <p className='text-red-500 text-sm'>
                          {errors.experiences[index]?.startDate?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        End Date*
                      </label>
                      <input
                        type='date'
                        {...register(`experiences.${index}.endDate`)}
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.experiences?.[index]?.endDate && (
                        <p className='text-red-500 text-sm'>
                          {errors.experiences[index]?.endDate?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        Position*
                      </label>
                      <input
                        type='text'
                        placeholder='Position held'
                        {...register(`experiences.${index}.position`)} // ✅ fixed: was pointing to qualifications
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.experiences?.[index]?.position && (
                        <p className='text-red-500 text-sm'>
                          {errors.experiences[index]?.position?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        Hospital*
                      </label>
                      <input
                        type='text'
                        placeholder='Name of Hospital'
                        {...register(`experiences.${index}.hospital`)} // ✅ fixed: was pointing to qualifications
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.experiences?.[index]?.hospital && (
                        <p className='text-red-500 text-sm'>
                          {errors.experiences[index]?.hospital?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeExperience(index)}
                    className='cursor-pointer bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] w-fit h-fit'
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              ))}
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() =>
                    appendExperience({
                      startDate: '',
                      endDate: '',
                      position: '',
                      hospital: '',
                    })
                  }
                  className='cursor-pointer bg-[#000] py-2 px-4 rounded text-white h-fit'
                >
                  Add Experience
                </button>
              </div>
            </div>

            {/* ===== TIME SLOTS ===== */}
            <div className='mb-5'>
              <h4 className='text-16 text-headingColor font-200 mt-5'>
                TIME SLOT
              </h4>
              {timeSlotFields.map((field, index) => (
                <div key={field.id}>
                  <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-5'>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        Day*
                      </label>
                      <select
                        {...register(`timeSlots.${index}.day`)} // ✅ fixed: was uncontrolled
                        className='text-textColor font-semibold text-[15px] px-4 py-3 focus:outline-none border-1 border-[#0066FF61] focus:border-primaryColor rounded-lg w-full'
                      >
                        <option value=''>Select Day</option>
                        <option value='Monday'>Monday</option>
                        <option value='Tuesday'>Tuesday</option>
                        <option value='Wednesday'>Wednesday</option>
                        <option value='Thursday'>Thursday</option>
                        <option value='Friday'>Friday</option>
                        <option value='Saturday'>Saturday</option>
                        <option value='Sunday'>Sunday</option>
                      </select>
                      {errors.timeSlots?.[index]?.day && (
                        <p className='text-red-500 text-sm'>
                          {errors.timeSlots[index]?.day?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        Starting Time*
                      </label>
                      <input
                        type='time'
                        {...register(`timeSlots.${index}.startingTime`)}
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.timeSlots?.[index]?.startingTime && (
                        <p className='text-red-500 text-sm'>
                          {errors.timeSlots[index]?.startingTime?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='text-headingColor font-bold text-[15px] text-left'>
                        Ending Time*
                      </label>
                      <input
                        type='time'
                        {...register(`timeSlots.${index}.endingTime`)} // ✅ fixed: was pointing to experience
                        className={`${classStylings} border-1 h-12 rounded-lg`}
                      />
                      {errors.timeSlots?.[index]?.endingTime && (
                        <p className='text-red-500 text-sm'>
                          {errors.timeSlots[index]?.endingTime?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeTimeSlot(index)}
                    className='cursor-pointer bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] w-fit h-fit'
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              ))}
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() =>
                    appendTimeSlot({
                      day: '',
                      startingTime: '',
                      endingTime: '',
                    })
                  }
                  className='cursor-pointer bg-[#000] py-2 px-4 rounded text-white h-fit'
                >
                  Add Timeslot
                </button>
              </div>
            </div>

            {/* About */}

            <div className='mb-5'>
              <label className='text-headingColor font-bold text-[15px] text-left'>
                About*
              </label>
              <textarea
                rows={5}
                placeholder='Write something about you'
                {...register('about')}
                className={`${classStylings} border-1 rounded-lg`}
              ></textarea>
              {errors.about && (
                <p className='text-red-500 text-sm'>{errors.about.message}</p>
              )}
            </div>

            {/* Upload */}
            <div className='mb-3 flex items-center gap-3 px-[15px]'>
              <figure className='w-[60px] h-[60px] rounded-full border-2 border-primaryColor flex items-center justify-center'>
                <img
                  src={preview || userData?.photo?.imageUrl || avatar}
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
  );
};

export default Profile;
