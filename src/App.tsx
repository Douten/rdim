import { useEffect, useState } from 'react';
import './App.css';

import StackList from './components/StackList';

function App() {
  const [stackName, setStackName] = useState<string>('');

  // function EmptyState() {

  //   if (stackList.length > 0) {
  //     return null;
  //   }

  //   let text = "No stack found";

  //   if (stackList.length === 0 && !stackName) {
  //     text = "Please enter a stack name";
  //   } else if (!stackList.length && stackName) {
  //     text = "No Images found in stack. Add some below.";
  //   }

  //   return <div className="text-xl font-medium">{text}</div>;
  // }

  // function clearStackList() {
  //   setStackList([]);
  // }

  // function addImagesToStack(images: string[]) {
  //   setStackList([...stackList, ...images]);
  // }

  return (
    <div className="App">
      <StackList />
    </div>
  );
}

export default App;
