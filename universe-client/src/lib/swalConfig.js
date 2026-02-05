import Swal from 'sweetalert2';

/**
 * Custom themed SweetAlert2 configuration for UniVerse
 * Implements the "Command Center" aesthetic:
 * - Background: Zinc-950 (Dark)
 * - Text: White / Gray-400
 * - Accents: Violet-600 (Primary), Emerald-500 (Success), Rose-500 (Error)
 */

const baseOptions = {
  background: '#09090b', // Zinc-950
  color: '#ffffff',
  confirmButtonColor: '#7c3aed', // Violet-600
  cancelButtonColor: '#27272a',  // Zinc-800
  customClass: {
    popup: 'rounded-3xl border border-white/10 shadow-2xl font-sans',
    title: 'text-xl font-clash font-bold tracking-tight',
    htmlContainer: 'text-sm text-gray-400 font-medium',
    confirmButton: 'px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 active:scale-95',
    cancelButton: 'px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all hover:bg-white/5 hover:text-white',
  },
  buttonsStyling: true,
};

export const swalConfirm = (options) => {
  return Swal.fire({
    ...baseOptions,
    icon: 'warning',
    showCancelButton: true,
    ...options,
  });
};

export const swalSuccess = (title, text) => {
  return Swal.fire({
    ...baseOptions,
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#10b981', // Emerald-500
    timer: 3000,
  });
};

export const swalError = (title, text) => {
  return Swal.fire({
    ...baseOptions,
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#ef4444', // Rose-500
  });
};

export default Swal;
