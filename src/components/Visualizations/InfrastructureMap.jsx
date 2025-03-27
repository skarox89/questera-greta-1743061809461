import { useRef, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  TreeChart,
  CanvasRenderer
]);

export default function InfrastructureMap({ infrastructure }) {
  const chartRef = useRef(null);

  const transformData = (data) => ({
    name: data.name,
    value: data.metrics?.usage || 0,
    children: data.components?.map(transformData) || undefined,
    itemStyle: {
      color: getHealthColor(data.health)
    },
    label: {
      position: 'inside',
      rotate: 0,
      verticalAlign: 'middle',
      align: 'center',
      fontSize: 14
    }
  });

  const getHealthColor = (health) => {
    const healthColors = {
      healthy: '#10B981',
      warning: '#F59E0B',
      critical: '#EF4444',
      unknown: '#6B7280'
    };
    return healthColors[health] || healthColors.unknown;
  };

  const getOption = () => ({
    title: {
      text: 'Infrastructure Components',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = params.data;
        return `
          <div class="space-y-1">
            <div class="font-bold">${data.name}</div>
            <div>Usage: ${data.value}%</div>
            ${data.health ? `<div>Health: ${data.health}</div>` : ''}
          </div>
        `;
      }
    },
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
    series: [{
      type: 'tree',
      data: [transformData(infrastructure)],
      top: '10%',
      bottom: '10%',
      layout: 'radial',
      symbol: 'rect',
      symbolSize: [100, 40],
      initialTreeDepth: 3,
      animationDurationUpdate: 750,
      emphasis: {
        focus: 'descendant'
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