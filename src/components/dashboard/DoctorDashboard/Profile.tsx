import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Briefcase, CalendarClock, Camera, GraduationCap, Plus, Trash2, UserRound } from 'lucide-react';
import avatarAsset from '@/assets/images/upload_avatar.png';
import { editDoctorSchema, editDoctorType } from '@/utils/authSchema';
import { queryClient } from '@/library/provider/reactQuery';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { doctorsInterface } from '@/types/doctors.ds';
import { useEditDoctor } from '@/Hook/useDoctors';
import { useAuthStore } from '@/store/authStore';
import { handleAxiosError } from '@/utils/axiosError';
import { Card, CardHeader, Field, fieldClass, primaryBtn, secondaryBtn } from '../shared/ui';
import { DAYS } from './doctorUtils';

const avatar: string = avatarAsset.src;

const SPECIALIZATIONS = [
  ['cardiologist', 'Cardiology'],
  ['dermatologist', 'Dermatology'],
  ['dentistry', 'Dentistry'],
  ['general practitioner', 'General practice'],
  ['gynecologist', 'Obstetrics & gynaecology'],
  ['neurologist', 'Neurology'],
  ['oncologist', 'Oncology'],
  ['optometrist', 'Optometry'],
  ['orthopedist', 'Orthopaedics'],
  ['pediatrician', 'Paediatrics'],
  ['psychiatrist', 'Psychiatry'],
] as const;

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const toDate = (v: unknown) => (v instanceof Date ? v.toISOString().split('T')[0] : String(v ?? '').slice(0, 10));
const toTime = (v: unknown) => (v instanceof Date ? v.toISOString().substring(11, 16) : String(v ?? ''));

const defaultsFrom = (d: doctorsInterface): editDoctorType => ({
  name: d.name ?? '',
  email: d.email ?? '',
  phone: d.phone ?? '',
  gender: (d.gender || undefined) as editDoctorType['gender'],
  photo: d.photo || undefined,
  bio: d.bio ?? '',
  about: d.about ?? '',
  specialization: d.specialization ?? '',
  ticketPrice: d.ticketPrice ? String(d.ticketPrice) : '',
  qualifications: (d.qualifications ?? []).map((q) => ({
    startDate: toDate(q.startDate),
    endDate: toDate(q.endDate),
    university: q.university,
    degree: q.degree,
  })),
  experiences: (d.experiences ?? []).map((e) => ({
    startDate: toDate(e.startDate),
    endDate: toDate(e.endDate),
    position: e.position,
    hospital: e.hospital,
  })),
  timeSlots: (d.timeSlots ?? []).map((t) => ({
    day: t.day,
    startingTime: toTime(t.startingTime),
    endingTime: toTime(t.endingTime),
  })),
});

const Profile = ({ data: doctor }: { data: doctorsInterface }) => {
  const [preview, setPreview] = useState<string | null>(doctor.photo?.imageUrl ?? null);
  const { mutate, isPending } = useEditDoctor();
  const updateDoctor = useAuthStore((state) => state.updateDoctor);
  const defaults = useMemo(() => defaultsFrom(doctor), [doctor]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<editDoctorType>({ resolver: zodResolver(editDoctorSchema), defaultValues: defaults });

  const qualifications = useFieldArray({ control, name: 'qualifications' });
  const experiences = useFieldArray({ control, name: 'experiences' });
  const timeSlots = useFieldArray({ control, name: 'timeSlots' });

  const bioLength = watch('bio')?.length ?? 0;
  const aboutLength = watch('about')?.length ?? 0;

  useEffect(
    () => () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const submitHandler = (data: editDoctorType) => {
    const formData = new FormData();
    formData.append('name', data.name);
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
      { id: doctor._id, formData },
      {
        onSuccess: (result) => {
          toast.success('Profile saved');
          updateDoctor(result.data);
          reset(defaultsFrom(result.data));
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTOR_ME] });
        },
        onError: (err) => toast.error(handleAxiosError(err) || 'Profile update failed'),
      }
    );
  };


  return (
    <form onSubmit={handleSubmit(submitHandler)} noValidate className='space-y-6'>
      {/* Public profile */}
      <Card>
        <CardHeader title='Public profile' description='What patients see when they find you' icon={<UserRound size={18} />} />
        <div className='px-5 pb-5 sm:px-6'>
          <div className='flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4'>
            <img src={preview || avatar} alt='Profile' className='h-16 w-16 rounded-full object-cover ring-4 ring-white' />
            <div className='min-w-[10rem] flex-1'>
              <p className='text-sm font-semibold text-headingColor'>Profile photo</p>
              <p className='text-xs text-gray-500'>A clear, professional headshot. JPG, PNG, WEBP or HEIC, up to 5 MB.</p>
            </div>
            <Controller
              name='photo'
              control={control}
              render={({ field }) => (
                <label className={secondaryBtn}>
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
            <Field label='Specialization' htmlFor='specialization' error={errors.specialization?.message}>
              <select id='specialization' {...register('specialization')} className={fieldClass}>
                <option value=''>Select specialization</option>
                {SPECIALIZATIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label='Consultation fee (USD)' htmlFor='fee' error={errors.ticketPrice?.message} hint='Patients pay the equivalent in their local currency.'>
              <div className='relative'>
                <span className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400'>$</span>
                <input id='fee' type='number' inputMode='decimal' min='0' step='1' placeholder='0' {...register('ticketPrice')} className={`${fieldClass} pl-7`} />
              </div>
            </Field>
            <Field
              label='Headline'
              htmlFor='bio'
              className='sm:col-span-2'
              error={errors.bio?.message}
              hint={`${bioLength}/50 · e.g. "Consultant cardiologist, 12 years' experience"`}
            >
              <input id='bio' maxLength={50} {...register('bio')} className={fieldClass} />
            </Field>
            <Field label='About you' htmlFor='about' className='sm:col-span-2' error={errors.about?.message} hint={`${aboutLength}/1500 · Your approach, areas of interest and languages spoken.`}>
              <textarea id='about' rows={5} maxLength={1500} {...register('about')} className={`${fieldClass} resize-y`} />
            </Field>
          </div>
        </div>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader
          title='Weekly availability'
          description='Patients can only book you during these hours'
          icon={<CalendarClock size={18} />}
          action={
            <button type='button' onClick={() => timeSlots.append({ day: '', startingTime: '09:00', endingTime: '17:00' })} className={`${secondaryBtn} py-2`}>
              <Plus size={15} /> Add hours
            </button>
          }
        />
        <div className='space-y-3 px-5 pb-5 sm:px-6'>
          {timeSlots.fields.length === 0 && <p className='rounded-xl bg-gray-50 p-4 text-sm text-gray-500'>No hours yet. Add the days and times you consult.</p>}
          {timeSlots.fields.map((f, i) => (
            <div key={f.id} className='grid grid-cols-[1fr_auto] items-start gap-3 rounded-xl border border-gray-100 p-3 sm:grid-cols-[1.2fr_1fr_1fr_auto]'>
              <Field label='Day' htmlFor={`day-${i}`} error={errors.timeSlots?.[i]?.day?.message} className='col-span-1'>
                <select id={`day-${i}`} {...register(`timeSlots.${i}.day`)} className={fieldClass}>
                  <option value=''>Select day</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <RemoveButton onClick={() => timeSlots.remove(i)} label='Remove hours' className='sm:order-last' />
              <Field label='From' htmlFor={`start-${i}`} error={errors.timeSlots?.[i]?.startingTime?.message}>
                <input id={`start-${i}`} type='time' {...register(`timeSlots.${i}.startingTime`)} className={fieldClass} />
              </Field>
              <Field label='To' htmlFor={`end-${i}`} error={errors.timeSlots?.[i]?.endingTime?.message}>
                <input id={`end-${i}`} type='time' {...register(`timeSlots.${i}.endingTime`)} className={fieldClass} />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      {/* Qualifications */}
      <Card>
        <CardHeader
          title='Qualifications'
          description='Degrees, fellowships and certifications'
          icon={<GraduationCap size={18} />}
          action={
            <button type='button' onClick={() => qualifications.append({ startDate: '', endDate: '', degree: '', university: '' })} className={`${secondaryBtn} py-2`}>
              <Plus size={15} /> Add
            </button>
          }
        />
        <div className='space-y-3 px-5 pb-5 sm:px-6'>
          {qualifications.fields.length === 0 && <p className='rounded-xl bg-gray-50 p-4 text-sm text-gray-500'>Add at least one qualification. It's required for approval.</p>}
          {qualifications.fields.map((f, i) => (
            <div key={f.id} className='rounded-xl border border-gray-100 p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Qualification {i + 1}</p>
                <RemoveButton onClick={() => qualifications.remove(i)} label='Remove qualification' className='!mt-0' />
              </div>
              <div className='grid gap-3 sm:grid-cols-2'>
                <Field label='Degree / certificate' htmlFor={`deg-${i}`} error={errors.qualifications?.[i]?.degree?.message}>
                  <input id={`deg-${i}`} placeholder='e.g. MBBS' {...register(`qualifications.${i}.degree`)} className={fieldClass} />
                </Field>
                <Field label='Institution' htmlFor={`uni-${i}`} error={errors.qualifications?.[i]?.university?.message}>
                  <input id={`uni-${i}`} placeholder='e.g. University of Lagos' {...register(`qualifications.${i}.university`)} className={fieldClass} />
                </Field>
                <Field label='Start date' htmlFor={`qs-${i}`} error={errors.qualifications?.[i]?.startDate?.message}>
                  <input id={`qs-${i}`} type='date' {...register(`qualifications.${i}.startDate`)} className={fieldClass} />
                </Field>
                <Field label='End date' htmlFor={`qe-${i}`} error={errors.qualifications?.[i]?.endDate?.message}>
                  <input id={`qe-${i}`} type='date' {...register(`qualifications.${i}.endDate`)} className={fieldClass} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader
          title='Experience'
          description='Hospitals and clinics you have worked at'
          icon={<Briefcase size={18} />}
          action={
            <button type='button' onClick={() => experiences.append({ startDate: '', endDate: '', position: '', hospital: '' })} className={`${secondaryBtn} py-2`}>
              <Plus size={15} /> Add
            </button>
          }
        />
        <div className='space-y-3 px-5 pb-5 sm:px-6'>
          {experiences.fields.length === 0 && <p className='rounded-xl bg-gray-50 p-4 text-sm text-gray-500'>Add your work history so patients know your background.</p>}
          {experiences.fields.map((f, i) => (
            <div key={f.id} className='rounded-xl border border-gray-100 p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Role {i + 1}</p>
                <RemoveButton onClick={() => experiences.remove(i)} label='Remove role' className='!mt-0' />
              </div>
              <div className='grid gap-3 sm:grid-cols-2'>
                <Field label='Position' htmlFor={`pos-${i}`} error={errors.experiences?.[i]?.position?.message}>
                  <input id={`pos-${i}`} placeholder='e.g. Senior registrar' {...register(`experiences.${i}.position`)} className={fieldClass} />
                </Field>
                <Field label='Hospital / clinic' htmlFor={`hos-${i}`} error={errors.experiences?.[i]?.hospital?.message}>
                  <input id={`hos-${i}`} placeholder='e.g. Lagos University Teaching Hospital' {...register(`experiences.${i}.hospital`)} className={fieldClass} />
                </Field>
                <Field label='Start date' htmlFor={`es-${i}`} error={errors.experiences?.[i]?.startDate?.message}>
                  <input id={`es-${i}`} type='date' {...register(`experiences.${i}.startDate`)} className={fieldClass} />
                </Field>
                <Field label='End date' htmlFor={`ee-${i}`} error={errors.experiences?.[i]?.endDate?.message}>
                  <input id={`ee-${i}`} type='date' {...register(`experiences.${i}.endDate`)} className={fieldClass} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className='sticky bottom-3 z-10 flex flex-col-reverse gap-2 rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between'>
        <p className='px-1 text-sm text-gray-500'>
          {Object.keys(errors).length ? <span className='text-red-600'>Please fix the highlighted fields.</span> : isDirty ? 'You have unsaved changes.' : 'All changes saved.'}
        </p>
        <div className='flex gap-2'>
          <button
            type='button'
            disabled={!isDirty || isPending}
            onClick={() => {
              reset(defaults);
              setPreview(doctor.photo?.imageUrl ?? null);
            }}
            className={`${secondaryBtn} flex-1 sm:flex-none`}
          >
            Discard
          </button>
          <button type='submit' disabled={!isDirty || isPending} className={`${primaryBtn} flex-1 sm:flex-none`}>
            {isPending ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </div>
    </form>
  );
};

const RemoveButton = ({ onClick, label, className = '' }: { onClick: () => void; label: string; className?: string }) => (
  <button
    type='button'
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`mt-6 flex h-10 w-10 cursor-pointer items-center justify-center self-start rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 ${className}`}
  >
    <Trash2 size={16} />
  </button>
);

export default Profile;
