// import { CgClose } from "react-icons/cg";

// const Modal=({isVisible,onClose,children,className})=>{
//     if (!isVisible) return null;
//     const handleClick=(e)=>{
//         if(e.target.id === 'wrapped') onClose();
//     }
//     return(
//         <div className="fixed inset-0 z-[9999] bg-black/35 backdrop-blur-sm flex justify-center items-center " id="wrapped" onClick={handleClick}>
//             <div className={`${className}`}>
//                 <div className="bg-white dark:bg-gray-800 p-2 rounded-sm flex flex-col">
//                 <button onClick={()=>onClose()} className="text-black dark:text-white font-bold text-xl place-self-end m-5 hover:text-red-700"><CgClose size={25}/></button>
//                 <div className="bg-white p-2 rounded">{children}</div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Modal;

import { CgClose } from "react-icons/cg";

const Modal = ({ isVisible, onClose, children, className,title }) => {
  if (!isVisible) return null;

  const handleClick = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  return (
    <div 
      id="wrapper"
      onClick={handleClick}
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4"
    >
      <div 
        className={` max-w-2xl max-h-[90vh] flex flex-col ${className} w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-100 h-[80px]">
            <h3 className="text-xl font-semibold text-red-700  bg-clip-text">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover-effect dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <CgClose size={24} />
            </button>
          </div>
          
          {/* Scrollable content */}
          <div className="overflow-y-auto p-4 flex-1">
            {children}
          </div>
          
      
        </div>
      </div>
    </div>
  );
};

export default Modal;