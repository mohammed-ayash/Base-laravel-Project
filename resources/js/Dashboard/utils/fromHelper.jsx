export function getErrorsFromResponse(err) {
  let {success, formErrors, error} = err.formErrors
    ? err
    : err?.response
    ? err.response?.data
    : err
  if (success === undefined) {
    return [
      {
        filedName: 'form_errors',
        errorMessage: err.error ?? 'Something Went Wrong',
      },
    ]
  }
  let backenderrors = []
  if (formErrors) {
    for (const [key, value] of Object.entries(formErrors)) {
      if (key === 'errors') {
        backenderrors.push({
          filedName: 'form_errors',
          errorMessage: value,
        })
        continue
      }
      if (key === 'translations') {
        if (formErrors?.translations?.en) {
          for (const [key2, value2] of Object.entries(
            formErrors.translations.en,
          )) {
            backenderrors.push({
              filedName: key2 + '_en',
              errorMessage: value2.errors,
            })
          }
        }
        if (formErrors?.translations?.ar) {
          for (const [key2, value2] of Object.entries(
            formErrors.translations.ar,
          )) {
            backenderrors.push({
              filedName: key2 + '_ar',
              errorMessage: value2.errors,
            })
          }
        }
        continue
      }

      backenderrors.push({
        filedName: key,
        errorMessage: value.errors,
      })
    }
  }
  if (error) {
    backenderrors.push({
      filedName: 'form_errors',
      errorMessage: error,
    })
  }

  return backenderrors
}