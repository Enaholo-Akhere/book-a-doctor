import { KeyboardEvent, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { HeartPulse, Lock, Phone, Pill, Ruler, ShieldAlert, X } from 'lucide-react';
import { user, HealthProfileInput } from '@/types/users';
import { useUpdateHealthProfile } from '@/Hook/useUsers';
import { queryClient } from '@/library/provider/reactQuery';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { handleAxiosError } from '@/utils/axiosError';
import { BLOOD_TYPES, GENOTYPES, ageFrom, bmiFrom } from '../shared/healthUtils';
import { Badge, Card, CardHeader, Field, fieldClass, primaryBtn, secondaryBtn } from '../shared/ui';

const optionalNumber = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max), {
      message: `Enter a ${label} between ${min} and ${max}`,
    });

const schema = z.object({
  dateOfBirth: z
    .string()
    .refine((v) => v === '' || (new Date(v) <= new Date() && new Date(v).getFullYear() >= 1900), {
      message: 'Enter a valid date of birth',
    }),
  heightCm: optionalNumber(30, 272, 'height'),
  weightKg: optionalNumber(1, 500, 'weight'),
  bloodType: z.string(),
  genotype: z.string(),
  address: z.string().trim().max(200, 'Address is too long'),
  allergies: z.array(z.string()),
  chronicConditions: z.array(z.string()),
  medications: z.array(z.string()),
  emergencyName: z.string().trim().max(60),
  emergencyRelationship: z.string().trim().max(40),
  emergencyPhone: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\+[1-9][0-9]{7,14}$/.test(v.replace(/[\s-]/g, '')), {
      message: 'Use international format, e.g. +2349012345678',
    }),
});

type FormValues = z.infer<typeof schema>;

const toDateInput = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');

const defaultsFrom = (u: user): FormValues => ({
  dateOfBirth: toDateInput(u.dateOfBirth),
  heightCm: u.heightCm ? String(u.heightCm) : '',
  weightKg: u.weightKg ? String(u.weightKg) : '',
  bloodType: u.bloodType ?? '',
  genotype: u.genotype ?? '',
  address: u.address ?? '',
  allergies: u.allergies ?? [],
  chronicConditions: u.chronicConditions ?? [],
  medications: u.medications ?? [],
  emergencyName: u.emergencyContact?.name ?? '',
  emergencyRelationship: u.emergencyContact?.relationship ?? '',
  emergencyPhone: u.emergencyContact?.phone ?? '',
});

const HealthProfile = ({ user }: { user: user }) => {
  const { mutate, isPending } = useUpdateHealthProfile();
  const defaults = useMemo(() => defaultsFrom(user), [user]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: defaults });

  const [heightCm, weightKg, dateOfBirth] = watch(['heightCm', 'weightKg', 'dateOfBirth']);
  const bmi = bmiFrom(Number(heightCm) || null, Number(weightKg) || null);
  const age = ageFrom(dateOfBirth);

  const onSubmit = (v: FormValues) => {
    const body: HealthProfileInput = {
      dateOfBirth: v.dateOfBirth,
      heightCm: v.heightCm === '' ? null : Number(v.heightCm),
      weightKg: v.weightKg === '' ? null : Number(v.weightKg),
      genotype: v.genotype as HealthProfileInput['genotype'],
      address: v.address,
      allergies: v.allergies,
      chronicConditions: v.chronicConditions,
      medications: v.medications,
      emergencyContact: {
        name: v.emergencyName,
        relationship: v.emergencyRelationship,
        phone: v.emergencyPhone.replace(/[\s-]/g, ''),
      },
    };
    if (v.bloodType) body.bloodType = v.bloodType as HealthProfileInput['bloodType'];

    mutate(body, {
      onSuccess: (res) => {
        toast.success('Health profile saved');
        reset(defaultsFrom(res.data));
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
      },
      onError: (err) => toast.error(handleAxiosError(err)),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' noValidate>
      <div className='flex items-start gap-3 rounded-2xl border border-primaryColor/20 bg-primaryColor/5 px-4 py-3 text-sm text-slate-600'>
        <Lock size={16} className='mt-0.5 shrink-0 text-primaryColor' />
        <p>
          Only you and the doctors you book can see this information. Keeping it accurate helps them
          give you safe, informed care.
        </p>
      </div>

      <Card>
        <CardHeader
          title='Vitals & body'
          description='Basic measurements and blood details'
          icon={<Ruler size={18} />}
        />
        <div className='grid gap-4 px-5 pb-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3'>
          <Field
            label='Date of birth'
            htmlFor='dob'
            error={errors.dateOfBirth?.message}
            hint={age !== null ? `${age} years old` : undefined}
          >
            <input
              id='dob'
              type='date'
              max={new Date().toISOString().slice(0, 10)}
              {...register('dateOfBirth')}
              className={fieldClass}
            />
          </Field>
          <Field label='Height (cm)' htmlFor='height' error={errors.heightCm?.message}>
            <input
              id='height'
              type='number'
              inputMode='decimal'
              step='0.1'
              placeholder='e.g. 172'
              {...register('heightCm')}
              className={fieldClass}
            />
          </Field>
          <Field label='Weight (kg)' htmlFor='weight' error={errors.weightKg?.message}>
            <input
              id='weight'
              type='number'
              inputMode='decimal'
              step='0.1'
              placeholder='e.g. 68'
              {...register('weightKg')}
              className={fieldClass}
            />
          </Field>
          <Field label='Blood group' htmlFor='blood'>
            <select id='blood' {...register('bloodType')} className={fieldClass}>
              <option value=''>Select blood group</option>
              {BLOOD_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <Field label='Genotype' htmlFor='genotype'>
            <select id='genotype' {...register('genotype')} className={fieldClass}>
              <option value=''>Select genotype</option>
              {GENOTYPES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <div className='min-w-0'>
            <p className='mb-1.5 text-[13px] font-medium text-slate-700'>Body mass index</p>
            <div className='flex h-[46px] items-center gap-2 rounded-xl bg-slate-50 px-3.5'>
              {bmi ? (
                <>
                  <span className='text-lg font-semibold text-headingColor tabular-nums'>
                    {bmi.value}
                  </span>
                  <Badge tone={bmi.tone}>{bmi.label}</Badge>
                </>
              ) : (
                <span className='text-sm text-slate-400'>Add height and weight</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title='Medical history'
          description='Press Enter or comma after each item'
          icon={<HeartPulse size={18} />}
        />
        <div className='grid gap-5 px-5 pb-5 sm:px-6 lg:grid-cols-3'>
          <Controller
            name='allergies'
            control={control}
            render={({ field }) => (
              <TagInput
                id='allergies'
                label='Allergies'
                icon={<ShieldAlert size={14} />}
                placeholder='e.g. Penicillin'
                tone='red'
                value={field.value}
                onChange={field.onChange}
                suggestions={['Penicillin', 'Peanuts', 'Latex', 'Sulfa drugs', 'Dust']}
              />
            )}
          />
          <Controller
            name='chronicConditions'
            control={control}
            render={({ field }) => (
              <TagInput
                id='conditions'
                label='Ongoing conditions'
                icon={<HeartPulse size={14} />}
                placeholder='e.g. Asthma'
                tone='violet'
                value={field.value}
                onChange={field.onChange}
                suggestions={['Hypertension', 'Diabetes', 'Asthma', 'Sickle cell']}
              />
            )}
          />
          <Controller
            name='medications'
            control={control}
            render={({ field }) => (
              <TagInput
                id='medications'
                label='Current medications'
                icon={<Pill size={14} />}
                placeholder='e.g. Metformin 500mg'
                tone='teal'
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title='Emergency contact & address'
          description='Who to reach if you need urgent help'
          icon={<Phone size={18} />}
        />
        <div className='grid gap-4 px-5 pb-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3'>
          <Field label='Full name' htmlFor='ec-name' error={errors.emergencyName?.message}>
            <input
              id='ec-name'
              autoComplete='off'
              placeholder='e.g. Jane Doe'
              {...register('emergencyName')}
              className={fieldClass}
            />
          </Field>
          <Field
            label='Relationship'
            htmlFor='ec-rel'
            error={errors.emergencyRelationship?.message}
          >
            <input
              id='ec-rel'
              placeholder='e.g. Sister'
              {...register('emergencyRelationship')}
              className={fieldClass}
            />
          </Field>
          <Field label='Phone number' htmlFor='ec-phone' error={errors.emergencyPhone?.message}>
            <input
              id='ec-phone'
              type='tel'
              placeholder='+2349012345678'
              {...register('emergencyPhone')}
              className={fieldClass}
            />
          </Field>
          <Field
            label='Home address'
            htmlFor='address'
            error={errors.address?.message}
            className='sm:col-span-2 lg:col-span-3'
          >
            <input
              id='address'
              autoComplete='street-address'
              placeholder='Street, city, state, country'
              {...register('address')}
              className={fieldClass}
            />
          </Field>
        </div>
      </Card>

      <div className='sticky bottom-3 z-0 flex flex-col-reverse gap-2 rounded-2xl border border-slate-100 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between'>
        <p className='px-1 text-sm text-slate-500'>
          {isDirty ? 'You have unsaved changes.' : 'All changes saved.'}
        </p>
        <div className='flex gap-2'>
          <button
            type='button'
            disabled={!isDirty || isPending}
            onClick={() => reset(defaults)}
            className={`${secondaryBtn} flex-1 sm:flex-none`}
          >
            Discard
          </button>
          <button
            type='submit'
            disabled={!isDirty || isPending}
            className={`${primaryBtn} flex-1 sm:flex-none`}
          >
            {isPending ? 'Saving…' : 'Save health profile'}
          </button>
        </div>
      </div>
    </form>
  );
};

interface TagInputProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  value: string[];
  onChange: (v: string[]) => void;
  suggestions?: string[];
  tone: 'red' | 'violet' | 'teal';
}

const TAG_TONES = {
  red: 'bg-red-50 text-red-700',
  violet: 'bg-secondary-50 text-secondary-700',
  teal: 'bg-primaryColor/10 text-primaryColor',
};

const TagInput = ({
  id,
  label,
  icon,
  placeholder,
  value,
  onChange,
  suggestions = [],
  tone,
}: TagInputProps) => {
  const [draft, setDraft] = useState('');

  const add = (raw: string) => {
    const item = raw.trim().replace(/,$/, '').slice(0, 60);
    if (!item || value.some((v) => v.toLowerCase() === item.toLowerCase()) || value.length >= 30)
      return;
    onChange([...value, item]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
      setDraft('');
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const unused = suggestions.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div className='min-w-0'>
      <label
        htmlFor={id}
        className='mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700'
      >
        {icon}
        {label}
      </label>
      <div className='flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 transition focus-within:border-primaryColor focus-within:ring-4 focus-within:ring-primaryColor/10'>
        {value.map((item) => (
          <span
            key={item}
            className={`inline-flex max-w-full items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${TAG_TONES[tone]}`}
          >
            <span className='truncate'>{item}</span>
            <button
              type='button'
              onClick={() => onChange(value.filter((v) => v !== item))}
              aria-label={`Remove ${item}`}
              className='cursor-pointer rounded opacity-70 hover:opacity-100'
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            add(draft);
            setDraft('');
          }}
          placeholder={value.length ? '' : placeholder}
          className='min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-[15px] text-headingColor outline-none placeholder:text-slate-400'
        />
      </div>
      {unused.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-1.5'>
          {unused.slice(0, 4).map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => add(s)}
              className='cursor-pointer rounded-lg border border-dashed border-slate-200 px-2 py-0.5 text-xs text-slate-500 transition hover:border-primaryColor hover:text-primaryColor'
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthProfile;
