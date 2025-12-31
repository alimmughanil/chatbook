
function useLinkTabs(type) {
  let tab = []

  if (type == 'config') {
    tab = [
      {
        name: 'configuration',
        label: 'Pengaturan Umum',
        value: '/admin/configuration'
      },
    ]
  }

  return tab
}

export default useLinkTabs
