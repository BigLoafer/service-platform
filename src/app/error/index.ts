import * as Sentry from '@sentry/browser';

export function reportError(error: any) {
  Sentry.withScope(scope => {
    Object.keys(error).forEach(key => {
      scope.setExtra(key, error);
    });
    Sentry.captureException(error);
  });
}

export const onUnhandledrejection = (e: any) => {
  if (process.env.SP_ENV === 'pub') {
    reportError(e);
    e.preventDefault();
  }
};

export const onWindowError = (e: any) => {
  // tslint:disable-next-line
  console.log(e);
  if (process.env.SP_ENV === 'pub') {
    reportError(e);
    e.preventDefault();
  }
};
