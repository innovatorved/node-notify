import Notify from './notify.js';

document.querySelector('button').addEventListener('click', () => {
    const note1 = new Notify({
        text: 'Warning',
        position: 'bottom-right',
        autoClose: false,
    })
   
})
