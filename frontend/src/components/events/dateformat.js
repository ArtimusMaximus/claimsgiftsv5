





const date = new Date(Date.now()).toLocaleString()
const d = date.split(',')[0]
export const propsDate = d.split('/')[2] + '-' + d.split('/')[0] + '-' + d.split('/')[1]
