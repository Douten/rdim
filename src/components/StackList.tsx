export default function StackList(
  props: {
    stackList: string[];
    clearStackList: () => void;
    currentStackIndex: number;
  }) 
{
  const imageClass = (active: Boolean) => {
    return `${active ? 'opacity-100' : 'opacity-0'} absolute top-0 h-full w-[80%] object-contain`;
  }

  return (
    <div>
      { props.stackList.length > 0 &&
        (<button className='close' onClick={props.clearStackList}>X</button>)
      }
      <div className="relative flex justify-center p-10 h-[70vh]">
        {props.stackList.map((imgUrl: string, index) => (
          <img
            className={imageClass(index === props.currentStackIndex)}
            key={index}
            src={imgUrl}
            alt="stack" />
        ))}
      </div>
    </div>
  );
}
