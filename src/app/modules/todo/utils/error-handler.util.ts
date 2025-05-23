import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export function handleError(operation = 'operation', toastr?: ToastrService) {
  return (error: any) => {
    const message = error?.message || error?.statusText || 'Unknown error';
    console.error(`[${operation}] failed:`, error);

    if (toastr) {
      toastr.error(`[${operation}] failed`, 'Error');
    }

    return throwError(() => new Error(`[${operation}] failed: ${message}`));
  };
}
