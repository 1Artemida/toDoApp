import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export function handleError(operation = 'operation', toastr?: ToastrService) {
  return (error: any) => {
    const backendMessage =
      error?.error?.message ||
      error?.error?.error ||
      error?.message ||
      error?.statusText ||
      'Unknown error';

    const finalMessage = `[${operation}] failed: ${backendMessage}`;
    console.error(finalMessage, error);

    if (toastr) {
      toastr.error(backendMessage, 'Error');
    }

    return throwError(() => new Error(finalMessage));
  };
}
