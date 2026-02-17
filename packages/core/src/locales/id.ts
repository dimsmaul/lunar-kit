import type { TranslationDictionary } from './index';

const id: TranslationDictionary = {
  common: {
    ok: 'OK',
    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    edit: 'Ubah',
    close: 'Tutup',
    back: 'Kembali',
    next: 'Selanjutnya',
    done: 'Selesai',
    loading: 'Memuat...',
    search: 'Cari',
    retry: 'Coba Lagi',
  },
  button: {
    submit: 'Kirim',
    continue: 'Lanjutkan',
    get_started: 'Mulai',
    sign_in: 'Masuk',
    sign_up: 'Daftar',
    sign_out: 'Keluar',
  },
  message: {
    welcome: 'Selamat datang, {{name}}!',
    empty: 'Tidak ada item',
    error: 'Terjadi kesalahan',
    success: 'Operasi berhasil',
    confirm_delete: 'Apakah Anda yakin ingin menghapus ini?',
  },
  label: {
    email: 'Email',
    password: 'Kata Sandi',
    name: 'Nama',
    phone: 'Telepon',
    address: 'Alamat',
  },
  error: {
    required: '{{field}} wajib diisi',
    invalid_email: 'Alamat email tidak valid',
    min_length: '{{field}} minimal {{min}} karakter',
    network: 'Kesalahan jaringan. Periksa koneksi Anda.',
  },
};

export default id;
