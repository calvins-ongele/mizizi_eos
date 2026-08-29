
import toast  from 'react-hot-toast';
type ToastType = {
    success:boolean, 
    msg?:string , 
    duration?:number
}

export async function Toast(data:ToastType) {

    if (data.success) {
        toast.success(data.msg ?? "", {
            position: "bottom-right",
            style: {
            border: '1px solid green',
            padding: '16px',
            color: 'green',
        },
        iconTheme: {
            primary: 'green',
            secondary: '#FFFAEE',
        },
        duration: data.duration || 5000
        });
    } else {
        
        toast.error(data.msg ?? "", {
            position: "bottom-right",
            style: {
            border: '1px solid red',
            padding: '16px',
            color: 'red',
        },
        iconTheme: {
            primary: 'red',
            secondary: '#FFFAEE',
        },
        duration:data.duration || 5000
        });
    }

}