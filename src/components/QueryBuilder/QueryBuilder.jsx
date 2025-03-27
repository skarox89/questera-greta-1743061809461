import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus, FaCode } from 'react-icons/fa';
import QueryPreview from './QueryPreview';
import VariableManager from './VariableManager';

export default function QueryBuilder({ 
  initialQuery = '', 
  initialVariables = [], 
  onQueryChange,
  onVariablesChange 
}) {
  const [mode, setMode] = useState('visual');
  const [conditions, setConditions] = useState([
    { field: '', operator: '=', value: '', useVariable: false, variableName: '' }
  ]);
  const [baseTable, setBaseTable] = useState('software');
  const [selectedFields, setSelectedFields] = useState(['*']);
  const [joins, setJoins] = useState([]);
  const [rawQuery, setRawQuery] = useState(initialQuery);

  const operators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN', 'NOT IN'];

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { field: '', operator: '=', value: '', useVariable: false, variableName: '' }
    ]);
  };

  const handleRemoveCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  const handleAddJoin = () => {
    setJoins([...joins, { table: '', condition: '', type: 'INNER' }]);
  };

  const handleRemoveJoin = (index) => {
    setJoins(joins.filter((_, i) => i !== index));
  };

  const handleJoinChange = (index, field, value) => {
    const newJoins = [...joins];
    newJoins[index] = { ...newJoins[index], [field]: value };
    setJoins(newJoins);
  };

  const buildQuery = () => {
    if (mode === 'raw') {
      return rawQuery;
    }

    let query = `SELECT ${selectedFields.join(', ')} FROM ${baseTable}`;

    // Add joins
    if (joins.length > 0) {
      query += ' ' + joins.map(join => 
        `${join.type} JOIN ${join.table} ON ${join.condition}`
      ).join(' ');
    }

    // Add where conditions
    if (conditions.length > 0) {
      const whereClause = conditions
        .filter(c => c.field && c.operator)
        .map(c => {
          const value = c.useVariable ? `:${c.variableName}` : `'${c.value}'`;
          return `${c.field} ${c.operator} ${value}`;
        })
        .join(' AND ');

      if (whereClause) {
        query += ` WHERE ${whereClause}`;
      }
    }

    return query;
  };

  const handleQueryUpdate = () => {
    const query = buildQuery();
    onQueryChange(query);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={() => setMode('visual')}
            className={`px-4 py-2 rounded-md ${
              mode === 'visual' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Visual Builder
          </button>
          <button
            onClick={() => setMode('raw')}
            className={`px-4 py-2 rounded-md ${
              mode === 'raw' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Raw SQL
          </button>
        </div>
      </div>

      {mode === 'visual' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Table
            </label>
            <input
              type="text"
              value={baseTable}
              onChange={(e) => setBaseTable(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Fields
            </label>
            <input
              type="text"
              value={selectedFields.join(', ')}
              onChange={(e) => setSelectedFields(e.target.value.split(',').map(f => f.trim()))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="field1, field2, *"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Joins
              </label>
              <button
                onClick={handleAddJoin}
                className="text-primary-600 hover:text-primary-700"
              >
                <FaPlus />
              </button>
            </div>
            {joins.map((join, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <select
                  value={join.type}
                  onChange={(e) => handleJoinChange(index, 'type', e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="INNER">INNER JOIN</option>
                  <option value="LEFT">LEFT JOIN</option>
                  <option value="RIGHT">RIGHT JOIN</option>
                </select>
                <input
                  type="text"
                  value={join.table}
                  onChange={(e) => handleJoinChange(index, 'table', e.target.value)}
                  placeholder="Table name"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <input
                  type="text"
                  value={join.condition}
                  onChange={(e) => handleJoinChange(index, 'condition', e.target.value)}
                  placeholder="Join condition"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <button
                  onClick={() => handleRemoveJoin(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaMinus />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Conditions
              </label>
              <button
                onClick={handleAddCondition}
                className="text-primary-600 hover:text-primary-700"
              >
                <FaPlus />
              </button>
            </div>
            {conditions.map((condition, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={condition.field}
                  onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                  placeholder="Field"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <select
                  value={condition.operator}
                  onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  {operators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                {condition.useVariable ? (
                  <input
                    type="text"
                    value={condition.variableName}
                    onChange={(e) => handleConditionChange(index, 'variableName', e.target.value)}
                    placeholder="Variable name"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                )}
                <button
                  onClick={() => handleConditionChange(index, 'useVariable', !condition.useVariable)}
                  className={`px-3 py-1 rounded ${
                    condition.useVariable 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <FaCode />
                </button>
                <button
                  onClick={() => handleRemoveCondition(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaMinus />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <textarea
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            className="w-full h-40 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono"
            placeholder="Enter your SQL query..."
          />
        </motion.div>
      )}

      <QueryPreview query={mode === 'raw' ? rawQuery : buildQuery()} />
      
      <VariableManager
        variables={initialVariables}
        onVariablesChange={onVariablesChange}
        usedVariables={conditions
          .filter(c => c.useVariable)
          .map(c => ({ name: c.variableName, type: 'text' }))}
      />

      <div className="flex justify-end">
        <button
          onClick={handleQueryUpdate}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Update Query
        </button>
      </div>
    </div>
  );
}