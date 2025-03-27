import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

export default function DashboardWidget({ type, data, onRemove }) {
  const renderWidget = () => {
    switch (type) {
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(data[0] || {}).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((cell, j) => (
                      <td
                        key={j}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'pie':
        return (
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'item'
              },
              series: [
                {
                  type: 'pie',
                  radius: '50%',
                  data: data,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            }}
          />
        );

      case 'line':
        return (
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                data: data.xAxis
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: data.series,
                  type: 'line'
                }
              ]
            }}
          />
        );

      case 'bar':
        return (
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              xAxis: {
                type: 'category',
                data: data.xAxis
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: data.series,
                  type: 'bar'
                }
              ]
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-lg shadow-md p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold capitalize">{type} Widget</h3>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
      {renderWidget()}
    </motion.div>
  );
}