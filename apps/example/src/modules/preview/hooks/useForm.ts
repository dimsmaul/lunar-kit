import { useState, useEffect } from 'react';
import { useForm, UseFormGetValues } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(200, 'Bio is too long'),
  country: z.string().min(1, 'Country is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function useForms() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      country: '',
    },
  });

  const onSubmit = (data: UseFormGetValues<FormValues>) => {
    console.log(data);
  };

  return { form, onSubmit, countryOptions };
}


const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Australia', value: 'AU' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'India', value: 'IN' },
  { label: 'Japan', value: 'JP' },
  { label: 'Brazil', value: 'BR' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Italy', value: 'IT' },
  { label: 'Spain', value: 'ES' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Norway', value: 'NO' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Finland', value: 'FI' },
  { label: 'Russia', value: 'RU' },
  { label: 'China', value: 'CN' },
  { label: 'South Korea', value: 'KR' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Austria', value: 'AT' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Greece', value: 'GR' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Poland', value: 'PL' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Chile', value: 'CL' },
  { label: 'Colombia', value: 'CO' },
  { label: 'Peru', value: 'PE' },
  { label: 'Venezuela', value: 'VE' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'United Arab Emirates', value: 'AE' },
]