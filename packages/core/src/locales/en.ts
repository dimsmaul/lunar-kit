import type { TranslationDictionary } from './index';

const en: TranslationDictionary = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    loading: 'Loading...',
    search: 'Search',
    retry: 'Retry',
  },
  button: {
    submit: 'Submit',
    continue: 'Continue',
    get_started: 'Get Started',
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    sign_out: 'Sign Out',
  },
  message: {
    welcome: 'Welcome, {{name}}!',
    empty: 'No items found',
    error: 'Something went wrong',
    success: 'Operation successful',
    confirm_delete: 'Are you sure you want to delete this?',
  },
  label: {
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
  },
  error: {
    required: '{{field}} is required',
    invalid_email: 'Invalid email address',
    min_length: '{{field}} must be at least {{min}} characters',
    network: 'Network error. Please check your connection.',
  },
};

export default en;
