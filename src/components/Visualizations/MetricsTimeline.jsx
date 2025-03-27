import { useRef, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { format } from 'date-fns';

echarts.use([
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer
]);

export default function MetricsTimeline({ metrics, timeRange = '1M' }) {
  const chartRef = useRef(null);

  const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy');

  const getOption = () => ({
    title: {
      text: 'Performance Metrics Over Time',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let result = formatDate(params[0].axisValue) + '<br/>';
        params.forEach(param => {
          result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: metrics.map(m => m.name),
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {},
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {}
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: metrics[0]?.data.map(d => d.timestamp) || []
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: metrics.map(metric => ({
      name: metric.name,
      type: 'line',
      data: metric.data.map(d => d.value),
      smooth: true,
      showSymbol: false,
      emphasis: {
        focus: 'series'
      },
      areaStyle: {
        opacity: 0.1
      }
    }))
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
    <div className="h-[400px] w-full">
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