import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PollChart = ({ options }) => {
  const data = {
    labels: options.map(opt => opt.text),
    datasets: [
      {
        label: 'Votes',
        data: options.map(opt => opt.votes),
        backgroundColor: [
          'rgba(0, 245, 160, 0.8)',   // Electric Emerald
          'rgba(0, 210, 255, 0.8)',   // Cyber Cyan
          'rgba(255, 184, 0, 0.8)',   // Cyber Amber
          'rgba(168, 85, 247, 0.8)',  // Neon Purple
          'rgba(244, 63, 94, 0.8)',   // Cyber Pink
        ],
        borderColor: [
          '#00F5A0',
          '#00D2FF',
          '#FFB800',
          '#A855F7',
          '#F43F5E',
        ],
        borderWidth: 1.5,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0a0b10',
        titleColor: '#00F5A0',
        bodyColor: '#ffffff',
        padding: 12,
        borderColor: 'rgba(0, 245, 160, 0.3)',
        borderWidth: 1,
        titleFont: { family: 'monospace' },
        bodyFont: { family: 'monospace' }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'monospace',
            weight: '500',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 245, 160, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 1,
          font: {
            family: 'monospace',
          },
        },
      },
    },
  };

  return (
    <div className="h-64 sm:h-80 relative w-full">
      <Bar data={data} options={chartOptions} />
    </div>
  );
};

export default PollChart;
