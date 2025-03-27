import { useRef, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GraphChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer
]);

export default function ProcessFlow({ processes }) {
  const chartRef = useRef(null);

  const getOption = () => ({
    title: {
      text: 'Process Dependencies',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: processes.map(process => ({
        name: process.name,
        value: process.metrics?.usage || 0,
        symbolSize: 50,
        category: process.category
      })),
      links: processes.reduce((acc, process) => {
        if (process.dependencies) {
          process.dependencies.forEach(dep => {
            acc.push({
              source: process.name,
              target: dep,
              lineStyle: {
                width: 2,
                curveness: 0.2
              }
            });
          });
        }
        return acc;
      }, []),
      categories: [...new Set(processes.map(p => p.category))].map(cat => ({
        name: cat
      })),
      roam: true,
      label: {
        show: true,
        position: 'right',
        formatter: '{b}'
      },
      force: {
        repulsion: 100,
        edgeLength: 100
      },
      emphasis: {
        focus: 'adjacency'
      }
    }]
  });

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-[600px] w-full">
      <ReactEChartsCore
        ref={chartRef}
        echarts={echarts}
        option={getOption()}
        style={{ height: '100%', width: '100%' }}
        className="bg-white rounded-lg shadow-lg p-4"
      />
    </div>
  );
}