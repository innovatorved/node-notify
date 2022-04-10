import Notify from './notify.js';

document.querySelector('button').addEventListener('click', () => {
    const note1 = new Notify({
        text: 'Hey I am Ved Gupta',
        position: 'top-right',
        canClose : true,
        autoClose: 2000
    })

})
