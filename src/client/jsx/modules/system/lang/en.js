module.exports = {
  counterpart: {
    // names: require('date-names/en'),
    // pluralize: require('pluralizers/en'),

    formats: {
      date: {
        'default':  '%a, %e %b %Y',
        long:       '%A, %B %o, %Y',
        short:      '%b %e',
        'dd MM yyyy': '%e %b %Y'
      },

      time: {
        'default':  '%H:%M',
        long:       '%H:%M:%S %z',
        short:      '%H:%M'
      },

      datetime: {
        'default':  '%a, %e %b %Y %H:%M',
        long:       '%A, %B %o, %Y %H:%M:%S %z',
        short:      '%e %b %H:%M'
      }
    }
  },
  status: {
    ready: 'Ready',
    loading: 'Loading...',
    error: 'Error!'
  },
  actions: 'Commands',
  action: {
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    print: 'Print',
    preview: 'Preview',
    signout:'Logout'
  },
  row: {
    created_at:'Created at',
    updated_at:'Updated at',
    created_by:'Created by',
    updated_by:'Updated by'
  },
  dialog: {
    title: {
      confirm_to_exit:'ยืนยันการออก'
    },
    confirm:'ยืนยัน',
    cancel:'ยกเลิก'
  }
}
