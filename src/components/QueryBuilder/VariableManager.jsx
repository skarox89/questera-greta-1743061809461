import { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

export default function VariableManager({ 
  variables, 
  onVariablesChange,
  usedVariables = [] 
}) {
  const [localVariables, setLocalVariables] = useState(variables);

  // Effect for syncing with used variables
  useEffect(() => {
    const newVariables = [...localVariables];
    let hasChanges = false;

    usedVariables.forEach(usedVar => {
      if (!newVariables.find(v => v.name === usedVar.name)) {
        newVariables.push(usedVar);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setLocalVariables(newVariables);
    }
  }, [usedVariables, localVariables]);

  // Effect for notifying parent of changes
  useEffect(() => {
    onVariablesChange(localVariables);
  }, [localVariables, onVariablesChange]);

  const handleAddVariable = () => {
    setLocalVariables(prev => [...prev, { name: '', type: 'text' }]);
  };

  const handleRemoveVariable = (index) => {
    setLocalVariables(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariableChange = (index, field, value) => {
    setLocalVariables(prev => {
      const newVariables = [...prev];
      newVariables[index] = { ...newVariables[index], [field]: value };
      return newVariables;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Variables</h3>
        <button
          onClick={handleAddVariable}
          className="text-primary-600 hover:text-primary-700"
        >
          <FaPlus />
        </button>
      </div>

      <div className="space-y-2">
        {localVariables.map((variable, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={variable.name}
              onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
              placeholder="Variable name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            <select
              value={variable.type}
              onChange={(e) => handleVariableChange(index, 'type', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Boolean</option>
            </select>
            <button
              onClick={() => handleRemoveVariable(index)}
              className="text-red-500 hover:text-red-700"
              disabled={usedVariables.some(v => v.name === variable.name)}
            >
              <FaMinus />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}