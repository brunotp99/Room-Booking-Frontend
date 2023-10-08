import { InputNumber, Slider } from 'antd';
import React, { useEffect, useState } from 'react';

export function Alocacao({
  setAlocacao, 
  alocacao
}) {
  const [inputValue, setInputValue] = useState(alocacao);

  const onChange = (newValue) => {
    setInputValue(newValue);
    setAlocacao(newValue)
  };

  useEffect(() => {
    setInputValue(alocacao)
  }, [alocacao])

  return (
    <div className='flex justify-center items-center'>
      <div className='sm:w-72 m-auto'>
        <Slider
          min={0}
          max={100}
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
          max={100}
          value={inputValue + '%'}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Alocacao;