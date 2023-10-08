import { InputNumber, Slider } from 'antd';
import React, { useState, useEffect } from 'react';

export function Intervalo({
    setIntervalo, 
    intervalo
}) {
  const [inputValue, setInputValue] = useState(intervalo);

  const onChange = (newValue) => {
    setInputValue(newValue);
    setIntervalo(newValue)
  };

  useEffect(() => {
    setInputValue(intervalo)
  }, [intervalo])

  return (
    <div className='flex justify-center items-center'>
      <div className='sm:w-72 m-auto'>
        <Slider
          min={0}
          max={60}
          onChange={onChange}
          style={{minWidth: '100px'}}
          trackStyle={{ backgroundColor: '#1C64F2', padding: '4px', borderRadius: '5px' }}
          handleStyle={{ borderColor: '#1C64F2', backgroundColor: '#1C64F2', padding: '7px' }}
          draggableTrack={true}
          value={typeof inputValue === 'number' ? inputValue : 0}
        />
      </div>
      <div>
      <InputNumber
          min={0}
          style={{background: '#374151', border: 'none', borderRadius: '5px', color: 'white', marginLeft: '15px'}}
          max={60}
          value={inputValue + ' min'}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Intervalo;